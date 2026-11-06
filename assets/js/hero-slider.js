/**
 * WIN-ENERGY - High-Converting Hero Carousel Slider Engine
 * Inspired by HydroPulse & HydroFlow:
 * - Ken Burns slow zoom background animation
 * - Auto-rotation (5.5s) with pause on hover
 * - Minimalist dots / pill indicator in Win Blue & Eco Green + 01 / 03 slide counter
 * - Full touch swipe & keyboard navigation
 * - Bulletproof display: flex / none to guarantee ZERO overlap
 */

(function () {
    let currentSlide = 0;
    let slideTimer = null;
    let isPaused = false;
    const SLIDE_DURATION = 5500; // 5.5 seconds

    let slides = [];
    let indicatorDots = [];
    let sliderEl = null;
    let counterEl = null;

    function initHeroSlider() {
        sliderEl = document.getElementById('hero-slider');
        if (!sliderEl) return;

        const slideElements = sliderEl.querySelectorAll('.hero-slide');
        if (!slideElements.length) return;

        slides = Array.from(slideElements);
        indicatorDots = Array.from(sliderEl.querySelectorAll('[data-hero-slide-to]'));
        counterEl = document.getElementById('hero-current-slide');

        // Controls: Prev / Next
        const prevBtn = document.getElementById('hero-prev-btn');
        const nextBtn = document.getElementById('hero-next-btn');

        if (prevBtn) {
            prevBtn.onclick = function (e) {
                e.preventDefault();
                prevSlide();
                restartTimer();
            };
        }

        if (nextBtn) {
            nextBtn.onclick = function (e) {
                e.preventDefault();
                nextSlide();
                restartTimer();
            };
        }

        // Indicator Dots / Pills
        indicatorDots.forEach((dot) => {
            dot.onclick = function (e) {
                e.preventDefault();
                const targetIndex = parseInt(dot.getAttribute('data-hero-slide-to'), 10);
                if (!isNaN(targetIndex) && targetIndex !== currentSlide) {
                    goToSlide(targetIndex);
                    restartTimer();
                }
            };
        });

        // Hover: Pause on hover, resume on mouse leave
        sliderEl.onmouseenter = function () {
            isPaused = true;
        };

        sliderEl.onmouseleave = function () {
            isPaused = false;
        };

        // Keyboard arrow navigation
        document.addEventListener('keydown', function (e) {
            if (!sliderEl) return;
            const rect = sliderEl.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    restartTimer();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    restartTimer();
                }
            }
        });

        // Mobile Touch Swipe
        let startX = 0;
        let endX = 0;
        sliderEl.addEventListener('touchstart', function (e) {
            startX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderEl.addEventListener('touchend', function (e) {
            endX = e.changedTouches[0].screenX;
            if (endX < startX - 45) {
                nextSlide();
                restartTimer();
            } else if (endX > startX + 45) {
                prevSlide();
                restartTimer();
            }
        }, { passive: true });

        // Initialize strictly with slide 0
        goToSlide(0);
        startTimer();
    }

    function goToSlide(index) {
        if (!slides.length) return;

        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        slides.forEach((slide, i) => {
            const bg = slide.querySelector('.hero-bg-photo');
            if (i === index) {
                // Ensure strictly visible
                slide.style.display = 'flex';
                slide.style.opacity = '1';
                slide.style.visibility = 'visible';
                slide.classList.add('active');
                slide.setAttribute('aria-hidden', 'false');

                // Restart Ken Burns Animation
                if (bg) {
                    bg.style.animation = 'none';
                    void bg.offsetWidth; // force reflow
                    bg.style.animation = 'kenburnsZoom 8s ease-out forwards';
                }
            } else {
                // Strictly hide inactive slides
                slide.style.display = 'none';
                slide.style.opacity = '0';
                slide.style.visibility = 'hidden';
                slide.classList.remove('active');
                slide.setAttribute('aria-hidden', 'true');

                if (bg) {
                    bg.style.animation = 'none';
                }
            }
        });

        // Update Dots / Indicator Pills (Strictly Win Blue & Eco Green)
        indicatorDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active-pill');
                dot.style.width = '2.25rem'; // 36px elongated pill
                dot.style.background = 'linear-gradient(90deg, #0F52BA, #50C878)'; // User Sapphire to Emerald
                dot.style.opacity = '1';
                dot.style.boxShadow = '0 0 12px rgba(15, 82, 186, 0.4)';
            } else {
                dot.classList.remove('active-pill');
                dot.style.width = '0.625rem'; // 10px circular dot
                dot.style.background = 'rgba(255, 255, 255, 0.40)';
                dot.style.opacity = '0.65';
                dot.style.boxShadow = 'none';
            }
        });

        // Update Slide Counter
        if (counterEl) {
            counterEl.textContent = '0' + (index + 1);
        }

        currentSlide = index;

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(() => {
            if (!isPaused) {
                nextSlide();
            }
        }, SLIDE_DURATION);
    }

    function restartTimer() {
        startTimer();
    }

    window.heroSlider = {
        next: nextSlide,
        prev: prevSlide,
        goTo: goToSlide,
        pause: () => { isPaused = true; },
        play: () => { isPaused = false; }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroSlider);
    } else {
        initHeroSlider();
    }
})();
