// Estas funciones ahora coinciden exactamente con tus botones de la pantalla
function toggleTranslator() {
    const panel = document.getElementById('translator-panel');
    if(panel) panel.classList.toggle('active');
}

function toggleRecord() {
    const panel = document.getElementById('record-panel');
    if(panel) {
        panel.classList.toggle('active');
        // Añadimos un error de prueba para ver el rectángulo cerrado
        addError("I has a pencil", "I have a pencil");
    }
}

function toggleFocus() {
    const panel = document.getElementById('focus-panel');
    if(panel) panel.classList.toggle('active');
}

// Función para crear los rectángulos de error
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

// Vinculamos los botones por su texto para que funcionen sí o sí
window.onload = () => {
    const botones = document.querySelectorAll('button');
    botones.forEach(btn => {
        if (btn.innerText.includes('Translator')) btn.onclick = toggleTranslator;
        if (btn.innerText.includes('Record')) btn.onclick = toggleRecord;
        if (btn.innerText.includes('Settings')) btn.onclick = toggleFocus;
    });
};