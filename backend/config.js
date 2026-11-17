/**
 * Win Energy Backend Configuration
 * -------------------------------------------------------------
 * Bucket 3 Settings: SheetDB & Payment Gateway Configuration
 */

module.exports = {
    // Port
    PORT: process.env.PORT || 8000,

    // SheetDB API Endpoint
    // Connected to Win Energy Database Google Sheet
    SHEETDB_API_URL: process.env.SHEETDB_API_URL || 'https://sheetdb.io/api/v1/7hh3rn673s8fk',

    // Razorpay Integration Config (Ready for your keys)
    RAZORPAY: {
        KEY_ID: process.env.RAZORPAY_KEY_ID || '',         // e.g. "rzp_test_xxxxxxxxxx"
        KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '', // e.g. "xxxxxxxxxxxxxxxxxxxx"
        CURRENCY: 'INR',
        COMPANY_NAME: 'Win Energy',
        COMPANY_LOGO: 'https://winenergy.in/assets/images/company/win_energy_emblem.png'
    },

    // Proxy Shield Security Settings (Bucket 2)
    SECURITY: {
        MAX_REQUESTS_PER_MINUTE: 100, // per IP
        RATE_LIMIT_WINDOW_MS: 60 * 1000,
        BLOCKED_USER_AGENTS: [
            /sqlmap/i,
            /nikto/i,
            /acunetix/i,
            /wpscan/i,
            /masscan/i,
            /zgrab/i,
            /curl/i // if automated probe without headers
        ]
    }
};
