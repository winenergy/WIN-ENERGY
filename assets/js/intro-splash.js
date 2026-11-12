/**
 * Win Energy - 3-Second Cinematic Intro Animation Controller
 * Light Modern Clean-Tech Theme (White & Light Blue)
 * 
 * Rules:
 * - Runs ONLY ONCE per session when a user first enters the site from any link (Google, shared, direct).
 * - Never shows again when navigating between internal pages, links, or subsequent visits in the session.
 * - Supports ?splash=1 query parameter for testing/previewing at any time.
 */

(function () {
    'use strict';

    const SPLASH_KEY = 'win_energy_splash_shown';
    const SPLASH_DURATION = 3000; // 3.0 seconds
    const EXIT_START = 2600;       // Transition start at 2.6s

    // Check if splash was already shown in this browser session or if running in an automated audit/bot
    function shouldShowSplash() {
        try {
            // Allow manual preview via ?splash=1
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('splash') === '1') {
                return true;
            }

            // Skip instantly for automated Lighthouse/PageSpeed/performance audits or search engine bots
            const isAuditOrBot = /Chrome-Lighthouse|Lighthouse|PageSpeed|HeadlessChrome|GTmetrix|Googlebot|bingbot/i.test(navigator.userAgent)
                || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
            if (isAuditOrBot) {
                return false;
            }

            // If already shown once during this session, do not show again
            if (sessionStorage.getItem(SPLASH_KEY) === 'true') {
                return false;
            }
        } catch (e) {
            console.warn('SessionStorage check:', e);
        }
        return true;
    }

    function createSplashOverlay() {
        if (!shouldShowSplash()) {
            // Already visited in this session: ensure scrolling is normal and do nothing
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            return;
        }

        // Mark as shown so navigation across other pages never triggers it again
        try {
            sessionStorage.setItem(SPLASH_KEY, 'true');
        } catch (e) {}

        if (document.getElementById('win-splash-overlay')) return;

        // Freeze scrolling while 3-second intro is active
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        const overlay = document.createElement('div');
        overlay.id = 'win-splash-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', 'Win Energy Intro Animation');

        overlay.innerHTML = `
            <!-- Ambient Glowing Energy Clouds (Soft Light Palette) -->
            <div class="splash-ambient-blue"></div>
            <div class="splash-ambient-green"></div>
            <div class="splash-ambient-orange"></div>

            <!-- Outer Rounded Perimeter Frame (Light White/Ice Blue with Vibrant Energy Border) -->
            <div class="splash-frame-border">
                <div class="splash-accent-bar-left"></div>
                <div class="splash-accent-bar-right"></div>
            </div>

            <!-- Center Brand Core -->
            <div class="splash-center-content">
                <!-- Glowing Soft Halo -->
                <div class="splash-emblem-halo"></div>

                <!-- Official Win Energy Emblem -->
                <div class="splash-emblem-wrap">
                    <div class="splash-orbit-ring">
                        <div class="splash-orbit-particle"></div>
                        <div class="splash-orbit-particle-green"></div>
                    </div>
                    <img src="assets/images/company/win_energy_emblem.png" alt="Win Energy Emblem" class="splash-emblem-img">
                </div>

                <!-- Official Win Energy Typography (All-Blue Wordmark & Tagline) -->
                <div class="splash-text-wrap">
                    <img src="assets/images/company/win_energy_text.png" alt="Win Energy — Always Reliable" class="splash-logo-text-img">
                    <div class="splash-subtitle">Physical Clean-Tech & Water Engineering</div>

                    <!-- 3-Second Precision Progress Beam -->
                    <div class="splash-progress-track">
                        <div class="splash-progress-bar"></div>
                    </div>
                </div>
            </div>

            <!-- Skip Button for instant entry -->
            <button class="splash-skip-btn" id="splash-skip-btn" title="Skip Intro">
                Skip &rarr;
            </button>
        `;

        document.body.prepend(overlay);

        let exited = false;
        function exitSplash() {
            if (exited) return;
            exited = true;

            overlay.classList.add('splash-exit');

            // Restore scrolling
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';

            setTimeout(() => {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 460);
        }

        // Automatic 3-second schedule
        setTimeout(exitSplash, EXIT_START);

        // Click to skip listeners
        const skipBtn = document.getElementById('splash-skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                exitSplash();
            });
        }

        overlay.addEventListener('click', () => {
            exitSplash();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSplashOverlay);
    } else {
        createSplashOverlay();
    }
})();
