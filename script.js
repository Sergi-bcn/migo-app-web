// 1. Función para abrir/cerrar paneles
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.toggle('active');
        console.log("Panel " + panelId + " toggled");
        
        // Cerrar otros paneles cuando se abre uno nuevo (opcional)
        const allPanels = document.querySelectorAll('.side-panel, .bottom-panel');
        allPanels.forEach(p => {
            if (p.id !== panelId && p.classList.contains('active')) {
                p.classList.remove('active');
            }
        });
    } else {
        console.error("No se encontró el panel con ID: " + panelId);
    }
}

// 2. Función para añadir el error de ejemplo
function addError(mistake, correction) {
    const container = document.getElementById('error-log-container');
    if (container) {
        const box = document.createElement('div');
        box.className = 'error-box';
        box.innerHTML = `<span class="wrong">${mistake}</span><span class="correct">${correction}</span>`;
        container.prepend(box);
    }
}

// 3. Al cargar la web, asignamos los eventos a los botones
window.onload = () => {
    console.log("Page loaded successfully");
    
    // Asignar eventos directamente por ID (más seguro)
    document.getElementById('btn-translator').onclick = () => togglePanel('translator-panel');
    document.getElementById('btn-record').onclick = () => {
        togglePanel('record-panel');
        addError("I has a dog", "I have a dog"); // Prueba visual
    };
    document.getElementById('btn-settings').onclick = () => togglePanel('focus-panel');
    
    // Agregar algunos errores de ejemplo al cargar
    addError("She don't like apples", "She doesn't like apples");
    addError("We was there yesterday", "We were there yesterday");
};