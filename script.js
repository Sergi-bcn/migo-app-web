function togglePanel(id) {
    const p = document.getElementById(id);
    if(p) p.classList.toggle('active');
}

function addError(m, f) {
    const c = document.getElementById('error-log-container');
    if(c) {
        const b = document.createElement('div');
        b.className = 'error-box';
        b.innerHTML = `<span class="mistake">${m}</span><span class="correction">${f}</span>`;
        c.prepend(b);
    }
}

window.onload = () => {
    addError("I has a pencil", "I have a pencil");
};