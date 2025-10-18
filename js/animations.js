// Modern Animation System - Ashish Waghmare Fitness

class AnimationController {
  constructor() {
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupParallax();
    this.setupNavbarBehavior();
    this.setupScrollToTop();
    this.respectReducedMotion();
  }

  // Intersection Observer for reveal animations
  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Use RAF for smoother animations
          requestAnimationFrame(() => {
            entry.target.classList.add('visible');
          });
        }
      });
    }, observerOptions);

    // Observe elements for reveal animations
    const revealElements = document.querySelectorAll('.reveal, .program-card, .testimonial-card, .how-card, .blog-card, .faq-card');
    revealElements.forEach((el, index) => {
      el.classList.add('reveal');
      // Add stagger classes
      if (index % 3 === 1) el.classList.add('stagger-1');
      if (index % 3 === 2) el.classList.add('stagger-2');
      observer.observe(el);
    });
  }

  // Efficient parallax using RAF
  setupParallax() {
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const hero = document.getElementById('hero');
      
      if (hero) {
        const heroHeight = hero.offsetHeight;
        if (scrolled < heroHeight) {
          const parallaxSpeed = scrolled * 0.15;
          hero.style.transform = `translateY(${parallaxSpeed}px)`;
        }
      }
      
      ticking = false;
    };

    const requestParallax = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Only enable parallax on desktop
    if (window.innerWidth > 768) {
      window.addEventListener('scroll', requestParallax, { passive: true });
    }
  }

  // Navbar hide/show behavior
  setupNavbarBehavior() {
    let lastScrollTop = 0;
    let ticking = false;
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;

    const updateNavbar = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add scrolled class for backdrop
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Hide/show navbar based on scroll direction
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.classList.add('hidden');
      } else {
        navbar.classList.remove('hidden');
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      ticking = false;
    };

    const requestNavbarUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestNavbarUpdate, { passive: true });
  }

  // Scroll to top button
  setupScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;

    let ticking = false;

    const updateScrollTopVisibility = () => {
      const scrolled = window.pageYOffset;
      
      if (scrolled > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
      
      ticking = false;
    };

    const requestScrollTopUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollTopVisibility);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestScrollTopUpdate, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Respect user's motion preferences
  respectReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      // Disable animations for users who prefer reduced motion
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
  }
}



// Accessible Lightbox
class Lightbox {
  constructor() {
    this.isOpen = false;
    this.currentImage = null;
    this.init();
  }

  init() {
    this.createLightboxHTML();
    this.setupEventListeners();
  }

  createLightboxHTML() {
    const lightboxHTML = `
      <div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-hidden="true">
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
          <img class="lightbox-image" alt="" />
          <div class="lightbox-caption"></div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  }

  setupEventListeners() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    // Close lightbox events
    closeBtn.addEventListener('click', () => this.close());
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) this.close();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.isOpen) {
        if (e.key === 'Escape') this.close();
      }
    });

    // Setup image click handlers
    document.addEventListener('click', (e) => {
      if (e.target.matches('.chat-image, .blog-image')) {
        e.preventDefault();
        this.open(e.target);
      }
    });
  }

  open(imageElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    this.currentImage = imageElement;
    this.isOpen = true;
    
    lightboxImage.src = imageElement.src;
    lightboxImage.alt = imageElement.alt;
    lightboxCaption.textContent = imageElement.alt || '';
    
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.style.display = 'flex';
    
    // Animate in
    requestAnimationFrame(() => {
      lightbox.classList.add('active');
    });
    
    // Focus management
    lightbox.querySelector('.lightbox-close').focus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  close() {
    const lightbox = document.getElementById('lightbox');
    
    this.isOpen = false;
    
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    
    setTimeout(() => {
      lightbox.style.display = 'none';
    }, 300);
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to trigger element
    if (this.currentImage) {
      this.currentImage.focus();
    }
  }
}

// Button Ripple Effect
class RippleEffect {
  static init() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.btn-primary, .btn-secondary, .nav-cta')) {
        RippleEffect.createRipple(e);
      }
    });
  }

  static createRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    `;
    
    // Ensure button has relative positioning
    if (getComputedStyle(button).position === 'static') {
      button.style.position = 'relative';
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}

// Testimonials Enhanced Interactions
class TestimonialsEnhancer {
  constructor() {
    this.container = document.querySelector('.testimonials-grid');
    if (this.container) {
      this.init();
    }
  }

  init() {
    this.setupScrollAnimations();
    this.setupClickAnimations();
    this.setupKeyboardNavigation();
  }

  setupScrollAnimations() {
    const cards = this.container.querySelectorAll('.testimonial-card');
    
    // Animate cards on scroll into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.animation = `slideInFromRight 0.6s ease forwards`;
            entry.target.style.opacity = '1';
          }, index * 100);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach((card, index) => {
      card.style.opacity = '0';
      observer.observe(card);
    });
  }

