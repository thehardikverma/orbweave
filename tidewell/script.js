// ===== Tidewell Analysis Page JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initNavScroll();
    initParticles();
    initWaveform();
    initAnimations();
    initCounters();
    initChart();
});

// ===== Loading Screen =====
function initLoader() {
    const loader = document.getElementById('loadingScreen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 1500);
    });
}

// ===== Custom Cursor =====
function initCursor() {
    const follower = document.querySelector('.cursor-follower');
    const dot = document.querySelector('.cursor-dot');
    if (!follower || !dot) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.borderColor = '#14b8a6';
        });
        el.addEventListener('mouseleave', () => {
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// ===== Navigation Scroll =====
function initNavScroll() {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// ===== Floating Particles =====
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(20, 184, 166, ${Math.random() * 0.5 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: -${Math.random() * 10}s;
        `;
        container.appendChild(particle);
    }

    // Add keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===== Waveform Animation =====
function initWaveform() {
    const canvas = document.getElementById('waveformCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 80;

    let phase = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#14b8a6');
        gradient.addColorStop(1, '#06b6d4');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 +
                Math.sin(x * 0.05 + phase) * 15 +
                Math.sin(x * 0.02 + phase * 0.5) * 10 +
                Math.sin(x * 0.1 + phase * 2) * 5;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#14b8a6';

        phase += 0.05;
        requestAnimationFrame(draw);
    }

    draw();
}

// ===== GSAP Animations =====
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations
    gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, delay: 1.8 });
    gsap.from('.title-line', { opacity: 0, y: 50, duration: 0.8, stagger: 0.2, delay: 2 });
    gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, delay: 2.6 });
    gsap.from('.hero-cta-group', { opacity: 0, y: 30, duration: 0.8, delay: 2.8 });
    gsap.from('.hero-stats', { opacity: 0, y: 30, duration: 0.8, delay: 3 });
    gsap.from('.hero-visual', { opacity: 0, x: 50, duration: 1, delay: 2.5 });
    gsap.from('.floating-element', { opacity: 0, scale: 0.8, duration: 0.6, stagger: 0.2, delay: 3.2 });

    // Section animations
    const sections = ['.client-overview', '.challenge-section', '.solution-section', '.impact-section', '.dashboard-section', '.why-section'];

    sections.forEach(section => {
        gsap.from(`${section} .section-label`, {
            scrollTrigger: { trigger: section, start: 'top 80%' },
            opacity: 0, y: 30, duration: 0.6
        });
        gsap.from(`${section} .section-title`, {
            scrollTrigger: { trigger: section, start: 'top 80%' },
            opacity: 0, y: 30, duration: 0.6, delay: 0.1
        });
    });

    // Challenge cards
    gsap.from('.challenge-card', {
        scrollTrigger: { trigger: '.challenge-grid', start: 'top 80%' },
        opacity: 0, y: 50, duration: 0.6, stagger: 0.15
    });

    // Quote block
    gsap.from('.quote-block', {
        scrollTrigger: { trigger: '.quote-block', start: 'top 80%' },
        opacity: 0, y: 50, duration: 0.8
    });

    // Solution features
    gsap.from('.feature-card', {
        scrollTrigger: { trigger: '.solution-features', start: 'top 80%' },
        opacity: 0, x: -30, duration: 0.6, stagger: 0.1
    });

    // Conversation bubbles
    gsap.from('.conversation-bubble', {
        scrollTrigger: { trigger: '.conversation-preview', start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.6, stagger: 0.2
    });

    // Impact cards
    gsap.from('.impact-card', {
        scrollTrigger: { trigger: '.impact-grid', start: 'top 80%' },
        opacity: 0, y: 50, duration: 0.6, stagger: 0.1
    });

    // Testimonial
    gsap.from('.testimonial-card', {
        scrollTrigger: { trigger: '.testimonial-section', start: 'top 80%' },
        opacity: 0, scale: 0.95, duration: 0.8
    });

    // Dashboard
    gsap.from('.dashboard-frame', {
        scrollTrigger: { trigger: '.dashboard-section', start: 'top 80%' },
        opacity: 0, y: 50, duration: 0.8
    });

    // Workflow items
    gsap.from('.workflow-item', {
        scrollTrigger: { trigger: '.workflow-timeline', start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.6, stagger: 0.2
    });
}

// ===== Number Counters =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-value]');

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.value);
        const duration = 2000;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * easeProgress);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        // Start counter when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

// ===== Chart (Simple Canvas) =====
function initChart() {
    const canvas = document.getElementById('noShowChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth || 400;
    canvas.height = 200;

    const data = {
        before: 40,
        after: 15,
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    };

    const values = [40, 38, 32, 25, 18, 15];
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    function drawChart(progress = 1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (chartHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }

        // Line chart
        const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
        gradient.addColorStop(0, 'rgba(20, 184, 166, 0.3)');
        gradient.addColorStop(1, 'rgba(20, 184, 166, 0)');

        ctx.beginPath();
        values.forEach((value, i) => {
            const x = padding + (chartWidth / (values.length - 1)) * i;
            const y = padding + chartHeight - (value / 50 * chartHeight) * progress;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        // Fill area
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw line
        ctx.beginPath();
        values.forEach((value, i) => {
            const x = padding + (chartWidth / (values.length - 1)) * i;
            const y = padding + chartHeight - (value / 50 * chartHeight) * progress;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#14b8a6';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw points
        values.forEach((value, i) => {
            const x = padding + (chartWidth / (values.length - 1)) * i;
            const y = padding + chartHeight - (value / 50 * chartHeight) * progress;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#14b8a6';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        });

        // Month labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        data.months.forEach((month, i) => {
            const x = padding + (chartWidth / (data.months.length - 1)) * i;
            ctx.fillText(month, x, canvas.height - 10);
        });
    }

    // Animate chart on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let progress = 0;
                const animate = () => {
                    progress += 0.02;
                    drawChart(Math.min(progress, 1));
                    if (progress < 1) requestAnimationFrame(animate);
                };
                animate();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(canvas);
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
