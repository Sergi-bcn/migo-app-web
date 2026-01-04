/**
 * ui-manager.js - Gestión de interfaz y ventanas múltiples
 */
function togglePopup(event, popupId) {
    // Detenemos la propagación para que no se cierre al hacer clic en el botón
    if (event) event.stopPropagation();

    const popup = document.getElementById(popupId);
    
    // Alternamos la clase 'active' solo en el popup clickeado
    if (popup) {
        popup.classList.toggle('active');
    }
}

// Opcional: Cerrar ventanas si se hace clic fuera de ellas (pero no entre ellas)
document.addEventListener('click', (event) => {
    if (!event.target.closest('.popup-modal') && !event.target.closest('button')) {
        const popups = document.querySelectorAll('.popup-modal');
        popups.forEach(p => p.classList.remove('active'));
    }
});