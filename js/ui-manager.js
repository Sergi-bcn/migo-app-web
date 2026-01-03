function toggleModal(id) {
    const modal = document.getElementById(id);
    const isActive = modal.classList.contains('active');
    
    // Cerrar otros modales
    document.querySelectorAll('.modal-float').forEach(m => m.classList.remove('active'));
    
    if (!isActive) {
        modal.classList.add('active');
    }
}

// Cerrar si se hace clic fuera del modal
document.addEventListener('click', (e) => {
    if (!e.target.closest('.modal-float') && !e.target.closest('.nav-btn') && !e.target.closest('.icon-tool')) {
        document.querySelectorAll('.modal-float').forEach(m => m.classList.remove('active'));
    }
});