function toggleTranslator() {
    document.getElementById('translator-panel').classList.toggle('active');
}

function toggleRecord() {
    const panel = document.getElementById('record-panel');
    panel.classList.toggle('active');
    
    // Si se abre, añadimos un error de prueba para verificar el diseño
    if(panel.classList.contains('active')) {
        addError("She dont like apple", "She doesn't like apples");
    }
}

function toggleFocus() {
    document.getElementById('focus-panel').classList.toggle('active');
}

// Función para crear los rectángulos de error en el historial
function addError(mistake, correction) {
    const container = document.getElementById('error-log-container');
    if (!container) return;
    
    const div = document.createElement('div');
    div.className = 'error-box';
    div.innerHTML = `
        <span class="wrong">${mistake}</span>
        <span class="correct">${correction}</span>
    `;
    container.prepend(div);
}