function togglePopup(event, id) {
    event.stopPropagation();
    const target = document.getElementById(id);
    const wasActive = target.classList.contains('active');
    
    // Cerramos todos antes de abrir el nuevo
    closeAllPopups();
    
    if (!wasActive) {
        target.classList.add('active');
    }
}

function closeAllPopups() {
    document.querySelectorAll('.popup-modal, .popup-user-card, .translator-premium').forEach(p => {
        p.classList.remove('active');
    });
}

// Cerramos al hacer clic fuera del área del popup
document.addEventListener('click', (e) => {
    if (!e.target.closest('.anchor')) {
        closeAllPopups();
    }
});