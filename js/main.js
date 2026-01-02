/**
 * Interfaz y UI General
 */

function togglePopup(id) {
    const el = document.getElementById(id);
    if (el) {
        // Cerramos otros popups si se abre uno nuevo (opcional)
        el.classList.toggle('show-popup');
    }
}

function selectOption(el, targetId, value) {
    const parent = el.parentElement;
    Array.from(parent.children).forEach(child => child.classList.remove('active'));
    el.classList.add('active');
    
    const displayElement = document.getElementById(targetId);
    if (displayElement) displayElement.innerText = el.innerText;
    
    // Si el cambio es el nivel de rigor, actualizamos la variable global de chat-logic.js
    if (targetId === 'status-rigor') {
        currentRigor = value;
    }
}

function handleChatEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function copyText(btn) {
    const text = btn.parentElement.querySelector('.msg-content').innerText;
    navigator.clipboard.writeText(text);
    
    const originalSVG = btn.innerHTML;
    btn.innerHTML = '<span style="color:green; font-size:10px; font-weight:800;">OK!</span>';
    setTimeout(() => {
        btn.innerHTML = originalSVG;
    }, 1500);
}