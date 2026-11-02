/* ================================================
   Reloom Case Study - Interactive JavaScript
   GSAP Animations, Particle Effects, and Charts
   ================================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Initialize all components
    initParticles();
    initNavigation();
    initHeroAnimations();
    initScrollAnimations();
    initChartAnimations();
    initCounterAnimations();
});

/* ================================================
   Particle Background
   ================================================ */
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let animationId;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.golden = Math.random() > 0.7; // 30% chance of gold particle
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

            if (this.golden) {
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.5})`;
            }

            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();

        animationId = requestAnimationFrame(animate);
    }

    animate();
}

/* ================================================
   Navigation
   ================================================ */
function initNavigation() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    // Change nav background on scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.backdropFilter = 'blur(20px)';
        } else {
            nav.style.background = 'linear-gradient(180deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0) 100%)';
            nav.style.backdropFilter = 'blur(10px)';
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ================================================
   Hero Animations
   ================================================ */
function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial state
    gsap.set(['.hero-badge', '.hero-title', '.hero-subtitle', '.hero-stats', '.hero-cta'], {
        opacity: 0,
        y: 30
    });

    gsap.set('.hero-visual', {
        opacity: 0,
        scale: 0.9
    });

    gsap.set('.floating-tag', {
        opacity: 0,
        scale: 0
    });

    // Animate in sequence
    tl.to('.hero-badge', {
        opacity: 1,
        y: 0,
        duration: 0.6
    }, 0.3)
        .to('.hero-title', {
            opacity: 1,
            y: 0,
            duration: 0.8
        }, 0.5)
        .to('.hero-subtitle', {
            opacity: 1,
            y: 0,
            duration: 0.6
        }, 0.7)
        .to('.hero-stats', {
            opacity: 1,
            y: 0,
            duration: 0.6
        }, 0.9)
        .to('.hero-cta', {
            opacity: 1,
            y: 0,
            duration: 0.6
        }, 1.1)
        .to('.hero-visual', {
            opacity: 1,
            scale: 1,
            duration: 1
        }, 0.4)
        .to('.floating-tag', {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.15
        }, 1.2);

    // Parallax effect on hero visual
    gsap.to('.hero-visual', {
        y: 100,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });
}

/* ================================================
   Scroll Animations
   ================================================ */
function initScrollAnimations() {
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Challenge intro
    gsap.from('.challenge-intro', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.challenge-intro',
            start: 'top 85%'
        }
    });

    // Pain cards
    gsap.utils.toArray('.pain-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 60,
            duration: 0.7,
            delay: i * 0.15,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            }
        });
    });

    // Quote block
    gsap.from('.quote-block', {
        opacity: 0,
        x: -50,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.quote-block',
            start: 'top 85%'
        }
    });

    // Solution content
    gsap.from('.solution-content', {
        opacity: 0,
        x: -50,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.solution-hero',
            start: 'top 80%'
        }
    });

    gsap.from('.solution-visual', {
        opacity: 0,
        x: 50,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.solution-hero',
            start: 'top 80%'
        }
    });

    // Process steps
    gsap.utils.toArray('.process-step').forEach((step, i) => {
        gsap.from(step, {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: '.ai-process',
                start: 'top 85%'
            }
        });
    });

    // Integration section
    gsap.from('.integration-section', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.integration-section',
            start: 'top 85%'
        }
    });

    // Workflow cards
    gsap.utils.toArray('.workflow-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            rotation: -5,
            duration: 0.6,
            delay: i * 0.12,
            scrollTrigger: {
                trigger: '.workflow-cards',
                start: 'top 85%'
            }
        });
    });

    // Impact hero text
    gsap.from('.impact-hero', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.impact-hero',
            start: 'top 85%'
        }
    });

    // Metric cards
    gsap.utils.toArray('.metric-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.5,
            delay: i * 0.1,
            scrollTrigger: {
                trigger: '.metrics-grid',
                start: 'top 85%'
            }
        });
    });

    // Testimonial card
    gsap.from('.testimonial-card', {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 1,
        scrollTrigger: {
            trigger: '.testimonial-card',
            start: 'top 85%'
        }
    });

    // Why us section
    gsap.from('.why-us-content', {
        opacity: 0,
        x: -50,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.why-us',
            start: 'top 80%'
        }
    });

    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            x: 50,
            duration: 0.5,
            delay: i * 0.15,
            scrollTrigger: {
                trigger: '.why-us-visual',
                start: 'top 85%'
            }
        });
    });

    // Footer elements
    gsap.from('.footer-nav, .footer-disclaimer, .related-studies, .footer-bottom', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%'
        }
    });
}

/* ================================================
   Chart Animations
   ================================================ */
function initChartAnimations() {
    // Bar Chart Animation
    ScrollTrigger.create({
        trigger: '#abandonmentChart',
        start: 'top 85%',
        onEnter: () => animateBarChart(),
        once: true
    });

    // Pie Chart Animation
    ScrollTrigger.create({
        trigger: '#roiChart',
        start: 'top 85%',
        onEnter: () => animatePieChart(),
        once: true
    });
}

function animateBarChart() {
    const barBefore = document.querySelector('.bar-before');
    const barAfter = document.querySelector('.bar-after');

    if (barBefore && barAfter) {
        // Animate bars to their target heights
        gsap.to(barBefore, {
            height: '65%',
            duration: 1.5,
            ease: 'power2.out'
        });

        gsap.to(barAfter, {
            height: '32%',
            duration: 1.5,
            delay: 0.3,
            ease: 'power2.out'
        });
    }
}

function animatePieChart() {
    const circumference = 2 * Math.PI * 40; // radius is 40

    // Revenue: $450K out of $570K ≈ 79%
    const segment1 = document.querySelector('.segment-1');
    // Savings: $120K out of $570K ≈ 21%
    const segment2 = document.querySelector('.segment-2');
    // Just a small segment for carbon (visual only)
    const segment3 = document.querySelector('.segment-3');

    // Calculate dash arrays
    const seg1Length = circumference * 0.65; // 65% of circle
    const seg2Length = circumference * 0.25; // 25% of circle
    const seg3Length = circumference * 0.10; // 10% of circle

    // Animate segments
    if (segment1) {
        gsap.to(segment1, {
            strokeDasharray: `${seg1Length} ${circumference}`,
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'power2.out'
        });
    }

    if (segment2) {
        gsap.to(segment2, {
            strokeDasharray: `${seg2Length} ${circumference}`,
            strokeDashoffset: -seg1Length,
            duration: 1.5,
            delay: 0.3,
            ease: 'power2.out'
        });
    }

    if (segment3) {
        gsap.to(segment3, {
            strokeDasharray: `${seg3Length} ${circumference}`,
            strokeDashoffset: -(seg1Length + seg2Length),
            duration: 1.5,
            delay: 0.6,
            ease: 'power2.out'
        });
    }
}

/* ================================================
   Counter Animations
   ================================================ */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.metric-value');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));

        if (isNaN(target)) return;

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            onEnter: () => {
                animateCounter(counter, target);
            },
            once: true
        });
    });
}

function animateCounter(element, target) {
    const duration = 2; // seconds
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = (currentTime - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const currentValue = Math.round(easeProgress * target);
        element.textContent = currentValue + '%';

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

/* ================================================
   Hover Effects Enhancement
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Add magnetic effect to CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-cta, .demo-cta');

    ctaButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(button, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Add glow effect on stat cards
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(212, 175, 55, 0.08) 0%, rgba(255, 255, 255, 0.03) 50%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = 'rgba(255, 255, 255, 0.03)';
        });
    });
});

/* ================================================
   Performance Optimization
   ================================================ */
// Reduce particle animation on mobile
if (window.innerWidth < 768) {
    const canvas = document.getElementById('particles');
    if (canvas) {
        canvas.style.opacity = '0.3';
    }
}

// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});

console.log('Reloom Case Study - Loaded Successfully ✨');
