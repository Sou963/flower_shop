// ===== FLORIA MAIN JAVASCRIPT =====

// Cart & Wishlist Data
let cart = JSON.parse(localStorage.getItem('floriaCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('floriaWishlist')) || [];

// ===== CART FUNCTIONS =====
function updateCartCount() {
    document.querySelectorAll('.cart .count, #cart-btn span').forEach(span => {
        span.textContent = `(${cart.length})`;
    });
}

function addToCart(id, name, price) {
    if (!cart.find(item => item.id === id)) {
        cart.push({ id, name, price: parseFloat(price), quantity: 1 });
        localStorage.setItem('floriaCart', JSON.stringify(cart));
        showToast(`${name} added to cart!`);
    } else {
        showToast('Already in cart!');
    }
    updateCartCount();
}

// ===== WISHLIST FUNCTIONS =====
function toggleWishlist(name, element) {
    if (wishlist.includes(name)) {
        wishlist = wishlist.filter(item => item !== name);
        element.style.color = '';
        showToast('Removed from wishlist');
    } else {
        wishlist.push(name);
        element.style.color = '#e84393';
        showToast('Added to wishlist ❤️');
    }
    localStorage.setItem('floriaWishlist', JSON.stringify(wishlist));
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification show';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ===== HEADER FUNCTIONS =====
function initHeader() {
    const menu = document.querySelector('#menu-btn');
    const navbar = document.querySelector('.navbar');
    const searchForm = document.querySelector('.search-form');
    const searchBtn = document.querySelector('#search-btn');

    if (menu) {
        menu.onclick = () => {
            menu.classList.toggle('fa-times');
            navbar?.classList.toggle('active');
            searchForm?.classList.remove('active');
        };
    }

    if (searchBtn) {
        searchBtn.onclick = () => {
            searchForm?.classList.toggle('active');
            menu?.classList.remove('fa-times');
            navbar?.classList.remove('active');
        };
    }

    window.onscroll = () => {
        menu?.classList.remove('fa-times');
        navbar?.classList.remove('active');
        searchForm?.classList.remove('active');

        const scrollBtn = document.getElementById('scrollTopBtn');
        if (scrollBtn) {
            scrollBtn.classList.toggle('visible', window.scrollY > 500);
        }
    };
}

// ===== SCROLL TO TOP =====
function initScrollTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) {
        btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===== ADD TO CART BUTTONS (Redirect to buy.html) =====
function initAddToCart() {
    document.querySelectorAll('.btn-add-to-cart, .add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const id = this.dataset.id || 'p' + Date.now();
            const name = this.dataset.name || this.closest('.card, .product-card')?.querySelector('h3, h4')?.textContent;
            const price = this.dataset.price || this.closest('.card, .product-card')?.querySelector('.price')?.textContent?.replace(/[^0-9.]/g, '');

            // Save selected product in localStorage
            localStorage.setItem('selectedProduct', JSON.stringify({ id, name, price }));

            // Redirect to buy.html
            window.location.href = 'buy.html';
        });
    });
}

// ===== WISHLIST BUTTONS =====
function initWishlist() {
    document.querySelectorAll('.wishlist-btn, .fa-heart').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const name = this.closest('.product-card, .card')?.querySelector('h3, h4')?.textContent;
            if (name) toggleWishlist(name, this);
        });
    });
}

// ===== CART BUTTON =====
function initCartButton() {
    const cartBtn = document.querySelector('#cart-btn, #cartBtn, .cart');
    if (cartBtn) {
        cartBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
}

// ===== USER BUTTON =====
function initUserButton() {
    const userBtn = document.querySelector('#user-btn');
    if (userBtn) {
        userBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('floriaUser')) || JSON.parse(sessionStorage.getItem('floriaUser'));

            if (user && user.loggedIn) {
                if (confirm(`Signed in as ${user.name}.\nEmail: ${user.email}\n\nSign out?`)) {
                    localStorage.removeItem('floriaUser');
                    sessionStorage.removeItem('floriaUser');
                    showToast('Signed out successfully');
                    updateUserIcon();
                }
            } else {
                window.location.href = 'signin.html';
            }
        });
    }
    updateUserIcon();
}

// ===== UPDATE USER ICON =====
function updateUserIcon() {
    const userBtn = document.querySelector('#user-btn');
    if (userBtn) {
        const user = JSON.parse(localStorage.getItem('floriaUser')) || JSON.parse(sessionStorage.getItem('floriaUser'));
        if (user && user.loggedIn) {
            userBtn.style.color = '#e84393';
            userBtn.title = `Signed in as ${user.name}`;
        } else {
            userBtn.style.color = '';
            userBtn.title = 'Sign In';
        }
    }
}

// ===== NEWSLETTER =====
function initNewsletter() {
    document.querySelectorAll('.newsletter form, .newsletter-form, #newsletter-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const input = this.querySelector('input[type="email"], .email-input');
            if (input?.value) {
                showToast('Thank you for subscribing! 🌸');
                input.value = '';
            }
        });
    });
}

// ===== SORT PRODUCTS =====
function initSort() {
    const sortSelect = document.querySelector('#sort-by, .sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            const grid = document.querySelector('.product-grid, .all-products-grid');
            if (!grid) return;

            const cards = Array.from(grid.querySelectorAll('.product-card'));
            cards.sort((a, b) => {
                const priceA = parseFloat(a.dataset.price || a.querySelector('.price')?.textContent?.replace(/[^0-9.]/g, '') || 0);
                const priceB = parseFloat(b.dataset.price || b.querySelector('.price')?.textContent?.replace(/[^0-9.]/g, '') || 0);
                if (this.value === 'price-asc') return priceA - priceB;
                if (this.value === 'price-desc') return priceB - priceA;
                return 0;
            });
            cards.forEach(card => grid.appendChild(card));
            showToast('Products sorted!');
        });
    }
}

// ===== PAGE LOADER =====
function hideLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => loader.classList.add('hidden'), 500);
    }
}

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    initHeader();
    initScrollTop();
    initAddToCart();  // <-- buy.html redirect
    initWishlist();
    initCartButton();
    initUserButton();
    initNewsletter();
    initSort();
});

window.addEventListener('load', hideLoader);
