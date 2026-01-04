function togglePopup(event, id) {
    event.stopPropagation();
    const target = document.getElementById(id);
    const wasActive = target.classList.contains('active');
    closeAllPopups();
    if (!wasActive) target.classList.add('active');
}

function closeAllPopups() {
    document.querySelectorAll('.popup-modal, .popup-user-card, .translator-premium').forEach(p => p.classList.remove('active'));
}

function setConfig(type, value, element) {
    const parent = element.parentElement;
    parent.querySelectorAll('.opt-btn, .opt-row').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    if (type === 'rigor') {
        document.getElementById('stat-rigor').innerText = value + ' / ' + (value === 'Relajado' ? 'Relaxed' : 'Strict');
    } else if (type === 'style') {
        document.getElementById('stat-style').innerText = value;
    }
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.anchor')) closeAllPopups();
});