// ========================================
// {INIT /<IDEA>} - STUDIO DIGITAL
// Code. Create. Connect.
// Enhanced with GSAP Animations
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initLoadingScreen();
    initGSAPAnimations();
    initBackgroundMusic();
    initInteractiveEffects();
    initScrollEffects();
    init3DEffects();
    initPerformanceOptimizations();
    initMobileOptimizations();
});

// ========================================
// LOADING SCREEN WITH GSAP
// ========================================
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingTitle = document.querySelector('.loading-title');
    const loadingBar = document.querySelector('.loading-bar');
    const loadingSubtitle = document.querySelector('.loading-subtitle');

    // GSAP Timeline for loading animations
    const loadingTL = gsap.timeline();

    loadingTL
        .to(loadingTitle, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: "back.out(1.7)"
        })
        .to(loadingBar, {
            duration: 2,
            width: "100%",
            ease: "power2.inOut"
        }, "-=0.5")
        .to(loadingSubtitle, {
            duration: 0.5,
            opacity: 1,
            y: 0,
            ease: "power2.out"
        }, "-=0.3")
        .to(loadingScreen, {
            duration: 1,
            opacity: 0,
            ease: "power2.inOut",
            onComplete: () => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        }, "+=0.5");
}

// ========================================
// GSAP ANIMATIONS
// ========================================
function initGSAPAnimations() {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Header video parallax
    gsap.to('.hero-video', {
        scrollTrigger: {
            trigger: '.hero-header',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.3
        },
        yPercent: 30,
        ease: 'none'
    });

    // About section animations
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        x: -100,
        opacity: 0,
        ease: 'power2.out'
    });

    gsap.from('.about-media', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        x: 100,
        opacity: 0,
        ease: 'power2.out'
    });

    // Service cards staggered animation
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '.services-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 100,
        opacity: 0,
        stagger: 0.15,
        ease: 'back.out(1.7)'
    });

    // Reasons cards animation
    gsap.from('.reason-card', {
        scrollTrigger: {
            trigger: '.why-us-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.6,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // CTA buttons animation
    gsap.from('.cta-btn', {
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.6,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    });

    // Footer video parallax
    gsap.to('.footer-video', {
        scrollTrigger: {
            trigger: '.footer-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.3
        },
        yPercent: 20,
        ease: 'none'
    });

    // Social buttons animation
    gsap.from('.social-btn', {
        scrollTrigger: {
            trigger: '.social-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.5,
        scale: 0,
        opacity: 0,
        stagger: 0.08,
        ease: 'back.out(1.7)'
    });

    // Continuous floating animation for scroll indicator
    gsap.to('.scroll-indicator', {
        duration: 2,
        y: 10,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
    });

    // Neon pulse animation for main title
    gsap.to('.main-title .text-init, .main-title .text-idea', {
        duration: 3,
        filter: 'hue-rotate(360deg)',
        repeat: -1,
        ease: 'none'
    });
}

// ========================================
// 3D EFFECTS
// ========================================
function init3DEffects() {
    const cards = document.querySelectorAll('.service-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return; // Disable on mobile

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            gsap.to(card, {
                duration: 0.3,
                rotateX: -rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotateX: 0,
                rotateY: 0,
                ease: 'power2.out'
            });
        });
    });
}

// ========================================
// BACKGROUND MUSIC WITH AUTOPLAY
// ========================================
function initBackgroundMusic() {
    const backgroundMusic = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    let isMusicPlaying = false;

    // Set initial volume
    if (backgroundMusic) {
        backgroundMusic.volume = 0.3;

        // Auto-play with user interaction fallback
        const playMusic = async () => {
            try {
                await backgroundMusic.play();
                isMusicPlaying = true;
                musicToggle.innerHTML = '🔊';
                console.log('🎵 Music started');
            } catch (error) {
                console.log('Autoplay blocked, waiting for interaction');
                // Add event listeners for user interaction
                const interactionHandler = async () => {
                    try {
                        await backgroundMusic.play();
                        isMusicPlaying = true;
                        musicToggle.innerHTML = '🔊';
                        console.log('🎵 Music started after interaction');
                        // Remove listeners after successful play
                        ['click', 'touchstart', 'keydown'].forEach(event => {
                            document.removeEventListener(event, interactionHandler);
                        });
                    } catch (retryError) {
                        console.log('Failed to play music:', retryError);
                    }
                };

                ['click', 'touchstart', 'keydown'].forEach(event => {
                    document.addEventListener(event, interactionHandler, { once: true });
                });
            }
        };

        // Initialize music
        playMusic();

        // Music toggle functionality
        musicToggle.addEventListener('click', async () => {
            try {
                if (isMusicPlaying) {
                    backgroundMusic.pause();
                    musicToggle.innerHTML = '🔇';
                    isMusicPlaying = false;
                } else {
                    await backgroundMusic.play();
                    musicToggle.innerHTML = '🔊';
                    isMusicPlaying = true;
                }
            } catch (error) {
                console.log('Music toggle failed:', error);
            }
        });
    }
}

