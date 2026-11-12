/**
 * Win Energy - 3-Second Cinematic Intro Animation Controller
 * Inspired by Mulyam.in & Clean Energy Technology Flow
 * Features: Blue, Green, White, Orange Palette, Flowing Rounded Framing Track, Exact Official Logo
 */

(function () {
    'use strict';

    // Total animation runtime: 3000ms (3.0 seconds)
    const SPLASH_DURATION = 3000;
    const EXIT_START = 2600;

    function createSplashOverlay() {
        if (document.getElementById('win-splash-overlay')) return;

        // Freeze scrolling while intro is active
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        const overlay = document.createElement('div');
        overlay.id = 'win-splash-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', 'Win Energy Intro Animation');

        overlay.innerHTML = `
            <!-- Ambient Glowing Energy Clouds -->
            <div class="splash-ambient-blue"></div>
            <div class="splash-ambient-green"></div>
            <div class="splash-ambient-orange"></div>

            <!-- Outer Rounded Perimeter Frame (Directly matching Mulyam.in Screenshot) -->
            <div class="splash-frame-border">
                <div class="splash-accent-bar-left"></div>
                <div class="splash-accent-bar-right"></div>
            </div>

            <!-- Center Brand Core -->
            <div class="splash-center-content">
                <!-- Glowing Halo -->
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
            }, 500);
        }

        // Automatic 3-second schedule
        setTimeout(exitSplash, EXIT_START);

        // Click to skip listener
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
