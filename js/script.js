// Main JavaScript - Ashish Waghmare Fitness

class FitnessWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupFAQ();
    this.setupModal();
    this.setupForms();
    this.setupBlogSearch();
    this.setupWhatsAppFloat();
  }

  // Mobile Menu Toggle
  setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking on a link
    navMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // FAQ Accordion
  setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains('active');
        
        // Close all other FAQs
        faqQuestions.forEach(q => {
          q.classList.remove('active');
          q.nextElementSibling.classList.remove('active');
        });
        
        // Toggle current FAQ
        if (!isActive) {
          question.classList.add('active');
          answer.classList.add('active');
        }
      });
    });
  }

  // Modal System
  setupModal() {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = document.querySelector('.close');
    const detailButtons = document.querySelectorAll('.btn-details');

    if (!modal) return;

    const planDetails = {
      starter: {
        title: 'Starter Plan - ₹999/month',
        description: `
          <strong>Perfect for beginners ready to start their fitness journey</strong>
          <br><br>
          <strong>What's Included:</strong>
          <ul>
            <li>Personalized 4-week workout plan</li>
            <li>Home or gym workout options</li>
            <li>Basic meal planning guidance</li>
            <li>Weekly progress check-ins via WhatsApp</li>
            <li>Exercise video demonstrations</li>
            <li>Nutrition tips and healthy recipes</li>
          </ul>
          <br>
          <strong>Perfect For:</strong>
          <ul>
            <li>Complete fitness beginners</li>
            <li>Students on a tight budget</li>
            <li>Those with limited time (30-45 min workouts)</li>
            <li>People who prefer flexible scheduling</li>
          </ul>
        `
      },
      group: {
        title: 'Group Plan - ₹1499/month',
        description: `
          <strong>Best for student groups who want to transform together</strong>
          <br><br>
          <strong>What's Included:</strong>
          <ul>
            <li>8-week comprehensive program</li>
            <li>Group progress tracking dashboard</li>
            <li>Detailed diet templates and meal plans</li>
            <li>Monthly group video calls with Ashish</li>
            <li>Private group chat for motivation</li>
            <li>Weekly challenges and competitions</li>
            <li>Workout buddy matching system</li>
          </ul>
          <br>
          <strong>Perfect For:</strong>
          <ul>
            <li>Groups of 3-6 friends or classmates</li>
            <li>Those who thrive on community support</li>
            <li>Students wanting accountability partners</li>
            <li>People who enjoy friendly competition</li>
          </ul>
        `
      },
      premium: {
        title: 'Premium Plan - ₹2499/month',
        description: `
          <strong>For serious transformation with complete personalized mentorship</strong>
          <br><br>
          <strong>What's Included:</strong>
          <ul>
            <li>Fully customized 12-week transformation plan</li>
            <li>One-on-one mentorship with Ashish</li>
            <li>Weekly video sessions for form correction</li>
            <li>Advanced meal planning with macro tracking</li>
            <li>24/7 WhatsApp support</li>
            <li>Monthly body composition analysis</li>
            <li>Supplement recommendations</li>
            <li>Lifestyle coaching and habit formation</li>
          </ul>
          <br>
          <strong>Perfect For:</strong>
          <ul>
            <li>Serious fitness enthusiasts</li>
            <li>Those with specific transformation goals</li>
            <li>People who want maximum personal attention</li>
            <li>Individuals ready to invest in their health</li>
          </ul>
        `
      }
    };

    // Open modal
    detailButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const plan = btn.getAttribute('data-plan');
        const details = planDetails[plan];
        
        if (details) {
          modalTitle.textContent = details.title;
          modalDescription.innerHTML = details.description;
          modal.style.display = 'block';
          
          // Focus management
          closeBtn.focus();
          
          // Prevent body scroll
          document.body.style.overflow = 'hidden';
        }
      });
    });

    // Close modal
    const closeModal = () => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
      }
    });
  }

  // Form Handling
  setupForms() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactForm(contactForm);
      });
    }

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      const newsletterBtn = newsletterForm.querySelector('button');
      newsletterBtn.addEventListener('click', () => {
        this.handleNewsletter();
      });
    }
  }

  handleContactForm(form) {
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !message) {
      this.showToast('Please fill in all fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showToast('Please enter a valid email address', 'error');
      return;
    }

    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      this.showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  }

  handleNewsletter() {
    const emailInput = document.getElementById('newsletter');
    const email = emailInput.value.trim();

    if (!email) {
      this.showToast('Please enter your email address', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.showToast('Please enter a valid email address', 'error');
      return;
    }

    // Simulate subscription
    this.showToast('Successfully subscribed to our newsletter!', 'success');
    emailInput.value = '';
  }

  // Toast Notifications
  showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Toast styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 10000;
      font-weight: 600;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    // Auto remove
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Blog Search
  setupBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    const blogCards = document.querySelectorAll('.blog-card');
    const noResults = document.getElementById('noResults');

    if (!searchInput || !blogCards.length) return;

    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      let visibleCards = 0;

      blogCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
          card.style.display = 'block';
          visibleCards++;
        } else {
          card.style.display = 'none';
        }
      });

      // Show/hide no results message
      if (noResults) {
        noResults.style.display = visibleCards === 0 && searchTerm ? 'block' : 'none';
      }
    });
  }

  // WhatsApp Float Behavior
  setupWhatsAppFloat() {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (!whatsappFloat) return;

    let isVisible = true;
    let ticking = false;

    const updateWhatsAppVisibility = () => {
      const scrolled = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Hide when near footer
      const nearFooter = scrolled + windowHeight > documentHeight - 200;
      
      if (nearFooter && isVisible) {
        whatsappFloat.style.transform = 'translateY(100px)';
        isVisible = false;
      } else if (!nearFooter && !isVisible) {
        whatsappFloat.style.transform = 'translateY(0)';
        isVisible = true;
      }
      
      ticking = false;
    };

    const requestWhatsAppUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateWhatsAppVisibility);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestWhatsAppUpdate, { passive: true });
  }
}

// Global functions for backward compatibility
window.toggleFAQ = function(element) {
  const answer = element.nextElementSibling;
  const isActive = element.classList.contains('active');
  
  // Close all other FAQs
  document.querySelectorAll('.faq-question').forEach(q => {
    q.classList.remove('active');
    q.nextElementSibling.classList.remove('active');
  });
  
  // Toggle current FAQ
  if (!isActive) {
    element.classList.add('active');
    answer.classList.add('active');
  }
};

window.subscribeNewsletter = function() {
  const website = new FitnessWebsite();
  website.handleNewsletter();
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FitnessWebsite();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when page is not visible
    document.body.classList.add('page-hidden');
  } else {
    // Resume animations when page becomes visible
    document.body.classList.remove('page-hidden');
  }
});