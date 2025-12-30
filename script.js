// Funciones para abrir y cerrar paneles
function toggleTranslator() {
    document.getElementById('translator-panel').classList.toggle('active');
}

function toggleRecord() {
    document.getElementById('record-panel').classList.toggle('active');
    // Esto añade un error de prueba para ver el rectángulo
    addError("I has a pencil", "I have a pencil");
}

function toggleFocus() {
    document.getElementById('focus-panel').classList.toggle('active');
}

// Función para crear los rectángulos de error cerrados
function addError(mistake, correction) {
    const container = document.getElementById('error-log-container');
    if (!container) return;
    
    const box = document.createElement('div');
    box.className = 'error-box';
    box.innerHTML = `
        <span class="wrong">Mistake: ${mistake}</span>
        <span class="correct">Correction: ${correction}</span>
    `;
    container.prepend(box);
}