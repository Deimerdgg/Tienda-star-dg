/**
 * ========================================
 * JavaScript - Página de Servicios
 * Star DG Tienda Multimarcas
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funciones
    initScrollAnimations();
    initSmoothScroll();
    initServiceCards();
    initHeaderScroll();
});

/**
 * Animaciones al hacer scroll
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos con clase animate-on-scroll
    document.querySelectorAll('.service-card, .feature-card, .contact-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

/**
 * Scroll suave para enlaces internos
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Efectos interactivos en las cards de servicios
 */
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Efecto de hover mejorado
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Animación de entrada secuencial
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

/**
 * Efecto de header al hacer scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });
}

/**
 * Función para mostrar notificaciones toast
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación (success, error, info)
 */
function showToast(message, type = 'info') {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 10px;
                color: white;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            }
            .toast-success { background: linear-gradient(135deg, #10b981, #059669); }
            .toast-error { background: linear-gradient(135deg, #ef4444, #dc2626); }
            .toast-info { background: linear-gradient(135deg, #3b82f6, #2563eb); }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(toast);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * Obtener icono según tipo de notificación
 * @param {string} type - Tipo de notificación
 * @returns {string} - Nombre del icono
 */
function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Tracking de eventos para Google Analytics (opcional)
 * @param {string} category - Categoría del evento
 * @param {string} action - Acción del evento
 * @param {string} label - Etiqueta del evento
 */
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    console.log(`Event: ${category} - ${action} - ${label}`);
}

// Agregar estilos CSS para animaciones
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Efectos adicionales para las cards */
    .service-card {
        position: relative;
        overflow: hidden;
    }
    
    .service-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, var(--primary), var(--accent));
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
    }
    
    .service-card:hover::before {
        transform: scaleX(1);
    }
    
    /* Loader para botones */
    .btn-loading {
        position: relative;
        pointer-events: none;
    }
    
    .btn-loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(animationStyles);

// Exportar funciones para uso global
window.StarDG = {
    showToast,
    trackEvent
};
