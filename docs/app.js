/* ─────────────────────────────────────────────────────────
   Minimalist Entrepreneur Docs — app.js
   ───────────────────────────────────────────────────────── */

// ── Skill metadata (step labels + commands) ──────────────
const SKILL_META = {
  'find-community':   { step: '01', cmd: '/find-community' },
  'validate-idea':    { step: '02', cmd: '/validate-idea'  },
  'mvp':              { step: '03', cmd: '/mvp'            },
  'processize':       { step: '04', cmd: '/processize'     },
  'first-customers':  { step: '05', cmd: '/first-customers'},
  'pricing':          { step: '06', cmd: '/pricing'        },
  'marketing-plan':   { step: '07', cmd: '/marketing-plan' },
  'grow-sustainably': { step: '08', cmd: '/grow-sustainably'},
  'company-values':   { step: '09', cmd: '/company-values' },
  'minimalist-review':{ step: '10', cmd: '/minimalist-review'},
};

const SKILL_KEYS = Object.keys(SKILL_META);

// ── DOM refs ──────────────────────────────────────────────
const $sidebar    = document.getElementById('sidebar');
const $overlay    = document.getElementById('overlay');
const $content    = document.getElementById('content');
const $skillsNav  = document.getElementById('skills-nav');
const $docPager   = document.getElementById('docPager');
const $pagerPrev  = document.getElementById('pagerPrev');
const $pagerNext  = document.getElementById('pagerNext');
const $prevTitle  = document.getElementById('pagerPrevTitle');
const $nextTitle  = document.getElementById('pagerNextTitle');
const $tocNav     = document.getElementById('tocNav');
const $searchInput = document.getElementById('searchInput');
const $searchResults = document.getElementById('searchResults');

// ── State ─────────────────────────────────────────────────
let currentSkillKey = null;
let searchFocusIndex = -1;
let searchResultItems = [];

// ── Build Sidebar Skills Nav ──────────────────────────────
(function buildSidebarNav() {
  SKILL_KEYS.forEach(key => {
    const meta  = SKILL_META[key];
    const skill = skillsData[key];
    if (!skill) return;
    const a = document.createElement('a');
    a.href = '#' + key;
    a.className = 'nav-link';
    a.id = 'nav-' + key;
    a.innerHTML = `
      <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/></svg>
      ${skill.title}
      <span class="nav-step">${meta.step}</span>
    `;
    a.addEventListener('click', e => {
      e.preventDefault();
      loadSkill(key);
    });
    $skillsNav.appendChild(a);
  });
})();

// ── Navigation helpers ────────────────────────────────────
function setActiveLink(id) {
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    // Scroll into view in sidebar if needed
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

function closeSidebar() {
  $sidebar.classList.remove('open');
  $overlay.classList.remove('visible');
}

// ── Copy button for code blocks ───────────────────────────
function addCopyButtons() {
  document.querySelectorAll('.prose pre').forEach(pre => {
    // Already wrapped? Skip.
    if (pre.parentElement.classList.contains('pre-wrap')) return;

    // Create a non-scrolling wrapper and move pre into it
    const wrap = document.createElement('div');
    wrap.className = 'pre-wrap';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    // Build the button inside the wrapper (not inside pre)
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'copy';
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code');
      navigator.clipboard.writeText(code ? code.textContent : pre.textContent).then(() => {
        btn.textContent = 'copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'copy';
          btn.classList.remove('copied');
        }, 1800);
      });
    });
    wrap.appendChild(btn);
  });
}

// ── Build Table of Contents ───────────────────────────────
function buildTOC() {
  $tocNav.innerHTML = '';
  const headings = $content.querySelectorAll('h2, h3');
  if (headings.length < 3) {
    document.getElementById('tocPanel').style.display = 'none';
    return;
  }
  document.getElementById('tocPanel').style.display = '';

  headings.forEach((h, i) => {
    if (!h.id) h.id = 'h-' + i;
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.dataset.level = h.tagName === 'H3' ? '3' : '2';
    a.addEventListener('click', e => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $tocNav.appendChild(a);
  });
}

// ── TOC scroll spy ────────────────────────────────────────
function setupScrollSpy() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = $tocNav.querySelector(`a[href="#${id}"]`);
      if (link) {
        if (entry.isIntersecting) {
          $tocNav.querySelectorAll('a').forEach(a => a.classList.remove('toc-active'));
          link.classList.add('toc-active');
        }
      }
    });
  }, { rootMargin: '-80px 0px -60% 0px' });

  $content.querySelectorAll('h2, h3').forEach(h => observer.observe(h));
}

// ── Render Pager ──────────────────────────────────────────
function renderPager(key) {
  const idx = SKILL_KEYS.indexOf(key);
  if (idx === -1) { $docPager.style.display = 'none'; return; }
  $docPager.style.display = 'flex';

  const prev = SKILL_KEYS[idx - 1];
  const next = SKILL_KEYS[idx + 1];

  $pagerPrev.style.display = prev ? 'flex' : 'none';
  $pagerNext.style.display = next ? 'flex' : 'none';

  if (prev) $prevTitle.textContent = skillsData[prev]?.title || '';
  if (next) $nextTitle.textContent = skillsData[next]?.title || '';
}

