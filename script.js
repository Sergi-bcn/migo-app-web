// Funciones para abrir/cerrar paneles
function toggleTranslator() {
    document.getElementById('translator-panel').classList.toggle('active');
}

function toggleRecord() {
    document.getElementById('record-panel').classList.toggle('active');
}

function toggleFocus() {
    document.getElementById('focus-panel').classList.toggle('active');
}

// Función para insertar errores en el Record
function addError(mistake, fix) {
    const container = document.getElementById('error-log-container');
    const box = document.createElement('div');
    box.className = 'error-box';
    box.innerHTML = `
        <span class="mistake">Mistake: ${mistake}</span>
        <span class="correction">Correction: ${fix}</span>
    `;
    container.prepend(box);
}

// Prueba para asegurar que el JS está funcionando
window.onload = () => {
    console.log("App cargada correctamente");
    addError("I has a pencil", "I have a pencil");
};