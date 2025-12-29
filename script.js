/**
 * Abre o cierra el panel según el ID que reciba
 */
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.toggle('active');
    }
}

/**
 * Añade un error al panel de Record
 */
function addError(mistake, fix) {
    const container = document.getElementById('error-log-container');
    if (container) {
        const box = document.createElement('div');
        box.className = 'error-box';
        box.innerHTML = `
            <span class="mistake">Mistake: ${mistake}</span>
            <span class="correction">Correction: ${fix}</span>
        `;
        container.prepend(box);
    }
}

// Empujón final: error de ejemplo al cargar
window.onload = () => {
    addError("I has a pencil", "I have a pencil");
};