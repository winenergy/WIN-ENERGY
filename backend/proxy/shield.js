/**
 * Bucket 2: Proxy Bucket / Shield Gateway
 * -------------------------------------------------------------
 * Intercepts all traffic between Frontend (Bucket 1) and Backend (Bucket 3).
 * 1. Blocks malicious exploits, bot scanners, and unauthorized probing.
 * 2. Masks backend structure ("shows them nothing is there" to attackers).
 * 3. Sanitizes all incoming payloads (anti-XSS, anti-SQL injection).
 * 4. Implements rolling IP rate limiting.
 * 5. Safely forwards validated clean requests to Bucket 3.
 */

const config = require('../config');

// In-memory rate limiting table: { [ip]: [timestamp, timestamp, ...] }
const ipRequestWindow = new Map();

// Suspicious payload / exploit signatures
const MALICIOUS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /union\s+select/gi,
    /select\s+.*\s+from/gi,
    /drop\s+table/gi,
    /insert\s+into/gi,
    /exec\s*\(/gi,
    /\.\.\//g,            // Directory traversal
    /\b(etc\/passwd|win\.ini|boot\.ini)\b/i,
    /<iframe/gi,
    /on(load|error|click|mouse)\s*=/gi
];

/**
 * Checks if client IP is exceeding allowed request frequency
 */
function isRateLimited(ip) {
    const now = Date.now();
    const windowMs = config.SECURITY.RATE_LIMIT_WINDOW_MS || 60000;
    const maxReqs = config.SECURITY.MAX_REQUESTS_PER_MINUTE || 100;

    let timestamps = ipRequestWindow.get(ip) || [];
    // Prune old timestamps
    timestamps = timestamps.filter(ts => now - ts < windowMs);

    if (timestamps.length >= maxReqs) {
        return true;
    }

    timestamps.push(now);
    ipRequestWindow.set(ip, timestamps);
    return false;
}

/**
 * Checks if request matches bot scanners or malicious headers
 */
function isMaliciousClient(req) {
    const userAgent = req.headers['user-agent'] || '';
    for (const rule of config.SECURITY.BLOCKED_USER_AGENTS) {
        if (rule.test(userAgent)) return true;
    }
    return false;
}

/**
 * Scans payload for injection patterns
 */
function containsMaliciousPayload(data) {
    if (!data) return false;
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    for (const pattern of MALICIOUS_PATTERNS) {
        if (pattern.test(str)) {
            return true;
        }
    }
    return false;
}

/**
 * Deep sanitizes all string fields in an object (strips HTML / dangerous chars)
 */
function sanitizeInput(obj) {
    if (typeof obj === 'string') {
        return obj
            .replace(/[<>]/g, '') // remove HTML tag brackets
            .replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
                switch (char) {
                    case "\0": return "\\0";
                    case "\x08": return "\\b";
                    case "\x09": return "\\t";
                    case "\x1a": return "\\z";
                    case "\n": return "\\n";
                    case "\r": return "\\r";
                    case "\"":
                    case "'":
                    case "\\":
                    case "%":
                        return char; // keep quotes safe
                    default:
                        return char;
                }
            })
            .trim();
    } else if (Array.isArray(obj)) {
        return obj.map(sanitizeInput);
    } else if (obj !== null && typeof obj === 'object') {
        const cleaned = {};
        for (const [key, val] of Object.entries(obj)) {
            cleaned[key] = sanitizeInput(val);
        }
        return cleaned;
    }
    return obj;
}

/**
 * Helper to safely extract client IP
 */
function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || req.connection?.remoteAddress || '127.0.0.1';
}

/**
 * Main Proxy Shield Interceptor
 * Returns: { allowed: boolean, body: object|null, ip: string }
 */
function proxyShield(req, res, callback) {
    const ip = getClientIp(req);

    // 1. Bot & Bad User-Agent check
    if (isMaliciousClient(req)) {
        // "Show them nothing is there in a back end" -> Generic 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
    }

    // 2. Rate limiting check
    if (isRateLimited(ip)) {
        res.writeHead(429, { 
            'Content-Type': 'application/json',
            'Retry-After': '60'
        });
        res.end(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }));
        return;
    }

    // 3. Handle OPTIONS (pre-flight)
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Max-Age': '86400'
        });
        res.end();
        return;
    }

    // 4. For GET requests (e.g. status)
    if (req.method === 'GET') {
        callback({ ip, body: {} });
        return;
    }

    // 5. Parse and inspect POST body
    let rawData = '';
    const MAX_SIZE = 100 * 1024; // 100KB limit

    req.on('data', chunk => {
        rawData += chunk;
        if (rawData.length > MAX_SIZE) {
            req.destroy();
            res.writeHead(413, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Payload too large' }));
        }
    });

    req.on('end', () => {
        try {
            // Malicious payload check
            if (containsMaliciousPayload(rawData)) {
                console.warn(`[Bucket 2 Shield BLOCKED] Malicious payload detected from IP: ${ip}`);
                // Disguise response so attacker learns nothing
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Bad Request' }));
                return;
            }

            const parsed = rawData ? JSON.parse(rawData) : {};
            const cleanBody = sanitizeInput(parsed);

            callback({ ip, body: cleanBody });
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
}

module.exports = {
    proxyShield,
    getClientIp,
    sanitizeInput
};
