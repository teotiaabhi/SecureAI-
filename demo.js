const demoResults = {
  score: 78,
  findings: 12,
  critical: 3,
  grade: 'B',
  summary: [
    { label: 'SQL Injection', level: 'critical' },
    { label: 'Reflected XSS', level: 'high' },
    { label: 'Missing CSRF token', level: 'medium' },
    { label: 'API key exposure', level: 'low' },
  ],
  findingsTable: [
    { file: 'src/api/auth.ts', issue: 'SQL Injection', severity: 'critical', fix: 'Use parameterized queries' },
    { file: 'src/components/Form.tsx', issue: 'Reflected XSS', severity: 'high', fix: 'Sanitize and escape output' },
    { file: 'src/routes/session.ts', issue: 'Session fixation', severity: 'medium', fix: 'Regenerate session token' },
    { file: 'config/.env', issue: 'Secret exposure', severity: 'low', fix: 'Move to secret manager' },
  ],
  history: [
    { grade: 'B', repo: 'secureai/frontend', date: 'Sep 12, 2026 • 8:43 AM', metrics: ['4 Medium', '2 High', '1 Critical'] },
    { grade: 'C', repo: 'payments-service', date: 'Sep 05, 2026 • 4:11 PM', metrics: ['6 Medium', '3 High', '2 Critical'] },
    { grade: 'A', repo: 'docs-portal', date: 'Aug 21, 2026 • 10:00 AM', metrics: ['3 Low', '2 Medium'] },
  ],
};

function badgeFor(level) {
  const map = {
    critical: 'badge-critical',
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
  };
  return map[level] || 'badge-info';
}

function renderResultsPage() {
  const summaryRoot = document.getElementById('results-summary');
  const tableBody = document.getElementById('results-table-body');

  if (!summaryRoot || !tableBody) return;

  document.getElementById('result-score').textContent = demoResults.score;
  document.getElementById('result-findings').textContent = demoResults.findings;
  document.getElementById('result-critical').textContent = demoResults.critical;
  document.getElementById('result-grade').textContent = demoResults.grade;

  summaryRoot.innerHTML = demoResults.summary.map((item) => `
    <div class="summary-row">
      <span>${item.label}</span>
      <span class="${badgeFor(item.level)}">${item.level.charAt(0).toUpperCase() + item.level.slice(1)}</span>
    </div>
  `).join('');

  tableBody.innerHTML = demoResults.findingsTable.map((row) => `
    <tr>
      <td>${row.file}</td>
      <td>${row.issue}</td>
      <td><span class="${badgeFor(row.severity)}">${row.severity.charAt(0).toUpperCase() + row.severity.slice(1)}</span></td>
      <td>${row.fix}</td>
    </tr>
  `).join('');
}

function renderHistoryPage() {
  const root = document.getElementById('history-list');
  if (!root) return;

  root.innerHTML = demoResults.history.map((scan) => {
    const gradeClass = scan.grade === 'A' ? 'grade-a' : scan.grade === 'C' ? 'grade-c' : '';
    const metricsHtml = scan.metrics.map((m) => {
      if (m.includes('Critical')) return '<span class="badge-critical">' + m + '</span>';
      if (m.includes('High')) return '<span class="badge-high">' + m + '</span>';
      if (m.includes('Medium')) return '<span class="badge-medium">' + m + '</span>';
      return '<span class="badge-low">' + m + '</span>';
    }).join('');

    return `
      <div class="card history-item">
        <div class="history-main">
          <div class="history-badge ${gradeClass}">${scan.grade}</div>
          <div>
            <h3>${scan.repo}</h3>
            <p>${scan.date}</p>
          </div>
        </div>
        <div class="history-meta">${metricsHtml}</div>
      </div>
    `;
  }).join('');
}

function updateDashboardAfterScan() {
  const avg = document.getElementById('avg-score-value');
  const vuln = document.getElementById('total-vuln-value');
  const count = document.getElementById('scan-count-value');
  const grade = document.getElementById('latest-grade-value');

  if (avg) avg.textContent = demoResults.score;
  if (vuln) vuln.textContent = demoResults.findings;
  if (count) count.textContent = '7';
  if (grade) grade.textContent = demoResults.grade;
}

function bindTabs() {
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.add('hidden'));
      btn.classList.add('active');
      const target = document.getElementById('panel-' + btn.dataset.tab);
      if (target) target.classList.remove('hidden');
    });
  });
}

