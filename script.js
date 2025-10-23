// ========================================
// ROCK CITY - BORN TO BLEED STYLE
// Enhanced with GSAP Animations
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initLoadingScreen();
    initGSAPAnimations();
    initBackgroundMusic();
    initInteractiveEffects();
    initScrollEffects();
    initPerformanceOptimizations();
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
    gsap.to('.header-bg-video', {
        scrollTrigger: {
            trigger: '.header-video',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.3
        },
        yPercent: 30,
        ease: 'none'
    });

    // Hero image scale animation
    gsap.from('.hero-image', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.5
        },
        scale: 0.8,
        opacity: 0.7,
        ease: 'none'
    });

    // Action buttons staggered animation
    gsap.from('.action-btn', {
        scrollTrigger: {
            trigger: '.action-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'back.out(1.7)'
    });

    // Footer video parallax
    gsap.to('.footer-bg-video', {
        scrollTrigger: {
            trigger: '.footer-video',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.3
        },
        yPercent: 20,
        ease: 'none'
    });

    // Floating elements
    gsap.to('.main-title .highlight', {
        duration: 3,
        rotationY: 360,
        repeat: -1,
        ease: 'none'
    });

    // Continuous floating animation for scroll indicator
    gsap.to('.scroll-indicator', {
        duration: 2,
        y: 10,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
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

// ========================================
// INTERACTIVE EFFECTS
// ========================================
function initInteractiveEffects() {
    // Button ripple effect
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = this.querySelector('.btn-ripple');
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

    // Hero image hover effect
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        heroImage.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.5,
                scale: 1.05,
                ease: 'power2.out'
            });
        });

        heroImage.addEventListener('mouseleave', function() {
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
        trigger: '.header-video',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.3,
        onUpdate: (self) => {
            const video = document.querySelector('.header-bg-video');
            if (video) {
                gsap.set(video, {
                    y: self.progress * 100
                });
            }
        }
    });

    // Hero section animations
    ScrollTrigger.create({
        trigger: '.hero-section',
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
            gsap.to('.hero-image', {
                duration: 1,
                scale: 1,
                opacity: 1,
                ease: 'back.out(1.7)'
            });
        },
        onLeaveBack: () => {
            gsap.to('.hero-image', {
                duration: 0.5,
                scale: 0.9,
                opacity: 0.8,
                ease: 'power2.out'
            });
        }
    });

    // Action buttons entrance animation
    ScrollTrigger.create({
        trigger: '.action-section',
        start: 'top 70%',
        onEnter: () => {
            gsap.fromTo('.action-btn',
                {
                    y: 100,
                    opacity: 0,
                    rotationX: -45
                },
                {
                    duration: 0.8,
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    stagger: 0.2,
                    ease: 'back.out(1.7)'
                }
            );
        }
    });

    // Footer parallax
    ScrollTrigger.create({
        trigger: '.footer-video',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.3,
        onUpdate: (self) => {
            const video = document.querySelector('.footer-bg-video');
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

    // Image loading optimization
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';

        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
            this.style.display = 'none';
        });
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
            gsap.killTweensOf('.main-title .highlight');
            gsap.killTweensOf('.scroll-indicator');
        }
    }

    // Resize handler with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Performance monitoring
function logPerformance() {
    if (window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log('🚀 Rock City loaded in:', loadTime + 'ms');

        // Log Core Web Vitals if available
        if ('web-vitals' in window) {
            console.log('📊 Performance metrics available');
        }
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
            backgroundColor: '#ff0000',
            ease: 'power2.inOut'
        });
    }
});

// Console welcome message
console.log(`
🤘 Welcome to Rock City - Born to Bleed Style! 🤘

Built with:
- GSAP for animations
- Modern CSS with custom properties
- Mobile-first responsive design
- Performance optimizations
- Accessibility features

Ready to rock? 🎸
`);

// ========================================
// MOBILE OPTIMIZATIONS
// ========================================
function initMobileOptimizations() {
    // Enhanced touch support
    const actionBtns = document.querySelectorAll('.action-btn');

    actionBtns.forEach(btn => {
        // Prevent double-tap zoom on iOS but allow link functionality
        btn.addEventListener('touchend', function(e) {
            // Only prevent default for non-link interactions
            const rect = this.getBoundingClientRect();
            const isTapOnLink = e.target.closest('a') === this;

            if (!isTapOnLink) {
                e.preventDefault();
            }

            // Add haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });

        // Improve touch targets for mobile
        if ('ontouchstart' in window) {
            btn.style.minHeight = '60px';
            btn.style.minWidth = '60px';
            btn.style.touchAction = 'manipulation';
        }
    });

    // Smooth scrolling for iOS
    document.documentElement.style.scrollBehavior = 'smooth';

    // Prevent horizontal scroll
    document.body.addEventListener('touchmove', (e) => {
        if (e.target === document.body) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Initialize mobile optimizations
initMobileOptimizations();