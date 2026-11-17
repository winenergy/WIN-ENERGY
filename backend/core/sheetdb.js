/**
 * Bucket 3: SheetDB Connector & Local Fallback Engine
 * Handles saving to Google Sheets via SheetDB API.
 * Guarantees zero data loss using local JSON queue fallback.
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const QUEUE_FILE = path.join(__dirname, '..', 'data', 'offline_queue.json');

// Cache actual column keys for each tab to tolerate spaces in user's sheet headers
const sheetKeysCache = {};

function getSheetKeys(tab) {
    return new Promise((resolve) => {
        if (sheetKeysCache[tab]) return resolve(sheetKeysCache[tab]);
        const baseUrl = config.SHEETDB_API_URL ? config.SHEETDB_API_URL.trim().replace(/\/$/, '') : '';
        if (!baseUrl) return resolve(null);

        const targetUrl = new URL(`${baseUrl}/keys?sheet=${encodeURIComponent(tab)}`);
        https.get(targetUrl, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const keys = JSON.parse(data);
                    if (Array.isArray(keys)) {
                        sheetKeysCache[tab] = keys;
                        return resolve(keys);
                    }
                } catch (e) {}
                resolve(null);
            });
        }).on('error', () => resolve(null));
    });
}

async function adaptPayloadToSheet(tab, payload) {
    const actualKeys = await getSheetKeys(tab);
    const adapted = {};

    for (let [key, val] of Object.entries(payload)) {
        // Prevent Google Sheets formula interpretation on phone numbers starting with '+'
        if (typeof val === 'string' && val.startsWith('+')) {
            val = ' ' + val;
        }

        if (actualKeys && Array.isArray(actualKeys)) {
            // Find matching actual column in Google Sheet (ignoring whitespace / casing)
            const match = actualKeys.find(k => k.trim().toLowerCase() === key.trim().toLowerCase());
            if (match) {
                adapted[match] = val;
                continue;
            }
        }
        adapted[key] = val;
    }
    return adapted;
}

// Ensure queue file exists
if (!fs.existsSync(QUEUE_FILE)) {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify({ visitors: [], inquiries: [], orders: [] }, null, 2));
}

function readQueue() {
    try {
        const raw = fs.readFileSync(QUEUE_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        return { visitors: [], inquiries: [], orders: [] };
    }
}

function writeQueue(data) {
    try {
        fs.writeFileSync(QUEUE_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('[Bucket 3] Failed to write offline queue:', e.message);
    }
}

function saveToOfflineQueue(tab, payload) {
    const queue = readQueue();
    const key = tab.toLowerCase();
    if (!queue[key]) queue[key] = [];
    queue[key].push({
        ...payload,
        _offline_logged_at: new Date().toISOString()
    });
    writeQueue(queue);
    console.log(`[Bucket 3 Local Fallback] Record queued into local database under [${tab}] (Total queued: ${queue[key].length})`);
}

/**
 * Send POST request to SheetDB API
 * @param {string} tab Sheet tab name ("Visitors", "Inquiries", "Orders")
 * @param {object} payload Row data matching Sheet columns
 */
async function sendToSheetDB(tab, rawPayload) {
    const payload = await adaptPayloadToSheet(tab, rawPayload);
    return new Promise((resolve, reject) => {
        const baseUrl = config.SHEETDB_API_URL ? config.SHEETDB_API_URL.trim().replace(/\/$/, '') : '';

        if (!baseUrl) {
            // No SheetDB URL configured yet — save locally so lead is 100% preserved
            saveToOfflineQueue(tab, payload);
            return resolve({
                success: true,
                mode: 'offline_queue',
                message: 'Saved to local queue. Ready to sync to SheetDB once API URL is entered in backend/config.js.'
            });
        }

        // SheetDB tab targeting format: https://sheetdb.io/api/v1/{API_ID}?sheet={tab}
        const parsedUrl = new URL(`${baseUrl}?sheet=${encodeURIComponent(tab)}`);
        const postData = JSON.stringify({
            data: [payload]
        });

        const client = parsedUrl.protocol === 'https:' ? https : http;
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'WinEnergy-Backend/1.0'
            },
            timeout: 8000
        };

        const req = client.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`[Bucket 3 SheetDB] Successfully synced 1 row to Sheet tab [${tab}].`);
                    resolve({ success: true, mode: 'sheetdb', response: body });
                } else {
                    console.warn(`[Bucket 3 SheetDB] SheetDB responded with HTTP ${res.statusCode}: ${body}. Falling back to local queue.`);
                    saveToOfflineQueue(tab, payload);
                    resolve({ success: true, mode: 'fallback_due_to_error', error: body });
                }
            });
        });

        req.on('error', (err) => {
            console.warn(`[Bucket 3 SheetDB] Network error connecting to SheetDB (${err.message}). Saving to offline queue.`);
            saveToOfflineQueue(tab, payload);
            resolve({ success: true, mode: 'fallback_network_error', error: err.message });
        });

        req.on('timeout', () => {
            req.destroy();
            console.warn(`[Bucket 3 SheetDB] Request timed out. Saving to offline queue.`);
            saveToOfflineQueue(tab, payload);
            resolve({ success: true, mode: 'fallback_timeout' });
        });

        req.write(postData);
        req.end();
    });
}

/**
 * Flush offline queued items to SheetDB once URL is valid
 */
async function flushOfflineQueue() {
    const baseUrl = config.SHEETDB_API_URL ? config.SHEETDB_API_URL.trim() : '';
    if (!baseUrl) return;

    const queue = readQueue();
    const tabs = ['Visitors', 'Inquiries', 'Orders'];

    for (const tab of tabs) {
        const key = tab.toLowerCase();
        const items = queue[key] || [];
        if (items.length === 0) continue;

        console.log(`[Bucket 3 Sync] Flushing ${items.length} queued records for tab [${tab}]...`);
        const remaining = [];
        for (const item of items) {
            try {
                const copy = { ...item };
                delete copy._offline_logged_at;
                const res = await sendToSheetDB(tab, copy);
                if (res.mode !== 'sheetdb') {
                    remaining.push(item);
                }
            } catch (e) {
                remaining.push(item);
            }
        }
        queue[key] = remaining;
    }
    writeQueue(queue);
}

module.exports = {
    sendToSheetDB,
    flushOfflineQueue,
    readQueue,
    saveToOfflineQueue
};
