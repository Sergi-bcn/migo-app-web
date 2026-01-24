async function loadComponent(id, url) {
    const res = await fetch(url);
    if (res.ok) {
        document.getElementById(id).innerHTML = await res.text();
        if (window.lucide) lucide.createIcons();
    }
}

function migoApp() {
    return {
        userInput: '', loading: false, correction: '', isBlocked: false,
        popups: { config: false, trans: false, user: false },
        config: { rigor: 'Normal', modo: 'Colloquial' },
        messages: [{ role: 'migo', text: 'Hello! I am Migo. Ready to learn?' }],
        
        async init() {
            // Carga de todos los módulos independientes
            await loadComponent('corrections-container', '/components/corrections.html');
            await loadComponent('config-modal-container', '/components/config-modal.html');
            await loadComponent('trans-modal-container', '/components/trans-modal.html');
            await loadComponent('user-modal-container', '/components/user-modal.html');
            
            this.$watch('messages', () => this.scrollToBottom());
        },
        // ... misma lógica de send() y unblock() de las versiones anteriores ...
        async send() {
            if (!this.userInput.trim() || this.loading || this.isBlocked) return;
            const text = this.userInput;
            this.messages.push({ role: 'user', text });
            this.userInput = ''; this.loading = true;
            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    body: JSON.stringify({ ...this.config, messages: this.messages })
                });
                const data = await res.json();
                this.messages.push({ role: 'migo', text: data.reply });
                this.correction = data.hasError ? `<div class="bg-red-50 p-4 rounded-3xl border border-red-100 text-gray-800 font-bold">${data.fix}</div>` : "Perfect!";
                if (data.blocked && this.config.rigor === 'Strict') this.isBlocked = true;
            } catch (e) { console.error(e); }
            finally { this.loading = false; this.scrollToBottom(); if(window.lucide) lucide.createIcons(); }
        },
        unblock() { this.isBlocked = false; this.correction = ''; },
        scrollToBottom() { const c = document.getElementById('chat-container'); if(c) setTimeout(()=>c.scrollTop = c.scrollHeight, 50); }
    }
}