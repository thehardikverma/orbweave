/* =========================================
   Canopy Commons Case Study - JavaScript
   GSAP Animations & Interactions
   ========================================= */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initNavigation();
    initFloatingPins();
    initHeroAnimations();
    initScrollAnimations();
    initCounterAnimations();
    initMetricRings();
    initSmoothScroll();
});

// ========================================
// Cursor Glow Effect
// ========================================
function initCursorGlow() {
    const cursor = document.getElementById('cursorGlow');

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
    }
}

// ========================================
// Navigation
// ========================================
function initNavigation() {
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// Floating Property Pins
// ========================================
function initFloatingPins() {
    const container = document.getElementById('floatingPins');
    const pinCount = 15;

    for (let i = 0; i < pinCount; i++) {
        const pin = document.createElement('div');
        pin.className = 'floating-pin';
        pin.style.left = `${Math.random() * 100}%`;
        pin.style.top = `${Math.random() * 100}%`;
        pin.style.animationDelay = `${Math.random() * 2}s`;
        pin.style.opacity = Math.random() * 0.5 + 0.3;
        container.appendChild(pin);

        // Subtle movement animation
        gsap.to(pin, {
            x: () => gsap.utils.random(-20, 20),
            y: () => gsap.utils.random(-20, 20),
            duration: gsap.utils.random(3, 6),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

// ========================================
// Hero Animations
// ========================================
function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animate hero elements
    tl.from('.hero-breadcrumb', {
        opacity: 0,
        y: 20,
        duration: 0.6
    })
        .from('.hero-badge', {
            opacity: 0,
            scale: 0.9,
            duration: 0.6
        }, '-=0.3')
        .from('.title-line', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.15
        }, '-=0.3')
        .from('.hero-subtitle', {
            opacity: 0,
            y: 30,
            duration: 0.6
        }, '-=0.4')
        .from('.hero-cta-group .btn', {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1
        }, '-=0.3')
        .from('.hero-stat', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1
        }, '-=0.3')
        .from('.hero-visual', {
            opacity: 0,
            x: 50,
            duration: 0.8
        }, '-=0.6')
        .from('.scroll-indicator', {
            opacity: 0,
            y: 20,
            duration: 0.5
        }, '-=0.3');

    // Animate hero stat values
    animateHeroStats();
}

function animateHeroStats() {
    const stats = document.querySelectorAll('.hero-stat .stat-value');

    stats.forEach(stat => {
        const target = parseFloat(stat.dataset.value);
        const isDecimal = target % 1 !== 0;

        gsap.to(stat, {
            textContent: target,
            duration: 2,
            delay: 1.5,
            ease: 'power2.out',
            snap: { textContent: isDecimal ? 0.1 : 1 },
            modifiers: {
                textContent: (value) => isDecimal ? parseFloat(value).toFixed(1) : Math.floor(value)
            }
        });
    });
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header.children, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        });
    });

    // Challenge section
    gsap.from('.challenge-visual', {
        scrollTrigger: {
            trigger: '.challenge-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.pain-point', {
        scrollTrigger: {
            trigger: '.challenge-stats',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 50,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
    });

    gsap.from('.quote-card', {
        scrollTrigger: {
            trigger: '.founder-quote',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.hurdle-tag', {
        scrollTrigger: {
            trigger: '.hurdles',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    });

    // Solution section
    gsap.from('.solution-visual-wrapper', {
        scrollTrigger: {
            trigger: '.solution-visual-wrapper',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.solution-features',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 60,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out'
    });

    gsap.from('.workflow-pipeline', {
        scrollTrigger: {
            trigger: '.workflow-pipeline',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.pipeline-step', {
        scrollTrigger: {
            trigger: '.workflow-pipeline',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Impact section
    gsap.from('.metric-card', {
        scrollTrigger: {
            trigger: '.impact-metrics',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out'
    });

    gsap.from('.impact-visual', {
        scrollTrigger: {
            trigger: '.impact-visual',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.testimonial-card', {
        scrollTrigger: {
            trigger: '.testimonial-card',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Why Orbweave section
    gsap.from('.why-content', {
        scrollTrigger: {
            trigger: '.why-orbweave',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.why-feature', {
        scrollTrigger: {
            trigger: '.why-features',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    });

    gsap.from('.badge', {
        scrollTrigger: {
            trigger: '.trust-badges',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Footer
    gsap.from('.related-card', {
        scrollTrigger: {
            trigger: '.related-cards',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -30,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
    });
}

// ========================================
// Counter Animations
// ========================================
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseFloat(counter.dataset.value);
        const isDecimal = target % 1 !== 0;

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    textContent: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { textContent: isDecimal ? 0.1 : 1 },
                    modifiers: {
                        textContent: (value) => isDecimal ? parseFloat(value).toFixed(1) : Math.floor(value)
                    }
                });
            }
        });
    });
}

// ========================================
// Metric Rings Animation
// ========================================
function initMetricRings() {
    const rings = document.querySelectorAll('.metric-ring');

    rings.forEach(ring => {
        const progress = ring.dataset.progress;
        const progressCircle = ring.querySelector('.ring-progress');

        if (progressCircle) {
            const circumference = 2 * Math.PI * 45; // radius = 45
            const offset = circumference - (progress / 100) * circumference;

            ScrollTrigger.create({
                trigger: ring,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.to(progressCircle, {
                        strokeDashoffset: offset,
                        duration: 2,
                        ease: 'power3.out'
                    });
                }
            });
        }
    });
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                gsap.to(window, {
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    duration: 1,
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

// ========================================
// Parallax Effects
// ========================================
gsap.to('.hero-gradient', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: 200,
    opacity: 0.5
});

// Visual frame parallax
gsap.to('.visual-frame', {
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
    },
    y: -50
});

// ========================================
// Button Interactions
// ========================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// ========================================
// Card Hover Effects
// ========================================
document.querySelectorAll('.feature-card, .metric-card, .related-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.1)',
            duration: 0.3
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            boxShadow: 'none',
            duration: 0.3
        });
    });
});

// ========================================
// Page Load Complete
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Refresh ScrollTrigger after images load
    ScrollTrigger.refresh();
});
