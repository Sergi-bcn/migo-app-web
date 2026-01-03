// Manejo de Modales
function togglePopup(event, id) {
    event.stopPropagation();
    const modal = document.getElementById(id);
    const wasActive = modal.classList.contains('active');
    
    closeAllPopups();
    
    if (!wasActive) {
        modal.classList.add('active');
    }
}

function closeAllPopups() {
    document.querySelectorAll('.popup-modal').forEach(m => m.classList.remove('active'));
}

// Lógica de Configuración (Operativa)
function setConfig(type, value, element) {
    // Actualizar UI de botones
    const parent = element.parentElement;
    parent.querySelectorAll('.opt-row').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    // Actualizar valores en el modal de usuario
    if (type === 'rigor') {
        document.getElementById('stat-rigor').innerText = value;
    } else if (type === 'style') {
        document.getElementById('stat-style').innerText = value;
    }
    
    console.log(`Configuración actualizada: ${type} -> ${value}`);
}

// Cerrar al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.popup-modal')) closeAllPopups();
});