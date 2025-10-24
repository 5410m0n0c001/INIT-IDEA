// Loading animation
window.addEventListener('load', () => {
  const loading = document.getElementById('loading-screen');
  const progress = loading.querySelector('.progress span');

  let width = 0;
  const interval = setInterval(() => {
    width += 10;
    progress.style.width = width + '%';
    if (width >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loading.style.opacity = '0';
        setTimeout(() => {
          loading.style.display = 'none';
          initGSAP();
        }, 500);
      }, 500);
    }
  }, 100);
});

// GSAP animations
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Parallax for videos
  gsap.to('.header-bg-video', {
    yPercent: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.header-video',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.hero-video', {
    yPercent: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.footer-bg', {
    yPercent: -50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  // Fade in animations
  gsap.from('.hero-copy', {
    opacity: 0,
    y: 50,
    duration: 1,
    delay: 0.5
  });

  gsap.from('.card', {
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 1,
    scrollTrigger: {
      trigger: '.services',
      start: 'top 80%'
    }
  });

  gsap.from('.contact', {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: '.contact',
      start: 'top 80%'
    }
  });

  // Social icons animation
  gsap.from('.social', {
    opacity: 0,
    x: 100,
    stagger: 0.1,
    duration: 0.5,
    delay: 1
  });

  // Button hover effects
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.05, duration: 0.3 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.3 });
    });
  });

  // Card hover effects
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -10, duration: 0.3 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: 0.3 });
    });
  });
}