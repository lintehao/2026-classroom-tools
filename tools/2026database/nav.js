// 共用導覽列 — 自動注入到每個頁面
(function () {
    const pages = [
        { href: '/index.html',              label: '成績記錄本',  icon: '📊', ep: 'EP09' },
        { href: '/wordcloud.html',          label: '文字雲',      icon: '☁️', ep: 'EP09' },
        { href: '/wordcloud-firebase.html', label: 'Firebase文字雲', icon: '🔥', ep: 'EP09.5' },
        { href: '/game-leaderboard.html',   label: '遊戲排行榜',  icon: '🏆', ep: 'Pre-10' },
        { href: '/classroom-irs.html',      label: 'IRS互動',    icon: '📡', ep: 'Pre-10' },
        { href: '/formative-quiz.html',     label: '形成性評量',  icon: '📝', ep: 'Pre-10' },
        { href: '/math-homework.html',      label: 'AI批改作業',  icon: '🤖', ep: 'EP12' },
    ];

    const current = location.pathname;

    const css = `
        #claude-nav {
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 9999;
            background: rgba(15, 15, 25, 0.92);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding: 0 16px;
            display: flex;
            align-items: center;
            height: 48px;
            gap: 4px;
            overflow-x: auto;
            scrollbar-width: none;
        }
        #claude-nav::-webkit-scrollbar { display: none; }
        #claude-nav .nav-brand {
            font-size: 12px;
            font-weight: 800;
            color: #fff;
            opacity: 0.5;
            white-space: nowrap;
            margin-right: 8px;
            letter-spacing: 1px;
        }
        #claude-nav a {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px 11px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            color: rgba(255,255,255,0.65);
            white-space: nowrap;
            transition: background .15s, color .15s;
            border: 1px solid transparent;
        }
        #claude-nav a:hover {
            background: rgba(255,255,255,0.1);
            color: #fff;
        }
        #claude-nav a.active {
            background: rgba(255,255,255,0.15);
            color: #fff;
            border-color: rgba(255,255,255,0.2);
        }
        #claude-nav a .ep-badge {
            font-size: 10px;
            opacity: 0.5;
            font-weight: 400;
        }
        body { padding-top: 48px !important; }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    const nav = document.createElement('nav');
    nav.id = 'claude-nav';

    const brand = document.createElement('span');
    brand.className = 'nav-brand';
    brand.textContent = 'Claude基本功';
    nav.appendChild(brand);

    pages.forEach(p => {
        const a = document.createElement('a');
        a.href = p.href;
        const isActive = current === p.href || current.endsWith(p.href.replace('/', ''));
        if (isActive) a.className = 'active';
        a.innerHTML = `${p.icon} ${p.label} <span class="ep-badge">${p.ep}</span>`;
        nav.appendChild(a);
    });

    document.body.prepend(nav);
})();
