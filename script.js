// ===================================
// Mobile Menu Toggle
// ===================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===================================
// Navbar Scroll Effect
// ===================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===================================
// Active Navigation Link on Scroll
// ===================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Scroll to Top Button
// ===================================
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// Quote Form Handling
// ===================================
const quoteForm = document.getElementById('quoteForm');

quoteForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        category: document.getElementById('category').value,
        items: document.getElementById('items').value,
        deadline: document.getElementById('deadline').value,
        message: document.getElementById('message').value
    };

    // Create email body
    const emailSubject = `Quote Request from ${formData.name}`;
    const emailBody = `
Name/Institution: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Delivery Location: ${formData.location}
Product Category: ${formData.category}
Deadline: ${formData.deadline || 'Not specified'}

Items Requested:
${formData.items}

Additional Notes:
${formData.message || 'None'}
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:labwisetradingcc@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show success message
    showFormMessage('Quote request prepared! Your email client will open shortly.', 'success');

    // Optional: Reset form after a delay
    setTimeout(() => {
        quoteForm.reset();
    }, 2000);
});

// Form message display function
function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 15px;
        margin-top: 20px;
        border-radius: 8px;
        font-weight: 600;
        text-align: center;
        animation: fadeIn 0.3s ease;
        ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
        ${type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
    `;

    // Insert message after form
    quoteForm.appendChild(messageDiv);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// ===================================
// Form Validation Enhancement
// ===================================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');

formInputs.forEach(input => {
    // Add real-time validation
    input.addEventListener('blur', function() {
        validateField(this);
    });

    // Remove error styling on input
    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            this.classList.remove('error');
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.remove();
        }
    });
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[+]?[\d\s-()]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Display error or remove it
    if (!isValid) {
        field.classList.add('error');
        field.style.borderColor = '#dc3545';

        // Remove existing error message
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;';
        field.parentElement.appendChild(errorDiv);
    } else {
        field.classList.remove('error');
        field.style.borderColor = '';
        const errorMsg = field.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }

    return isValid;
}

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Staggered animation observer for grids
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('animated');
                }, index * 100); // 100ms stagger delay
            });
            staggerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Individual animated elements
    const animatedElements = document.querySelectorAll(`
        .about-card,
        .product-category,
        .service-card,
        .benefit-item,
        .contact-detail,
        .stat-item,
        .section-header,
        .quote-info,
        .quote-form-container
    `);

    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Staggered grid animations
    const grids = document.querySelectorAll(`
        .about-grid,
        .products-grid,
        .services-grid,
        .benefits-grid
    `);

    grids.forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach(child => {
            child.classList.add('animate-on-scroll');
        });
        staggerObserver.observe(grid);
    });
});

// ===================================
// Counter Animation for Stats
// ===================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (element.dataset.suffix || '');
    }, 16);
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    const suffix = stat.textContent.replace(/[0-9]/g, '');
                    stat.dataset.suffix = suffix;
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// ===================================
// Product Category Filtering (Future Enhancement)
// ===================================
// This can be implemented if you want to add search/filter functionality

// ===================================
// WhatsApp Click Handler
// ===================================
function createWhatsAppLink(phone, message = '') {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

// Add WhatsApp functionality to phone links if needed
document.addEventListener('DOMContentLoaded', () => {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        // You can add WhatsApp button next to phone numbers if desired
        // This is optional and can be customized based on requirements
    });
});

// ===================================
// Dynamic Year in Footer
// ===================================
const updateFooterYear = () => {
    const yearElements = document.querySelectorAll('.footer-copyright');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        el.textContent = el.textContent.replace(/\d{4}/, currentYear);
    });
};

updateFooterYear();

// ===================================
// Loading State Management
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Initialize any features that require full page load
    highlightNavigation();
});

// ===================================
// Performance Optimization
// ===================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(() => {
    // Additional scroll-based functionality can be added here
}, 100));

// ===================================
// Accessibility Enhancements
// ===================================
// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Focus management for mobile menu
mobileMenuToggle.addEventListener('click', () => {
    if (navMenu.classList.contains('active')) {
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }
});

// ===================================
// Print Functionality
// ===================================
window.addEventListener('beforeprint', () => {
    // Expand all collapsed sections before printing
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// ===================================
// 3D Tilt Effect for Cards
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const tiltCards = document.querySelectorAll('.about-card, .service-card, .product-category');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});

// ===================================
// Magnetic Button Effect
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-3px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
});

// ===================================
// Hero Content Animation on Load
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
});

// ===================================
// Parallax Effect for Hero Orbs
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const orbs = document.querySelectorAll('.hero-orb');

    if (hero && orbs.length > 0) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 20;
                orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }
});

// ===================================
// Product List Expand/Collapse
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const productCategories = document.querySelectorAll('.product-category');

    productCategories.forEach(category => {
        const productList = category.querySelector('.product-list');
        const categoryBtn = category.querySelector('.category-btn');
        const itemCount = productList.querySelectorAll('li').length;

        // Only add expand button if there are more than 10 items
        if (itemCount > 10) {
            // Create expand button
            const expandBtn = document.createElement('button');
            expandBtn.className = 'expand-btn';
            expandBtn.innerHTML = `<span>Show All ${itemCount} Items</span><span class="arrow">▼</span>`;

            // Insert button before the category button
            categoryBtn.parentNode.insertBefore(expandBtn, categoryBtn);

            // Toggle expand/collapse
            expandBtn.addEventListener('click', () => {
                const isExpanded = productList.classList.toggle('expanded');
                expandBtn.classList.toggle('expanded');

                if (isExpanded) {
                    expandBtn.innerHTML = `<span>Show Less</span><span class="arrow">▼</span>`;
                } else {
                    expandBtn.innerHTML = `<span>Show All ${itemCount} Items</span><span class="arrow">▼</span>`;
                }
            });
        }
    });
});

// ===================================
// Console Welcome Message
// ===================================
console.log('%cLabwise Trading cc', 'color: #1b7bb2; font-size: 24px; font-weight: bold;');
console.log('%cLaboratory & Scientific Equipment Supplier in Namibia', 'color: #073b4c; font-size: 14px;');
console.log('%cWebsite developed with ❤️', 'color: #666; font-size: 12px;');
console.log('%c📞 +264 81 440 1522 | 📧 labwisetradingcc@gmail.com', 'color: #666; font-size: 12px;');
