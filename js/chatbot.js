// Orbweave Chatbot Widget (Vanilla JS)

(function () {
    // 1. Inject CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/chatbot.css'; // Adjust path if needed or use absolute if CDN
    document.head.appendChild(link);

    // 2. Create HTML Structure
    const root = document.createElement('div');
    root.id = 'orbweave-chatbot-root';

    // Icon SVG (Orbweave "O" mark)
    const brandLogoSVG = `
    <svg viewBox="0 0 100 100" class="brand-logo-svg">
        <defs>
            <linearGradient id="orbweaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="100%" stop-color="#e0e0e0" />
            </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="#0a0a0a" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
        <text x="50" y="68" text-anchor="middle" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="55" fill="url(#orbweaveGradient)">O</text>
    </svg>`;

    root.innerHTML = `
        <button id="orbweave-chat-btn" aria-label="Open Chat">
            ${brandLogoSVG}
        </button>

        <div id="orbweave-chat-overlay">
            <div id="orbweave-chat-card">
                <button class="close-btn" id="close-chat">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                
                <div class="chat-sidebar">
                    <div class="sidebar-header">
                        <div style="width: 52px; height: 52px; margin-bottom: 14px;">
                            ${brandLogoSVG}
                        </div>
                        <h2>Orbweave</h2>
                        <div class="status-indicator">
                            <span class="status-dot"></span>
                            <span>Online</span>
                        </div>
                    </div>
                    
                    <div class="sidebar-footer">
                        <div class="sidebar-info">
                            <p>"Closing loops, one sensor at a time."</p>
                        </div>
                        
                        <div class="theme-toggle" id="theme-toggle">
                            <span class="theme-icon">☀️</span>
                            <span class="theme-label">Light Mode</span>
                            <div class="toggle-switch"></div>
                        </div>
                    </div>
                </div>

                <div class="chat-main">
                    <div class="chat-header-mobile">
                         <div style="width: 28px; height: 28px;">${brandLogoSVG}</div>
                         <span>Orbweave</span>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages">
                        <div class="message ai">
                            Hey! 👋 Where does your organisation leak water, energy or materials?
                        </div>
                    </div>

                    <div class="chat-input-area">
                        <div class="input-row">
                            <form id="chat-form" class="input-wrapper">
                                <input type="text" id="chat-input" class="chat-input" placeholder="Ask about loops, sensors, AI..." autocomplete="off">
                                <button type="submit" class="send-btn" id="send-btn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                                </button>
                            </form>
                            <button class="theme-btn-mobile" id="theme-toggle-mobile" aria-label="Toggle theme">
                                <span class="theme-icon-mobile">☀️</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(root);

    // 3. Logic
    const btn = document.getElementById('orbweave-chat-btn');
    const overlay = document.getElementById('orbweave-chat-overlay');
    const closeBtn = document.getElementById('close-chat');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');

    let messages = [
        { role: 'assistant', content: "Hey! 👋 Where does your organisation leak water, energy or materials?" }
    ];

    function toggleChat() {
        overlay.classList.toggle('open');
        if (overlay.classList.contains('open')) {
            setTimeout(() => input.focus(), 100);
        }
    }

    btn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    const themeLabel = themeToggle?.querySelector('.theme-label');
    const themeSwitchDesktop = themeToggle?.querySelector('.toggle-switch');
    const themeIconMobile = themeToggleMobile?.querySelector('.theme-icon-mobile');

    function setTheme(isLight) {
        if (isLight) {
            root.setAttribute('data-theme', 'light');
            themeSwitchDesktop?.classList.add('active');
            themeToggleMobile?.classList.add('active');
            if (themeIcon) themeIcon.textContent = '🌙';
            if (themeLabel) themeLabel.textContent = 'Dark Mode';
            if (themeIconMobile) themeIconMobile.textContent = '🌙';
            localStorage.setItem('orbweave-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
            themeSwitchDesktop?.classList.remove('active');
            themeToggleMobile?.classList.remove('active');
            if (themeIcon) themeIcon.textContent = '☀️';
            if (themeLabel) themeLabel.textContent = 'Light Mode';
            if (themeIconMobile) themeIconMobile.textContent = '☀️';
            localStorage.setItem('orbweave-theme', 'dark');
        }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('orbweave-theme');
    if (savedTheme === 'light') {
        setTheme(true);
    }

    // Toggle handlers
    themeToggle?.addEventListener('click', () => {
        const isLight = !root.hasAttribute('data-theme');
        setTheme(isLight);
    });

    themeToggleMobile?.addEventListener('click', () => {
        const isLight = !root.hasAttribute('data-theme');
        setTheme(isLight);
    });

    function appendMessage(role, content) {
        const div = document.createElement('div');
        div.className = `message ${role === 'assistant' ? 'ai' : 'user'}`;
        div.textContent = content;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const content = input.value.trim();
        if (!content) return;

        // User Message
        appendMessage('user', content);
        messages.push({ role: 'user', content });
        input.value = '';

        // AI Placeholder (Typing)
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai typing-dots';
        loadingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            });

            if (!response.ok) throw new Error('API Error');

            // Remove loading
            loadingDiv.remove();

            // Stream handling
            const div = document.createElement('div');
            div.className = 'message ai';
            messagesContainer.appendChild(div);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                aiContent += chunk;
                div.textContent = aiContent; // Simple text update. For Markdown, use a library.
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            messages.push({ role: 'assistant', content: aiContent });

        } catch (error) {
            console.error(error);
            loadingDiv.remove();
            appendMessage('assistant', "We encountered a connection issue. Please try again.");
        }
    }

    form.addEventListener('submit', handleSubmit);
})();
