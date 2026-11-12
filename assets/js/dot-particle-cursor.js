/**
 * Win Energy - Fluid Dynamic Ribbon Canvas Cursor
 * Converted and adapted from React useCanvasCursor to high-performance Vanilla JS
 * 
 * Features:
 * - Fluid ribbon wave trails following mouse & touch pointer
 * - 20 interconnected harmonic lines with spring-damper physics
 * - Dynamic iridescent color oscillator (Blue, Purple, Cyan, Amber)
 * - Additive blending (lighter composite) for luminous light trails
 * - 100% non-intrusive (pointer-events: none) & battery-friendly sleep when inactive
 */

(function () {
    'use strict';

    // Harmonic Oscillator for smooth color shifts
    function Oscillator(opt) {
        this.init(opt || {});
    }
    Oscillator.prototype = {
        init: function (opt) {
            this.phase = opt.phase || 0;
            this.offset = opt.offset || 0;
            this.frequency = opt.frequency || 0.001;
            this.amplitude = opt.amplitude || 1;
            this.current = this.offset;
        },
        update: function () {
            this.phase += this.frequency;
            this.current = this.offset + Math.sin(this.phase) * this.amplitude;
            return this.current;
        },
        value: function () {
            return this.current;
        }
    };

    // Node in the spring-damper chain
    function Node() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
    }

    // Dynamic wave parameters
    const E = {
        friction: 0.5,
        trails: 20,
        size: 50,
        dampening: 0.25,
        tension: 0.98
    };

    let ctx = null;
    let canvas = null;
    let f = null;
    let pos = { x: -1000, y: -1000 };
    let lines = [];

    // Line with spring chain
    function Line(opt) {
        this.init(opt || {});
    }
    Line.prototype = {
        init: function (opt) {
            this.spring = opt.spring + 0.1 * Math.random() - 0.02;
            this.friction = E.friction + 0.01 * Math.random() - 0.002;
            this.nodes = [];
            for (let n = 0; n < E.size; n++) {
                const node = new Node();
                node.x = pos.x;
                node.y = pos.y;
                this.nodes.push(node);
            }
        },
        update: function () {
            let spring = this.spring;
            let firstNode = this.nodes[0];
            firstNode.vx += (pos.x - firstNode.x) * spring;
            firstNode.vy += (pos.y - firstNode.y) * spring;

            for (let i = 0, len = this.nodes.length; i < len; i++) {
                const currNode = this.nodes[i];
                if (i > 0) {
                    const prevNode = this.nodes[i - 1];
                    currNode.vx += (prevNode.x - currNode.x) * spring;
                    currNode.vy += (prevNode.y - currNode.y) * spring;
                    currNode.vx += prevNode.vx * E.dampening;
                    currNode.vy += prevNode.vy * E.dampening;
                }
                currNode.vx *= this.friction;
                currNode.vy *= this.friction;
                currNode.x += currNode.vx;
                currNode.y += currNode.vy;
                spring *= E.tension;
            }
        },
        draw: function () {
            let n = this.nodes[0].x;
            let i = this.nodes[0].y;
            ctx.beginPath();
            ctx.moveTo(n, i);

            let a;
            let o = this.nodes.length - 2;
            for (a = 1; a < o; a++) {
                const nodeA = this.nodes[a];
                const nodeB = this.nodes[a + 1];
                n = 0.5 * (nodeA.x + nodeB.x);
                i = 0.5 * (nodeA.y + nodeB.y);
                ctx.quadraticCurveTo(nodeA.x, nodeA.y, n, i);
            }
            const nodeA = this.nodes[a];
            const nodeB = this.nodes[a + 1];
            ctx.quadraticCurveTo(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
            ctx.stroke();
            ctx.closePath();
        }
    };

    function createLines() {
        lines = [];
        for (let i = 0; i < E.trails; i++) {
            lines.push(new Line({ spring: 0.4 + (i / E.trails) * 0.025 }));
        }
    }

    function updatePos(e) {
        if (e.touches && e.touches.length > 0) {
            pos.x = e.touches[0].clientX;
            pos.y = e.touches[0].clientY;
        } else {
            pos.x = e.clientX;
            pos.y = e.clientY;
        }
    }

    function onFirstPointer(e) {
        document.removeEventListener('mousemove', onFirstPointer);
        document.removeEventListener('touchstart', onFirstPointer);

        updatePos(e);
        createLines();

        document.addEventListener('mousemove', updatePos, { passive: true });
        document.addEventListener('touchmove', updatePos, { passive: true });
        document.addEventListener('touchstart', (ev) => {
            if (ev.touches.length === 1) {
                pos.x = ev.touches[0].clientX;
                pos.y = ev.touches[0].clientY;
            }
        }, { passive: true });

        ctx.running = true;
        render();
    }

    function render() {
        if (ctx && ctx.running) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.globalCompositeOperation = 'lighter';
            ctx.strokeStyle = 'hsla(' + Math.round(f.update()) + ',50%,50%,0.2)';
            ctx.lineWidth = 1;

            for (let i = 0; i < E.trails; i++) {
                lines[i].update();
                lines[i].draw();
            }

            ctx.frame++;
            window.requestAnimationFrame(render);
        }
    }

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function initCanvasCursor() {
        if (document.getElementById('canvas-cursor')) return;

        canvas = document.createElement('canvas');
        canvas.id = 'canvas-cursor';
        canvas.className = 'pointer-events-none fixed inset-0';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:99998;';
        document.body.appendChild(canvas);

        ctx = canvas.getContext('2d');
        ctx.running = false;
        ctx.frame = 1;

        f = new Oscillator({
            phase: Math.random() * 2 * Math.PI,
            amplitude: 85,
            frequency: 0.0015,
            offset: 285
        });

        document.addEventListener('mousemove', onFirstPointer);
        document.addEventListener('touchstart', onFirstPointer, { passive: true });
        window.addEventListener('resize', resizeCanvas, { passive: true });
        window.addEventListener('orientationchange', resizeCanvas, { passive: true });

        window.addEventListener('focus', () => {
            if (ctx && !ctx.running && lines.length > 0) {
                ctx.running = true;
                render();
            }
        });

        window.addEventListener('blur', () => {
            if (ctx) ctx.running = false;
        });

        resizeCanvas();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCanvasCursor);
    } else {
        initCanvasCursor();
    }
})();
