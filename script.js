function handlePanel(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.toggle('show');
    }
}

function insertError(original, corregido) {
    const list = document.getElementById('record-list');
    if (list) {
        const item = document.createElement('div');
        item.className = 'card-error';
        item.innerHTML = `
            <span class="old">Error: ${original}</span>
            <span class="new">Correcto: ${corregido}</span>
        `;
        list.prepend(item);
    }
}

// Prueba para confirmar que funciona
window.onload = () => {
    console.log("Migo App Ready");
    insertError("I has a pencil", "I have a pencil");
};