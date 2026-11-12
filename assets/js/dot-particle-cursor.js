/**
 * Win Energy - Interactive Dot Particle Cursor & Click Burst System
 * Converted and adapted from React DotParticleCanvas to performant Vanilla JS
 * 
 * Features:
 * - High-DPI Retina canvas overlay with pointer-events: none (zero click interference)
 * - Click particle bursts (35+ particles in Win Energy palette: Blue, Green, Orange, White)
 * - Gentle physics (air drag, subtle gravity, organic wave turbulence)
 * - Micro-trail energy particles on cursor movement
 * - Intelligent sleep mode (0% CPU/GPU usage when idle)
 * - Full support across desktop mouse, touch taps, scrolling, buttons & icons
 */

(function () {
    'use strict';

    // Win Energy brand colors in RGB format
    const BRAND_COLORS = [
        '15, 82, 186',   // Win Sapphire Blue (#0F52BA)
        '2, 132, 199',   // HydroPulse Sky Blue (#0284C7)
        '80, 200, 120',  // CropSafe Emerald Green (#50C878)
        '11, 110, 79',   // Forest Green (#0B6E4F)
        '234, 88, 12',   // ScaleBreck Orange (#EA580C)
        '245, 158, 11',  // Warm Amber (#F59E0B)
        '255, 255, 255'  // Pure Crisp White
    ];

    let canvas = null;
    let ctx = null;
    let animId = null;
    let time = 0;
    const animationSpeed = 0.006;
    let particles = [];
    let lastMovePos = { x: -1000, y: -1000 };
    let isRunning = false;

    function initParticleCanvas() {
        if (document.getElementById('win-particle-canvas')) return;

        canvas = document.createElement('canvas');
        canvas.id = 'win-particle-canvas';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:99998;';
        document.body.appendChild(canvas);

        ctx = canvas.getContext('2d', { alpha: true });
        resizeCanvas();

        // Event Listeners (Passive for high scrolling performance)
        window.addEventListener('resize', resizeCanvas, { passive: true });
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerdown', onPointerDown, { passive: true });
    }

    function resizeCanvas() {
        if (!canvas || !ctx) return;
        const dpr = window.devicePixelRatio || 1;
        const w = window.innerWidth;
        const h = window.innerHeight;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    function ensureAnimationLoop() {
        if (!isRunning) {
            isRunning = true;
            animId = requestAnimationFrame(render);
        }
    }

    function onPointerMove(e) {
        const x = e.clientX;
        const y = e.clientY;

        // Calculate distance moved
        const dx = x - lastMovePos.x;
        const dy = y - lastMovePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Spawn a subtle trailing speck every 18px of mouse movement
        if (dist > 18) {
            lastMovePos = { x, y };

            const color = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.4 + Math.random() * 0.8;

            particles.push({
                x: x + (Math.random() - 0.5) * 6,
                y: y + (Math.random() - 0.5) * 6,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0,
                maxLife: 600 + Math.random() * 600,
                size: 1.2 + Math.random() * 1.8,
                angle: angle,
                speed: speed,
                color: color
            });

            ensureAnimationLoop();
        }
    }

    function onPointerDown(e) {
        const x = e.clientX;
        const y = e.clientY;

        // Particle Burst: 25 - 40 fast radial particles
        const numParticles = 25 + Math.floor(Math.random() * 16);

        for (let i = 0; i < numParticles; i++) {
            const angle = (Math.PI * 2 * i) / numParticles + (Math.random() - 0.5) * 0.5;
            const speed = 2.2 + Math.random() * 4.2;
            const size = 1.2 + Math.random() * 3.0;
            const color = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];

            particles.push({
                x: x + (Math.random() - 0.5) * 10,
                y: y + (Math.random() - 0.5) * 10,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0,
                maxLife: 1800 + Math.random() * 2200,
                size: size,
                angle: angle,
                speed: speed,
                color: color
            });
        }

        // 8 Slower, larger floating particles for rich organic depth
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.6 + Math.random() * 1.6;
            const color = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];

            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0,
                maxLife: 3200 + Math.random() * 1800,
                size: 2.5 + Math.random() * 2.2,
                angle: angle,
                speed: speed,
                color: color
            });
        }

        ensureAnimationLoop();
    }

    function render() {
        if (!ctx || !canvas) {
            isRunning = false;
            return;
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        // Clear transparent canvas
        ctx.clearRect(0, 0, width, height);

        time += animationSpeed;

        // Update & Render particles
        particles = particles.filter(particle => {
            particle.life += 16; // approx 60fps delta
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Apply gentle physics
            particle.vy += 0.02;     // subtle gravity
            particle.vx *= 0.992;    // air resistance
            particle.vy *= 0.992;

            // Organic natural movement
            const organicX = Math.sin(time + particle.angle) * 0.3;
            const organicY = Math.cos(time + particle.angle * 0.7) * 0.2;
            particle.x += organicX;
            particle.y += organicY;

            // Calculate alpha and size based on life
            const lifeProgress = particle.life / particle.maxLife;
            const alpha = Math.max(0, (1 - lifeProgress) * 0.85);
            const currentSize = Math.max(0.4, particle.size * (1 - lifeProgress * 0.35));

            // Draw particle
            if (alpha > 0.01) {
                ctx.fillStyle = `rgba(${particle.color}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
                ctx.fill();
            }

            return (
                particle.life < particle.maxLife &&
                particle.x > -50 &&
                particle.x < width + 50 &&
                particle.y > -50 &&
                particle.y < height + 50
            );
        });

        // If no more particles are active, sleep to preserve 0% CPU
        if (particles.length > 0) {
            animId = requestAnimationFrame(render);
        } else {
            isRunning = false;
            animId = null;
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticleCanvas);
    } else {
        initParticleCanvas();
    }
})();