  setupClickAnimations() {
    const cards = this.container.querySelectorAll('.testimonial-card');
    
    cards.forEach(card => {
      card.addEventListener('click', () => {
        // Add glow animation on click
        card.style.animation = 'testimonialGlow 1s ease';
        
        // Reset animation after completion
        setTimeout(() => {
          card.style.animation = '';
        }, 1000);
      });

      // Enhanced hover effects
      card.addEventListener('mouseenter', () => {
        this.pauseOtherAnimations(card);
      });

      card.addEventListener('mouseleave', () => {
        this.resumeAllAnimations();
      });
    });
  }

  setupKeyboardNavigation() {
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.container.scrollBy({ left: -350, behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        this.container.scrollBy({ left: 350, behavior: 'smooth' });
      }
    });

    // Make container focusable
    this.container.setAttribute('tabindex', '0');
  }

  pauseOtherAnimations(activeCard) {
    const cards = this.container.querySelectorAll('.testimonial-card');
    cards.forEach(card => {
      if (card !== activeCard) {
        card.style.filter = 'brightness(0.7) blur(1px)';
        card.style.transform = 'scale(0.95)';
      }
    });
  }

  resumeAllAnimations() {
    const cards = this.container.querySelectorAll('.testimonial-card');
    cards.forEach(card => {
      card.style.filter = '';
      card.style.transform = '';
    });
  }

  setupTestimonialCarousel() {
    const container = document.querySelector('.testimonials-grid');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (!container || cards.length === 0) return;

    // Create controls
    const controlsHTML = `
      <div class="carousel-controls">
        <button class="carousel-btn prev">‹</button>
        <div class="carousel-dots"></div>
        <button class="carousel-btn next">›</button>
      </div>
    `;
    
    container.parentElement.insertAdjacentHTML('afterend', controlsHTML);
    
    // Create dots
    const dotsContainer = document.querySelector('.carousel-dots');
    cards.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dotsContainer.appendChild(dot);
    });

    let currentIndex = 0;
    const scrollAmount = 370;

    const updateCarousel = (index) => {
      container.scrollTo({
        left: index * scrollAmount,
        behavior: 'smooth'
      });
      
      document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      
      currentIndex = index;
    };

    document.querySelector('.carousel-btn.prev').addEventListener('click', () => {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
      updateCarousel(newIndex);
    });

    document.querySelector('.carousel-btn.next').addEventListener('click', () => {
      const newIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
      updateCarousel(newIndex);
    });

    document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
      dot.addEventListener('click', () => updateCarousel(index));
    });
  }
}

// Initialize everything when DOM is loaded
// Splash Screen Controller
class SplashScreen {
  constructor() {
    this.init();
  }

  init() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;

    setTimeout(() => {
      splash.remove();
      document.body.style.overflow = '';
    }, 2800);

    document.body.style.overflow = 'hidden';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize splash screen
  new SplashScreen();
  
  // Initialize animation controller
  new AnimationController();
  
  // Initialize testimonials enhancer
  const testimonialsEnhancer = new TestimonialsEnhancer();
  testimonialsEnhancer.setupTestimonialCarousel();
  
  // Initialize testimonial carousel on mobile
  if (window.innerWidth <= 768) {
    const testimonialsGrid = document.querySelector('.testimonials-grid');
    if (testimonialsGrid) {
      new TestimonialCarousel(testimonialsGrid);
    }
  }
  
  // Initialize lightbox
  new Lightbox();
  
  // Initialize ripple effects
  RippleEffect.init();
});

// Add ripple animation CSS
const rippleCSS = `
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);