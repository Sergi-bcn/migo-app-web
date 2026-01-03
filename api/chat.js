// Función principal para enviar mensajes
async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const message = input.value.trim();

    if (!message) return;

    // 1. Mostrar mensaje del usuario en el chat
    appendMessage('user', message);
    input.value = ''; // Limpiar input

    try {
        // 2. Llamada a nuestra API en Vercel
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: message,
                // Obtenemos el rigor del botón que tenga la clase 'active'
                rigor: document.querySelector('.opt-btn.active')?.innerText.toLowerCase().includes('strict') ? 'strict' : 'relaxed'
            })
        });

        if (!response.ok) throw new Error('Error en la conexión con Migo');

        const data = await response.json();
        
        // 3. Mostrar respuesta de Migo
        if (data.reply) {
            appendMessage('bot', data.reply);
        }
        
        // 4. Si la IA detectó un error, actualizar la ventana de CORRECTIONS
        if (data.correction && data.correction !== message) {
            updateCorrectionsPanel(data);
        }

    } catch (error) {
        console.error("Error:", error);
        appendMessage('bot', "I'm sorry, Sergi. I'm having trouble thinking right now. / Lo siento, Sergi. Tengo problemas para conectar.");
    }
}

// Función para añadir burbujas al chat
function appendMessage(role, text) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = `bubble ${role === 'user' ? 'user' : 'bot'}`;
    msgDiv.innerText = text;
    
    chatBox.appendChild(msgDiv);
    
    // Scroll automático al final
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Función para actualizar la ventana de correcciones (Izquierda)
function updateCorrectionsPanel(data) {
    const correctionsList = document.getElementById('corrections-list');
    
    // Crear un nuevo elemento de corrección
    const correctionHTML = `
        <div class="correction-item" style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <p style="font-size: 0.65rem; font-weight: 800; color: #f16b24; margin-bottom: 5px;">YOU SAID:</p>
            <p style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">"${data.original || '...'}"</p>
            
            <p style="font-size: 0.65rem; font-weight: 800; color: #28a745; margin-bottom: 5px;">SUGGESTION:</p>
            <p style="font-size: 0.9rem; font-weight: 600; color: #333; margin-bottom: 10px;">${data.correction}</p>
            
            <p style="font-size: 0.65rem; font-weight: 800; color: #bbb; margin-bottom: 5px;">EXPLANATION:</p>
            <p style="font-size: 0.85rem; color: #777; font-style: italic;">${data.explanation || 'No hay explicación disponible.'}</p>
        </div>
    `;

    // Reemplazar el "No hay correcciones todavía" o añadir a la lista
    if (correctionsList.querySelector('.empty-text')) {
        correctionsList.innerHTML = correctionHTML;
    } else {
        correctionsList.insertAdjacentHTML('afterbegin', correctionHTML);
    }
    
    // Efecto visual: Resaltar la ventana de correcciones
    bringToFront('corrections-panel');
}

// Permitir enviar con la tecla Enter
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});