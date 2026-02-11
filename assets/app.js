/* =============================================
   RITA Product Tour — Shared JavaScript
   ============================================= */

// ---------- Asset Map ----------
// Replace filenames below with your actual screenshot filenames.
// Images are expected in assets/images/
const ASSETS = {
  slackChat:              'slack-chat.png',              // RITA conversation landing / Slack chat
  roiDashboard:           'roi-dashboard.png',           // ROI / Analytics dashboard
  alertAgentWorkflow:     'alert-agent-workflow.png',    // Alert Agent workflow diagram
  distributionListWF:     'distribution-list-workflow.png', // Distribution List Add workflow
  ticketAnalysis:         'ticket-analysis.png',         // AutoPilot ticket analysis
  workflowBuilder:        'workflow-builder.png',        // Workflow builder screenshot
};

// ---------- Tour Order ----------
const TOUR_ORDER = [
  'index.html',
  'knowledge.html',
  'automation.html',
  'agentic.html',
  'autopilot.html',
  'roi.html',
];

const TOUR_LABELS = [
  'Home',
  'Knowledge',
  'Automation',
  'Agentic',
  'AutoPilot',
  'ROI',
];

// ---------- Navigation Helpers ----------

/** Returns just the filename from the current URL path */
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  return page;
}

/** Get current index in TOUR_ORDER */
function getCurrentIndex() {
  const page = getCurrentPage();
  const idx = TOUR_ORDER.indexOf(page);
  return idx >= 0 ? idx : 0;
}

/** Navigate to a page */
function goTo(page) {
  window.location.href = page;
}

/** Navigate to home */
function goHome() {
  goTo('index.html');
}

/** Navigate to the next tour page */
function goNext() {
  const idx = getCurrentIndex();
  if (idx < TOUR_ORDER.length - 1) {
    goTo(TOUR_ORDER[idx + 1]);
  }
}

/** Navigate to the previous tour page */
function goBack() {
  const idx = getCurrentIndex();
  if (idx > 0) {
    goTo(TOUR_ORDER[idx - 1]);
  }
}

// ---------- Tour Progress Rendering ----------

/** Render the tour progress bar into an element with id="tour-progress" */
function renderTourProgress() {
  const container = document.getElementById('tour-progress');
  if (!container) return;

  const currentIdx = getCurrentIndex();

  let html = '';
  TOUR_ORDER.forEach((page, i) => {
    let cls = '';
    if (i < currentIdx) cls = 'completed';
    else if (i === currentIdx) cls = 'active';

    html += `<div class="tour-progress__step ${cls}">`;
    html += `<span class="tour-progress__dot"></span>`;
    html += `<span class="tour-progress__label">${TOUR_LABELS[i]}</span>`;
    html += `</div>`;

    if (i < TOUR_ORDER.length - 1) {
      const lineCls = i < currentIdx ? 'completed' : (i === currentIdx ? 'active' : '');
      html += `<span class="tour-progress__line ${lineCls}"></span>`;
    }
  });

  container.innerHTML = html;
}

// ---------- Navigation Bar Rendering ----------

/** Render bottom navigation bar */
function renderNavBar() {
  const container = document.getElementById('nav-bar');
  if (!container) return;

  const idx = getCurrentIndex();
  const isFirst = idx === 0;
  const isLast = idx === TOUR_ORDER.length - 1;

  let html = '';

  // Back button
  if (isFirst) {
    html += '<div></div>';
  } else {
    html += `<button class="btn btn-secondary" onclick="goBack()">&#8592; ${TOUR_LABELS[idx - 1]}</button>`;
  }

  // Center: Home button (show on non-home pages)
  if (!isFirst) {
    html += `<button class="btn btn-dark btn-sm" onclick="goHome()">&#8962; Home</button>`;
  } else {
    html += '<div></div>';
  }

  // Next button
  if (isLast) {
    html += `<button class="btn btn-primary" onclick="goHome()">&#8962; Back to Home</button>`;
  } else {
    html += `<button class="btn btn-primary" onclick="goNext()">${TOUR_LABELS[idx + 1]} &#8594;</button>`;
  }

  container.innerHTML = html;
}

// ---------- Image Loading with Fallback ----------

/**
 * Load an image from assets/images/. If it fails, show a styled placeholder.
 * Usage: <div class="screenshot-area" data-asset="slackChat" data-label="RITA Conversation"></div>
 */
function loadScreenshots() {
  const areas = document.querySelectorAll('.screenshot-area[data-asset]');
  areas.forEach(area => {
    const assetKey = area.getAttribute('data-asset');
    const label = area.getAttribute('data-label') || 'Screenshot';
    const filename = ASSETS[assetKey];

    if (!filename) {
      showPlaceholder(area, label);
      return;
    }

    const img = new Image();
    img.src = 'assets/images/' + filename;
    img.alt = label;
    img.onload = () => {
      area.innerHTML = '';
      area.appendChild(img);
    };
    img.onerror = () => {
      showPlaceholder(area, label);
    };
  });
}

