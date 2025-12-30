// 1. Función para abrir/cerrar paneles
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.toggle('active');
        console.log("Panel " + panelId + " activado");
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

// 3. Al cargar la web, obligamos a los botones a funcionar
window.onload = () => {
    const botones = document.querySelectorAll('button');
    
    botones.forEach(btn => {
        const texto = btn.innerText.toLowerCase();
        
        if (texto.includes('translator')) {
            btn.onclick = () => togglePanel('translator-panel');
        } else if (texto.includes('record')) {
            btn.onclick = () => {
                togglePanel('record-panel');
                addError("I has a dog", "I have a dog"); // Prueba visual
            };
        } else if (texto.includes('settings')) {
            btn.onclick = () => togglePanel('focus-panel');
        }
    });
};