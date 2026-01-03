function toggleModal(event, id) {
    event.stopPropagation();
    const target = document.getElementById(id);
    const isOpen = target.classList.contains('active');

    // Cerrar todos los demás
    document.querySelectorAll('.popup-window').forEach(p => p.classList.remove('active'));

    // Abrir el actual si estaba cerrado
    if (!isOpen) {
        target.classList.add('active');
    }
}

// Cerrar al hacer clic en cualquier parte de la pantalla
document.addEventListener('click', () => {
    document.querySelectorAll('.popup-window').forEach(p => p.classList.remove('active'));
});