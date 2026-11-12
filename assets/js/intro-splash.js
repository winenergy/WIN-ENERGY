/**
 * Win Energy - 3-Second Cinematic Intro Animation Controller
 * Light Modern Clean-Tech Theme (White & Light Blue)
 * 
 * Runs smoothly at the start of the website (index.html)
 * - 100% GPU-composited pure CSS animation with zero load lag
 * - Auto-transitions into the full website in 3 seconds
 * - Interactive: click anywhere or click "Skip" for instant entry
 */

(function () {
    'use strict';

    const EXIT_START = 2600; // Transition begins at 2.6s, completes by 3.0s

    function createSplashOverlay() {
        if (document.getElementById('win-splash-overlay')) return;

        // Freeze scrolling while intro animation is active
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
                    <img src="assets/images/company/win_energy_emblem.png" alt="Win Energy Emblem" class="splash-emblem-img" width="120" height="120" fetchpriority="high">
                </div>

                <!-- Official Win Energy Typography (All-Blue Wordmark & Tagline) -->
                <div class="splash-text-wrap">
                    <img src="assets/images/company/win_energy_text.png" alt="Win Energy — Always Reliable" class="splash-logo-text-img" width="260" height="70" fetchpriority="high">
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
        const autoTimer = setTimeout(exitSplash, EXIT_START);

        // Click to skip listeners
        const skipBtn = document.getElementById('splash-skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clearTimeout(autoTimer);
                exitSplash();
            });
        }

        overlay.addEventListener('click', () => {
            clearTimeout(autoTimer);
            exitSplash();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSplashOverlay);
    } else {
        createSplashOverlay();
    }
})();
