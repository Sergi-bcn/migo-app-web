async function loadMiniWeb(id, url) {
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
            await Promise.all([
                loadMiniWeb('miniweb-navbar', '/components/navbar.html'),
                loadMiniWeb('miniweb-corrections', '/components/corrections.html'),
                loadMiniWeb('miniweb-chat', '/components/chat-main.html'),
                loadMiniWeb('miniweb-config', '/components/config-modal.html'),
                loadMiniWeb('miniweb-trans', '/components/trans-modal.html')
            ]);
            this.$watch('messages', () => {
                const el = document.getElementById('chat-scroll');
                if(el) setTimeout(() => el.scrollTop = el.scrollHeight, 50);
            });
        },

        async send() {
            if (!this.userInput.trim() || this.loading || this.isBlocked) return;
            const text = this.userInput;
            this.messages.push({ role: 'user', text });
            this.userInput = ''; this.loading = true;
            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...this.config, messages: this.messages })
                });
                const data = await res.json();
                this.messages.push({ role: 'migo', text: data.reply });
                this.correction = data.hasError ? `<div class="fix-card">${data.fix}</div>` : "Perfect!";
                if (data.blocked && this.config.rigor === 'Strict') this.isBlocked = true;
            } catch (e) { console.error(e); }
            finally { this.loading = false; if(window.lucide) lucide.createIcons(); }
        },
        unblock() { this.isBlocked = false; this.correction = ''; }
    }
}