function bindScanButton() {
  const btn = document.getElementById('startScanBtn');
  const status = document.getElementById('scanStatus');
  if (!btn || !status) return;

  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.textContent = 'Scanning...';
    status.textContent = 'Running demo analysis...';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '▶ Start Security Scan →';
      status.textContent = 'Demo scan complete. Redirecting to report...';
      updateDashboardAfterScan();
      setTimeout(() => {
        window.location.href = 'results.html';
      }, 900);
    }, 1200);
  });
}

if (document.body.dataset.page === 'results') {
  renderResultsPage();
}

if (document.body.dataset.page === 'history') {
  renderHistoryPage();
}

if (document.body.dataset.page === 'scan') {
  bindTabs();
  bindScanButton();
}

/* ═══════════ Shared UI animations ═══════════ */
function bindHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function bindScrollReveal() {
  const targets = document.querySelectorAll(
    '.card, .step-card, .feature-card, .stat-card, .history-item, .pipeline-row, .policy-item, .framework-row, .summary-row, .activity-item'
  );
  if (!targets.length) return;

  targets.forEach((el, i) => {
    el.classList.add('reveal-init');
    el.style.willChange = 'opacity, transform';
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 45}ms`;
  });

  const clearWillChange = (el) => {
    el.addEventListener('transitionend', () => { el.style.willChange = 'auto'; }, { once: true });
  };

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => { el.classList.add('is-visible'); clearWillChange(el); });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          clearWillChange(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ═══════════ Auth pages (static demo) ═══════════ */
const DEMO_CREDENTIALS = {
  email: 'demo@secureai.com',
  password: 'Demo@123',
};

function showFieldError(input, message) {
  input.classList.add('input-error');
  const errorEl = input.closest('.form-row')?.querySelector('.field-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
  input.addEventListener(
    'animationend',
    () => input.classList.remove('input-error'),
    { once: true }
  );
}

function clearFieldError(input) {
  const errorEl = input.closest('.form-row')?.querySelector('.field-error');
  if (errorEl) errorEl.classList.remove('visible');
}

function setButtonLoading(btn, loadingText) {
  btn.dataset.originalText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<span class="btn-spinner"></span> ${loadingText}`;
}

function bindLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const email = document.getElementById('loginEmail');
  const password = document.getElementById('loginPassword');
  const submitBtn = document.getElementById('loginSubmit');
  const formError = document.getElementById('loginFormError');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    [email, password].forEach(clearFieldError);
    if (formError) formError.classList.remove('visible');

    let valid = true;
    if (!email.value.trim() || !email.value.includes('@')) {
      showFieldError(email, 'Enter a valid email address');
      valid = false;
    }
    if (!password.value || password.value.length < 6) {
      showFieldError(password, 'Password must be at least 6 characters');
      valid = false;
    }
    if (!valid) return;

    const isDemoUser =
      email.value.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password.value === DEMO_CREDENTIALS.password;

    if (!isDemoUser) {
      if (formError) formError.classList.add('visible');
      form.classList.add('input-error');
      setTimeout(() => form.classList.remove('input-error'), 400);
      return;
    }

    setButtonLoading(submitBtn, 'Logging in...');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 900);
  });
}

function bindSignupForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  const name = document.getElementById('signupName');
  const email = document.getElementById('signupEmail');
  const password = document.getElementById('signupPassword');
  const confirm = document.getElementById('signupConfirm');
  const terms = document.getElementById('signupTerms');
  const submitBtn = document.getElementById('signupSubmit');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    [name, email, password, confirm].forEach(clearFieldError);

    let valid = true;
    if (!name.value.trim()) {
      showFieldError(name, 'Enter your full name');
      valid = false;
    }
    if (!email.value.trim() || !email.value.includes('@')) {
      showFieldError(email, 'Enter a valid email address');
      valid = false;
    }
    if (!password.value || password.value.length < 6) {
      showFieldError(password, 'Password must be at least 6 characters');
      valid = false;
    }
    if (confirm.value !== password.value || !confirm.value) {
      showFieldError(confirm, 'Passwords do not match');
      valid = false;
    }
    if (terms && !terms.checked) {
      valid = false;
      terms.closest('label')?.classList.add('input-error');
      setTimeout(() => terms.closest('label')?.classList.remove('input-error'), 400);
    }
    if (!valid) return;

    setButtonLoading(submitBtn, 'Creating account...');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 900);
  });
}

bindHeaderScroll();
bindScrollReveal();
bindLoginForm();
bindSignupForm();

