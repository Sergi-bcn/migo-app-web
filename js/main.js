function togglePopup(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

function selectOption(el, targetId, value) {
    const parent = el.parentElement;
    Array.from(parent.children).forEach(child => child.classList?.remove('active'));
    el.classList.add('active');
    document.getElementById(targetId).innerText = el.innerText;
    window.currentRigor = value;
}