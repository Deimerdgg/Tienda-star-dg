/* ========================================
   JAVASCRIPT - STAR DG TIENDA MULTIMARCA
   Funcionalidades completas con animaciones
   ======================================== */

// ========================================
// 1. CARRITO DE COMPRAS
// ========================================

const cart = {
    items: [],
    
    addItem: function(productId, productName, productPrice, productImage = '📦') {
        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        this.updateCartBadge();
        this.renderCartItems();
        this.showNotification(`${productName} agregado al carrito`);
    },
    
    removeItem: function(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCartBadge();
        this.renderCartItems();
    },
    
    updateQuantity: function(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.updateCartBadge();
                this.renderCartItems();
            }
        }
    },
    
    updateCartBadge: function() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
        }
    },
    
    getTotal: function() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    renderCartItems: function() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) return;
        
        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛒</div>
                    <p>Tu carrito está vacío</p>
                    <p>¡Agrega productos para comenzar!</p>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">${item.image}</div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatCurrency(item.price)}</div>
                        <div class="cart-item-quantity">
                            <button onclick="cart.updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="cart.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="btn-remove-item" onclick="cart.removeItem(${item.id})">×</button>
                </div>
            `).join('');
        }
        
        // Actualizar total
        const totalElement = document.querySelector('.cart-total-value');
        if (totalElement) {
            totalElement.textContent = formatCurrency(this.getTotal());
        }
    },
    
    showNotification: function(message, type = 'success') {
        // Eliminar notificaciones anteriores
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        const colors = {
            success: '#10b981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        notification.className = 'custom-notification';
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background-color: ${colors[type] || colors.success};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 280px;
        `;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        notification.innerHTML = `
            <span style="
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            ">${icons[type] || icons.success}</span>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animación de salida
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    openCart: function() {
        const overlay = document.querySelector('.cart-overlay');
        const panel = document.querySelector('.cart-panel');
        if (overlay && panel) {
            overlay.classList.add('active');
            panel.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    closeCart: function() {
        const overlay = document.querySelector('.cart-overlay');
        const panel = document.querySelector('.cart-panel');
        if (overlay && panel) {
            overlay.classList.remove('active');
            panel.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    checkout: function() {
        if (this.items.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        let message = '¡Hola! Quiero comprar:%0A%0A';
        this.items.forEach(item => {
            message += `• ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}%0A`;
        });
        message += `%0ATotal: ${formatCurrency(this.getTotal())}`;
        
        window.open(`https://wa.me/573046188207?text=${message}`, '_blank');
    }
};

// ========================================
// 2. MENÚ MÓVIL CON ANIMACIONES
// ========================================

function initMobileMenu() {
    const menuBtn = document.querySelector('.btn-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            // Animación del botón
            this.classList.toggle('active');
            
            // Animación del menú
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.style.transform = 'translateY(-20px)';
                mobileMenu.style.opacity = '0';
                setTimeout(() => {
                    mobileMenu.classList.remove('active');
                }, 200);
            } else {
                mobileMenu.classList.add('active');
                setTimeout(() => {
                    mobileMenu.style.transform = 'translateY(0)';
                    mobileMenu.style.opacity = '1';
                }, 10);
            }
        });
        
        // Estilos de transición para el menú
        mobileMenu.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        // Cerrar menú al hacer clic en un enlace
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    }
}

// ========================================
// 3. ANIMACIONES DE ENTRADA
// ========================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.category-card, .service-card, .benefit-box, .stat, .hero-content, .hero-image'
    );
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Efecto de sonido suave (opcional)
                // playHoverSound();
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.68, -0.15, 0.265, 1.15)';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// ========================================
// 4. EFECTOS DE HOVER MEJORADOS
// ========================================

function initHoverEffects() {
    // Efectos en tarjetas de categorías
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 50px rgba(26, 35, 126, 0.2)';
        });
        
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Efectos en tarjetas de servicios
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.01)';
            this.style.boxShadow = '0 15px 40px rgba(26, 35, 126, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // Efectos en botones
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-whatsapp');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ========================================
// 5. EFECTO PARALLAX EN HERO
// ========================================

function initParallax() {
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (hero && heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            heroImage.style.transform = `translateY(${rate}px)`;
            heroImage.style.opacity = 1 - scrolled / 700;
        });
    }
}

// ========================================
// 6. CONTADOR ANIMADO
// ========================================

