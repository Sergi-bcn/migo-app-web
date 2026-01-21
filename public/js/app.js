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
            await loadComponent('config-modal-container', '/components/config-modal.html');
            await loadComponent('trans-modal-container', '/components/trans-modal.html');
            this.$watch('messages', () => this.scrollToBottom());
        },
        async send() {
            const text = this.userInput.trim();
            if (!text || this.loading || this.isBlocked) return;
            this.messages.push({ role: 'user', text: text });
            this.userInput = ''; this.loading = true;
            try {
                const response = await fetch('/api/chat', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ rigor: this.config.rigor, modo: this.config.modo, messages: this.messages }) 
                });
                const data = await response.json();
                this.messages.push({ role: 'migo', text: data.reply });
                if (data.hasError) {
                    this.correction = `<div class="bg-red-50 p-5 rounded-[25px] border border-red-100"><b class="text-red-500 block mb-1 uppercase text-[10px]">Correction</b><div class="text-gray-800 font-bold">${data.fix}</div></div>`;
                } else { this.correction = "Perfect! No mistakes."; }
                if (data.blocked && this.config.rigor === 'Strict') { this.isBlocked = true; }
            } catch (e) { this.messages.push({ role: 'migo', text: 'Error' }); }
            finally { this.loading = false; lucide.createIcons(); this.scrollToBottom(); }
        },
        unblock() { this.isBlocked = false; this.correction = ''; },
        translate(dir) { console.log('Translate', dir); },
        scrollToBottom() { const c = document.getElementById('chat-container'); if(c) setTimeout(()=>c.scrollTop = c.scrollHeight, 50); }
    }
}