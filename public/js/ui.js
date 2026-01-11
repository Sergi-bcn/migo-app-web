import { isBlocked, requiredText, currentRigor } from './state.js';

export function togglePopup(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const isVisible = (el.style.display === 'block');
    el.style.display = isVisible ? 'none' : 'block';
    updatePositions();
}

export function updatePositions() {
    const modesPopup = document.getElementById('menu-modes');
    const modesBtn = document.getElementById('menu-modes-btn');
    const transPopup = document.getElementById('panel-translator');
    
    const isTransOpen = (transPopup.style.display === 'block');
    const isModesOpen = (modesPopup.style.display === 'block');

    if (isTransOpen && isModesOpen) {
        modesPopup.classList.add('shifted-left');
        modesBtn.classList.add('shifted-btn');
    } else {
        modesPopup.classList.remove('shifted-left');
        modesBtn.classList.remove('shifted-btn');
    }
}

export function copyText(btn) {
    const text = btn.parentElement.querySelector('.msg-content').innerText;
    navigator.clipboard.writeText(text);
    const originalSvg = btn.innerHTML;
    btn.innerHTML = `<span style="font-size:10px; font-weight:800; color:var(--verde)">OK</span>`;
    setTimeout(() => btn.innerHTML = originalSvg, 1500);
}
