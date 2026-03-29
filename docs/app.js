const skillsNav = document.getElementById('skills-nav');
const contentArea = document.getElementById('content');
const sidebar = document.getElementById('sidebar');

/* Inject Skills into Sidebar */
const ul = document.createElement('ul');
Object.keys(skillsData).forEach(key => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#${key}" id="nav-${key}" onclick="loadSkill('${key}')">${skillsData[key].title}</a>`;
    ul.appendChild(li);
});
skillsNav.appendChild(ul);

const loadSkill = (key) => {
    const skill = skillsData[key];
    if (!skill) return;
    
    /* Active Link Management */
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    document.getElementById(`nav-${key}`).classList.add('active');
    
    /* Clean content and render markdown */
    const rawContent = skill.content.replace(/---[\s\S]*?---/, ''); // Remove frontmatter
    contentArea.innerHTML = marked.parse(rawContent);
    
    /* Smooth Scroll */
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    /* Mobile sidebar close */
    sidebar.classList.remove('open');
};

const loadHome = () => {
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    document.getElementById('nav-home').classList.add('active');
    
    contentArea.innerHTML = `
        <h1>Welcome to Minimalist Entrepreneur Docs</h1>
        <p>Transform your coding agent into a high-leverage business advisor. This framework is meticulously crafted based on <strong>The Minimalist Entrepreneur</strong> by Sahil Lavingia.</p>
        
        <h2>Philosophy</h2>
        <blockquote>"Start with community, not with a product idea."</blockquote>
        <p>This documentation provides deep-dives into each of the 10 skills included in the Antigravity package. Each skill is designed to guide you from initial community discovery to sustainable, profitable growth.</p>
        
        <h2>How to use these Docs</h2>
        <p>Navigate through the 10 core skills in the sidebar. Each page contains the principles, frameworks, and evaluation criteria that the AI agent follows when you invoke a command.</p>
    `;
};

const loadInstall = () => {
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    document.getElementById('nav-install').classList.add('active');
    
    contentArea.innerHTML = `
        <h1>Installation Guide</h1>
        <p>Get the Minimalist Entrepreneur skills running in your Antigravity environment in seconds.</p>

        <h2>macOS & Linux</h2>
        <pre><code>curl -sSL https://raw.githubusercontent.com/Deepshah0308/minimalist-entrepreneur-antigravity/main/scripts/install.sh | bash</code></pre>
        
        <h2>Windows (PowerShell)</h2>
        <pre><code>powershell -c "irm https://raw.githubusercontent.com/Deepshah0308/minimalist-entrepreneur-antigravity/main/scripts/install.ps1 | iex"</code></pre>

        <p>Once installed, verify by asking Antigravity for <code>/minimalist-review</code> or <code>/find-community</code>.</p>
    `;
};

/* Global functions for HTML */
window.loadContent = (type) => {
    if (type === 'home') loadHome();
    if (type === 'install') loadInstall();
};

window.loadSkill = (key) => loadSkill(key);

window.toggleSidebar = () => {
    sidebar.classList.toggle('open');
};

/* Initial Routing */
const handleRouting = () => {
    const hash = window.location.hash.slice(1);
    if (hash && skillsData[hash]) {
        loadSkill(hash);
    } else {
        loadHome();
    }
};

window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', handleRouting);
