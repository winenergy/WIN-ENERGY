/**
 * Bucket 3: Razorpay Payment Processor
 * Ready for live / test credentials from Razorpay Dashboard.
 */

const crypto = require('crypto');
const https = require('https');
const config = require('../config');

/**
 * Creates a Razorpay Order
 * @param {number} amountInRupees e.g. 19500
 * @param {string} receiptId Internal order receipt ID
 */
function createRazorpayOrder(amountInRupees, receiptId) {
    return new Promise((resolve, reject) => {
        const { KEY_ID, KEY_SECRET, CURRENCY } = config.RAZORPAY;

        // If Razorpay keys not yet provided, return simulated order structure
        if (!KEY_ID || !KEY_SECRET) {
            return resolve({
                success: true,
                simulated: true,
                order_id: 'order_sim_' + Date.now(),
                amount: Math.round(amountInRupees * 100),
                currency: CURRENCY || 'INR',
                key_id: KEY_ID || 'rzp_test_placeholder',
                message: 'Razorpay keys pending in backend/config.js. Order initialized in test/ready mode.'
            });
        }

        const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
        const postData = JSON.stringify({
            amount: Math.round(amountInRupees * 100), // Razorpay takes amount in paise
            currency: CURRENCY || 'INR',
            receipt: receiptId,
            payment_capture: 1
        });

        const options = {
            hostname: 'api.razorpay.com',
            port: 443,
            path: '/v1/orders',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({ success: true, simulated: false, ...parsed, key_id: KEY_ID });
                    } else {
                        reject(new Error(parsed.error?.description || 'Razorpay order creation failed'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

/**
 * Verify Razorpay payment signature
 */
function verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const { KEY_SECRET } = config.RAZORPAY;
    if (!KEY_SECRET) return true; // Simulated pass if keys not configured

    const hmac = crypto.createHmac('sha256', KEY_SECRET);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const generatedSignature = hmac.digest('hex');

    return generatedSignature === razorpaySignature;
}

module.exports = {
    createRazorpayOrder,
    verifyPaymentSignature
};
