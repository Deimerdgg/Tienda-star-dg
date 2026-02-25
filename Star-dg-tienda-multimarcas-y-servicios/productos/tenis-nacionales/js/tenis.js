/* ========================================
   JAVASCRIPT TENIS NACIONALES - STAR DG
   ======================================== */

// Carrito de compras
var carrito = [];

// Funcion para agregar productos al carrito
function agregarAlCarrito(nombre, precio) {
    // Verificar si el producto ya esta en el carrito
    var productoExistente = null;
    for (var i = 0; i < carrito.length; i++) {
        if (carrito[i].nombre === nombre) {
            productoExistente = carrito[i];
            break;
        }
    }
    
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }
    
    // Actualizar el contador del carrito
    actualizarContadorCarrito();
    
    // Mostrar mensaje de exito
    mostrarMensaje('"' + nombre + '" agregado al carrito', 'success');
    
    // Actualizar la vista del carrito
    actualizarVistaCarrito();
}

// Funcion para eliminar productos del carrito
function eliminarDelCarrito(nombre) {
    var index = -1;
    for (var i = 0; i < carrito.length; i++) {
        if (carrito[i].nombre === nombre) {
            index = i;
            break;
        }
    }
    
    if (index > -1) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad--;
        } else {
            carrito.splice(index, 1);
        }
    }
    
    actualizarContadorCarrito();
    actualizarVistaCarrito();
}

// Funcion para actualizar el contador del carrito
function actualizarContadorCarrito() {
    var totalItems = 0;
    for (var i = 0; i < carrito.length; i++) {
        totalItems += carrito[i].cantidad;
    }
    document.getElementById('cart-count').textContent = totalItems;
}

// Funcion para formatear precios
function formatearPrecio(precio) {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Funcion para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    // Crear elemento de mensaje
    var mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'mensaje-flash mensaje-' + tipo;
    mensajeDiv.innerHTML = '<span>' + mensaje + '</span>';
    
    // Agregar estilos si no existen
    if (!document.getElementById('mensajes-estilos')) {
        var estilos = document.createElement('style');
        estilos.id = 'mensajes-estilos';
        estilos.textContent = '.mensaje-flash { position: fixed; top: 100px; right: 20px; padding: 1rem 1.5rem; border-radius: 8px; color: #ffffff; font-weight: 500; z-index: 300; animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); } .mensaje-success { background: linear-gradient(135deg, #10b981, #059669); } .mensaje-error { background: linear-gradient(135deg, #EF4444, #DC2626); } @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }';
        document.head.appendChild(estilos);
    }
    
    document.body.appendChild(mensajeDiv);
    
    // Remover mensaje despues de 3 segundos
    setTimeout(function() {
        mensajeDiv.remove();
    }, 3000);
}

// Funcion para mostrar/ocultar el carrito
function toggleCart() {
    var carritoFlotante = document.getElementById('carrito-flotante');
    var overlay = document.getElementById('overlay');
    
    carritoFlotante.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Funcion para actualizar la vista del carrito
function actualizarVistaCarrito() {
    var carritoItems = document.getElementById('carrito-items');
    var carritoTotal = document.getElementById('carrito-total');
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito esta vacio</p>';
        carritoTotal.textContent = '$0 COP';
        return;
    }
    
    var html = '';
    var total = 0;
    
    for (var i = 0; i < carrito.length; i++) {
        var item = carrito[i];
        var subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        html += '<div class="carrito-item">';
        html += '<div class="carrito-item-info">';
        html += '<h4>' + item.nombre + '</h4>';
        html += '<p>' + formatearPrecio(item.precio) + ' COP</p>';
        html += '<small>Cantidad: ' + item.cantidad + '</small>';
        html += '</div>';
        html += '<div class="carrito-item-acciones">';
        html += '<button class="btn-eliminar" onclick="eliminarDelCarrito(\'' + item.nombre + '\')">';
        html += '<i class="fas fa-trash"></i>';
        html += '</button>';
        html += '</div>';
        html += '</div>';
    }
    
    carritoItems.innerHTML = html;
    carritoTotal.textContent = formatearPrecio(total) + ' COP';
}

// Funcion para finalizar compra por WhatsApp
function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje('Tu carrito esta vacio', 'error');
        return;
    }
    
    var mensaje = 'Hola! Me interesa comprar los siguientes productos:%0A%0A';
    var total = 0;
    
    for (var i = 0; i < carrito.length; i++) {
        var item = carrito[i];
        var subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += '- ' + item.nombre + '%0A';
        mensaje += '  Cantidad: ' + item.cantidad + '%0A';
        mensaje += '  Precio: ' + formatearPrecio(item.precio) + ' COP%0A%0A';
    }
    
    mensaje += '%0ATotal: ' + formatearPrecio(total) + ' COP%0A';
    mensaje += '%0APor favor confirmar disponibilidad y metodo de pago.';
    
    var numeroWhatsApp = '573000000000';
    var urlWhatsApp = 'https://wa.me/' + numeroWhatsApp + '?text=' + mensaje;
    
    window.open(urlWhatsApp, '_blank');
}

// Inicializar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Star DG - Tenis Nacionales cargado correctamente');
    
    // Asegurar que el contador del carrito muestre 0 al inicio
    actualizarContadorCarrito();
    
    // Agregar efecto de scroll suave
    window.addEventListener('scroll', function() {
        var header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(26, 35, 126, 0.25)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(26, 35, 126, 0.15)';
        }
    });
});

// Funciones de utilidad
function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}
