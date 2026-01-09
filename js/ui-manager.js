/**
 * UI MANAGER - Migo Web Companion
 * Gestiona la interactividad de popups, menús y scroll.
 */

// --- 1. GESTIÓN DE POPUPS Y PANELES ---

/**
 * Abre o cierra un popup por su ID y cierra los demás abiertos.
 * @param {string} id - El ID del elemento HTML a mostrar/ocultar.
 */
function togglePopup(id) {
    const target = document.getElementById(id);
    if (!target) {
        console.error(`Error: No se encontró el elemento con ID "${id}"`);
        return;
    }

    // Comprobamos si ya está visible
    const isVisible = target.style.display === 'block';

    // 1. Cerramos todos los popups y tarjetas de perfil para evitar solapamientos
    // Usamos los selectores que definimos en el HTML modular
    const allPopups = document.querySelectorAll('.popup-migo, .mini-profile-card');
    allPopups.forEach(popup => {
        popup.style.display = 'none';
    });

    // 2. Si el que clicamos no estaba visible, lo mostramos
    if (!isVisible) {
        target.style.display = 'block';
        
        // Si es el traductor, ponemos el foco en el textarea automáticamente
        if (id === 'panel-translator') {
            const area = target.querySelector('textarea');
            if (area) area.focus();
        }
    }
}

/**
 * Cierra todos los popups abiertos al hacer clic fuera de ellos (opcional)
 */
window.addEventListener('click', function(event) {
    // Si quieres que se cierren al clicar fuera, puedes descomentar esta lógica:
    /*
    const isClickInside = event.target.closest('.popup-migo') || 
                          event.target.closest('.circle-btn-nav') || 
                          event.target.closest('.profile-circle-nav');
    
    if (!isClickInside) {
        document.querySelectorAll('.popup-migo, .mini-profile-card').forEach(p => {
            p.style.display = 'none';
        });
    }
    */
});


// --- 2. GESTIÓN DEL CHAT Y SCROLL ---

/**
 * Desplaza el scroll del chat hasta el final. 
 * Se debe llamar cada vez que se añade un mensaje nuevo.
 */
function scrollToBottom() {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        // Usamos un pequeño timeout para asegurar que el DOM se haya actualizado
        setTimeout(() => {
            chatBox.scrollTo({
                top: chatBox.scrollHeight,
                behavior: 'smooth'
            });
        }, 50);
    }
}


// --- 3. UTILIDADES DE COPIADO ---

/**
 * Copia el texto al portapapeles y da feedback visual al botón.
 * @param {HTMLElement} btn - El botón que disparó la función.
 */
function copyText(btn) {
    const textElement = btn.parentElement.querySelector('.msg-content');
    if (!textElement) return;

    const textToCopy = textElement.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        // Feedback visual: cambiamos el icono o color temporalmente
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '✓'; 
        btn.style.color = '#4caf50';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}


// --- 4. INICIALIZACIÓN ---

document.addEventListener('DOMContentLoaded', () => {
    console.log("UI Manager cargado y listo.");
    
    // Aseguramos que el chat empiece abajo si ya hay mensajes cargados
    scrollToBottom();
});