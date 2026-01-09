/**
 * UI MANAGER - Migo Web
 * Control de ventanas, scroll y efectos visuales.
 */

function togglePopup(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const isVisible = target.style.display === 'block';

    // Cerrar todos los popups antes de abrir el nuevo
    document.querySelectorAll('.popup-migo, .mini-profile-card').forEach(p => {
        p.style.display = 'none';
    });

    // Toggle
    target.style.display = isVisible ? 'none' : 'block';
}

function scrollToBottom() {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Escuchar la tecla Enter para el chat
function handleChatEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        // Esta función debe estar definida en chat-logic.js
        if (typeof sendMessage === 'function') {
            sendMessage();
        }
    }
}

console.log("UI Manager cargado correctamente.");