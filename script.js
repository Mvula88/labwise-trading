/* ==========================================================================
   Labwise — site script
   ========================================================================== */

(function () {
    'use strict';

    /* --------------------------------------------------------------------
       Mobile menu
       -------------------------------------------------------------------- */
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .btn-primary-nav');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    /* --------------------------------------------------------------------
       Navbar scroll state + active link
       -------------------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');

    const onScroll = () => {
        const y = window.pageYOffset;
        if (navbar) navbar.classList.toggle('scrolled', y > 8);

        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (!link) return;
            if (y >= top && y < top + section.offsetHeight) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* --------------------------------------------------------------------
       Smooth anchor scroll (offset for sticky navbar)
       -------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });

    /* --------------------------------------------------------------------
       Scroll-to-top
       -------------------------------------------------------------------- */
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            scrollBtn.classList.toggle('visible', window.pageYOffset > 400);
        }, { passive: true });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --------------------------------------------------------------------
       Quote forms — open mailto with prefilled body
       -------------------------------------------------------------------- */
    const buildMailto = (subject, body) =>
        `mailto:labwisetradingcc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const showMessage = (form, text, kind = 'success') => {
        const existing = form.querySelector('.form-message');
        if (existing) existing.remove();
        const div = document.createElement('div');
        div.className = `form-message form-message-${kind}`;
        div.textContent = text;
        form.appendChild(div);
        setTimeout(() => { div.style.opacity = '0'; setTimeout(() => div.remove(), 300); }, 5000);
    };

    // Quick quote (hero)
    const quickForm = document.getElementById('quickQuoteForm');
    if (quickForm) {
        quickForm.addEventListener('submit', e => {
            e.preventDefault();
            const data = {
                name:  document.getElementById('qq-name').value.trim(),
                email: document.getElementById('qq-email').value.trim(),
                phone: document.getElementById('qq-phone').value.trim(),
                items: document.getElementById('qq-items').value.trim()
            };
            if (!data.name || !data.email || !data.phone || !data.items) {
                showMessage(quickForm, 'Please complete all fields.', 'error');
                return;
            }
            const body = `Name / Institution: ${data.name}
Email: ${data.email}
Phone: ${data.phone}

Items requested:
${data.items}

— Sent from labwise-namibia.com quick quote`;
            window.location.href = buildMailto(`Quick quote request — ${data.name}`, body);
            showMessage(quickForm, 'Opening your email — send the message to complete the request.');
            setTimeout(() => quickForm.reset(), 1500);
        });
    }

    // Full quote
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', e => {
            e.preventDefault();
            const f = id => (document.getElementById(id) || {}).value || '';
            const data = {
                name: f('name').trim(),
                email: f('email').trim(),
                phone: f('phone').trim(),
                location: f('location').trim(),
                category: f('category'),
                items: f('items').trim(),
                deadline: f('deadline'),
                reference: f('reference').trim(),
                message: f('message').trim()
            };
            if (!data.name || !data.email || !data.phone || !data.location || !data.items) {
                showMessage(quoteForm, 'Please complete the required fields.', 'error');
                return;
            }
            const body = `Name / Institution: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Delivery location: ${data.location}
Product category: ${data.category || 'All / multiple'}
Required by: ${data.deadline || '—'}
Reference / PO: ${data.reference || '—'}

Items & quantities:
${data.items}

Notes:
${data.message || '—'}

— Sent from labwise-namibia.com quote form`;
            window.location.href = buildMailto(`Quote request — ${data.name}`, body);
            showMessage(quoteForm, 'Opening your email — send the message to complete the request.');
            setTimeout(() => quoteForm.reset(), 1500);
        });
    }

    /* --------------------------------------------------------------------
       Inline field validation
       -------------------------------------------------------------------- */
    const fields = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select, .qq-field input, .qq-field textarea');

    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                field.classList.remove('error');
                const err = field.parentElement.querySelector('.error-message');
                if (err) err.remove();
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let valid = true;
        let msg = '';

        if (field.hasAttribute('required') && !value) {
            valid = false; msg = 'This field is required';
        }
        if (valid && field.type === 'email' && value) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                valid = false; msg = 'Please enter a valid email address';
            }
        }
        if (valid && field.type === 'tel' && value) {
            if (!/^[+]?[\d\s\-()]+$/.test(value)) {
                valid = false; msg = 'Please enter a valid phone number';
            }
        }

        const existing = field.parentElement.querySelector('.error-message');
        if (existing) existing.remove();

        if (!valid) {
            field.classList.add('error');
            const div = document.createElement('div');
            div.className = 'error-message';
            div.textContent = msg;
            field.parentElement.appendChild(div);
        } else {
            field.classList.remove('error');
        }
        return valid;
    }

    /* --------------------------------------------------------------------
       Scroll-in animations
       -------------------------------------------------------------------- */
    const animTargets = document.querySelectorAll(`
        .cat-row,
        .cat-detail,
        .ind-card,
        .why-item,
        .contact-card,
        .stat,
        .about-media,
        .about-copy,
        .quote-side,
        .quote-form-wrap,
        .section-head
    `);

    if ('IntersectionObserver' in window && animTargets.length) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        animTargets.forEach(el => {
            el.classList.add('animate-on-scroll');
            io.observe(el);
        });
    }

    /* --------------------------------------------------------------------
       Stat counters
       -------------------------------------------------------------------- */
    const counters = document.querySelectorAll('.stat-num [data-target]');
    if (counters.length && 'IntersectionObserver' in window) {
        const countObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                if (Number.isNaN(target)) return;
                const duration = 1200;
                const start = performance.now();
                const tick = now => {
                    const t = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - t, 3);
                    el.textContent = Math.floor(eased * target);
                    if (t < 1) requestAnimationFrame(tick);
                    else el.textContent = target;
                };
                requestAnimationFrame(tick);
                countObserver.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => countObserver.observe(c));
    }

    /* --------------------------------------------------------------------
       Dynamic footer year
       -------------------------------------------------------------------- */
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
