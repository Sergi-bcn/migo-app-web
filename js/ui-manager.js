/**
 * ui-manager.js - Permite tener todas las ventanas abiertas a la vez
 */
function togglePopup(event, popupId) {
    if (event) event.stopPropagation();
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.toggle('active');
    }
}

// Cierra si se pulsa en el fondo de la pantalla (opcional)
document.addEventListener('click', (event) => {
    if (!event.target.closest('.popup-modal') && !event.target.closest('button')) {
        // Si quieres que no se cierren al clickar fuera, comenta las siguientes líneas
        // const popups = document.querySelectorAll('.popup-modal');
        // popups.forEach(p => p.classList.remove('active'));
    }
});