window.navigateSkill = function(dir) {
  const idx = SKILL_KEYS.indexOf(currentSkillKey);
  if (idx === -1) return;
  const newKey = SKILL_KEYS[idx + dir];
  if (newKey) loadSkill(newKey);
};

// ── Load Skill page ────────────────────────────────────────
function loadSkill(key) {
  const skill = skillsData[key];
  if (!skill) return;
  currentSkillKey = key;
  const meta = SKILL_META[key];

  // Strip YAML frontmatter
  let raw = skill.content.replace(/^---[\s\S]*?---\n?/, '');

  // Parse markdown
  const html = marked.parse(raw, { breaks: false, gfm: true });

  $content.innerHTML = `
    <div class="page-eyebrow">Step ${meta.step}</div>
    <h1>${skill.title}</h1>
    <p class="page-lead">The <strong>${skill.title}</strong> skill guides your AI agent through the minimalist entrepreneur framework. Invoke it with <code>${meta.cmd}</code>.</p>
    ${html}
  `;

  // Post-processing
  addCopyButtons();
  buildTOC();
  setupScrollSpy();
  renderPager(key);
  setActiveLink('nav-' + key);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  window.location.hash = key;
  closeSidebar();
}

// ── Load Home page ────────────────────────────────────────
function loadHome() {
  currentSkillKey = null;
  $docPager.style.display = 'none';
  $tocNav.innerHTML = '';

  const cards = SKILL_KEYS.map(key => {
    const meta  = SKILL_META[key];
    const skill = skillsData[key];
    // Extract first sentence description from content
    const raw = skill.content.replace(/^---[\s\S]*?---\n?/, '');
    const firstParagraph = (raw.match(/^(?!#)[^\n]+/m) || [''])[0].replace(/\*\*/g, '').slice(0, 100);
    return `
      <a class="skill-card" href="#${key}" onclick="loadSkill('${key}'); return false;">
        <div class="skill-card-step">Step ${meta.step}</div>
        <div class="skill-card-title">${skill.title}</div>
        <div class="skill-card-cmd">${meta.cmd}</div>
      </a>
    `;
  }).join('');

  $content.innerHTML = `
    <div class="page-eyebrow">Reference</div>
    <h1>Minimalist Entrepreneur Skills</h1>
    <p class="page-lead">Ten battle-tested frameworks distilled from <em>The Minimalist Entrepreneur</em> by Sahil Lavingia. Each skill turns your AI agent into a high-leverage business advisor — from finding your first community to growing sustainably.</p>

    <blockquote><p>"Start with community, not with a product idea."<br>— Sahil Lavingia</p></blockquote>

    <h2>The 10-Step Journey</h2>
    <p>Navigate through each skill in sequence, or jump directly to the framework you need. Every skill includes the principles, frameworks, and evaluation criteria your agent follows.</p>

    <div class="skills-grid">${cards}</div>

    <h2>How to Use These Docs</h2>
    <p>Install the skills (see <a href="#" onclick="loadContent('install'); return false;" style="color:var(--amber-light)">Installation</a>), then invoke any skill by name in your Antigravity chat. Each page documents the full system prompt and decision framework used by the AI.</p>

    <h2>Philosophy</h2>
    <p>Minimalist Entrepreneurs build <strong>profitable</strong> businesses that solve <strong>real problems</strong> for <strong>real communities</strong> — without venture capital, massive teams, or unsustainable growth pressure. These skills embed that philosophy directly into your coding agent.</p>
  `;

  addCopyButtons();
  setActiveLink('nav-home');
  window.scrollTo({ top: 0 });
  window.location.hash = '';
  closeSidebar();
}

// ── Load Install page ─────────────────────────────────────
function loadInstall() {
  currentSkillKey = null;
  $docPager.style.display = 'none';
  $tocNav.innerHTML = '';

  $content.innerHTML = `
    <div class="page-eyebrow">Setup</div>
    <h1>Installation</h1>
    <p class="page-lead">Get the Minimalist Entrepreneur skills running in your Antigravity environment in under a minute. Choose your platform below.</p>

    <div class="install-platform">
      <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v8H5V6z" clip-rule="evenodd"/></svg>
      macOS &amp; Linux
    </div>
    <pre><code>curl -sSL https://raw.githubusercontent.com/Deepshah0308/minimalist-entrepreneur-antigravity/main/scripts/install.sh | bash</code></pre>
    <p>Or run locally:</p>
    <pre><code>chmod +x scripts/install.sh && ./scripts/install.sh</code></pre>

    <div class="install-platform">
      <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 3L3 17h14L10 3z"/></svg>
      Windows (PowerShell)
    </div>
    <pre><code>powershell -c "irm https://raw.githubusercontent.com/Deepshah0308/minimalist-entrepreneur-antigravity/main/scripts/install.ps1 | iex"</code></pre>
    <p>Or run locally:</p>
    <pre><code>.\\scripts\\install.ps1</code></pre>

    <h2>Verify Installation</h2>
    <p>Once installed, test by asking Antigravity:</p>
    <pre><code>/minimalist-review</code></pre>
    <p>Or start at step one:</p>
    <pre><code>/find-community</code></pre>

    <h2>Requirements</h2>
    <ul>
      <li>Antigravity ≥ 1.0.0</li>
      <li>An active Antigravity workspace</li>
      <li>Internet access for initial fetch</li>
    </ul>

    <h2>Manual Install</h2>
    <p>You can also clone the repository directly and copy the <code>skills/</code> folder into your Antigravity workspace:</p>
    <pre><code>git clone https://github.com/Deepshah0308/minimalist-entrepreneur-antigravity.git</code></pre>
  `;

  addCopyButtons();
  buildTOC();
  setupScrollSpy();
  setActiveLink('nav-install');
  window.scrollTo({ top: 0 });
  closeSidebar();
}

// ── Global routing dispatcher ─────────────────────────────
window.loadContent = function(type) {
  if (type === 'home')    loadHome();
  if (type === 'install') loadInstall();
};

// ── Sidebar toggle ────────────────────────────────────────
window.toggleSidebar = function() {
  const open = $sidebar.classList.toggle('open');
  $overlay.classList.toggle('visible', open);
};
window.closeSidebar = closeSidebar;

// ── Search ────────────────────────────────────────────────
function buildSearchIndex() {
  return SKILL_KEYS.map(key => {
    const skill = skillsData[key];
    const raw = skill.content.replace(/^---[\s\S]*?---\n?/, '').replace(/[#*`>_\-\[\]]/g, ' ');
    return { key, title: skill.title, body: raw };
  });
}

const searchIndex = buildSearchIndex();

function runSearch(q) {
  if (!q || q.length < 2) {
    $searchResults.classList.remove('visible');
    return;
  }
  const lower = q.toLowerCase();
  const results = searchIndex
    .map(item => {
      const titleScore = item.title.toLowerCase().includes(lower) ? 3 : 0;
      const bodyIdx = item.body.toLowerCase().indexOf(lower);
      const bodyScore = bodyIdx >= 0 ? 1 : 0;
      const snippet = bodyIdx >= 0
        ? item.body.slice(Math.max(0, bodyIdx - 40), bodyIdx + 80).trim()
        : '';
      return { ...item, score: titleScore + bodyScore, snippet, bodyIdx };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (results.length === 0) {
    $searchResults.innerHTML = `<div class="search-empty">No results for "<strong>${q}</strong>"</div>`;
    $searchResults.classList.add('visible');
    searchResultItems = [];
    return;
  }

  $searchResults.innerHTML = results.map((r, i) => {
    const meta = SKILL_META[r.key];
    const highlighted = r.snippet
      ? r.snippet.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>')
      : '';
    return `
      <div class="search-result-item" tabindex="-1" data-key="${r.key}" data-index="${i}">
        <div class="sr-step">Step ${meta?.step || '–'}</div>
        <div>
          <div class="sr-title">${r.title}</div>
          ${highlighted ? `<div class="sr-snippet">${highlighted}…</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  $searchResults.querySelectorAll('.search-result-item').forEach(el => {
    el.addEventListener('click', () => {
      loadSkill(el.dataset.key);
      $searchInput.value = '';
      $searchResults.classList.remove('visible');
    });
  });

  searchResultItems = Array.from($searchResults.querySelectorAll('.search-result-item'));
  searchFocusIndex = -1;
  $searchResults.classList.add('visible');
}

$searchInput.addEventListener('input', () => runSearch($searchInput.value.trim()));

$searchInput.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    searchFocusIndex = Math.min(searchFocusIndex + 1, searchResultItems.length - 1);
    searchResultItems.forEach((el, i) => el.classList.toggle('focused', i === searchFocusIndex));
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    searchFocusIndex = Math.max(searchFocusIndex - 1, 0);
    searchResultItems.forEach((el, i) => el.classList.toggle('focused', i === searchFocusIndex));
  } else if (e.key === 'Enter' && searchFocusIndex >= 0) {
    searchResultItems[searchFocusIndex]?.click();
  } else if (e.key === 'Escape') {
    $searchResults.classList.remove('visible');
    $searchInput.blur();
  }
});

document.addEventListener('click', e => {
  if (!e.target.closest('#searchWrap') && !e.target.closest('#searchResults')) {
    $searchResults.classList.remove('visible');
  }
});

// ── Keyboard shortcut ─────────────────────────────────────
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    $searchInput.focus();
    $searchInput.select();
  }
});

// ── Hash routing ──────────────────────────────────────────
function route() {
  const hash = window.location.hash.slice(1);
  if (hash === 'install') {
    loadInstall();
  } else if (hash && skillsData[hash]) {
    loadSkill(hash);
  } else {
    loadHome();
  }
}

window.addEventListener('hashchange', route);
window.addEventListener('load', route);
