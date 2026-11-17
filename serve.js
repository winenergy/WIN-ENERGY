const http = require('http');
const fs = require('fs');
const path = require('path');

// 3-Bucket Architecture Modules
const config = require('./backend/config');
const { proxyShield, getClientIp } = require('./backend/proxy/shield');
const { getTimeOfDayCategory, getFormattedIST, getISTDate } = require('./backend/core/timeUtils');
const sheetdb = require('./backend/core/sheetdb');
const payment = require('./backend/core/payment');

const PORT = config.PORT || 8000;
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // =========================================================================
    // PIPELINE: BUCKET 2 (PROXY SHIELD) -> BUCKET 3 (BACKEND & SHEETDB)
    // =========================================================================
    if (pathname.startsWith('/api/')) {
        proxyShield(req, res, async ({ ip, body }) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'SAMEORIGIN');

            const nowIST = getISTDate();
            const timeOfDay = getTimeOfDayCategory(nowIST);
            const formattedTime = getFormattedIST(nowIST);

            try {
                // 1. Visitor Tracking Endpoint
                if (pathname === '/api/visitor' && req.method === 'POST') {
                    const visitorRow = {
                        "Timestamp": formattedTime,
                        "Time_Of_Day": timeOfDay, // Morning / Afternoon / Evening / Night
                        "Country": body.country || 'India',
                        "City": body.city || 'Unknown',
                        "IP_Address": ip,
                        "Page_Visited": body.page || 'Home',
                        "Referrer": body.referrer || 'Direct',
                        "Device": body.device || 'Desktop/Mobile'
                    };

                    const result = await sheetdb.sendToSheetDB('Visitors', visitorRow);
                    res.writeHead(200);
                    res.end(JSON.stringify({ 
                        success: true, 
                        message: 'Visitor logged',
                        timeOfDay,
                        mode: result.mode 
                    }));
                    return;
                }

                // 2. Form Filling / Inquiry Endpoint (Modal + Contact Page)
                if (pathname === '/api/inquiry' && req.method === 'POST') {
                    const inquiryId = 'INQ-' + Date.now().toString().slice(-6);
                    const inquiryRow = {
                        "Inquiry_ID": inquiryId,
                        "Timestamp": formattedTime,
                        "Time_Of_Day": timeOfDay,
                        "Customer_Name": body.name || 'Anonymous',
                        "Phone_Number": body.phone || 'N/A',
                        "Email_Address": body.email || 'N/A',
                        "Product_Interest": body.product || 'General Inquiry',
                        "Sector": body.sector || 'General',
                        "Message": body.message || 'Customer requested consultation / quote.',
                        "Source_Page": body.source || 'Website Modal',
                        "Status": "New"
                    };

                    const result = await sheetdb.sendToSheetDB('Inquiries', inquiryRow);
                    res.writeHead(200);
                    res.end(JSON.stringify({ 
                        success: true, 
                        inquiryId,
                        message: 'Inquiry registered successfully',
                        mode: result.mode 
                    }));
                    return;
                }

                // 3. Product Buying / Order Checkout Endpoint
                if (pathname === '/api/order' && req.method === 'POST') {
                    const orderId = body.orderId || ('WIN-' + Math.floor(100000 + Math.random() * 900000));
                    
                    // Format ordered items into readable string
                    let itemsSummary = '';
                    if (Array.isArray(body.items)) {
                        itemsSummary = body.items.map(i => `${i.name} (Qty: ${i.qty || 1}, ₹${i.price})`).join(' | ');
                    } else if (typeof body.items === 'string') {
                        itemsSummary = body.items;
                    }

                    const orderRow = {
                        "Order_ID": orderId,
                        "Timestamp": formattedTime,
                        "Time_Of_Day": timeOfDay,
                        "Customer_Name": body.customerName || 'Valued Customer',
                        "Phone_Number": body.phone || 'N/A',
                        "Email_Address": body.email || 'N/A',
                        "Shipping_Address": body.address || 'N/A',
                        "City": body.city || 'N/A',
                        "State": body.state || 'Maharashtra',
                        "Pincode": body.pincode || 'N/A',
                        "Ordered_Products": itemsSummary,
                        "Total_Amount_INR": body.totalAmount || 0,
                        "Payment_Mode": body.paymentMode || 'COD', // 'Razorpay' or 'COD'
                        "Payment_Status": body.paymentStatus || 'Pending',
                        "Order_Status": "Confirmed"
                    };

                    const result = await sheetdb.sendToSheetDB('Orders', orderRow);
                    res.writeHead(200);
                    res.end(JSON.stringify({ 
                        success: true, 
                        orderId,
                        message: 'Order placed successfully',
                        mode: result.mode 
                    }));
                    return;
                }

                // 4. Razorpay Order Creation Endpoint
                if (pathname === '/api/payment/create-order' && req.method === 'POST') {
                    const amount = Number(body.amount) || 100;
                    const receipt = body.receipt || ('rcpt_' + Date.now());
                    const rzpOrder = await payment.createRazorpayOrder(amount, receipt);
                    res.writeHead(200);
                    res.end(JSON.stringify(rzpOrder));
                    return;
                }

                // 5. Razorpay Payment Verification Endpoint
                if (pathname === '/api/payment/verify' && req.method === 'POST') {
                    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
                    const isValid = payment.verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
                    
                    if (isValid) {
                        res.writeHead(200);
                        res.end(JSON.stringify({ success: true, verified: true }));
                    } else {
                        res.writeHead(400);
                        res.end(JSON.stringify({ success: false, verified: false, error: 'Signature mismatch' }));
                    }
                    return;
                }

                // 6. Generic Shield Status (Conceals internal architecture)
                if (pathname === '/api/status') {
                    res.writeHead(200);
                    res.end(JSON.stringify({ 
                        service: 'Win Energy Gateway',
                        status: 'healthy',
                        pipeline: 'active'
                    }));
                    return;
                }

                // Unrecognized API path -> Shield returns generic 404
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Endpoint not found' }));

            } catch (apiErr) {
                console.error('[API Gateway Error]', apiErr);
                // Obfuscate internal errors from client
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Internal gateway processing error' }));
            }
        });
        return;
    }

    // =========================================================================
    // BUCKET 1: FRONTEND STATIC ASSETS SERVING
    // =========================================================================
    let cleanUrl = pathname;
    if (cleanUrl === '/' || cleanUrl === '') cleanUrl = '/index.html';
    
    // Normalize and prevent directory traversal
    const safePath = path.normalize(decodeURIComponent(cleanUrl)).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(__dirname, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        
        // Cache control
        const isMediaOrFont = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.mp4', '.webm'].includes(ext);
        const cacheControl = isMediaOrFont 
            ? 'public, max-age=31536000, immutable' 
            : 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': cacheControl,
            'X-Content-Type-Options': 'nosniff'
        });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(` Win Energy 3-Tier Gateway Active on Port ${PORT}`);
    console.log(` [Bucket 1] Frontend Client:    http://localhost:${PORT}/`);
    console.log(` [Bucket 2] Proxy Shield:       Active (Anti-Malicious/Rate-Limited)`);
    console.log(` [Bucket 3] Backend & SheetDB:  Connected (Fallback Queue Ready)`);
    console.log(`=======================================================`);
});