// ========================================
// INTERACTIVE EFFECTS
// ========================================
function initInteractiveEffects() {
    // Button ripple effect
    document.querySelectorAll('.cta-btn, .social-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = this.querySelector('.btn-ripple');
            if (!ripple) return;

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('active');

            setTimeout(() => {
                ripple.classList.remove('active');
            }, 600);
        });

        // Enhanced hover effects
        btn.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1.05,
                rotationY: 5,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                rotationY: 0,
                ease: 'power2.out'
            });
        });
    });

    // About video hover effect
    const aboutVideo = document.querySelector('.about-video');
    if (aboutVideo) {
        aboutVideo.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.5,
                scale: 1.05,
                ease: 'power2.out'
            });
        });

        aboutVideo.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.5,
                scale: 1,
                ease: 'power2.out'
            });
        });
    }

    // Music toggle pulse animation
    gsap.to('.music-toggle', {
        duration: 2,
        scale: 1.1,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
    });
}

// ========================================
// SCROLL EFFECTS
// ========================================
function initScrollEffects() {
    // Parallax for header video
    ScrollTrigger.create({
        trigger: '.hero-header',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.3,
        onUpdate: (self) => {
            const video = document.querySelector('.hero-video');
            if (video) {
                gsap.set(video, {
                    y: self.progress * 100
                });
            }
        }
    });

    // About section animations
    ScrollTrigger.create({
        trigger: '.about-section',
        start: 'top 70%',
        onEnter: () => {
            gsap.to('.about-text', {
                duration: 1,
                x: 0,
                opacity: 1,
                ease: 'power2.out'
            });
            gsap.to('.about-media', {
                duration: 1,
                x: 0,
                opacity: 1,
                ease: 'power2.out'
            });
        }
    });

    // Services section animations
    ScrollTrigger.create({
        trigger: '.services-section',
        start: 'top 70%',
        onEnter: () => {
            gsap.fromTo('.service-card',
                {
                    y: 100,
                    opacity: 0,
                    rotationX: -15
                },
                {
                    duration: 0.8,
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    stagger: 0.15,
                    ease: 'back.out(1.7)'
                }
            );
        }
    });

    // Footer parallax
    ScrollTrigger.create({
        trigger: '.footer-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.3,
        onUpdate: (self) => {
            const video = document.querySelector('.footer-video');
            if (video) {
                gsap.set(video, {
                    y: self.progress * 50
                });
            }
        }
    });
}

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================
function initPerformanceOptimizations() {
    // Video loading optimization
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        // Pause videos when not in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log('Video play failed:', e));
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.25 });

        observer.observe(video);

        // Error handling
        video.addEventListener('error', function() {
            console.log('Video failed to load:', this.src);
            this.style.display = 'none';
        });
    });

    // Resize handler with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });

    // Network-aware optimizations
    if ('connection' in navigator) {
        const connection = navigator.connection;

        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            // Reduce animation complexity on slow connections
            gsap.globalTimeline.timeScale(0.5);

            // Reduce video quality
            videos.forEach(video => {
                video.playbackRate = 0.5;
            });
        }

        if (connection.saveData) {
            // Disable non-essential animations
            gsap.killTweensOf('.main-title .text-init, .main-title .text-idea');
            gsap.killTweensOf('.scroll-indicator');
        }
    }
}

// ========================================
// MOBILE OPTIMIZATIONS
// ========================================
function initMobileOptimizations() {
    // Enhanced touch support
    const interactiveElements = document.querySelectorAll('.cta-btn, .social-btn, .service-card');

    interactiveElements.forEach(element => {
        // Improve touch targets for mobile
        if ('ontouchstart' in window) {
            element.style.minHeight = '48px';
            element.style.touchAction = 'manipulation';
        }

        // Add haptic feedback if available
        element.addEventListener('touchend', function() {
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    });

    // iOS viewport fix
    const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);

    // Prevent zoom on double-tap (iOS)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Performance monitoring
function logPerformance() {
    if (window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log('🚀 {INIT IDEA} loaded in:', loadTime + 'ms');
    }
}

// Initialize performance monitoring
window.addEventListener('load', logPerformance);

// ========================================
// EASTER EGGS & SURPRISES
// ========================================

// Konami code easter egg
let konami = [];
const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konami.push(e.code);
    if (konami.length > konamiCode.length) {
        konami.shift();
    }

    if (konami.join('') === konamiCode.join('')) {
        console.log('🎮 Konami code activated!');
        // Add a fun surprise effect
        gsap.to('body', {
            duration: 0.1,
            repeat: 10,
            yoyo: true,
            backgroundColor: '#00FFFF',
            ease: 'power2.inOut'
        });
    }
});

// Console welcome message
console.log(`
%c{INIT /<IDEA>}
%cCode. Create. Connect.

%cStudio Digital Integral
Built with GSAP, Modern CSS, and lots of ❤️
`,
'color: #00FFFF; font-size: 24px; font-weight: bold; font-family: Orbitron;',
'color: #A366FF; font-size: 16px; font-weight: bold;',
'color: #FFFFFF; font-size: 12px;'
);