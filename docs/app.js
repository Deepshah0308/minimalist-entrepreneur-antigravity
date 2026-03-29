const skills = [
    { title: "Find Community", command: "/find-community", desc: "Discover where your people are and identify the problems they face." },
    { title: "Validate Idea", command: "/validate-idea", desc: "Ensure your solution is something people are actually willing to pay for." },
    { title: "MVP Build", command: "/mvp", desc: "Define the absolute minimum you can ship this weekend." },
    { title: "Processize", command: "/processize", desc: "Deliver value manually before you build the automation." },
    { title: "First Customers", command: "/first-customers", desc: "Get your first 100 customers through manual, unscalable effort." },
    { title: "Pricing Strategy", command: "/pricing", desc: "Set prices that reflect value and ensure profitability from day one." },
    { title: "Marketing Plan", command: "/marketing-plan", desc: "Scale through content and community-building, not ads." },
    { title: "Grow Sustainably", command: "/grow-sustainably", desc: "Make smart decisions about spending, hiring, and scaling." },
    { title: "Company Values", command: "/company-values", desc: "Define a culture that makes your business a place you want to live in." },
    { title: "Minimalist Review", command: "/minimalist-review", desc: "A high-level audit for any business decision." }
];

const skillsGrid = document.getElementById('skills-grid');

skills.forEach((skill, index) => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.setAttribute('data-reveal', '');
    card.innerHTML = `
        <span class="num">${String(index + 1).padStart(2, '0')}</span>
        <h3>${skill.title}</h3>
        <p>${skill.desc}</p>
        <div style="margin-top: 2rem; color: #FACC15; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; opacity: 0.6;">
            Run: <code>${skill.command}</code>
        </div>
    `;
    skillsGrid.appendChild(card);
});

/* Scroll Reveal */
const reveals = document.querySelectorAll('[data-reveal]');
const scrollReveal = () => {
    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;
        if (revealTop < windowHeight - revealPoint) {
            reveal.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', scrollReveal);
window.addEventListener('load', scrollReveal);

/* Installation Tabs */
const installCommands = {
    macos: "curl -sSL https://raw.githubusercontent.com/Deepshah0308/minimalist-entrepreneur-antigravity/main/scripts/install.sh | bash",
    windows: "powershell -c \"irm https://raw.githubusercontent.com/Deepshah0308/minimalist-entrepreneur-antigravity/main/scripts/install.ps1 | iex\""
};

const switchInstall = (platform) => {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[onclick="switchInstall('${platform}')"]`).classList.add('active');
    document.getElementById('install-code').innerText = installCommands[platform];
};

const copyCode = () => {
    const code = document.getElementById('install-code').innerText;
    navigator.clipboard.writeText(code);
    const btn = document.getElementById('copy-btn');
    btn.innerText = "Copied!";
    setTimeout(() => { btn.innerText = "Copy"; }, 2000);
};

window.switchInstall = switchInstall;
window.copyCode = copyCode;