function showPlaceholder(area, label) {
  area.innerHTML = `
    <div class="screenshot-placeholder">
      <div class="screenshot-placeholder__icon">&#128247;</div>
      <div class="screenshot-placeholder__label">${label}</div>
    </div>
  `;
}

// ---------- Typing Animation ----------

/**
 * Animate text appearing character by character.
 * Usage: <span class="type-in" data-text="Hello, I'm RITA!"></span>
 * @param {number} speed - ms per character (default 25)
 */
function initTypeInAnimations(speed = 25) {
  const elements = document.querySelectorAll('.type-in');
  elements.forEach(el => {
    const text = el.getAttribute('data-text') || el.textContent;
    el.textContent = '';
    el.style.visibility = 'visible';
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
      } else {
        clearInterval(interval);
        el.classList.add('type-in--done');
      }
    }, speed);
  });
}

// ---------- Workflow Simulation ----------

/**
 * Simulate workflow steps completing in sequence.
 * Elements with class "workflow-step" inside a container with id="workflow-viz"
 * will be animated one by one.
 * @param {string} containerId - the container id
 * @param {number} stepDelay - ms between each step completing (default 800)
 */
function simulateWorkflow(containerId, stepDelay = 800) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const steps = container.querySelectorAll('.workflow-step');
  const connectors = container.querySelectorAll('.workflow-connector');

  // Reset all
  steps.forEach(s => { s.classList.remove('active', 'completed'); });
  connectors.forEach(c => { c.classList.remove('active', 'completed'); });

  let current = 0;

  function activateStep() {
    if (current > 0) {
      // Complete previous step
      steps[current - 1].classList.remove('active');
      steps[current - 1].classList.add('completed');
      if (connectors[current - 1]) {
        connectors[current - 1].classList.remove('active');
        connectors[current - 1].classList.add('completed');
      }
    }

    if (current < steps.length) {
      steps[current].classList.add('active');
      steps[current].classList.add('animate-flow-pulse');
      if (connectors[current]) {
        connectors[current].classList.add('active');
      }
      current++;
      setTimeout(activateStep, stepDelay);
    }
  }

  // Start after a short delay so user sees the animation
  setTimeout(activateStep, 500);
}

// ---------- ROI Calculator ----------

function initROICalculator() {
  const rateInput = document.getElementById('roi-rate');
  const minutesInput = document.getElementById('roi-minutes');
  const volumeInput = document.getElementById('roi-volume');

  if (!rateInput || !minutesInput || !volumeInput) return;

  function calculate() {
    const rate = parseFloat(rateInput.value) || 0;
    const minutes = parseFloat(minutesInput.value) || 0;
    const volume = parseFloat(volumeInput.value) || 0;

    const hoursSavedMonth = (minutes * volume) / 60;
    const costSavedMonth = hoursSavedMonth * rate;
    const costSavedYear = costSavedMonth * 12;
    const automationRuns = volume; // 1 run per task

    // Update outputs
    setOutput('roi-hours-saved', hoursSavedMonth.toFixed(1));
    setOutput('roi-cost-month', formatCurrency(costSavedMonth));
    setOutput('roi-cost-year', formatCurrency(costSavedYear));
    setOutput('roi-runs', volume.toLocaleString());
  }

  function setOutput(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function formatCurrency(val) {
    if (val >= 1000000) return '$' + (val / 1000000).toFixed(2) + 'M';
    if (val >= 1000) return '$' + (val / 1000).toFixed(1) + 'K';
    return '$' + val.toFixed(0);
  }

  // Bind events
  [rateInput, minutesInput, volumeInput].forEach(input => {
    input.addEventListener('input', calculate);
    input.addEventListener('change', calculate);
  });

  // Initial calculation
  calculate();
}

// ---------- Confidence Meter Animation ----------

function animateConfidenceMeter() {
  const fills = document.querySelectorAll('.confidence-meter__fill');
  fills.forEach(fill => {
    const target = fill.getAttribute('data-width') || '0%';
    // Start at 0 and animate
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.width = target;
    }, 600);
  });
}

// ---------- Bar Chart Animation ----------

function animateBarCharts() {
  const fills = document.querySelectorAll('.bar-chart__fill');
  fills.forEach(fill => {
    const target = fill.getAttribute('data-width') || '0%';
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.width = target;
    }, 400);
  });
}

// ---------- Init ----------

document.addEventListener('DOMContentLoaded', () => {
  renderTourProgress();
  renderNavBar();
  loadScreenshots();
  animateConfidenceMeter();
  animateBarCharts();

  // Page-specific init
  const page = getCurrentPage();

  if (page === 'automation.html') {
    simulateWorkflow('workflow-viz', 900);
  }

  if (page === 'agentic.html') {
    simulateWorkflow('workflow-viz-agentic', 700);
  }

  if (page === 'roi.html') {
    initROICalculator();
  }

  // Init type-in animations after a brief delay
  setTimeout(() => {
    initTypeInAnimations(20);
  }, 300);
});