function initCounters() {
    const stats = document.querySelectorAll('.stat-value');
    
    stats.forEach(stat => {
        const text = stat.textContent;
        const isNumber = !isNaN(parseInt(text));
        
        if (isNumber || text === 'Gratis') {
            stat.dataset.target = text === 'Gratis' ? '100' : text;
            stat.dataset.suffix = text === 'Gratis' ? '%' : '';
            
            if (isNumber || text === 'Gratis') {
                const target = parseInt(stat.dataset.target);
                let count = 0;
                const increment = target / 50;
                
                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        stat.textContent = Math.floor(count) + (stat.dataset.suffix || '');
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = text;
                    }
                };
                
                // Observar cuando el elemento sea visible
                const observer = new IntersectionObserver(entries => {
                    if (entries[0].isIntersecting) {
                        updateCount();
                        observer.unobserve(stat);
                    }
                });
                
                observer.observe(stat);
            }
        }
    });
}

// ========================================
// 7. EFECTO DE CARGA DE PÁGINA
// ========================================

function initPageLoadAnimation() {
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    
    if (header) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
    }
    
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(30px)';
    }
    
    // Ejecutar animación después de un pequeño delay
    setTimeout(() => {
        if (header) {
            header.style.transition = 'all 0.6s cubic-bezier(0.68, -0.15, 0.265, 1.15)';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }
        
        setTimeout(() => {
            if (hero) {
                hero.style.transition = 'all 0.8s cubic-bezier(0.68, -0.15, 0.265, 1.15)';
                hero.style.opacity = '1';
                hero.style.transform = 'translateY(0)';
            }
        }, 200);
    }, 100);
}

// ========================================
// 8. EFECTO DE SCROLL SUAVE MEJORADO
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// 3. INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Star DG - Página cargada');
    
    // ========================================
    
    // Inicializar menú móvil
    initMobileMenu();
    
    // Inicializar carrito
    cart.updateCartBadge();
    cart.renderCartItems();
    
    // Evento del botón del carrito
    const cartBtn = document.querySelector('.btn-cart');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            cart.openCart();
        });
    }
    
    // Cerrar carrito
    const closeBtn = document.querySelector('.btn-close-cart');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            cart.closeCart();
        });
    }
    
    const overlay = document.querySelector('.cart-overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            cart.closeCart();
        });
    }
    
    // Checkout
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            cart.checkout();
        });
    }
    
    // ========================================
    // NAVEGACIÓN SUAVE
    // ========================================
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ========================================
    // BOTONES "VER PRODUCTOS"
    // ========================================
    const primaryButtons = document.querySelectorAll('.btn-primary');
    
    primaryButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.tagName === 'BUTTON') {
                e.preventDefault();
                // Agregar producto de ejemplo al carrito
                cart.addItem(
                    1,
                    'Producto Destacado',
                    99999,
                    '📱'
                );
            }
        });
    });
    
    // ========================================
    // TARJETAS DE CATEGORÍAS
    // Los enlaces de categorías ahora navegan directamente a sus páginas
    // ========================================
    // (Código eliminado - los category-card ahora navegan usando href en el HTML)
    
    /*
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryName = this.querySelector('.category-name').textContent;
            cart.addItem(
                Date.now(),
                categoryName,
                50000,
                '🎁'
            );
        });
    });
    */
    
    // ========================================
    // TARJETAS DE SERVICIOS
    // ========================================
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        card.addEventListener('click', function() {
            const serviceName = this.querySelector('.service-title').textContent;
            window.open('https://wa.me/573046188207?text=Hola, me interesa: ' + encodeURIComponent(serviceName), '_blank');
        });
    });
    
    // ========================================
    // EFECTOS DE SCROLL
    // ========================================
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
            }
        }
    });
    
    // ========================================
    // BÚSQUEDA
    // ========================================
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchQuery = this.value.trim().toLowerCase();
                if (searchQuery.length > 0) {
                    // Navegar a la sección de productos
                    window.location.href = '#productos';
                }
            }
        });
    }
});

// ========================================
// FUNCIONES AUXILIARES
// ========================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

function getCurrentDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('es-CO', options);
}

// ========================================
// ANIMACIONES CON INTERSECTION OBSERVER
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-up');
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos
    const animateElements = document.querySelectorAll('.category-card, .service-card, .benefit-box');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
});

// ========================================
// MANEJO DE ERRORES
// ========================================

window.addEventListener('error', function(event) {
    console.error('Error en la página:', event.error);
});

// ========================================
// EXPORTAR VARIABLES Y FUNCIONES
// ========================================

// Hacer funciones accesibles globalmente
window.cart = cart;
window.formatCurrency = formatCurrency;
