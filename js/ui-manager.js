function toggleWindow(id) {
    const win = document.getElementById(id);
    
    // Si la ventana ya está abierta, la cerramos
    if (win.classList.contains('active')) {
        win.classList.remove('active');
    } else {
        // Cerramos otras ventanas abiertas para que no se amontonen
        document.querySelectorAll('.floating-modal').forEach(m => m.classList.remove('active'));
        // Abrimos la seleccionada
        win.classList.add('active');
    }
}

// Cerrar ventanas al hacer clic fuera del área (opcional)
document.addEventListener('mousedown', (e) => {
    const modals = document.querySelectorAll('.floating-modal');
    modals.forEach(modal => {
        if (modal.classList.contains('active') && !modal.contains(e.target) && !e.target.closest('.action-icon')) {
            modal.classList.remove('active');
        }
    });
});