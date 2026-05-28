/* ==========================================================================
   Labwise — catalogue page
   ========================================================================== */

(function () {
    'use strict';

    /* --------------------------------------------------------------------
       Category → brand color + SVG icon map
       Matches the catalogue PDF's color-coded category system.
       -------------------------------------------------------------------- */
    const CATEGORY_META = {
        'Biology Equipment':           { color: '#4eb262', icon: 'biology' },
        'Chemistry Glassware':         { color: '#5fb3b5', icon: 'flask'   },
        'Chemicals & Reagents':        { color: '#ec8b29', icon: 'reagent' },
        'Indicators & Test Papers':    { color: '#f2b134', icon: 'paper'   },
        'Physics Equipment':           { color: '#1e2a5e', icon: 'physics' },
        'Lab Consumables':             { color: '#7e57a9', icon: 'consumable' },
        'Electronics & Test Equipment':{ color: '#e95824', icon: 'electronics' },
        'Specialised Instruments':     { color: '#c9437d', icon: 'instrument' }
    };
    const DEFAULT_META = { color: '#1b7bb2', icon: 'flask' };

    const ICONS = {
        biology:      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="20" r="8"/><path d="M32 28v12"/><rect x="24" y="40" width="16" height="10" rx="2"/><path d="M20 56h24"/></svg>',
        flask:        '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M24 8h16v14l10 28a4 4 0 0 1-4 6H22a4 4 0 0 1-4-6l10-28z"/><line x1="24" y1="8" x2="40" y2="8"/><line x1="22" y1="38" x2="42" y2="38"/></svg>',
        reagent:      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M26 8h12v16l10 22a4 4 0 0 1-4 6H20a4 4 0 0 1-4-6l10-22z"/><circle cx="32" cy="40" r="3"/><circle cx="26" cy="46" r="2"/><circle cx="38" cy="46" r="2"/></svg>',
        paper:        '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="10" width="36" height="44" rx="2"/><line x1="22" y1="22" x2="42" y2="22"/><line x1="22" y1="30" x2="42" y2="30"/><line x1="22" y1="38" x2="36" y2="38"/></svg>',
        physics:      '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="6"/><ellipse cx="32" cy="32" rx="22" ry="10"/><ellipse cx="32" cy="32" rx="22" ry="10" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="22" ry="10" transform="rotate(120 32 32)"/></svg>',
        consumable:   '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18h32v8H16z"/><path d="M18 26v22h28V26"/><line x1="28" y1="34" x2="36" y2="34"/></svg>',
        electronics:  '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="18" width="36" height="28" rx="2"/><circle cx="24" cy="32" r="3"/><circle cx="40" cy="32" r="3"/><path d="M22 18V10h20v8"/><line x1="10" y1="36" x2="14" y2="36"/><line x1="50" y1="36" x2="54" y2="36"/></svg>',
        instrument:   '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="14" width="40" height="36" rx="3"/><rect x="20" y="22" width="24" height="14" rx="1"/><circle cx="24" cy="44" r="2"/><circle cx="32" cy="44" r="2"/><circle cx="40" cy="44" r="2"/></svg>'
    };

    /* --------------------------------------------------------------------
       State
       -------------------------------------------------------------------- */
    const state = {
        products: [],
        categories: [],
        activeCategory: 'all',
        searchTerm: '',
        sort: 'name-asc',
        cart: new Map()  // sku → { product, qty }
    };

    const STORAGE_KEY = 'labwise.quote.cart.v1';

    /* --------------------------------------------------------------------
       DOM
       -------------------------------------------------------------------- */
    const $ = sel => document.querySelector(sel);
    const grid           = $('#productGrid');
    const chipsEl        = $('#categoryChips');
    const sortSelect     = $('#sortSelect');
    const searchInput    = $('#searchInput');
    const searchClear    = $('#searchClear');
    const resultMeta     = $('#resultMeta');
    const emptyState     = $('#emptyState');
    const clearFilters   = $('#clearFilters');
    const totalCountEl   = $('#totalCount');
    const catCountEl     = $('#catCount');
    const footerCategoriesEl = $('#footerCategories');

    const fab            = $('#quoteFab');
    const fabCount       = $('#quoteFabCount');
    const drawer         = $('#quoteDrawer');
    const drawerBackdrop = $('#quoteDrawerBackdrop');
    const drawerClose    = $('#quoteDrawerClose');
    const drawerBody     = $('#quoteDrawerBody');
    const subcount       = $('#quoteSubcount');
    const totalItems     = $('#quoteTotalItems');
    const totalMoney     = $('#quoteTotalMoney');
    const btnSend        = $('#quoteSend');
    const btnClearQuote  = $('#quoteClear');

    /* --------------------------------------------------------------------
       Helpers
       -------------------------------------------------------------------- */
    const meta = name => CATEGORY_META[name] || DEFAULT_META;
    const escapeHtml = s => String(s).replace(/[&<>"']/g, m => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));

    /* --------------------------------------------------------------------
       Cart persistence
       -------------------------------------------------------------------- */
    function loadCart () {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const entries = JSON.parse(raw);
            entries.forEach(({ sku, qty }) => {
                const p = state.products.find(x => x.sku === sku);
                if (p) state.cart.set(sku, { product: p, qty });
            });
        } catch (_) { /* ignore */ }
    }
    function saveCart () {
        const entries = [...state.cart.values()].map(({ product, qty }) => ({ sku: product.sku, qty }));
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch (_) {}
    }

    /* --------------------------------------------------------------------
       Init: load data
       Prefers window.LABWISE_PRODUCTS (loaded via data/products.js script tag)
       — works on file:// without fetch/CORS. Falls back to fetch when absent.
       -------------------------------------------------------------------- */
    function bootstrap (data) {
        state.products = data.products || [];
        state.categories = data.categories || [];
        loadCart();
        renderMeta();
        renderChips();
        renderFooterCategories();
        renderProducts();
        renderCart();
    }

    if (window.LABWISE_PRODUCTS) {
        bootstrap(window.LABWISE_PRODUCTS);
    } else {
        fetch('data/products.json')
            .then(r => {
                if (!r.ok) throw new Error('Could not load catalogue (' + r.status + ')');
                return r.json();
            })
            .then(bootstrap)
            .catch(err => {
                grid.innerHTML = `<div class="cat-loading" style="color:#a31515">
                    <strong>Could not load catalogue.</strong><br>
                    ${escapeHtml(err.message)}<br><br>
                    <small>Make sure <code>data/products.js</code> is loaded before <code>catalogue.js</code>, or serve the site over HTTP.</small>
                </div>`;
            });
    }

    /* --------------------------------------------------------------------
       Render — meta counts
       -------------------------------------------------------------------- */
    function renderMeta () {
        if (totalCountEl) totalCountEl.textContent = state.products.length;
        if (catCountEl)   catCountEl.textContent   = state.categories.length;
    }

    /* --------------------------------------------------------------------
       Render — category chips
       -------------------------------------------------------------------- */
    function renderChips () {
        const counts = new Map();
        state.products.forEach(p => counts.set(p.category, (counts.get(p.category) || 0) + 1));

        const html = [
            `<button class="cat-chip${state.activeCategory === 'all' ? ' active' : ''}" data-cat="all">
                All <span class="cat-chip-count">${state.products.length}</span>
            </button>`
        ];
        state.categories.forEach(name => {
            const m = meta(name);
            const c = counts.get(name) || 0;
            const active = state.activeCategory === name;
            html.push(`
                <button class="cat-chip${active ? ' active' : ''}" data-cat="${escapeHtml(name)}" style="--chip:${m.color}">
                    <span class="cat-chip-dot"></span>${escapeHtml(name)}
                    <span class="cat-chip-count">${c}</span>
                </button>
            `);
        });
        chipsEl.innerHTML = html.join('');

        chipsEl.querySelectorAll('.cat-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                state.activeCategory = chip.dataset.cat;
                renderChips();
                renderProducts();
            });
        });
    }

    /* --------------------------------------------------------------------
       Render — footer category list
       -------------------------------------------------------------------- */
    function renderFooterCategories () {
        if (!footerCategoriesEl) return;
        footerCategoriesEl.innerHTML = state.categories.map(name =>
            `<li><a href="#" data-cat="${escapeHtml(name)}">${escapeHtml(name)}</a></li>`
        ).join('');
        footerCategoriesEl.querySelectorAll('a[data-cat]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                state.activeCategory = a.dataset.cat;
                renderChips();
                renderProducts();
                window.scrollTo({ top: $('.cat-toolbar').offsetTop - 80, behavior: 'smooth' });
            });
        });
    }

    /* --------------------------------------------------------------------
       Filter + sort
       -------------------------------------------------------------------- */
    function getVisible () {
        let list = state.products.slice();

        if (state.activeCategory !== 'all') {
            list = list.filter(p => p.category === state.activeCategory);
        }

        const q = state.searchTerm.trim().toLowerCase();
        if (q) {
            list = list.filter(p => {
                const haystack = [
                    p.name, p.sku, p.description, p.spec, p.category,
                    ...(p.tags || [])
                ].join(' ').toLowerCase();
                return haystack.includes(q);
            });
        }

        switch (state.sort) {
            case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name));  break;
            case 'name-desc':  list.sort((a, b) => b.name.localeCompare(a.name));  break;
            case 'category':   list.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)); break;
        }
        return list;
    }

    /* --------------------------------------------------------------------
       Render — products
       -------------------------------------------------------------------- */
    function renderProducts () {
        const list = getVisible();

        // Result meta
        const total = state.products.length;
        const showing = list.length;
        const bits = [];
        bits.push(`<strong>${showing}</strong> of ${total} products`);
        if (state.activeCategory !== 'all') bits.push(`in <strong>${escapeHtml(state.activeCategory)}</strong>`);
        if (state.searchTerm.trim())        bits.push(`matching <strong>“${escapeHtml(state.searchTerm.trim())}”</strong>`);
        resultMeta.innerHTML = bits.join(' ');

        if (!list.length) {
            grid.innerHTML = '';
            emptyState.hidden = false;
            return;
        }
        emptyState.hidden = true;

        grid.innerHTML = list.map(productCardHTML).join('');

        // Add-to-quote wire
        grid.querySelectorAll('.product-add').forEach(btn => {
            btn.addEventListener('click', () => addToCart(btn.dataset.sku));
        });

        // Lazy image with placeholder fallback
        grid.querySelectorAll('img.product-img-real').forEach(img => {
            img.addEventListener('error', () => {
                const card = img.closest('.product-image');
                if (!card) return;
                img.remove();
                const cat = card.dataset.icon;
                card.insertAdjacentHTML('beforeend',
                    `<div class="product-placeholder">${ICONS[cat] || ICONS.flask}</div>`);
            });
        });
    }

    function productCardHTML (p) {
        const m = meta(p.category);
        const inCart = state.cart.has(p.sku);
        return `
            <article class="product-card${inCart ? ' in-quote' : ''}" style="--cat:${m.color}" data-sku="${escapeHtml(p.sku)}">
                <div class="product-image" data-icon="${m.icon}">
                    <img class="product-img-real" src=".${escapeHtml(p.imageUrl)}" alt="" loading="lazy">
                    <span class="product-cat-badge">${escapeHtml(p.category)}</span>
                    <span class="product-sku-tag">${escapeHtml(p.sku)}</span>
                </div>
                <div class="product-body">
                    <h3 class="product-name">${escapeHtml(p.name)}</h3>
                    <p class="product-desc">${escapeHtml(p.description)}</p>
                    ${p.spec ? `<div class="product-spec"><strong>Spec</strong>${escapeHtml(p.spec)}</div>` : ''}
                    <div class="product-foot">
                        <div class="product-price">
                            <span class="product-price-value">P.O.R</span>
                            <span class="product-price-unit">Price on request · per ${escapeHtml(p.unit)}</span>
                        </div>
                        <button class="product-add${inCart ? ' added' : ''}" data-sku="${escapeHtml(p.sku)}" aria-label="Add ${escapeHtml(p.name)} to quote">
                            ${inCart ? 'Added' : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg> Add to quote`}
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    /* --------------------------------------------------------------------
       Cart actions
       -------------------------------------------------------------------- */
    function addToCart (sku) {
        const product = state.products.find(p => p.sku === sku);
        if (!product) return;
        const existing = state.cart.get(sku);
        if (existing) {
            existing.qty += 1;
        } else {
            state.cart.set(sku, { product, qty: 1 });
        }
        saveCart();
        renderProducts();
        renderCart();
        openDrawer();
    }
    function setQty (sku, qty) {
        const entry = state.cart.get(sku);
        if (!entry) return;
        const n = Math.max(1, Math.floor(qty) || 1);
        entry.qty = n;
        saveCart();
        renderCart();
    }
    function removeFromCart (sku) {
        state.cart.delete(sku);
        saveCart();
        renderProducts();
        renderCart();
    }
    function clearCart () {
        state.cart.clear();
        saveCart();
        renderProducts();
        renderCart();
    }

    /* --------------------------------------------------------------------
       Render — cart / drawer
       -------------------------------------------------------------------- */
    function renderCart () {
        const items = [...state.cart.values()];
        const count = items.reduce((a, b) => a + b.qty, 0);

        fabCount.textContent = count;
        fab.hidden = count === 0 && !drawer.classList.contains('open');
        subcount.textContent = count === 1 ? '1 item' : `${count} items`;
        totalItems.textContent = count;
        btnSend.disabled = count === 0;
        btnSend.style.opacity = count === 0 ? '0.45' : '';
        btnSend.style.pointerEvents = count === 0 ? 'none' : '';
        btnClearQuote.style.display = count === 0 ? 'none' : '';

        if (!items.length) {
            drawerBody.innerHTML = `
                <div class="quote-empty">
                    <p>Your quote is empty.</p>
                    <p class="quote-empty-hint">Add items from the catalogue and we'll bundle them into a single quote request.</p>
                </div>
            `;
            return;
        }

        drawerBody.innerHTML = items.map(({ product, qty }) => {
            const m = meta(product.category);
            return `
                <div class="quote-line" style="--cat:${m.color}" data-sku="${escapeHtml(product.sku)}">
                    <div class="quote-line-bar"></div>
                    <div class="quote-line-body">
                        <div class="quote-line-name">${escapeHtml(product.name)}</div>
                        <div class="quote-line-meta">${escapeHtml(product.sku)} · ${escapeHtml(product.category)} · per ${escapeHtml(product.unit)}</div>
                        <div class="quote-qty">
                            <button type="button" data-act="dec" aria-label="Decrease quantity">−</button>
                            <input type="number" min="1" value="${qty}" data-act="qty" aria-label="Quantity">
                            <button type="button" data-act="inc" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                    <div class="quote-line-price">
                        <span class="quote-line-por">P.O.R</span>
                        <button type="button" class="quote-line-remove" data-act="remove">Remove</button>
                    </div>
                </div>
            `;
        }).join('');

        drawerBody.querySelectorAll('.quote-line').forEach(line => {
            const sku = line.dataset.sku;
            const entry = state.cart.get(sku);
            if (!entry) return;
            line.querySelector('[data-act="dec"]').addEventListener('click', () => setQty(sku, entry.qty - 1));
            line.querySelector('[data-act="inc"]').addEventListener('click', () => setQty(sku, entry.qty + 1));
            line.querySelector('[data-act="qty"]').addEventListener('change', e => setQty(sku, +e.target.value));
            line.querySelector('[data-act="remove"]').addEventListener('click', () => removeFromCart(sku));
        });
    }

    /* --------------------------------------------------------------------
       Drawer open/close
       -------------------------------------------------------------------- */
    function openDrawer () {
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        drawerBackdrop.hidden = false;
        fab.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    function closeDrawer () {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        drawerBackdrop.hidden = true;
        fab.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (state.cart.size === 0) fab.hidden = true;
    }
    fab.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    drawerBackdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });

    btnClearQuote.addEventListener('click', () => {
        if (state.cart.size === 0) return;
        if (confirm('Remove all items from your quote?')) clearCart();
    });

    /* --------------------------------------------------------------------
       Send quote — open mailto with structured body
       -------------------------------------------------------------------- */
    btnSend.addEventListener('click', () => {
        const items = [...state.cart.values()];
        if (!items.length) return;

        const lines = items.map(({ product, qty }) => {
            return `• ${product.name}\n  SKU: ${product.sku}  ·  Qty: ${qty} ${product.unit}${qty > 1 ? 's' : ''}  ·  ${product.category}`;
        });

        const totalCount = items.reduce((a, b) => a + b.qty, 0);

        const body = `Hello Labwise,

Please send me a formal quotation for the following items from your catalogue:

${lines.join('\n\n')}

────────────────────────────────────────
Total items: ${totalCount}
────────────────────────────────────────

Please confirm pricing, availability and lead time.

Delivery to: [please fill in]
Required by: [optional]
Institution / Name: [please fill in]
Phone: [please fill in]

— Built from labwise-namibia.com/catalogue.html`;

        const subject = `Quote request — ${totalCount} item${totalCount === 1 ? '' : 's'} from catalogue`;
        const mailto = `mailto:labwisetradingcc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    });

    /* --------------------------------------------------------------------
       Search + sort wire
       -------------------------------------------------------------------- */
    let searchTimer;
    searchInput.addEventListener('input', e => {
        state.searchTerm = e.target.value;
        searchClear.hidden = !state.searchTerm;
        clearTimeout(searchTimer);
        searchTimer = setTimeout(renderProducts, 120);
    });
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        state.searchTerm = '';
        searchClear.hidden = true;
        renderProducts();
        searchInput.focus();
    });
    sortSelect.addEventListener('change', e => {
        state.sort = e.target.value;
        renderProducts();
    });
    clearFilters.addEventListener('click', () => {
        state.searchTerm = '';
        state.activeCategory = 'all';
        searchInput.value = '';
        searchClear.hidden = true;
        renderChips();
        renderProducts();
    });

})();
