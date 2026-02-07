import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

/* ═══════════════════════════════════════════
   SVG ICONS (inline data for seed/action cards)
   ═══════════════════════════════════════════ */
const ICONS = {
  // Seeds
  geometric: `<svg viewBox="0 0 28 28" fill="none" stroke="#c85a30" stroke-width="1.2"><rect x="8" y="8" width="12" height="12" rx="1" transform="rotate(15 14 14)"/><rect x="10" y="10" width="8" height="8" rx="0.5" transform="rotate(-10 14 14)"/></svg>`,
  organic: `<svg viewBox="0 0 28 28" fill="none" stroke="#5a9a5e" stroke-width="1.2"><path d="M14 22C14 22 8 18 7 12C7 8 10 5 14 5C18 5 21 8 21 12C20 18 14 22 14 22Z"/><path d="M14 22V14" stroke-dasharray="2 2"/></svg>`,
  crystalline: `<svg viewBox="0 0 28 28" fill="none" stroke="#6aaac8" stroke-width="1.2"><path d="M14 4L22 10L20 20L8 20L6 10Z"/><path d="M14 4L8 20M14 4L20 20M6 10L22 10" opacity="0.4"/></svg>`,
  fungal: `<svg viewBox="0 0 28 28" fill="none" stroke="#9a6ab0" stroke-width="1.2"><path d="M14 22V15"/><path d="M10 22V17"/><path d="M18 22V17"/><ellipse cx="14" cy="12" rx="8" ry="5"/><circle cx="10" cy="10" r="1.5" fill="#9a6ab0" opacity="0.3"/><circle cx="16" cy="11" r="1" fill="#9a6ab0" opacity="0.3"/></svg>`,
  mechanical: `<svg viewBox="0 0 28 28" fill="none" stroke="#8a8a8a" stroke-width="1.2"><circle cx="14" cy="14" r="6"/><circle cx="14" cy="14" r="2"/><path d="M14 6V8M14 20V22M6 14H8M20 14H22" stroke-linecap="round"/><path d="M8.3 8.3L9.7 9.7M18.3 18.3L19.7 19.7M8.3 19.7L9.7 18.3M18.3 9.7L19.7 8.3" stroke-linecap="round"/></svg>`,
  ethereal: `<svg viewBox="0 0 28 28" fill="none" stroke="#b8a8c8" stroke-width="1.2"><path d="M14 6C14 6 20 10 20 15C20 18 18 22 14 22C10 22 8 18 8 15C8 10 14 6 14 6Z" stroke-dasharray="3 2"/><circle cx="14" cy="14" r="2" opacity="0.5"/></svg>`,
  coral: `<svg viewBox="0 0 28 28" fill="none" stroke="#d4728a" stroke-width="1.2"><path d="M14 22V16"/><path d="M14 16C14 16 14 12 10 8"/><path d="M14 16C14 16 14 12 18 8"/><path d="M10 8C10 8 8 6 8 4"/><path d="M10 8C10 8 12 7 13 5"/><path d="M18 8C18 8 20 6 20 4"/><path d="M18 8C18 8 16 7 15 5"/></svg>`,
  neural: `<svg viewBox="0 0 28 28" fill="none" stroke="#5888c8" stroke-width="1.2"><circle cx="14" cy="14" r="2"/><circle cx="7" cy="9" r="1.5"/><circle cx="21" cy="9" r="1.5"/><circle cx="7" cy="19" r="1.5"/><circle cx="21" cy="19" r="1.5"/><circle cx="14" cy="5" r="1.5"/><circle cx="14" cy="23" r="1.5"/><line x1="14" y1="12" x2="14" y2="6.5"/><line x1="12.3" y1="13" x2="8.3" y2="10"/><line x1="15.7" y1="13" x2="19.7" y2="10"/><line x1="12.3" y1="15" x2="8.3" y2="18"/><line x1="15.7" y1="15" x2="19.7" y2="18"/><line x1="14" y1="16" x2="14" y2="21.5"/></svg>`,
  void_: `<svg viewBox="0 0 28 28" fill="none" stroke="#4a4a52" stroke-width="1.2"><circle cx="14" cy="14" r="8"/><circle cx="14" cy="14" r="4" fill="#4a4a52" opacity="0.15"/><circle cx="14" cy="14" r="1.5" fill="#4a4a52" opacity="0.3"/><path d="M6 14C6 14 10 12 14 14C18 16 22 14 22 14" opacity="0.3"/></svg>`,
  alien: `<svg viewBox="0 0 28 28" fill="none" stroke="#6ac878" stroke-width="1.2"><ellipse cx="14" cy="13" rx="8" ry="9"/><ellipse cx="10.5" cy="11" rx="2.5" ry="3"/><ellipse cx="17.5" cy="11" rx="2.5" ry="3"/><circle cx="10.5" cy="11.5" r="1" fill="#6ac878"/><circle cx="17.5" cy="11.5" r="1" fill="#6ac878"/><path d="M12 17C12 17 14 19 16 17"/></svg>`,
  electronic: `<svg viewBox="0 0 28 28" fill="none" stroke="#30c8a0" stroke-width="1.2"><rect x="9" y="9" width="10" height="10" rx="1"/><line x1="14" y1="4" x2="14" y2="9"/><line x1="14" y1="19" x2="14" y2="24"/><line x1="4" y1="14" x2="9" y2="14"/><line x1="19" y1="14" x2="24" y2="14"/><circle cx="14" cy="14" r="2" fill="#30c8a0" opacity="0.3"/><line x1="11" y1="9" x2="11" y2="6" opacity="0.5"/><line x1="17" y1="9" x2="17" y2="6" opacity="0.5"/></svg>`,
  temporal: `<svg viewBox="0 0 28 28" fill="none" stroke="#c8a850" stroke-width="1.2"><circle cx="14" cy="14" r="8"/><path d="M14 8V14L18 16"/><circle cx="14" cy="14" r="8" stroke-dasharray="3 2" opacity="0.3" transform="rotate(30 14 14)"/><circle cx="14" cy="14" r="5" stroke-dasharray="2 2" opacity="0.4"/></svg>`,
  // Actions
  observe: `<svg viewBox="0 0 24 24" fill="none" stroke="#7a6b5a" stroke-width="1.3" stroke-linecap="round"><circle cx="10" cy="10" r="6"/><line x1="14.5" y1="14.5" x2="20" y2="20"/></svg>`,
  prune: `<svg viewBox="0 0 24 24" fill="none" stroke="#7a6b5a" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6"/><path d="M18 6C18 6 20 8 18 10C16 12 14 10 14 10"/><path d="M18 6C18 6 16 4 14 6C12 8 14 10 14 10"/></svg>`,
  catalyst: `<svg viewBox="0 0 24 24" fill="none" stroke="#7a6b5a" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 2 13 9 20 9"/><polyline points="11 22 11 15 4 15"/><line x1="13" y1="9" x2="7" y2="15"/></svg>`,
  nurture: `<svg viewBox="0 0 24 24" fill="none" stroke="#7a6b5a" stroke-width="1.3" stroke-linecap="round"><path d="M12 2C12 2 6 6 6 12C6 15.3 8.7 18 12 18C15.3 18 18 15.3 18 12C18 6 12 2 12 2Z"/><path d="M12 18V22"/><path d="M12 10V14" opacity="0.4"/></svg>`,
  barrier: `<svg viewBox="0 0 24 24" fill="none" stroke="#7a6b5a" stroke-width="1.3" stroke-linecap="round"><rect x="4" y="6" width="16" height="12" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="4" y1="14" x2="20" y2="14"/><line x1="10" y1="6" x2="10" y2="18"/><line x1="14" y1="6" x2="14" y2="18"/></svg>`,
};

const SEEDS = [
  { id: 'geometric',   name: 'Geometric',   desc: 'Crystalline tiles',    color: '#c85a30', unlocked: true },
  { id: 'organic',     name: 'Organic',      desc: 'Flowing tendrils',    color: '#5a9a5e', unlocked: true },
  { id: 'crystalline', name: 'Crystalline',  desc: 'Refractive facets',   color: '#6aaac8', unlocked: true },
  { id: 'fungal',      name: 'Fungal',       desc: 'Mycelium networks',   color: '#9a6ab0', unlocked: true },
  { id: 'mechanical',  name: 'Mechanical',   desc: 'Interlocking gears',  color: '#8a8a8a', unlocked: true },
  { id: 'electronic',  name: 'Electronic',   desc: 'Circuit traces',      color: '#30c8a0', unlocked: true },
  { id: 'ethereal',    name: 'Ethereal',     desc: 'Phasing wisps',       color: '#b8a8c8', unlocked: true },
  { id: 'coral',       name: 'Coral',        desc: 'Branching colonies',  color: '#d4728a', unlocked: true },
  { id: 'neural',      name: 'Neural',       desc: 'Synaptic sparks',     color: '#5888c8', unlocked: true },
  { id: 'void_',       name: 'Void',         desc: 'Consuming dark',      color: '#4a4a52', unlocked: true },
  { id: 'alien',       name: 'Alien',        desc: 'Unknowable forms',    color: '#6ac878', unlocked: true },
  { id: 'temporal',    name: 'Temporal',      desc: 'Echoes of time',      color: '#c8a850', unlocked: true },
];

const ACTIONS = [
  { id: 'observe', name: 'Observe', desc: 'Watch and learn', unlocked: true },
  { id: 'prune', name: 'Prune', desc: 'Trim overgrowth', unlocked: true },
  { id: 'catalyst', name: 'Catalyst', desc: 'Accelerate growth', unlocked: true },
  { id: 'nurture', name: 'Nurture', desc: 'Boost struggling life', unlocked: true },
  { id: 'barrier', name: 'Barrier', desc: 'Block expansion', unlocked: true },
];

/* ═══════════════════════════════════════════
   UI SETUP
   ═══════════════════════════════════════════ */
let currentSeed = 'geometric';
let currentAction = 'observe';
let elapsedTime = 0;
let gameStarted = false;

// Build seeds grid
const seedsGrid = document.getElementById('seeds-grid');
SEEDS.forEach(s => {
  const card = document.createElement('div');
  card.className = `seed-card${s.unlocked ? '' : ' locked'}${s.id === currentSeed ? ' selected' : ''}`;
  card.dataset.seed = s.id;
  card.innerHTML = `
    <div class="sc-icon">${ICONS[s.id]}</div>
    <div class="sc-info">
      <div class="sc-name">${s.name}</div>
      <div class="sc-desc">${s.unlocked ? s.desc : 'Locked'}</div>
    </div>`;
  card.addEventListener('click', () => {
    if (!s.unlocked) return;
    currentSeed = s.id;
    document.querySelectorAll('.seed-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    closeAllPanels();
  });
  seedsGrid.appendChild(card);
});

// Build actions list
const actionsList = document.getElementById('actions-list');
ACTIONS.forEach(a => {
  const row = document.createElement('div');
  row.className = `action-row${a.unlocked ? '' : ' locked'}${a.id === currentAction ? ' selected' : ''}`;
  row.dataset.action = a.id;
  row.innerHTML = `
    <div class="ar-icon">${ICONS[a.id]}</div>
    <div class="ar-info">
      <div class="ar-name">${a.name}</div>
      <div class="ar-desc">${a.unlocked ? a.desc : 'Locked'}</div>
    </div>`;
  row.addEventListener('click', () => {
    if (!a.unlocked) return;
    currentAction = a.id;
    document.querySelectorAll('.action-row').forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
    closeAllPanels();
    closeInspector();
  });
  actionsList.appendChild(row);
});

// Panel toggling
function closeAllPanels() {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('open'));
}

/* ═══════════════════════════════════════════
   TUTORIAL SLIDES
   ═══════════════════════════════════════════ */
const TUTORIAL_SLIDES = [
  {
    icon: `<svg viewBox="0 0 44 44" fill="none" stroke="#7a6b5a" stroke-width="1.0" stroke-linecap="round">
      <circle cx="22" cy="22" r="16"/>
      <circle cx="22" cy="22" r="8" stroke-dasharray="3 3"/>
      <circle cx="22" cy="22" r="2" fill="#7a6b5a" opacity="0.3"/>
    </svg>`,
    heading: 'Welcome',
    text: 'A meditative ecosystem where living forms grow, compete, and merge on a shared surface.\n\nYour garden will be unique. No two are alike.',
  },
  {
    icon: `<svg viewBox="0 0 44 44" fill="none" stroke="#7a6b5a" stroke-width="1.0" stroke-linecap="round">
      <path d="M22 34V22"/>
      <path d="M22 22C22 22 16 18 14 12C18 14 22 18 22 22"/>
      <path d="M22 22C22 22 28 18 30 12C26 14 22 18 22 22"/>
      <circle cx="22" cy="36" r="1.5" fill="#7a6b5a" opacity="0.4"/>
    </svg>`,
    heading: 'Planting',
    text: 'Open the Seeds panel to choose a seed type, then click anywhere on the surface to plant.\n\nEach type grows differently — geometric tiles, organic tendrils, fungal webs, and more.',
  },
  {
    icon: `<svg viewBox="0 0 44 44" fill="none" stroke="#7a6b5a" stroke-width="1.0" stroke-linecap="round">
      <circle cx="16" cy="22" r="8"/>
      <circle cx="28" cy="22" r="8"/>
      <path d="M22 16V28" stroke-dasharray="2 2" opacity="0.5"/>
    </svg>`,
    heading: 'Growth & Conflict',
    text: 'Organisms claim territory outward from where they were planted. When two meet, borders form and they compete for space.\n\nStronger organisms can overwhelm weaker ones.',
  },
  {
    icon: `<svg viewBox="0 0 44 44" fill="none" stroke="#7a6b5a" stroke-width="1.0" stroke-linecap="round">
      <circle cx="14" cy="20" r="6" opacity="0.4"/>
      <circle cx="30" cy="20" r="6" opacity="0.4"/>
      <path d="M22 30L18 22L22 14L26 22Z" fill="#7a6b5a" opacity="0.15"/>
      <path d="M22 30L18 22L22 14L26 22Z"/>
    </svg>`,
    heading: 'Emergence',
    text: 'When organisms collide long enough, entirely new hybrid life emerges — with traits from both parents.\n\nExperiment with different combinations. Use barriers, pruning, and catalysts from the Actions panel.',
  },
];

const TutorialController = {
  STORAGE_KEY: 'garden-tutorial-seen',
  currentSlide: 0,
  isActive: false,

  shouldShow() {
    try {
      return !localStorage.getItem(this.STORAGE_KEY);
    } catch { return true; }
  },

  markSeen() {
    try { localStorage.setItem(this.STORAGE_KEY, '1'); } catch {}
  },

  start() {
    if (!this.shouldShow()) return;
    this.isActive = true;
    this.currentSlide = 0;

    // Build dots
    const dotsEl = document.getElementById('tutorial-dots');
    dotsEl.innerHTML = '';
    TUTORIAL_SLIDES.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'tutorial-dot' + (i === 0 ? ' active' : '');
      dotsEl.appendChild(dot);
    });

    this._renderSlide();
    document.getElementById('tutorial-overlay').classList.add('visible');

    // Wire buttons
    document.getElementById('tutorial-next').onclick = () => this._next();
    document.getElementById('tutorial-skip').onclick = () => this._close();
  },

  _renderSlide() {
    const slide = TUTORIAL_SLIDES[this.currentSlide];
    document.getElementById('tutorial-icon').innerHTML = slide.icon;
    document.getElementById('tutorial-heading').textContent = slide.heading;
    document.getElementById('tutorial-text').innerHTML = slide.text.replace(/\n/g, '<br>');

    // Update dots
    document.querySelectorAll('.tutorial-dot').forEach((d, i) => {
      d.classList.toggle('active', i === this.currentSlide);
    });

    // Update button labels
    const isLast = this.currentSlide === TUTORIAL_SLIDES.length - 1;
    document.getElementById('tutorial-next').textContent = isLast ? 'Begin' : 'Next';
    document.getElementById('tutorial-skip').style.display = isLast ? 'none' : '';
  },

  _next() {
    if (this.currentSlide < TUTORIAL_SLIDES.length - 1) {
      this.currentSlide++;
      this._renderSlide();
    } else {
      this._close();
    }
  },

  _close() {
    this.markSeen();
    this.isActive = false;
    document.getElementById('tutorial-overlay').classList.remove('visible');
  },
};

document.addEventListener('keydown', (e) => {
  if (!TutorialController.isActive) return;
  if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    TutorialController._next();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    TutorialController._close();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (TutorialController.currentSlide > 0) {
      TutorialController.currentSlide--;
      TutorialController._renderSlide();
    }
  }
});

document.getElementById('btn-seeds').addEventListener('click', () => {
  const panel = document.getElementById('seeds-panel');
  const isOpen = panel.classList.contains('open');
  closeAllPanels();
  if (!isOpen) {
    panel.classList.add('open');
    document.getElementById('btn-seeds').classList.add('open');
  }
});

document.getElementById('btn-actions').addEventListener('click', () => {
  const panel = document.getElementById('actions-panel');
  const isOpen = panel.classList.contains('open');
  closeAllPanels();
  if (!isOpen) {
    panel.classList.add('open');
    document.getElementById('btn-actions').classList.add('open');
  }
});

document.getElementById('btn-view').addEventListener('click', () => {
  const panel = document.getElementById('view-panel');
  const isOpen = panel.classList.contains('open');
  closeAllPanels();
  if (!isOpen) {
    panel.classList.add('open');
    document.getElementById('btn-view').classList.add('open');
  }
});

// Spin toggle
let spinActive = false;
let spinDirection = 1; // 1 = right, -1 = left
let lastDragX = null;

document.getElementById('view-spin').addEventListener('click', () => {
  spinActive = !spinActive;
  const row = document.getElementById('view-spin');
  row.classList.toggle('selected', spinActive);
  row.querySelector('.ar-desc').textContent = spinActive
    ? 'Active · swipe sphere to change direction'
    : 'Constant rotation · swipe to set direction';
  if (!spinActive) ctrl.autoRotate = false;
  closeAllPanels();
});

// ── Photo Mode + Gallery ──
let photoModeActive = false;
let _photoSavedSpeed = 1;
const photoGallery = []; // {dataURL, timestamp}
const GALLERY_MAX = 50;
let _previewIdx = -1;

function enterPhotoMode() {
  if (photoModeActive) return;
  photoModeActive = true;
  _photoSavedSpeed = timeSpeed;
  document.getElementById('hud-top').style.display = 'none';
  document.getElementById('hud-bottom').style.display = 'none';
  const hint = document.getElementById('hint');
  if (hint) hint.style.display = 'none';
  const inspector = document.getElementById('inspector');
  if (inspector) inspector.style.display = 'none';
  document.getElementById('photo-toolbar').style.display = 'flex';
  const photoRow = document.getElementById('view-photo');
  if (photoRow) photoRow.classList.add('selected');
  _updateGalleryCount();
  closeAllPanels();
}

function exitPhotoMode() {
  if (!photoModeActive) return;
  photoModeActive = false;
  document.getElementById('hud-top').style.display = '';
  document.getElementById('hud-bottom').style.display = '';
  const hint = document.getElementById('hint');
  if (hint) hint.style.display = '';
  document.getElementById('photo-toolbar').style.display = 'none';
  document.getElementById('photo-gallery').classList.remove('open');
  document.getElementById('gallery-preview').classList.remove('open');
  const photoRow = document.getElementById('view-photo');
  if (photoRow) photoRow.classList.remove('selected');
}

function captureScreenshot() {
  if (!renderer) return;
  // Hide toolbar momentarily for clean capture
  const toolbar = document.getElementById('photo-toolbar');
  toolbar.style.visibility = 'hidden';

  // Render
  if (typeof composer !== 'undefined' && composer) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
  const dataURL = renderer.domElement.toDataURL('image/png');

  // Flash effect
  const flash = document.getElementById('photo-flash');
  flash.classList.add('flash');
  setTimeout(() => {
    flash.classList.remove('flash');
    toolbar.style.visibility = '';
  }, 120);

  // Store in gallery
  photoGallery.unshift({
    dataURL,
    timestamp: Date.now(),
  });
  // Cap at max
  if (photoGallery.length > GALLERY_MAX) {
    photoGallery.length = GALLERY_MAX;
  }
  _updateGalleryCount();
}

function _updateGalleryCount() {
  const el = document.getElementById('photo-count');
  if (el) el.textContent = photoGallery.length > 0 ? `(${photoGallery.length})` : '';
}

function _formatTimestamp(ts) {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  const s = d.getSeconds().toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function openGallery() {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';

  if (photoGallery.length === 0) {
    grid.innerHTML = '<div id="gallery-empty">No photos yet — capture some moments</div>';
  } else {
    photoGallery.forEach((photo, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'gallery-thumb';
      thumb.innerHTML = `<img src="${photo.dataURL}" alt="Photo ${idx + 1}"/>
        <div class="gallery-thumb-time">${_formatTimestamp(photo.timestamp)}</div>`;
      thumb.addEventListener('click', () => openPreview(idx));
      grid.appendChild(thumb);
    });
  }

  document.getElementById('gallery-title').textContent = `Gallery · ${photoGallery.length} / ${GALLERY_MAX}`;
  document.getElementById('photo-gallery').classList.add('open');
}

function closeGallery() {
  document.getElementById('photo-gallery').classList.remove('open');
}

function openPreview(idx) {
  if (idx < 0 || idx >= photoGallery.length) return;
  _previewIdx = idx;
  const photo = photoGallery[idx];
  document.getElementById('preview-img').src = photo.dataURL;
  document.getElementById('preview-time').textContent = _formatTimestamp(photo.timestamp);
  document.getElementById('gallery-preview').classList.add('open');
}

function closePreview() {
  document.getElementById('gallery-preview').classList.remove('open');
  _previewIdx = -1;
}

function exportPhoto(idx) {
  if (idx < 0 || idx >= photoGallery.length) return;
  const photo = photoGallery[idx];
  const link = document.createElement('a');
  link.download = `garden-${photo.timestamp}.png`;
  link.href = photo.dataURL;
  link.click();
}

function deletePhoto(idx) {
  if (idx < 0 || idx >= photoGallery.length) return;
  photoGallery.splice(idx, 1);
  _updateGalleryCount();
  closePreview();
  openGallery(); // refresh grid
}

// Toolbar handlers
document.getElementById('view-photo').addEventListener('click', () => {
  if (photoModeActive) {
    exitPhotoMode();
  } else {
    enterPhotoMode();
  }
  closeAllPanels();
});

document.getElementById('photo-capture').addEventListener('click', captureScreenshot);
document.getElementById('photo-gallery-btn').addEventListener('click', openGallery);
document.getElementById('photo-exit').addEventListener('click', () => exitPhotoMode());

// Gallery handlers
document.getElementById('gallery-close').addEventListener('click', closeGallery);
document.getElementById('preview-close').addEventListener('click', closePreview);
document.getElementById('preview-export').addEventListener('click', () => exportPhoto(_previewIdx));
document.getElementById('preview-delete').addEventListener('click', () => deletePhoto(_previewIdx));

// Click gallery background to close
document.getElementById('photo-gallery').addEventListener('click', (e) => {
  if (e.target === document.getElementById('photo-gallery')) closeGallery();
});
document.getElementById('gallery-preview').addEventListener('click', (e) => {
  if (e.target === document.getElementById('gallery-preview')) closePreview();
});

document.querySelectorAll('.panel-close').forEach(btn =>
  btn.addEventListener('click', () => closeAllPanels())
);

// Close panels when clicking outside
document.addEventListener('pointerdown', e => {
  if (!e.target.closest('.panel') && !e.target.closest('.tool-btn')) closeAllPanels();
});

// Time formatting
function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

/* ═══════════════════════════════════════════
   SAVE / LOAD — Multi-slot system
   ═══════════════════════════════════════════ */
const SAVE_KEY_PREFIX = 'garden-of-emergence-slot-';
const MAX_SLOTS = 3;
let activeSlot = null;
const barriers = new Set(); // stores vertex indices

function getSlotData(i) {
  try {
    const raw = localStorage.getItem(SAVE_KEY_PREFIX + i);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function getAllSlots() {
  return Array.from({ length: MAX_SLOTS }, (_, i) => getSlotData(i));
}

function hasAnySave() {
  return getAllSlots().some(s => s !== null);
}

function buildSaveData(name) {
  return {
    name: name || 'Unnamed Garden',
    savedAt: new Date().toISOString(),
    canvasType: activeCanvasType,
    elapsedTime,
    currentSeed,
    currentAction,
    barriers: [...barriers],
    organisms: organisms.map(o => ({
      seedType: o.seedType,
      spawnIndex: o.spawnVertex.index,
      genome: o.genome,
      claimed: [...o.claimed].map(v => ({
        i: v.index,
        rng: v.rng,
        hs: v.hueShift,
        ls: v.lightnessShift,
        ro: v.rotOffset,
        pr: v.pressure || 0,
        lft: v.lastFlipTime || 0,
      })),
      energy: o.energy,
      age: o.age,
      isAlive: o.isAlive,
      stress: o.stress || 0,
      peakTerritory: o._peakTerritory || 1,
      isHybrid: o.isHybrid || false,
      parentTypes: o.parentTypes || null,
      isShrinking: o.isShrinking || false,
      catalystTimer: o.catalystTimer || 0,
      catalystCooldown: o.catalystCooldown || 0,
      nurtureTimer: o.nurtureTimer || 0,
      nurtureCooldown: o.nurtureCooldown || 0,
      patternTypeValue: o.seedDef.patternTypeValue !== undefined ? o.seedDef.patternTypeValue : null,
    })),
  };
}

function saveToSlot(slotIndex, name) {
  if (!gameStarted || !activeCanvas) return;
  try {
    const data = buildSaveData(name);
    localStorage.setItem(SAVE_KEY_PREFIX + slotIndex, JSON.stringify(data));
    activeSlot = slotIndex;
  } catch(e) { console.warn('Save failed:', e); }
}

function deleteSlot(i) {
  try { localStorage.removeItem(SAVE_KEY_PREFIX + i); } catch {}
}

function saveGame() {
  if (activeSlot !== null && gameStarted) {
    const existing = getSlotData(activeSlot);
    saveToSlot(activeSlot, existing ? existing.name : 'Auto-save');
  }
}

// Migrate legacy single-save to slot 0
(function migrateLegacySave() {
  try {
    const old = localStorage.getItem('garden-of-emergence-save');
    if (old && !getSlotData(0)) {
      const data = JSON.parse(old);
      data.name = 'Legacy Garden';
      data.savedAt = new Date().toISOString();
      localStorage.setItem(SAVE_KEY_PREFIX + '0', JSON.stringify(data));
      localStorage.removeItem('garden-of-emergence-save');
    }
  } catch {}
})();

// Auto-save every 30s
setInterval(saveGame, 30000);

// Manual save button — opens save modal
// Settings gear toggle
document.getElementById('btn-settings').addEventListener('click', (e) => {
  if (e.target.closest('.settings-dropdown')) return;
  document.getElementById('settings-dropdown').classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('#btn-settings')) {
    document.getElementById('settings-dropdown').classList.remove('open');
  }
});
document.getElementById('settings-save').addEventListener('click', () => {
  document.getElementById('settings-dropdown').classList.remove('open');
  openSaveModal();
});
document.getElementById('settings-audio').addEventListener('click', () => {
  audioEngine.toggle();
});

function openSaveModal() {
  const modal = document.getElementById('save-modal');
  const slotsContainer = document.getElementById('save-slots');
  const nameRow = document.getElementById('save-name-row');
  const nameInput = document.getElementById('save-name-input');
  let selectedSlot = activeSlot;

  slotsContainer.innerHTML = '';
  nameRow.style.display = 'none';

  const slots = getAllSlots();

  for (let i = 0; i < MAX_SLOTS; i++) {
    const data = slots[i];
    const el = document.createElement('div');
    el.className = `save-slot${data ? '' : ' empty'}${i === selectedSlot ? ' selected' : ''}`;

    if (data) {
      const elapsed = formatTime(data.elapsedTime || 0);
      const date = new Date(data.savedAt).toLocaleDateString();
      el.innerHTML = `
        <div class="slot-number">${i + 1}</div>
        <div class="slot-info">
          <div class="slot-name">${data.name}</div>
          <div class="slot-meta">${data.canvasType} · ${elapsed} · ${date}</div>
        </div>
        <button class="slot-delete" title="Delete save">×</button>`;
      el.querySelector('.slot-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSlot(i);
        openSaveModal();
      });
    } else {
      el.innerHTML = `
        <div class="slot-number">${i + 1}</div>
        <div class="slot-info">
          <div class="slot-name">Empty Slot</div>
          <div class="slot-meta">—</div>
        </div>`;
    }

    el.addEventListener('click', () => {
      selectedSlot = i;
      slotsContainer.querySelectorAll('.save-slot').forEach(s => s.classList.remove('selected'));
      el.classList.add('selected');
      nameRow.style.display = 'flex';
      const existing = slots[i];
      nameInput.value = existing ? existing.name : '';
      nameInput.placeholder = existing ? existing.name : 'Name your garden...';
      nameInput.focus();
    });

    slotsContainer.appendChild(el);
  }

  if (selectedSlot !== null) {
    nameRow.style.display = 'flex';
    const existing = slots[selectedSlot];
    nameInput.value = existing ? existing.name : '';
  }

  modal.classList.add('visible');
}

document.getElementById('save-confirm-btn').addEventListener('click', () => {
  const nameInput = document.getElementById('save-name-input');
  const selectedEl = document.querySelector('#save-slots .save-slot.selected');
  if (!selectedEl) return;
  const slotIndex = [...document.querySelectorAll('#save-slots .save-slot')].indexOf(selectedEl);
  if (slotIndex < 0) return;

  const name = nameInput.value.trim() || 'Unnamed Garden';
  saveToSlot(slotIndex, name);

  document.getElementById('save-modal').classList.remove('visible');
  notify('garden saved');
});

document.getElementById('save-modal-close').addEventListener('click', () => {
  document.getElementById('save-modal').classList.remove('visible');
});

function openLoadModal() {
  const modal = document.getElementById('load-modal');
  const slotsContainer = document.getElementById('load-slots');
  slotsContainer.innerHTML = '';

  const slots = getAllSlots();
  let hasSaves = false;

  for (let i = 0; i < MAX_SLOTS; i++) {
    const data = slots[i];
    if (!data) continue;
    hasSaves = true;

    const elapsed = formatTime(data.elapsedTime || 0);
    const date = new Date(data.savedAt).toLocaleDateString();
    const orgCount = data.organisms ? data.organisms.filter(o => o.isAlive).length : 0;

    const el = document.createElement('div');
    el.className = 'save-slot';
    el.innerHTML = `
      <div class="slot-number">${i + 1}</div>
      <div class="slot-info">
        <div class="slot-name">${data.name}</div>
        <div class="slot-meta">${data.canvasType} · ${orgCount} organisms · ${elapsed} · ${date}</div>
      </div>
      <button class="slot-delete" title="Delete save">×</button>`;

    el.querySelector('.slot-delete').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteSlot(i);
      openLoadModal();
      if (!hasAnySave()) {
        document.getElementById('btn-continue').disabled = true;
        modal.classList.remove('visible');
      }
    });

    el.addEventListener('click', () => {
      modal.classList.remove('visible');
      activeSlot = i;
      if (window._startGame) window._startGame(data);
    });

    slotsContainer.appendChild(el);
  }

  if (!hasSaves) {
    slotsContainer.innerHTML = '<div style="text-align:center;color:var(--text-dim);font-size:11px;padding:20px;">No saved gardens</div>';
  }

  modal.classList.add('visible');
}
window._openLoadModal = openLoadModal;

document.getElementById('load-modal-close').addEventListener('click', () => {
  document.getElementById('load-modal').classList.remove('visible');
});

/* ═══════════════════════════════════════════
   VERTEX
   ═══════════════════════════════════════════ */
class Vertex {
  constructor(i, pos, norm) {
    this.index = i;
    this.position = pos.clone();
    this.normal = norm.clone();
    this.neighbors = [];
    this.owner = null;
    this.claimStrength = 0;
    this.color = new THREE.Color(0);
    this.height = 0;
    this.targetHeight = 0;
    this.claimProgress = 0;
    // Per-vertex visual variety (set at claim time)
    this.claimTime = 0;        // organism age when claimed (for flash effect)
    this.rng = 0;           // random 0-1 for deriving offsets
    this.hueShift = 0;      // small hue offset
    this.lightnessShift = 0; // small lightness offset
    this.rotOffset = 0;     // rotation offset in radians
    // Combat properties
    this.pressure = 0;          // accumulated border pressure (0 to ~3+)
    this.contestedBy = null;    // reference to the enemy organism applying pressure
    this.lastFlipTime = 0;      // organism-age when this vertex last changed hands
    this.combatFlash = 0;       // 0-1, set to 1 on capture, decays to 0
    this.isBarrier = false;     // player-placed barrier — persists through reset
  }
  reset() {
    this.owner = null; this.claimStrength = 0;
    this.color.set(0); this.height = 0;
    this.targetHeight = 0; this.claimProgress = 0;
    this.rng = 0; this.hueShift = 0; this.lightnessShift = 0; this.rotOffset = 0; this.claimTime = 0;
    this.pressure = 0; this.contestedBy = null; this.lastFlipTime = 0; this.combatFlash = 0;
  }
}

/* ═══════════════════════════════════════════
   SPHERE CANVAS
   ═══════════════════════════════════════════ */
class SphereCanvas {
  constructor(scene, radius, subdiv) {
    this.scene = scene;
    this.radius = radius;
    this.vertices = [];
    this._faces = [];
    this._build(subdiv);
    this._buildNeighbors();
    this._buildVisuals();
    this._buildShellGeometry();
  }

  _build(subdiv) {
    const geo = new THREE.IcosahedronGeometry(this.radius, subdiv);
    const pa = geo.getAttribute('position');
    const na = geo.getAttribute('normal');
    const map = new Map(), remap = [];
    for (let i = 0; i < pa.count; i++) {
      const p = new THREE.Vector3().fromBufferAttribute(pa, i);
      const k = `${p.x.toFixed(4)},${p.y.toFixed(4)},${p.z.toFixed(4)}`;
      if (!map.has(k)) {
        const n = new THREE.Vector3().fromBufferAttribute(na, i).normalize();
        map.set(k, new Vertex(map.size, p, n));
        this.vertices.push(map.get(k));
      }
      remap.push(map.get(k).index);
    }
    const idx = geo.getIndex();
    if (idx) {
      for (let i = 0; i < idx.count; i += 3)
        this._faces.push([remap[idx.getX(i)], remap[idx.getX(i+1)], remap[idx.getX(i+2)]]);
    } else {
      // Non-indexed: every 3 consecutive vertices form a face
      for (let i = 0; i < pa.count; i += 3)
        this._faces.push([remap[i], remap[i+1], remap[i+2]]);
    }
    geo.dispose();
  }

  _buildNeighbors() {
    const s = new Map();
    for (const v of this.vertices) s.set(v.index, new Set());
    for (const [a,b,c] of this._faces) {
      s.get(a).add(b); s.get(a).add(c);
      s.get(b).add(a); s.get(b).add(c);
      s.get(c).add(a); s.get(c).add(b);
    }
    for (const v of this.vertices) v.neighbors = [...s.get(v.index)];
  }

  _buildVisuals() {
    const sphereGeo = new THREE.SphereGeometry(this.radius, 64, 48);
    // Inner glow
    const glowGeo = new THREE.SphereGeometry(this.radius * 0.93, 32, 24);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.FrontSide,
      uniforms: { uTime: { value: 0 }, uGrowthPulse: { value: 0 } },
      vertexShader: `varying vec3 vN; varying vec3 vV; uniform float uTime;
        void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `varying vec3 vN; varying vec3 vV; uniform float uTime; uniform float uGrowthPulse;
        void main(){ float g=pow(max(dot(vN,vV),0.),2.); float p=sin(uTime*.35)*.04+1.;
        float gpBoost=1.0+uGrowthPulse;
        gl_FragColor=vec4(vec3(.94,.93,.95)*g*.22*p*gpBoost, g*.1*p*gpBoost); }`
    });
    this.glowMat = glowMat;
    this.glowMesh = new THREE.Mesh(glowGeo, glowMat);
    this.glowMesh.renderOrder = -1;
    this.scene.add(this.glowMesh);
    // Main glass
    const jellyMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.FrontSide,
      uniforms: { uTime:{value:0}, uLD:{value:new THREE.Vector3(.4,.7,.5).normalize()}, uLD2:{value:new THREE.Vector3(-.5,.3,-.4).normalize()} },
      vertexShader: `varying vec3 vN; varying vec3 vV; uniform float uTime;
        void main(){ vec3 p=position; p+=normal*sin(p.x*2.+uTime*.35)*cos(p.y*1.8+uTime*.25)*.006;
        vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(p,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 uLD; uniform vec3 uLD2; varying vec3 vN; varying vec3 vV;
        void main(){ float f=pow(1.-max(dot(vN,vV),0.),3.);
        float s1=pow(max(dot(vN,normalize(uLD+vV)),0.),200.)*2.; float s2=pow(max(dot(vN,normalize(uLD2+vV)),0.),120.)*.6;
        float st=s1+s2; vec3 c=vec3(.48,.46,.44)*f*.7+vec3(1.,.99,.96)*st; float a=clamp(f*.5+st*.5,0.,.85);
        gl_FragColor=vec4(c,a); }`
    });
    this.jellyMat = jellyMat;
    this.mesh = new THREE.Mesh(sphereGeo, jellyMat);
    this.mesh.renderOrder = 0;
    this.scene.add(this.mesh);
    // Backface
    const backMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.BackSide, uniforms: {},
      vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `varying vec3 vN; varying vec3 vV; void main(){ float r=pow(1.-max(dot(-vN,vV),0.),2.5); gl_FragColor=vec4(vec3(.52,.50,.48)*r*.25,r*.2); }`
    });
    this.backMesh = new THREE.Mesh(sphereGeo.clone(), backMat);
    this.backMesh.renderOrder = -2;
    this.scene.add(this.backMesh);
  }

  getNeighbors(v) { return v.neighbors.map(i => this.vertices[i]); }

  _buildShellGeometry() {
    const N = this.vertices.length;
    const positions = new Float32Array(N * 3);
    const normals = new Float32Array(N * 3);

    for (const v of this.vertices) {
      const i3 = v.index * 3;
      positions[i3]     = v.position.x;
      positions[i3 + 1] = v.position.y;
      positions[i3 + 2] = v.position.z;
      normals[i3]       = v.normal.x;
      normals[i3 + 1]   = v.normal.y;
      normals[i3 + 2]   = v.normal.z;
    }

    const F = this._faces.length;
    const indices = N > 65535 ? new Uint32Array(F * 3) : new Uint16Array(F * 3);
    for (let i = 0; i < F; i++) {
      indices[i * 3]     = this._faces[i][0];
      indices[i * 3 + 1] = this._faces[i][1];
      indices[i * 3 + 2] = this._faces[i][2];
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    this.shellGeo = geo;
  }
  getNearestVertex(wp) { let b=null,d=Infinity; for(const v of this.vertices){const dd=v.position.distanceToSquared(wp); if(dd<d){d=dd;b=v;}} return b; }
  raycast(rc) { const h=rc.intersectObject(this.mesh,false); return h.length>0?h[0]:null; }
  releaseVertex(v) { v.reset(); }
  update(dt) { this.jellyMat.uniforms.uTime.value+=dt; this.glowMat.uniforms.uTime.value+=dt; }
  get vertexCount() { return this.vertices.length; }

  dispose() {
    this.scene.remove(this.mesh); this.scene.remove(this.glowMesh); this.scene.remove(this.backMesh);
    this.mesh.geometry.dispose(); this.mesh.material.dispose();
    this.glowMesh.geometry.dispose(); this.glowMesh.material.dispose();
    this.backMesh.geometry.dispose(); this.backMesh.material.dispose();
    if (this.shellGeo) this.shellGeo.dispose();
  }
}

/* ═══════════════════════════════════════════
   SHARED CANVAS HELPERS
   ═══════════════════════════════════════════ */

// Shared glass shaders — used by all canvas types
function _makeGlowMat() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.FrontSide,
    uniforms: { uTime: { value: 0 }, uGrowthPulse: { value: 0 } },
    vertexShader: `varying vec3 vN; varying vec3 vV; uniform float uTime;
      void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: `varying vec3 vN; varying vec3 vV; uniform float uTime; uniform float uGrowthPulse;
      void main(){ float g=pow(max(dot(vN,vV),0.),2.); float p=sin(uTime*.35)*.04+1.;
      float gpBoost=1.0+uGrowthPulse;
      gl_FragColor=vec4(vec3(.94,.93,.95)*g*.22*p*gpBoost, g*.1*p*gpBoost); }`
  });
}

function _makeJellyMat() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.FrontSide,
    uniforms: { uTime:{value:0}, uLD:{value:new THREE.Vector3(.4,.7,.5).normalize()}, uLD2:{value:new THREE.Vector3(-.5,.3,-.4).normalize()} },
    vertexShader: `varying vec3 vN; varying vec3 vV; uniform float uTime;
      void main(){ vec3 p=position; p+=normal*sin(p.x*2.+uTime*.35)*cos(p.y*1.8+uTime*.25)*.006;
      vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(p,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: `uniform vec3 uLD; uniform vec3 uLD2; varying vec3 vN; varying vec3 vV;
      void main(){ float f=pow(1.-max(dot(vN,vV),0.),3.);
      float s1=pow(max(dot(vN,normalize(uLD+vV)),0.),200.)*2.; float s2=pow(max(dot(vN,normalize(uLD2+vV)),0.),120.)*.6;
      float st=s1+s2; vec3 c=vec3(.48,.46,.44)*f*.7+vec3(1.,.99,.96)*st; float a=clamp(f*.5+st*.5,0.,.85);
      gl_FragColor=vec4(c,a); }`
  });
}

function _makeBackMat() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.BackSide, uniforms: {},
    vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: `varying vec3 vN; varying vec3 vV; void main(){ float r=pow(1.-max(dot(-vN,vV),0.),2.5); gl_FragColor=vec4(vec3(.52,.50,.48)*r*.25,r*.2); }`
  });
}

function _roundBoxPositions(geo, halfSize, edgeRadius) {
  const pos = geo.getAttribute('position');
  const h = halfSize;
  const r = edgeRadius;
  const clamped = new THREE.Vector3();
  const diff = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    clamped.set(
      Math.max(-h + r, Math.min(h - r, x)),
      Math.max(-h + r, Math.min(h - r, y)),
      Math.max(-h + r, Math.min(h - r, z))
    );
    diff.set(x - clamped.x, y - clamped.y, z - clamped.z);
    const dist = diff.length();
    if (dist > 0.0001) {
      diff.normalize().multiplyScalar(r);
      pos.setXYZ(i, clamped.x + diff.x, clamped.y + diff.y, clamped.z + diff.z);
    }
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

function _roundSlabPositions(geo, halfW, halfH, halfD, edgeRadius) {
  const pos = geo.getAttribute('position');
  const r = edgeRadius;
  const clamped = new THREE.Vector3();
  const diff = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    clamped.set(
      Math.max(-halfW + r, Math.min(halfW - r, x)),
      Math.max(-halfH + r, Math.min(halfH - r, y)),
      Math.max(-halfD + r, Math.min(halfD - r, z))
    );
    diff.set(x - clamped.x, y - clamped.y, z - clamped.z);
    const dist = diff.length();
    if (dist > 0.0001) {
      diff.normalize().multiplyScalar(r);
      pos.setXYZ(i, clamped.x + diff.x, clamped.y + diff.y, clamped.z + diff.z);
    }
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
}

function _buildVerticesFromGeo(geo, vertexArr, faceArr) {
  const pa = geo.getAttribute('position');
  const na = geo.getAttribute('normal');
  const map = new Map(), remap = [];
  for (let i = 0; i < pa.count; i++) {
    const p = new THREE.Vector3().fromBufferAttribute(pa, i);
    const k = `${p.x.toFixed(4)},${p.y.toFixed(4)},${p.z.toFixed(4)}`;
    if (!map.has(k)) {
      const n = new THREE.Vector3().fromBufferAttribute(na, i).normalize();
      map.set(k, new Vertex(map.size, p, n));
      vertexArr.push(map.get(k));
    }
    remap.push(map.get(k).index);
  }
  const idx = geo.getIndex();
  if (idx) {
    for (let i = 0; i < idx.count; i += 3)
      faceArr.push([remap[idx.getX(i)], remap[idx.getX(i+1)], remap[idx.getX(i+2)]]);
  } else {
    for (let i = 0; i < pa.count; i += 3)
      faceArr.push([remap[i], remap[i+1], remap[i+2]]);
  }
}

function _buildNeighborsGeneric(vertices, faces) {
  const s = new Map();
  for (const v of vertices) s.set(v.index, new Set());
  for (const [a,b,c] of faces) {
    s.get(a).add(b); s.get(a).add(c);
    s.get(b).add(a); s.get(b).add(c);
    s.get(c).add(a); s.get(c).add(b);
  }
  for (const v of vertices) v.neighbors = [...s.get(v.index)];
}

function _buildShellGeoGeneric(vertices, faces) {
  const N = vertices.length;
  const positions = new Float32Array(N * 3);
  const normals = new Float32Array(N * 3);
  for (const v of vertices) {
    const i3 = v.index * 3;
    positions[i3] = v.position.x; positions[i3+1] = v.position.y; positions[i3+2] = v.position.z;
    normals[i3] = v.normal.x; normals[i3+1] = v.normal.y; normals[i3+2] = v.normal.z;
  }
  const F = faces.length;
  const indices = N > 65535 ? new Uint32Array(F * 3) : new Uint16Array(F * 3);
  for (let i = 0; i < F; i++) {
    indices[i*3] = faces[i][0]; indices[i*3+1] = faces[i][1]; indices[i*3+2] = faces[i][2];
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geo.setIndex(new THREE.BufferAttribute(indices, 1));
  return geo;
}

/* ═══════════════════════════════════════════
   CUBE CANVAS
   ═══════════════════════════════════════════ */
class CubeCanvas {
  constructor(scene, radius) {
    this.scene = scene;
    this.radius = radius;
    this.vertices = [];
    this._faces = [];
    this._build();
    _buildNeighborsGeneric(this.vertices, this._faces);
    this._buildVisuals();
    this.shellGeo = _buildShellGeoGeneric(this.vertices, this._faces);
  }

  _build() {
    const size = this.radius * 2;
    const seg = 129;
    const geo = new THREE.BoxGeometry(size, size, size, seg, seg, seg);
    _roundBoxPositions(geo, this.radius, this.radius * 0.15);
    _buildVerticesFromGeo(geo, this.vertices, this._faces);
    geo.dispose();
  }

  _buildVisuals() {
    const size = this.radius * 2;
    // Glass mesh
    const glassGeo = new THREE.BoxGeometry(size, size, size, 64, 64, 64);
    _roundBoxPositions(glassGeo, this.radius, this.radius * 0.15);
    this.jellyMat = _makeJellyMat();
    this.mesh = new THREE.Mesh(glassGeo, this.jellyMat);
    this.mesh.renderOrder = 0;
    this.scene.add(this.mesh);

    // Inner glow
    const gs = this.radius * 0.93;
    const glowGeo = new THREE.BoxGeometry(gs*2, gs*2, gs*2, 32, 32, 32);
    _roundBoxPositions(glowGeo, gs, gs * 0.15);
    this.glowMat = _makeGlowMat();
    this.glowMesh = new THREE.Mesh(glowGeo, this.glowMat);
    this.glowMesh.renderOrder = -1;
    this.scene.add(this.glowMesh);

    // Backface
    const backGeo = glassGeo.clone();
    this.backMesh = new THREE.Mesh(backGeo, _makeBackMat());
    this.backMesh.renderOrder = -2;
    this.scene.add(this.backMesh);
  }

  getNeighbors(v) { return v.neighbors.map(i => this.vertices[i]); }
  getNearestVertex(wp) { let b=null,d=Infinity; for(const v of this.vertices){const dd=v.position.distanceToSquared(wp); if(dd<d){d=dd;b=v;}} return b; }
  raycast(rc) { const h=rc.intersectObject(this.mesh,false); return h.length>0?h[0]:null; }
  releaseVertex(v) { v.reset(); }
  update(dt) { this.jellyMat.uniforms.uTime.value+=dt; this.glowMat.uniforms.uTime.value+=dt; }
  get vertexCount() { return this.vertices.length; }

  dispose() {
    this.scene.remove(this.mesh); this.scene.remove(this.glowMesh); this.scene.remove(this.backMesh);
    this.mesh.geometry.dispose(); this.mesh.material.dispose();
    this.glowMesh.geometry.dispose(); this.glowMesh.material.dispose();
    this.backMesh.geometry.dispose(); this.backMesh.material.dispose();
    if (this.shellGeo) this.shellGeo.dispose();
  }
}

/* ═══════════════════════════════════════════
   PLANE CANVAS
   ═══════════════════════════════════════════ */
class PlaneCanvas {
  constructor(scene, radius) {
    this.scene = scene;
    this.radius = radius;
    this.vertices = [];
    this._faces = [];
    this._build();
    _buildNeighborsGeneric(this.vertices, this._faces);
    this._cutEdgeConnections();
    this._buildVisuals();
    this.shellGeo = _buildShellGeoGeneric(this.vertices, this._faces);
  }

  _build() {
    const w = this.radius * 2.5;
    const d = this.radius * 0.15;
    const segW = 224;
    const segD = 4;
    const geo = new THREE.BoxGeometry(w, d, w, segW, segD, segW);
    _roundSlabPositions(geo, w/2, d/2, w/2, d * 0.4);
    _buildVerticesFromGeo(geo, this.vertices, this._faces);
    geo.dispose();
  }

  _cutEdgeConnections() {
    const THRESHOLD = 0.5;
    // Classify vertices by face group
    for (const v of this.vertices) {
      if (Math.abs(v.normal.y) > THRESHOLD) {
        v._faceGroup = v.normal.y > 0 ? 'top' : 'bottom';
      } else {
        v._faceGroup = 'edge';
      }
    }

    // Assign edge vertices to nearest face
    for (const v of this.vertices) {
      if (v._faceGroup !== 'edge') continue;
      const neighbors = v.neighbors.map(i => this.vertices[i]);
      const topCount = neighbors.filter(n => n._faceGroup === 'top').length;
      const botCount = neighbors.filter(n => n._faceGroup === 'bottom').length;
      v._faceGroup = topCount >= botCount ? 'top' : 'bottom';
    }

    // Sever cross-group connections and mark boundaries
    for (const v of this.vertices) {
      const before = v.neighbors.length;
      v.neighbors = v.neighbors.filter(i => this.vertices[i]._faceGroup === v._faceGroup);
      v._isBoundary = v.neighbors.length < before || v.neighbors.length < 4;
    }
  }

  _buildVisuals() {
    const w = this.radius * 2.5;
    const d = this.radius * 0.15;

    // Glass mesh
    const glassGeo = new THREE.BoxGeometry(w, d, w, 80, 4, 80);
    _roundSlabPositions(glassGeo, w/2, d/2, w/2, d * 0.4);
    this.jellyMat = _makeJellyMat();
    this.mesh = new THREE.Mesh(glassGeo, this.jellyMat);
    this.mesh.renderOrder = 0;
    this.scene.add(this.mesh);

    // Inner glow
    const gs = 0.93;
    const glowGeo = new THREE.BoxGeometry(w*gs, d*gs, w*gs, 32, 3, 32);
    _roundSlabPositions(glowGeo, w*gs/2, d*gs/2, w*gs/2, d*gs * 0.4);
    this.glowMat = _makeGlowMat();
    this.glowMesh = new THREE.Mesh(glowGeo, this.glowMat);
    this.glowMesh.renderOrder = -1;
    this.scene.add(this.glowMesh);

    // Backface
    const backGeo = glassGeo.clone();
    this.backMesh = new THREE.Mesh(backGeo, _makeBackMat());
    this.backMesh.renderOrder = -2;
    this.scene.add(this.backMesh);
  }

  getNeighbors(v) { return v.neighbors.map(i => this.vertices[i]); }
  getNearestVertex(wp) { let b=null,d=Infinity; for(const v of this.vertices){const dd=v.position.distanceToSquared(wp); if(dd<d){d=dd;b=v;}} return b; }
  raycast(rc) { const h=rc.intersectObject(this.mesh,false); return h.length>0?h[0]:null; }
  releaseVertex(v) { v.reset(); }
  update(dt) { this.jellyMat.uniforms.uTime.value+=dt; this.glowMat.uniforms.uTime.value+=dt; }
  get vertexCount() { return this.vertices.length; }

  dispose() {
    this.scene.remove(this.mesh); this.scene.remove(this.glowMesh); this.scene.remove(this.backMesh);
    this.mesh.geometry.dispose(); this.mesh.material.dispose();
    this.glowMesh.geometry.dispose(); this.glowMesh.material.dispose();
    this.backMesh.geometry.dispose(); this.backMesh.material.dispose();
    if (this.shellGeo) this.shellGeo.dispose();
  }
}

/* ═══════════════════════════════════════════
   SEED DEFINITIONS (Phase A)
   ═══════════════════════════════════════════ */
const SEED_DEFS = {
  geometric: {
    id: 'geometric',
    name: 'Geometric',
    genome: {
      speed:            [0.4, 0.6],
      density:          [0.3, 0.5],
      branching:        [0.2, 0.4],
      sprawl:           [0.5, 0.7],
      directionality:   [0.6, 0.8],
      aggression:       [0.4, 0.7],
      resilience:       [0.6, 0.8],
      territoriality:   [0.5, 0.7],
      hue:              [0.0, 0.08],
      saturation:       [0.7, 0.9],
      value:            [0.6, 0.8],
      roughness:        [0.1, 0.3],
      metalness:        [0.7, 0.9],
      emissive:         [0.3, 0.5],
      decayRate:        [0.3, 0.5],
      patternScale:       [0.5, 0.8],
      patternContrast:    [0.5, 0.8],
      patternComplexity:  [0.3, 0.6],
      secondaryHueOffset: [0.02, 0.08],
      patternDetail1:     [0.5, 0.8],
      patternDetail2:     [0.3, 0.6],
      translucency:       [0.0, 0.15],
      warpStrength:       [0.0, 0.2],
    },
    growthStrategy: 'tiling',
    visualStrategy: 'shell',
    visualProfile: 'geometric',
    visual: {
      interiorHeight: 0.35,
      frontierHeight: 0.18,
      spawnHeight: 0.5,
      flashHeight: 0.08,
      smoothing: 0.5,
      pulseSpeed: 0.8,
      pulseDepth: 0.03,
    },
    energy: {
      initial: 50,
      perVertex: 1.5,
      maxEnergy: 200,
      combatCost: 3,
      combatLoss: 5,
      collapseThreshold: 2,
      pressureResist: 0.5,
      cascadeBoost: 0.4,
      entrenchDuration: 1.5,
      weaknessThreshold: 0.3,
    },
  },
  organic: {
    id: 'organic',
    name: 'Organic',
    genome: {
      speed:            [0.3, 0.5],
      density:          [0.15, 0.3],
      branching:        [0.5, 0.8],
      sprawl:           [0.6, 0.9],
      directionality:   [0.3, 0.5],
      aggression:       [0.15, 0.35],
      resilience:       [0.5, 0.7],
      territoriality:   [0.2, 0.4],
      hue:              [0.25, 0.38],
      saturation:       [0.5, 0.75],
      value:            [0.5, 0.7],
      roughness:        [0.6, 0.9],
      metalness:        [0.02, 0.12],
      emissive:         [0.15, 0.35],
      decayRate:        [0.2, 0.4],
      patternScale:       [0.3, 0.7],
      patternContrast:    [0.3, 0.6],
      patternComplexity:  [0.4, 0.8],
      secondaryHueOffset: [0.05, 0.15],
      patternDetail1:     [0.3, 0.7],
      patternDetail2:     [0.4, 0.7],
      translucency:       [0.15, 0.4],
      warpStrength:       [0.2, 0.5],
    },
    growthStrategy: 'branching',
    visualStrategy: 'shell',
    visualProfile: 'organic',
    visual: {
      interiorHeight: 0.18,
      frontierHeight: 0.08,
      spawnHeight: 0.28,
      flashHeight: 0.05,
      smoothing: 0.8,
      pulseSpeed: 0.35,
      pulseDepth: 0.02,
    },
    energy: {
      initial: 40,
      perVertex: 1.2,
      maxEnergy: 160,
      combatCost: 2,
      combatLoss: 4,
      collapseThreshold: 2,
      pressureResist: 0.7,
      cascadeBoost: 0.25,
      entrenchDuration: 2.0,
      weaknessThreshold: 0.25,
    },
  },
  crystalline: {
    id: 'crystalline',
    name: 'Crystalline',
    genome: {
      speed:            [0.25, 0.45],
      density:          [0.6, 0.85],
      branching:        [0.1, 0.3],
      sprawl:           [0.3, 0.5],
      directionality:   [0.3, 0.6],
      aggression:       [0.5, 0.8],
      resilience:       [0.7, 0.9],
      territoriality:   [0.6, 0.8],
      hue:              [0.5, 0.6],
      saturation:       [0.5, 0.8],
      value:            [0.55, 0.8],
      roughness:        [0.05, 0.15],
      metalness:        [0.4, 0.7],
      emissive:         [0.5, 0.75],
      decayRate:        [0.15, 0.3],
      patternScale:       [0.4, 0.7],
      patternContrast:    [0.5, 0.8],
      patternComplexity:  [0.4, 0.7],
      secondaryHueOffset: [0.03, 0.1],
      patternDetail1:     [0.5, 0.8],
      patternDetail2:     [0.4, 0.7],
      translucency:       [0.1, 0.3],
      warpStrength:       [0.05, 0.2],
    },
    growthStrategy: 'faceting',
    visualStrategy: 'shell',
    visualProfile: 'crystalline',
    visual: {
      interiorHeight: 0.45,
      frontierHeight: 0.1,
      spawnHeight: 0.6,
      flashHeight: 0.12,
      smoothing: 0.15,
      pulseSpeed: 1.5,
      pulseDepth: 0.05,
    },
    energy: {
      initial: 35,
      perVertex: 1.8,
      maxEnergy: 180,
      combatCost: 4,
      combatLoss: 3,
      collapseThreshold: 3,
      pressureResist: 0.8,
      cascadeBoost: 0.15,
      entrenchDuration: 2.5,
      weaknessThreshold: 0.2,
    },
  },
  mechanical: {
    id: 'mechanical',
    name: 'Mechanical',
    genome: {
      speed:            [0.35, 0.55],
      density:          [0.5, 0.7],
      branching:        [0.15, 0.35],
      sprawl:           [0.4, 0.6],
      directionality:   [0.7, 0.9],
      aggression:       [0.3, 0.55],
      resilience:       [0.5, 0.7],
      territoriality:   [0.6, 0.8],
      hue:              [0.08, 0.12],
      saturation:       [0.15, 0.35],
      value:            [0.45, 0.65],
      roughness:        [0.2, 0.4],
      metalness:        [0.8, 0.95],
      emissive:         [0.3, 0.55],
      decayRate:        [0.4, 0.6],
      patternScale:       [0.4, 0.7],
      patternContrast:    [0.4, 0.7],
      patternComplexity:  [0.3, 0.6],
      secondaryHueOffset: [0.02, 0.06],
      patternDetail1:     [0.4, 0.7],
      patternDetail2:     [0.3, 0.6],
      translucency:       [0.0, 0.1],
      warpStrength:       [0.05, 0.15],
    },
    growthStrategy: 'concentric',
    visualStrategy: 'shell',
    visualProfile: 'mechanical',
    visual: {
      interiorHeight: 0.28,
      frontierHeight: 0.2,
      spawnHeight: 0.4,
      flashHeight: 0.06,
      smoothing: 0.3,
      pulseSpeed: 2.5,
      pulseDepth: 0.04,
    },
    energy: {
      initial: 55,
      perVertex: 1.3,
      maxEnergy: 220,
      combatCost: 2,
      combatLoss: 4,
      collapseThreshold: 3,
      pressureResist: 0.5,
      cascadeBoost: 0.5,
      entrenchDuration: 1.0,
      weaknessThreshold: 0.35,
    },
  },
  fungal: {
    id: 'fungal',
    name: 'Fungal',
    genome: {
      speed: [0.2, 0.4], density: [0.1, 0.25], branching: [0.7, 0.95],
      sprawl: [0.7, 0.95], directionality: [0.15, 0.35], aggression: [0.1, 0.25],
      resilience: [0.55, 0.75], territoriality: [0.15, 0.3],
      hue: [0.07, 0.15], saturation: [0.18, 0.35], value: [0.35, 0.58],
      roughness: [0.75, 0.98], metalness: [0.0, 0.04], emissive: [0.05, 0.18], decayRate: [0.15, 0.3],
      patternScale: [0.3, 0.6], patternContrast: [0.4, 0.7], patternComplexity: [0.5, 0.9],
      secondaryHueOffset: [0.05, 0.12], patternDetail1: [0.4, 0.8], patternDetail2: [0.3, 0.6],
      translucency: [0.1, 0.3], warpStrength: [0.3, 0.6],
    },
    growthStrategy: 'branching',
    visualStrategy: 'shell',
    visualProfile: 'fungal',
    visual: { interiorHeight: 0.12, frontierHeight: 0.05, spawnHeight: 0.25, flashHeight: 0.04, smoothing: 0.9, pulseSpeed: 0.2, pulseDepth: 0.015 },
    energy: { initial: 35, perVertex: 1.0, maxEnergy: 140, combatCost: 1.5, combatLoss: 3, collapseThreshold: 2, pressureResist: 0.3, cascadeBoost: 0.6, entrenchDuration: 1.0, weaknessThreshold: 0.35 },
  },
  electronic: {
    id: 'electronic',
    name: 'Electronic',
    genome: {
      speed: [0.45, 0.7], density: [0.35, 0.55], branching: [0.15, 0.35],
      sprawl: [0.4, 0.6], directionality: [0.7, 0.95], aggression: [0.35, 0.55],
      resilience: [0.5, 0.7], territoriality: [0.5, 0.7],
      hue: [0.42, 0.52], saturation: [0.6, 0.85], value: [0.45, 0.7],
      roughness: [0.05, 0.2], metalness: [0.5, 0.75], emissive: [0.5, 0.8], decayRate: [0.35, 0.5],
      patternScale: [0.4, 0.7], patternContrast: [0.6, 0.9], patternComplexity: [0.4, 0.7],
      secondaryHueOffset: [0.08, 0.2], patternDetail1: [0.5, 0.8], patternDetail2: [0.4, 0.7],
      translucency: [0.0, 0.1], warpStrength: [0.0, 0.1],
    },
    growthStrategy: 'tiling',
    visualStrategy: 'shell',
    visualProfile: 'electronic',
    visual: { interiorHeight: 0.2, frontierHeight: 0.12, spawnHeight: 0.35, flashHeight: 0.06, smoothing: 0.2, pulseSpeed: 3.0, pulseDepth: 0.04 },
    energy: { initial: 45, perVertex: 1.4, maxEnergy: 190, combatCost: 2.5, combatLoss: 4, collapseThreshold: 2, pressureResist: 0.5, cascadeBoost: 0.5, entrenchDuration: 1.2, weaknessThreshold: 0.3 },
  },
  ethereal: {
    id: 'ethereal',
    name: 'Ethereal',
    genome: {
      speed: [0.3, 0.5], density: [0.1, 0.2], branching: [0.6, 0.9],
      sprawl: [0.8, 1.0], directionality: [0.1, 0.3], aggression: [0.05, 0.2],
      resilience: [0.3, 0.5], territoriality: [0.1, 0.25],
      hue: [0.7, 0.85], saturation: [0.15, 0.35], value: [0.65, 0.85],
      roughness: [0.8, 1.0], metalness: [0.0, 0.05], emissive: [0.3, 0.55], decayRate: [0.1, 0.25],
      patternScale: [0.2, 0.5], patternContrast: [0.2, 0.4], patternComplexity: [0.3, 0.6],
      secondaryHueOffset: [0.05, 0.15], patternDetail1: [0.3, 0.6], patternDetail2: [0.3, 0.6],
      translucency: [0.3, 0.6], warpStrength: [0.4, 0.7],
    },
    growthStrategy: 'branching',
    visualStrategy: 'shell',
    visualProfile: 'ethereal',
    visual: { interiorHeight: 0.1, frontierHeight: 0.04, spawnHeight: 0.18, flashHeight: 0.03, smoothing: 0.95, pulseSpeed: 0.15, pulseDepth: 0.025 },
    energy: { initial: 30, perVertex: 0.8, maxEnergy: 120, combatCost: 1, combatLoss: 2, collapseThreshold: 2, pressureResist: 0.2, cascadeBoost: 0.3, entrenchDuration: 0.8, weaknessThreshold: 0.4 },
  },
  coral: {
    id: 'coral',
    name: 'Coral',
    genome: {
      speed: [0.2, 0.35], density: [0.4, 0.6], branching: [0.5, 0.7],
      sprawl: [0.5, 0.7], directionality: [0.4, 0.6], aggression: [0.3, 0.5],
      resilience: [0.7, 0.9], territoriality: [0.4, 0.6],
      hue: [0.07, 0.11], saturation: [0.03, 0.10], value: [0.58, 0.74],
      roughness: [0.85, 0.98], metalness: [0.0, 0.04], emissive: [0.01, 0.06], decayRate: [0.1, 0.2],
      patternScale: [0.3, 0.6], patternContrast: [0.3, 0.6], patternComplexity: [0.4, 0.7],
      secondaryHueOffset: [0.03, 0.1], patternDetail1: [0.4, 0.7], patternDetail2: [0.3, 0.7],
      translucency: [0.02, 0.10], warpStrength: [0.15, 0.35],
    },
    growthStrategy: 'branching',
    visualStrategy: 'shell',
    visualProfile: 'coral',
    visual: { interiorHeight: 0.10, frontierHeight: 0.04, spawnHeight: 0.16, flashHeight: 0.03, smoothing: 0.92, pulseSpeed: 0.25, pulseDepth: 0.008 },
    energy: { initial: 40, perVertex: 1.3, maxEnergy: 170, combatCost: 2, combatLoss: 4, collapseThreshold: 3, pressureResist: 0.7, cascadeBoost: 0.25, entrenchDuration: 2.0, weaknessThreshold: 0.25 },
  },
  neural: {
    id: 'neural',
    name: 'Neural',
    genome: {
      speed: [0.5, 0.75], density: [0.1, 0.25], branching: [0.6, 0.85],
      sprawl: [0.6, 0.85], directionality: [0.3, 0.5], aggression: [0.25, 0.45],
      resilience: [0.4, 0.6], territoriality: [0.3, 0.5],
      hue: [0.55, 0.65], saturation: [0.5, 0.75], value: [0.5, 0.7],
      roughness: [0.3, 0.5], metalness: [0.2, 0.4], emissive: [0.45, 0.7], decayRate: [0.3, 0.5],
      patternScale: [0.3, 0.6], patternContrast: [0.5, 0.8], patternComplexity: [0.5, 0.8],
      secondaryHueOffset: [0.05, 0.15], patternDetail1: [0.4, 0.7], patternDetail2: [0.4, 0.7],
      translucency: [0.05, 0.2], warpStrength: [0.15, 0.3],
    },
    growthStrategy: 'branching',
    visualStrategy: 'shell',
    visualProfile: 'neural',
    visual: { interiorHeight: 0.15, frontierHeight: 0.08, spawnHeight: 0.3, flashHeight: 0.07, smoothing: 0.7, pulseSpeed: 1.8, pulseDepth: 0.04 },
    energy: { initial: 40, perVertex: 1.2, maxEnergy: 160, combatCost: 2.5, combatLoss: 4, collapseThreshold: 2, pressureResist: 0.4, cascadeBoost: 0.55, entrenchDuration: 1.0, weaknessThreshold: 0.35 },
  },
  void_: {
    id: 'void_',
    name: 'Void',
    genome: {
      speed: [0.3, 0.5], density: [0.5, 0.75], branching: [0.2, 0.4],
      sprawl: [0.5, 0.7], directionality: [0.4, 0.6], aggression: [0.7, 0.95],
      resilience: [0.6, 0.8], territoriality: [0.7, 0.9],
      hue: [0.7, 0.78], saturation: [0.1, 0.25], value: [0.15, 0.3],
      roughness: [0.8, 1.0], metalness: [0.0, 0.05], emissive: [0.05, 0.15], decayRate: [0.2, 0.35],
      patternScale: [0.3, 0.6], patternContrast: [0.3, 0.6], patternComplexity: [0.4, 0.7],
      secondaryHueOffset: [0.02, 0.06], patternDetail1: [0.4, 0.7], patternDetail2: [0.3, 0.6],
      translucency: [0.0, 0.05], warpStrength: [0.2, 0.45],
    },
    growthStrategy: 'tiling',
    visualStrategy: 'shell',
    visualProfile: 'void_',
    visual: { interiorHeight: 0.08, frontierHeight: 0.15, spawnHeight: 0.12, flashHeight: 0.04, smoothing: 0.4, pulseSpeed: 0.5, pulseDepth: 0.01 },
    energy: { initial: 55, perVertex: 1.6, maxEnergy: 220, combatCost: 2, combatLoss: 3, collapseThreshold: 3, pressureResist: 0.7, cascadeBoost: 0.3, entrenchDuration: 2.0, weaknessThreshold: 0.2 },
  },
  alien: {
    id: 'alien',
    name: 'Alien',
    genome: {
      speed: [0.25, 0.65], density: [0.2, 0.7], branching: [0.2, 0.8],
      sprawl: [0.3, 0.8], directionality: [0.2, 0.7], aggression: [0.3, 0.6],
      resilience: [0.5, 0.7], territoriality: [0.3, 0.6],
      hue: [0.25, 0.45], saturation: [0.6, 0.9], value: [0.4, 0.7],
      roughness: [0.2, 0.6], metalness: [0.2, 0.5], emissive: [0.3, 0.6], decayRate: [0.2, 0.4],
      patternScale: [0.2, 0.8], patternContrast: [0.4, 0.8], patternComplexity: [0.5, 0.9],
      secondaryHueOffset: [0.1, 0.25], patternDetail1: [0.3, 0.8], patternDetail2: [0.3, 0.8],
      translucency: [0.05, 0.25], warpStrength: [0.3, 0.6],
    },
    growthStrategy: 'tiling',
    visualStrategy: 'shell',
    visualProfile: 'alien',
    visual: { interiorHeight: 0.22, frontierHeight: 0.12, spawnHeight: 0.35, flashHeight: 0.06, smoothing: 0.5, pulseSpeed: 1.2, pulseDepth: 0.035 },
    energy: { initial: 45, perVertex: 1.4, maxEnergy: 180, combatCost: 2.5, combatLoss: 4, collapseThreshold: 2, pressureResist: 0.5, cascadeBoost: 0.4, entrenchDuration: 1.5, weaknessThreshold: 0.3 },
  },
  temporal: {
    id: 'temporal',
    name: 'Temporal',
    genome: {
      speed: [0.35, 0.55], density: [0.3, 0.5], branching: [0.3, 0.5],
      sprawl: [0.4, 0.7], directionality: [0.3, 0.5], aggression: [0.2, 0.4],
      resilience: [0.5, 0.7], territoriality: [0.3, 0.5],
      hue: [0.1, 0.18], saturation: [0.4, 0.65], value: [0.5, 0.7],
      roughness: [0.3, 0.5], metalness: [0.15, 0.35], emissive: [0.25, 0.45], decayRate: [0.2, 0.35],
      patternScale: [0.3, 0.6], patternContrast: [0.3, 0.6], patternComplexity: [0.4, 0.7],
      secondaryHueOffset: [0.05, 0.12], patternDetail1: [0.4, 0.7], patternDetail2: [0.3, 0.6],
      translucency: [0.15, 0.35], warpStrength: [0.2, 0.4],
    },
    growthStrategy: 'concentric',
    visualStrategy: 'shell',
    visualProfile: 'temporal',
    visual: { interiorHeight: 0.18, frontierHeight: 0.1, spawnHeight: 0.3, flashHeight: 0.05, smoothing: 0.6, pulseSpeed: 0.6, pulseDepth: 0.03 },
    energy: { initial: 45, perVertex: 1.3, maxEnergy: 170, combatCost: 2, combatLoss: 4, collapseThreshold: 2, pressureResist: 0.5, cascadeBoost: 0.4, entrenchDuration: 1.5, weaknessThreshold: 0.3 },
  },
};

/* ═══════════════════════════════════════════
   GENOME
   ═══════════════════════════════════════════ */
const R = (a, b) => a + Math.random() * (b - a);

function rollGenome(ranges) {
  const g = {};
  for (const [key, [lo, hi]] of Object.entries(ranges)) {
    g[key] = R(lo, hi);
  }
  return g;
}

/* ═══════════════════════════════════════════
   GROWTH STRATEGIES (Phase C)
   ═══════════════════════════════════════════ */
const _up = new THREE.Vector3(0, 1, 0);

const GrowthStrategies = {
  tiling: {
    filterCandidates(organism, frontierVertex) {
      return organism.canvas.getNeighbors(frontierVertex).filter(n => {
        if (n.isBarrier) return false;
        if (n.owner === organism && n.claimStrength >= 1) return false;
        if (n.owner && n.owner !== organism) return false; // growth never targets enemy vertices
        return true;
      });
    },

    pickTarget(organism, frontierVertex, candidates) {
      const genome = organism.genome;
      const scored = candidates.map(v => {
        let s = 0;
        const vd = Math.abs(v.normal.dot(_up));
        s += genome.sprawl > 0.5 ? (1 - vd) * 3 : vd * 3;
        if (genome.directionality > 0.5 && organism.claimed.size > 3) {
          const d1 = v.position.clone().sub(organism.spawnVertex.position).normalize();
          const d2 = v.position.clone().sub(frontierVertex.position).normalize();
          s += d2.dot(d1) * genome.directionality * 2;
        }
        const neighbors = organism.canvas.getNeighbors(v);
        const nc = neighbors.filter(n => n.owner === organism).length;
        const ld = nc / neighbors.length;
        s += genome.density < 0.5 ? -ld * 4 : ld * 2;
        if (!v.owner) s += 3;
        s += (Math.random() - 0.5) * 2;
        return { v, s };
      });
      scored.sort((a, b) => b.s - a.s);
      return scored[0].v;
    },
  },

  branching: {
    filterCandidates(organism, frontierVertex) {
      return organism.canvas.getNeighbors(frontierVertex).filter(n => {
        if (n.isBarrier) return false;
        if (n.owner === organism) return false;
        if (n.owner && n.owner !== organism) return false; // growth never targets enemy vertices
        return true;
      });
    },

    pickTarget(organism, frontierVertex, candidates) {
      const genome = organism.genome;
      // How many owned neighbors does the frontier vertex have? (is it a thin tip?)
      const fvOwned = organism.canvas.getNeighbors(frontierVertex)
        .filter(n => n.owner === organism).length;
      const isTip = fvOwned <= 2;

      const scored = candidates.map(v => {
        let s = 0;
        const neighbors = organism.canvas.getNeighbors(v);
        const nc = neighbors.filter(n => n.owner === organism).length;
        const totalN = neighbors.length;
        const ld = nc / totalN;

        // Strongly prefer low-density targets (extend tendrils, don't fill)
        s -= ld * 6;

        // Prefer unclaimed
        if (!v.owner) s += 4;

        // Sprawl preference
        const vd = Math.abs(v.normal.dot(_up));
        s += genome.sprawl > 0.5 ? (1 - vd) * 2 : vd * 2;

        // Outward momentum from spawn
        if (organism.claimed.size > 2) {
          const outward = v.position.clone().sub(organism.spawnVertex.position).normalize();
          const step = v.position.clone().sub(frontierVertex.position).normalize();
          s += step.dot(outward) * 3;
        }

        // Tips get bonus for continuing straight (less branching)
        if (isTip && organism.claimed.size > 4) {
          s += 2;
        }

        // Random branching chance
        s += (Math.random() - 0.5) * 3 * genome.branching;

        return { v, s };
      });
      scored.sort((a, b) => b.s - a.s);
      return scored[0].v;
    },
  },

  faceting: {
    filterCandidates(organism, frontierVertex) {
      return organism.canvas.getNeighbors(frontierVertex).filter(n => {
        if (n.isBarrier) return false;
        if (n.owner === organism) return false;
        if (n.owner && n.owner !== organism) return false;
        return true;
      });
    },

    pickTarget(organism, frontierVertex, candidates) {
      const genome = organism.genome;
      const scored = candidates.map(v => {
        let s = 0;
        const neighbors = organism.canvas.getNeighbors(v);
        const nc = neighbors.filter(n => n.owner === organism).length;
        const totalN = neighbors.length;
        const ld = nc / totalN;

        // STRONGLY prefer filling gaps (high local density = good)
        s += ld * 8;

        if (!v.owner) s += 2;

        // Occasional nucleation: random chance to prefer DISTANT vertices
        if (Math.random() < 0.05 * (1 - genome.density)) {
          s += (1 - ld) * 10;
        }

        if (organism.claimed.size > 5) {
          const outward = v.position.clone().sub(organism.spawnVertex.position).normalize();
          const step = v.position.clone().sub(frontierVertex.position).normalize();
          s += step.dot(outward) * genome.directionality;
        }

        s += (Math.random() - 0.5) * 1.5;
        return { v, s };
      });
      scored.sort((a, b) => b.s - a.s);
      return scored[0].v;
    },
  },

  concentric: {
    filterCandidates(organism, frontierVertex) {
      return organism.canvas.getNeighbors(frontierVertex).filter(n => {
        if (n.isBarrier) return false;
        if (n.owner === organism) return false;
        if (n.owner && n.owner !== organism) return false;
        return true;
      });
    },

    pickTarget(organism, frontierVertex, candidates) {
      const genome = organism.genome;
      const spawnPos = organism.spawnVertex.position;
      const fvDist = frontierVertex.position.distanceTo(spawnPos);

      const scored = candidates.map(v => {
        let s = 0;
        const neighbors = organism.canvas.getNeighbors(v);
        const nc = neighbors.filter(n => n.owner === organism).length;
        const ld = nc / neighbors.length;
        const vDist = v.position.distanceTo(spawnPos);

        // STRONGLY prefer vertices at similar distance from spawn (same ring)
        const ringDiff = Math.abs(vDist - fvDist);
        s -= ringDiff * 15;

        // Prefer filling the current ring
        s += ld * 4;

        // Slight outward bias when current ring is full
        if (ld > 0.6) {
          s += (vDist - fvDist) * 3;
        }

        if (!v.owner) s += 2;
        s += (Math.random() - 0.5) * 1.5;
        return { v, s };
      });
      scored.sort((a, b) => b.s - a.s);
      return scored[0].v;
    },
  },
};

/* ═══════════════════════════════════════════
   VISUAL PROFILES (Per-seed visual identity)
   ═══════════════════════════════════════════ */
const VisualProfiles = {
  geometric: {
    height(ctx) {
      const { isSpawn, isFrontier, ownedRatio, v, config, distFromSpawn } = ctx;
      if (isSpawn) return config.spawnHeight;
      if (isFrontier) {
        return config.frontierHeight * (ownedRatio > 0.5 ? 1.0 : 0.2);
      }
      const plateau = config.interiorHeight;
      const band = Math.floor(distFromSpawn * 4) % 3;
      const step = [1.0, 0.92, 0.85][band];
      return plateau * step * (0.95 + v.rng * 0.1);
    },
    color(ctx) {
      const { v, isFrontier } = ctx;
      return {
        hShift: v.hueShift * 0.5,
        sMult: 0.9 + v.rng * 0.2,
        lShift: v.lightnessShift * 0.2 + (isFrontier ? 0.03 : 0),
      };
    },
  },

  organic: {
    height(ctx) {
      const { isSpawn, isFrontier, ownedRatio, v, config, distFromSpawn, time } = ctx;
      if (isSpawn) return config.spawnHeight;
      if (isFrontier) {
        return config.frontierHeight * (0.3 + ownedRatio * 0.7);
      }
      const wave1 = Math.sin(distFromSpawn * 3.5 + v.rng * 6.28) * 0.4;
      const wave2 = Math.cos(v.position.x * 2 + v.position.z * 3) * 0.3;
      const breathe = Math.sin(time * 0.5 + distFromSpawn) * 0.08;
      const base = config.interiorHeight * (0.6 + (wave1 + wave2 + 1) * 0.25);
      return base + breathe;
    },
    color(ctx) {
      const { v, distFromSpawn, isFrontier } = ctx;
      const depthShift = Math.min(distFromSpawn * 0.02, 0.06);
      return {
        hShift: v.hueShift + depthShift,
        sMult: 0.85 + v.rng * 0.3,
        lShift: v.lightnessShift * 0.5 + (isFrontier ? 0.06 : 0),
      };
    },
  },

  crystalline: {
    height(ctx) {
      const { isSpawn, isFrontier, ownedRatio, v, config, distFromSpawn } = ctx;
      if (isSpawn) return config.spawnHeight;
      if (isFrontier) {
        return ownedRatio > 0.7 ? config.frontierHeight * 1.5 : config.frontierHeight * 0.15;
      }
      const terraceCount = 5;
      const terrace = Math.floor(distFromSpawn * terraceCount * 1.5) % terraceCount;
      const terraceHeight = [1.0, 0.7, 0.85, 0.55, 0.95][terrace];
      return config.interiorHeight * terraceHeight * (0.97 + v.rng * 0.06);
    },
    color(ctx) {
      const { v, isFrontier } = ctx;
      const facetHue = Math.floor(v.rng * 4) * 0.025;
      return {
        hShift: facetHue - 0.035,
        sMult: 0.85 + (Math.floor(v.rng * 3) * 0.1),
        lShift: v.lightnessShift * 0.15 + (isFrontier ? 0.08 : 0),
      };
    },
    alpha(ctx) {
      const { isFrontier, ownedRatio, v } = ctx;
      if (isFrontier && ownedRatio < 0.4) {
        return 0.5 + v.rng * 0.3;
      }
      return 1.0;
    },
  },

  mechanical: {
    height(ctx) {
      const { isSpawn, isFrontier, ownedRatio, v, config, distFromSpawn, time } = ctx;
      if (isSpawn) return config.spawnHeight;
      if (isFrontier) {
        return config.frontierHeight * (0.4 + ownedRatio * 0.6);
      }
      const ringWidth = 0.25;
      const ringPhase = (distFromSpawn / ringWidth) * Math.PI;
      const ringWave = Math.cos(ringPhase);
      const ridgeH = config.interiorHeight * 1.1;
      const troughH = config.interiorHeight * 0.45;
      const h = ringWave > 0
        ? troughH + (ridgeH - troughH) * ringWave
        : troughH + (troughH - troughH * 0.7) * (-ringWave);
      const pulse = Math.sin(time + ringPhase * 0.5) * 0.02;
      return h + pulse;
    },
    color(ctx) {
      const { v, distFromSpawn } = ctx;
      const ringWidth = 0.25;
      const ringPhase = (distFromSpawn / ringWidth) * Math.PI;
      const ringWave = Math.cos(ringPhase);
      const isTrough = ringWave < -0.2;
      if (isTrough) {
        return { hShift: 0.0, sMult: 1.8, lShift: 0.15 };
      }
      return {
        hShift: v.hueShift * 0.3,
        sMult: 0.4,
        lShift: v.lightnessShift * 0.15 + (ringWave > 0.2 ? 0.05 : 0),
      };
    },
  },

  fungal: {
    height(ctx) {
      const { isSpawn, isFrontier, ownedRatio, v, config, distFromSpawn, time } = ctx;
      if (isSpawn) return config.spawnHeight;

      // Frontier: keep it low and soft so it reads like a living substrate, not spikes.
      if (isFrontier) return config.frontierHeight * (0.25 + ownedRatio * 0.45);

      // Interior: rolling hills (low-frequency variation) instead of binary "bloom spikes".
      const a = Math.sin(distFromSpawn * 2.1 + v.rng * 6.28) * 0.5 + 0.5;
      const b = Math.cos(v.position.x * 1.2 + v.position.z * 1.45 + v.rng * 3.1) * 0.5 + 0.5;
      const c = Math.sin(v.position.y * 1.4 + distFromSpawn * 0.9) * 0.5 + 0.5;

      const hills = (0.70 + 0.55 * a + 0.25 * b + 0.18 * c);
      const breathe = Math.sin(time * 0.22 + v.rng * 6.28) * 0.006;

      return config.interiorHeight * hills * (0.92 + v.rng * 0.16) + breathe;
    },
    color(ctx) {
      const { v, distFromSpawn, isFrontier } = ctx;
      const isSpore = Math.sin(v.rng * 31.4 + distFromSpawn * 5) > 0.7;
      return {
        hShift: v.hueShift * 0.3 + (isSpore ? 0.05 : 0),
        sMult: isSpore ? 1.3 : 0.7,
        lShift: v.lightnessShift * 0.3 + (isSpore ? 0.12 : 0) + (isFrontier ? 0.04 : 0),
      };
    },
  },

  electronic: {
    height(ctx) {
      const { isSpawn, isFrontier, ownedRatio, v, config, distFromSpawn, time } = ctx;
      if (isSpawn) return config.spawnHeight;
      if (isFrontier) return config.frontierHeight * (0.5 + ownedRatio * 0.5);
      const isNode = v.rng > 0.85;
      const pulse = Math.sin(time * 3.0 + distFromSpawn * 4) * 0.02;
      return config.interiorHeight * (isNode ? 1.4 : 0.7) + (isNode ? pulse : 0);
    },
    color(ctx) {
      const { v, distFromSpawn, time } = ctx;
      const isNode = v.rng > 0.85;
      const pulse = (Math.sin(time * 3 + distFromSpawn * 4) * 0.5 + 0.5);
      return {
        hShift: v.hueShift * 0.2,
        sMult: isNode ? 1.5 : 0.6,
        lShift: (isNode ? 0.15 * pulse : v.lightnessShift * 0.1),
      };
    },
  },

  ethereal: {
    height(ctx) {
      const { isSpawn, isFrontier, ownedRatio, v, config, distFromSpawn, time } = ctx;
      if (isSpawn) return config.spawnHeight;
      if (isFrontier) return config.frontierHeight * 0.3;
      const wave = Math.sin(distFromSpawn * 2 + time * 0.2 + v.rng * 6.28) * 0.5 + 0.5;
      return config.interiorHeight * wave * (0.8 + v.rng * 0.4);
    },
    color(ctx) {
      const { v, distFromSpawn, time } = ctx;
      const shimmer = Math.sin(time * 0.3 + v.rng * 12) * 0.04;
      return {
        hShift: v.hueShift + shimmer,
        sMult: 0.5 + v.rng * 0.3,
        lShift: v.lightnessShift * 0.4 + Math.sin(distFromSpawn * 3 + time * 0.2) * 0.05,
      };
    },
    alpha(ctx) {
      const { distFromSpawn, v, time } = ctx;
      const phase = Math.sin(time * 0.4 + distFromSpawn * 1.5 + v.rng * 6.28) * 0.3 + 0.7;
      return Math.max(0.3, phase);
    },
  },

  coral: {
    height(ctx) {
      const { isSpawn, isFrontier, ownedRatio, v, config, distFromSpawn } = ctx;
      if (isSpawn) return config.spawnHeight;
      if (isFrontier) return config.frontierHeight * (0.4 + ownedRatio * 0.6);
      // Smooth porous reef rock: gentle rolling undulations, not spiky
      const roll = Math.sin(distFromSpawn * 1.8 + v.rng * 6.28) * 0.5 + 0.5;
      const undulation = Math.cos(v.position.x * 0.9 + v.position.z * 1.1 + v.rng * 3.0) * 0.5 + 0.5;
      const terrain = 0.80 + 0.20 * roll + 0.10 * undulation;
      return config.interiorHeight * terrain * (0.96 + v.rng * 0.08);
    },
    color(ctx) {
      const { v, distFromSpawn, isFrontier } = ctx;
      // Grey porous reef rock: minimal color variation
      const rockVar = Math.sin(v.rng * 47 + distFromSpawn * 3.5) > 0.2;
      return {
        hShift: v.hueShift * 0.10 + (rockVar ? 0.005 : -0.005),
        sMult: rockVar ? 0.60 : 0.35,
        lShift: v.lightnessShift * 0.08 + (isFrontier ? 0.03 : -0.01),
      };
    },
  },

  neural: {
    height(ctx) {
      const { isSpawn, isFrontier, ownedRatio, v, config, distFromSpawn, time } = ctx;
      if (isSpawn) return config.spawnHeight;
      if (isFrontier) return config.frontierHeight * (0.3 + ownedRatio * 0.5);
      const synapseFlash = Math.sin(time * 1.8 + v.rng * 62.8) > 0.85 ? 1.8 : 0.6;
      return config.interiorHeight * synapseFlash * (0.9 + v.rng * 0.2);
    },
    color(ctx) {
      const { v, time, isFrontier } = ctx;
      const firing = Math.sin(time * 1.8 + v.rng * 62.8) > 0.85;
      return {
        hShift: v.hueShift * 0.3,
        sMult: firing ? 1.4 : 0.6,
        lShift: (firing ? 0.2 : v.lightnessShift * 0.2) + (isFrontier ? 0.06 : 0),
      };
    },
  },

  void_: {
    height(ctx) {
      const { isSpawn, isFrontier, ownedRatio, v, config, distFromSpawn } = ctx;
      if (isSpawn) return config.spawnHeight;
      if (isFrontier) return config.frontierHeight * (0.6 + ownedRatio * 0.4);
      const depth = 1.0 - distFromSpawn * 0.3;
      return config.interiorHeight * Math.max(0.3, depth) * (0.95 + v.rng * 0.1);
    },
    color(ctx) {
      const { v, distFromSpawn } = ctx;
      return {
        hShift: v.hueShift * 0.15,
        sMult: 0.3 + distFromSpawn * 0.3,
        lShift: -distFromSpawn * 0.08 + v.lightnessShift * 0.1,
      };
    },
  },

  alien: {
    height(ctx) {
      const { isSpawn, isFrontier, ownedRatio, v, config, distFromSpawn, time } = ctx;
      if (isSpawn) return config.spawnHeight;
      if (isFrontier) return config.frontierHeight * (0.3 + ownedRatio * 0.7);
      const w1 = Math.sin(v.position.x * 5 + v.position.y * 3 + time * 0.4);
      const w2 = Math.cos(distFromSpawn * 7 + v.rng * 12);
      const w3 = Math.sin(v.position.z * 4 + time * 0.2);
      const chaos = (w1 + w2 + w3) / 3;
      return config.interiorHeight * (0.5 + chaos * 0.5) * (0.85 + v.rng * 0.3);
    },
    color(ctx) {
      const { v, time, distFromSpawn } = ctx;
      const drift = Math.sin(time * 0.15 + v.rng * 6.28) * 0.06;
      return {
        hShift: v.hueShift + drift,
        sMult: 0.8 + Math.sin(distFromSpawn * 3) * 0.3,
        lShift: v.lightnessShift * 0.3 + Math.sin(time * 0.2 + v.rng * 12) * 0.04,
      };
    },
  },

  temporal: {
    height(ctx) {
      const { isSpawn, isFrontier, ownedRatio, v, config, distFromSpawn, time } = ctx;
      if (isSpawn) return config.spawnHeight;
      if (isFrontier) return config.frontierHeight * (0.3 + ownedRatio * 0.5);
      const present = config.interiorHeight * (0.8 + v.rng * 0.4);
      const echo = config.interiorHeight * 0.4 * Math.sin(distFromSpawn * 3 + time * -0.3);
      const phase = Math.sin(time * 0.6 + distFromSpawn * 2) * 0.5 + 0.5;
      return present * phase + echo * (1 - phase);
    },
    color(ctx) {
      const { v, time, distFromSpawn } = ctx;
      const split = Math.sin(time * 0.5 + distFromSpawn * 1.5) * 0.04;
      return {
        hShift: v.hueShift + split,
        sMult: 0.7 + Math.sin(time * 0.3 + v.rng * 6.28) * 0.2,
        lShift: v.lightnessShift * 0.3,
      };
    },
    alpha(ctx) {
      const { distFromSpawn, v, time } = ctx;
      const flicker = Math.sin(time * 0.8 + distFromSpawn * 3 + v.rng * 12.56) * 0.2 + 0.8;
      return Math.max(0.4, flicker);
    },
  },
};

/* ═══════════════════════════════════════════
   HYBRIDIZATION FUNCTIONS
   ═══════════════════════════════════════════ */
function createHybridGenome(gA, gB, typeA, typeB) {
  const hybrid = {};
  for (const key of Object.keys(gA)) {
    const a = gA[key], b = gB[key];
    const roll = Math.random();
    if (roll < 0.3) {
      hybrid[key] = Math.max(a, b);
    } else if (roll < 0.5) {
      hybrid[key] = Math.min(a, b);
    } else if (roll < 0.75) {
      const lo = Math.min(a, b);
      const range = Math.max(a, b) - lo + 0.15;
      hybrid[key] = lo - 0.05 + Math.random() * range;
    } else {
      hybrid[key] = Math.random();
    }
    if (key === 'hue') {
      hybrid[key] = ((hybrid[key] % 1) + 1) % 1;
    } else {
      hybrid[key] = Math.max(0.01, Math.min(0.99, hybrid[key]));
    }
  }
  return hybrid;
}

function createHybridVisualProfile(typeA, typeB) {
  const pA = VisualProfiles[typeA] || VisualProfiles.geometric;
  const pB = VisualProfiles[typeB] || VisualProfiles.geometric;

  const heightInterference = 0.5 + Math.random() * 1.5;
  const heightBlendBias = Math.random();
  const colorSplitAxis = Math.random();
  const alphaLaceDensity = 2 + Math.random() * 6;
  const hasAlphaLace = Math.random() < 0.4;
  const waveFreq = 1 + Math.random() * 4;
  const spiralFactor = (Math.random() - 0.5) * 3;

  return {
    height(ctx) {
      const hA = pA.height(ctx);
      const hB = pB.height(ctx);
      const { distFromSpawn, v, time } = ctx;
      const angle = Math.atan2(v.position.z, v.position.x);
      const spiral = angle + distFromSpawn * spiralFactor;
      const interference = Math.sin(spiral * heightInterference + time * 0.3) * 0.5 + 0.5;
      const blend = interference * heightBlendBias + (1 - interference) * (1 - heightBlendBias);
      let h = hA * blend + hB * (1 - blend);
      const mutation = Math.sin(distFromSpawn * waveFreq + v.rng * 6.28) * ctx.config.interiorHeight * 0.2;
      h += mutation;
      return Math.max(0.02, h);
    },
    color(ctx) {
      const cA = pA.color(ctx);
      const cB = pB.color(ctx);
      const { distFromSpawn, v } = ctx;
      const angle = Math.atan2(v.position.z, v.position.x);
      const splitValue = colorSplitAxis < 0.33
        ? Math.sin(angle * 2 + distFromSpawn) * 0.5 + 0.5
        : colorSplitAxis < 0.66
          ? (distFromSpawn % 0.5) / 0.5
          : v.rng;
      const t = splitValue;
      return {
        hShift: cA.hShift * t + cB.hShift * (1 - t) + Math.sin(angle * 3) * 0.03,
        sMult: cA.sMult * t + cB.sMult * (1 - t),
        lShift: cA.lShift * t + cB.lShift * (1 - t),
      };
    },
    alpha(ctx) {
      if (!hasAlphaLace) {
        if (pA.alpha) return pA.alpha(ctx);
        if (pB.alpha) return pB.alpha(ctx);
        return 1.0;
      }
      const { distFromSpawn, v } = ctx;
      const angle = Math.atan2(v.position.z, v.position.x);
      const lace = Math.sin(angle * alphaLaceDensity + distFromSpawn * 8) *
                   Math.cos(distFromSpawn * alphaLaceDensity);
      return lace > 0.3 ? 1.0 : 0.4 + lace;
    },
  };
}

function createHybridDef(defA, defB, typeA, typeB) {
  const eA = defA.energy, eB = defB.energy;
  const avgE = (field) => Math.round(((eA[field] || 0) + (eB[field] || 0)) / 2);
  const growthStrategy = Math.random() < 0.5 ? defA.growthStrategy : defB.growthStrategy;
  const vA = defA.visual, vB = defB.visual;
  const blendV = (field) => {
    const avg = (vA[field] + vB[field]) / 2;
    return avg * (0.8 + Math.random() * 0.4);
  };
  const profileKey = 'hybrid_' + typeA + '_' + typeB + '_' + Date.now();
  VisualProfiles[profileKey] = createHybridVisualProfile(typeA, typeB);
  const patternTypeValue = 100.0 + Math.floor(Math.random() * 6) + Math.random() * 0.99;
  return {
    id: profileKey,
    name: `${defA.name}×${defB.name}`,
    genome: {},
    growthStrategy,
    visualStrategy: 'shell',
    visualProfile: profileKey,
    patternTypeValue,
    visual: {
      interiorHeight: blendV('interiorHeight'),
      frontierHeight: blendV('frontierHeight'),
      spawnHeight: blendV('spawnHeight'),
      flashHeight: blendV('flashHeight'),
      smoothing: blendV('smoothing'),
      pulseSpeed: blendV('pulseSpeed') * (0.7 + Math.random() * 0.6),
      pulseDepth: blendV('pulseDepth'),
    },
    energy: {
      initial: avgE('initial') + 15,
      perVertex: (eA.perVertex + eB.perVertex) / 2,
      maxEnergy: avgE('maxEnergy') + 20,
      combatCost: avgE('combatCost'),
      combatLoss: avgE('combatLoss'),
      collapseThreshold: Math.max(eA.collapseThreshold, eB.collapseThreshold),
      pressureResist: ((eA.pressureResist||0.5) + (eB.pressureResist||0.5)) / 2,
      cascadeBoost: ((eA.cascadeBoost||0.4) + (eB.cascadeBoost||0.4)) / 2,
      entrenchDuration: ((eA.entrenchDuration||1.5) + (eB.entrenchDuration||1.5)) / 2,
      weaknessThreshold: ((eA.weaknessThreshold||0.3) + (eB.weaknessThreshold||0.3)) / 2,
    },
  };
}

/* ═══════════════════════════════════════════
   VISUAL STRATEGIES — Shell Displacement
   ═══════════════════════════════════════════ */

const SHELL_VERT = `
  attribute float aHeight;
  attribute vec3 aColor;
  attribute float aAlpha;

  varying vec3 vColor;
  varying float vAlpha;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 displacedPos = position + normal * aHeight;
    vColor = aColor;
    vAlpha = aAlpha;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(displacedPos, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const SHELL_FRAG = `
  varying vec3 vColor;
  varying float vAlpha;
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  uniform vec3 uLightDir1;
  uniform vec3 uLightDir2;
  uniform float uTime;
  uniform float uMetalness;
  uniform float uRoughness;
  uniform float uEmissive;

  void main() {
    if (vAlpha < 0.01) discard;

    vec3 N = normalize(vNormal);

    // Two-light diffuse
    float diff1 = max(dot(N, uLightDir1), 0.0) * 0.7;
    float diff2 = max(dot(N, uLightDir2), 0.0) * 0.35;
    float ambient = 0.25;

    // Specular (Blinn-Phong)
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vec3 halfDir = normalize(uLightDir1 + viewDir);
    float shininess = mix(8.0, 120.0, 1.0 - uRoughness);
    float spec = pow(max(dot(N, halfDir), 0.0), shininess) * uMetalness * 0.6;

    // Fresnel rim
    float fresnel = pow(1.0 - max(dot(N, viewDir), 0.0), 3.0) * 0.15;

    // Emissive glow
    vec3 emissive = vColor * uEmissive * 0.3;

    vec3 color = vColor * (ambient + diff1 + diff2) + vec3(1.0) * spec + emissive + vec3(1.0) * fresnel;
    gl_FragColor = vec4(color, vAlpha);
  }
`;

/* ═══════════════════════════════════════════
   ORGANISM SHADERS (Phase 6 — Procedural Patterns)
   ═══════════════════════════════════════════ */

const ORGANISM_VERT = `
  attribute float aHeight;
  attribute vec3  aColor;
  attribute float aAlpha;
  attribute float aDistFromSpawn;
  attribute float aRng;
  attribute vec2  aVertexData;

  varying vec3  vColor;
  varying float vAlpha;
  varying vec3  vNormal;
  varying vec3  vWorldPos;
  varying vec3  vLocalPos;
  varying float vDistFromSpawn;
  varying float vRng;
  varying float vIsFrontier;
  varying float vOwnedRatio;
  varying float vHeight;

  void main() {
    vec3 displacedPos = position + normal * aHeight;
    vColor = aColor;
    vAlpha = aAlpha;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(displacedPos, 1.0);
    vWorldPos = worldPos.xyz;
    vLocalPos = position;
    vDistFromSpawn = aDistFromSpawn;
    vRng = aRng;
    vIsFrontier = aVertexData.x;
    vOwnedRatio = aVertexData.y;
    vHeight = aHeight;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const ORGANISM_FRAG = `
  precision highp float;

  varying vec3  vColor;
  varying float vAlpha;
  varying vec3  vNormal;
  varying vec3  vWorldPos;
  varying vec3  vLocalPos;
  varying float vDistFromSpawn;
  varying float vRng;
  varying float vIsFrontier;
  varying float vOwnedRatio;
  varying float vHeight;

  uniform vec3  uLightDir1;
  uniform vec3  uLightDir2;
  uniform float uTime;
  uniform float uMetalness;
  uniform float uRoughness;
  uniform float uEmissive;
  uniform float uPatternType;
  uniform vec3  uSpawnWorldPos;
  uniform vec4  uPatternParams;
  uniform vec4  uPatternParams2;
  uniform float uOrganismAge;

  // --- NOISE LIBRARY ---

  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  vec2 worley(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    float d1 = 1e10;
    float d2 = 1e10;
    for (int x = -1; x <= 1; x++) {
      for (int y = -1; y <= 1; y++) {
        for (int z = -1; z <= 1; z++) {
          vec3 neighbor = vec3(float(x), float(y), float(z));
          vec3 cellPos = neighbor + fract(sin(dot(i + neighbor, vec3(127.1, 311.7, 74.7))) * 43758.5453);
          float dist = length(f - cellPos);
          if (dist < d1) { d2 = d1; d1 = dist; }
          else if (dist < d2) { d2 = dist; }
        }
      }
    }
    return vec2(d1, d2);
  }

  float hash31(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }

  float hexDist(vec2 p) {
    p = abs(p);
    return max(dot(p, vec2(0.866025, 0.5)), p.y);
  }

  vec2 hexCenter(vec2 p) {
    vec2 a = mod(p, vec2(1.0, 1.732)) - vec2(0.5, 0.866);
    vec2 b = mod(p + vec2(0.5, 0.866), vec2(1.0, 1.732)) - vec2(0.5, 0.866);
    return length(a) < length(b) ? a : b;
  }

  vec3 hsl2rgb(float h, float s, float l) {
    vec3 rgb = clamp(abs(mod(h*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);
    return l + s * (rgb - 0.5) * (1.0 - abs(2.0*l - 1.0));
  }

  // --- PATTERN: GEOMETRIC ---

  vec4 patternGeometric(vec3 pos, vec3 N, vec3 viewDir) {
    float scale = uPatternParams.x * 12.0 + 4.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float edgeSharp = uPatternParams2.x;
    float facetDepth = uPatternParams2.y;
    float warp = uPatternParams2.w;

    vec3 warpedPos = vLocalPos + snoise(vLocalPos * 2.0 + vRng * 3.0) * warp * 0.15;
    vec2 hexUV = warpedPos.xz * scale;
    vec2 hc = hexCenter(hexUV);
    float edgeDist = hexDist(hc);
    float cellRadius = 0.5;
    float edgeFactor = smoothstep(cellRadius - edgeSharp * 0.15, cellRadius, edgeDist);

    vec2 cellID = floor(hexUV + 0.5);
    float cellHash = fract(sin(dot(cellID, vec2(127.1, 311.7))) * 43758.5453);

    float terraceN = 3.0 + complexity * 5.0;
    float terraceFrac = fract(vDistFromSpawn * terraceN);
    float ridgeLine = smoothstep(0.0, 0.08, terraceFrac) * smoothstep(0.16, 0.08, terraceFrac);

    float subDetail = 0.0;
    if (complexity > 0.4) {
      float subScale = scale * 3.0;
      vec2 subHC = hexCenter(warpedPos.xz * subScale);
      float subEdge = hexDist(subHC);
      subDetail = smoothstep(0.45, 0.5, subEdge) * (complexity - 0.4) * 1.5;
    }

    vec3 colorMod = vec3(0.0);
    colorMod += hsl2rgb(secHueOff, 0.3, 0.0) * edgeFactor * contrast * 0.5;
    colorMod += vec3(cellHash * 0.06 - 0.03) * contrast;
    colorMod += vec3(ridgeLine * 0.08 * contrast);
    colorMod -= vec3(subDetail * 0.06);

    float specBoost = edgeFactor * 0.3 * contrast;
    float alphaMod = 1.0 + edgeFactor * contrast * 0.1;

    return vec4(colorMod + vec3(specBoost), alphaMod);
  }

  // --- PATTERN: ORGANIC ---

  vec4 patternOrganic(vec3 pos, vec3 N, vec3 viewDir) {
    float scale = uPatternParams.x * 8.0 + 3.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float veinThick = uPatternParams2.x;
    float cellVar = uPatternParams2.y;
    float translucency = uPatternParams2.z;
    float warp = uPatternParams2.w;

    vec3 warpOffset = vec3(
      snoise(vLocalPos * 1.5 + 10.0),
      snoise(vLocalPos * 1.5 + 20.0),
      snoise(vLocalPos * 1.5 + 30.0)
    ) * warp * 0.3;
    vec3 warpedPos = vLocalPos + warpOffset;

    vec2 cell = worley(warpedPos * scale);
    float d1 = cell.x;
    float d2 = cell.y;
    float veinRaw = 1.0 - smoothstep(0.0, veinThick * 0.25 + 0.05, d2 - d1);

    vec3 cellCenter = floor(warpedPos * scale + 0.5);
    float cellID = hash31(cellCenter);
    float cellHueShift = (cellID - 0.5) * cellVar * 0.15;
    float cellBright = (cellID - 0.5) * cellVar * 0.1;

    float membrane = 0.0;
    if (complexity > 0.3) {
      membrane = snoise(warpedPos * scale * 2.5 + uTime * 0.1) * (complexity - 0.3) * 0.5;
    }

    float breathe = sin(uTime * 0.4 + vDistFromSpawn * 2.0 + cellID * 6.28) * 0.02;

    float sss = 0.0;
    if (translucency > 0.01) {
      float rim = 1.0 - max(dot(N, viewDir), 0.0);
      sss = pow(rim, 2.0) * translucency;
    }

    vec3 colorMod = vec3(0.0);
    vec3 veinColor = hsl2rgb(secHueOff, 0.4, -0.1);
    colorMod += veinColor * veinRaw * contrast;
    colorMod += vec3(cellBright) + hsl2rgb(cellHueShift, 0.0, 0.0);
    colorMod += vec3(membrane * 0.04 * contrast);
    colorMod += vec3(breathe);
    vec3 sssColor = hsl2rgb(secHueOff * 0.5, 0.5, 0.15);
    colorMod += sssColor * sss;

    float edgeTranslucency = (1.0 - vOwnedRatio) * translucency * 0.3;
    float alphaMod = 1.0 - edgeTranslucency + veinRaw * 0.05;

    return vec4(colorMod, alphaMod);
  }

  // --- PATTERN: CRYSTALLINE ---

  vec4 patternCrystalline(vec3 pos, vec3 N, vec3 viewDir) {
    float scale = uPatternParams.x * 8.0 + 4.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float edgeSharp = uPatternParams2.x;
    float facetDepth = uPatternParams2.y;
    float translucency = uPatternParams2.z;
    float warp = uPatternParams2.w;

    vec3 warpedPos = vLocalPos + snoise(vLocalPos * 1.5) * warp * 0.1;
    vec2 cell = worley(warpedPos * scale);
    float d1 = cell.x;
    float d2 = cell.y;
    float edge = 1.0 - smoothstep(0.0, edgeSharp * 0.12 + 0.02, d2 - d1);

    vec3 cellCenter = floor(warpedPos * scale + 0.5);
    float cellID = hash31(cellCenter);

    float viewAngle = dot(N, viewDir);
    float iridescentHue = fract(viewAngle * 2.0 + cellID * 0.3);
    vec3 iridescence = hsl2rgb(iridescentHue, 0.6, 0.12) * edge * contrast;

    float facetBright = (cellID - 0.5) * facetDepth * 0.2;

    float refraction = 0.0;
    if (complexity > 0.4) {
      float rf = snoise(warpedPos * scale * 2.0 + vec3(cellID * 10.0));
      refraction = smoothstep(0.3, 0.5, abs(rf)) * (complexity - 0.4) * 0.08;
    }

    float rim = 1.0 - max(viewAngle, 0.0);
    float sss = pow(rim, 2.5) * translucency * 0.5;

    vec3 colorMod = vec3(facetBright) * contrast;
    colorMod += iridescence;
    colorMod += vec3(refraction);
    colorMod += hsl2rgb(secHueOff * 0.5, 0.4, 0.1) * sss;
    float alphaMod = 1.0 - (1.0 - edge) * translucency * 0.15;

    return vec4(colorMod, alphaMod);
  }

  // --- PATTERN: FUNGAL ---

  vec4 patternFungal(vec3 pos, vec3 N, vec3 viewDir) {
    float scale = uPatternParams.x * 10.0 + 5.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float webThick = uPatternParams2.x;
    float sporeDensity = uPatternParams2.y;
    float translucency = uPatternParams2.z;
    float warp = uPatternParams2.w;

    vec3 warpOffset = vec3(
      snoise(vLocalPos * 1.2 + 5.0),
      snoise(vLocalPos * 1.2 + 15.0),
      snoise(vLocalPos * 1.2 + 25.0)
    ) * warp * 0.35;
    vec3 wp = vLocalPos + warpOffset;

    vec2 cell = worley(wp * scale);
    float webLine = 1.0 - smoothstep(0.0, webThick * 0.08 + 0.02, cell.y - cell.x);

    float sporeGlow = smoothstep(0.15, 0.0, cell.x) * sporeDensity * 2.0;
    float sporePulse = sin(uTime * 0.6 + hash31(floor(wp * scale + 0.5)) * 6.28) * 0.5 + 0.5;
    sporeGlow *= (0.5 + sporePulse * 0.5);

    float web2 = 0.0;
    if (complexity > 0.5) {
      vec2 cell2 = worley(wp * scale * 2.5 + 3.0);
      web2 = 1.0 - smoothstep(0.0, 0.03, cell2.y - cell2.x);
      web2 *= (complexity - 0.5) * 0.6;
    }

    vec3 colorMod = vec3(0.0);
    colorMod += hsl2rgb(secHueOff, 0.3, -0.05) * webLine * contrast;
    colorMod += hsl2rgb(secHueOff * 1.5, 0.6, 0.2) * sporeGlow * contrast;
    colorMod += vec3(web2 * 0.03) * contrast;

    float rim = pow(1.0 - max(dot(N, viewDir), 0.0), 2.0);
    colorMod += hsl2rgb(secHueOff, 0.5, 0.08) * rim * translucency;

    return vec4(colorMod, 1.0 + webLine * 0.05);
  }

  // --- PATTERN: MECHANICAL ---

  vec4 patternMechanical(vec3 pos, vec3 N, vec3 viewDir) {
    float scale = uPatternParams.x * 6.0 + 3.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float grooveDepth = uPatternParams2.x;
    float toothDetail = uPatternParams2.y;
    float warp = uPatternParams2.w;

    vec3 wp = vLocalPos + snoise(vLocalPos * 2.0) * warp * 0.08;
    float distR = length(wp.xz - uSpawnWorldPos.xz) * scale;

    float ringPhase = fract(distR);
    float groove = smoothstep(0.0, 0.1 * grooveDepth, ringPhase) *
                   smoothstep(0.3 * grooveDepth, 0.15 * grooveDepth, ringPhase);

    float angle = atan(wp.z - uSpawnWorldPos.z, wp.x - uSpawnWorldPos.x);
    float teeth = 0.0;
    if (complexity > 0.3) {
      float toothCount = 8.0 + complexity * 16.0;
      teeth = smoothstep(0.3, 0.5, sin(angle * toothCount + floor(distR) * 1.5));
      teeth *= groove * toothDetail;
    }

    float rivet = 0.0;
    if (complexity > 0.5) {
      float rivetAngle = floor(angle * 6.0 / 6.2832) * 6.2832 / 6.0;
      float rivetDist = fract(distR + 0.5);
      rivet = smoothstep(0.12, 0.0, abs(rivetDist - 0.5)) *
              smoothstep(0.15, 0.0, abs(angle - rivetAngle));
      rivet *= (complexity - 0.5) * 2.0;
    }

    vec3 colorMod = vec3(0.0);
    colorMod += vec3(groove * 0.08 * contrast);
    colorMod += hsl2rgb(secHueOff, 0.2, 0.04) * teeth * contrast;
    colorMod += vec3(rivet * 0.1) * contrast;
    float specBoost = (1.0 - groove) * 0.2 * contrast;
    colorMod += vec3(specBoost);

    return vec4(colorMod, 1.0);
  }

  // --- PATTERN: ELECTRONIC ---

  vec4 patternElectronic(vec3 pos, vec3 N, vec3 viewDir) {
    float scale = uPatternParams.x * 10.0 + 5.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float traceWidth = uPatternParams2.x;
    float nodeGlow = uPatternParams2.y;
    float warp = uPatternParams2.w;

    vec3 wp = vLocalPos + snoise(vLocalPos * 3.0) * warp * 0.05;

    vec2 gridUV = wp.xz * scale;
    vec2 gridFrac = fract(gridUV);
    vec2 gridCenter = gridFrac - 0.5;

    float traceX = smoothstep(traceWidth * 0.06 + 0.01, 0.0, abs(gridCenter.y));
    float traceZ = smoothstep(traceWidth * 0.06 + 0.01, 0.0, abs(gridCenter.x));

    vec2 cellID = floor(gridUV);
    float cellHash = fract(sin(dot(cellID, vec2(127.1, 311.7))) * 43758.5453);
    float trace = 0.0;
    if (cellHash < 0.35) trace = traceX;
    else if (cellHash < 0.7) trace = traceZ;
    else trace = max(traceX, traceZ);

    float isJunction = step(0.7, cellHash);
    float nodeDist = length(gridCenter);
    float node = smoothstep(0.12, 0.0, nodeDist) * isJunction;
    float pulse = sin(uTime * 3.0 + (cellID.x + cellID.y) * 1.5) * 0.5 + 0.5;
    node *= (0.5 + pulse * 0.5) * nodeGlow * 2.0;

    float digNoise = 0.0;
    if (complexity > 0.5) {
      vec2 hires = floor(gridUV * 4.0);
      digNoise = fract(sin(dot(hires, vec2(12.9898, 78.233))) * 43758.5453);
      digNoise = step(0.85, digNoise) * (complexity - 0.5) * 0.15;
    }

    float signal = sin(uTime * 4.0 - length(wp.xz - uSpawnWorldPos.xz) * scale * 0.5) * 0.5 + 0.5;
    float signalGlow = trace * signal * 0.1;

    vec3 colorMod = vec3(0.0);
    colorMod += hsl2rgb(secHueOff, 0.3, -0.03) * trace * contrast;
    colorMod += hsl2rgb(secHueOff * 1.5, 0.8, 0.25) * node * contrast;
    colorMod += vec3(digNoise) * contrast;
    colorMod += hsl2rgb(secHueOff, 0.6, 0.1) * signalGlow * contrast;

    return vec4(colorMod, 1.0 + trace * 0.05 + node * 0.1);
  }

  // --- PATTERN: ETHEREAL ---

  vec4 patternEthereal(vec3 pos, vec3 N, vec3 viewDir) {
    float scale = uPatternParams.x * 6.0 + 2.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float wispDensity = uPatternParams2.x;
    float shimmerRate = uPatternParams2.y;
    float translucency = uPatternParams2.z;
    float warp = uPatternParams2.w;

    vec3 warpOffset = vec3(
      snoise(vLocalPos * 0.8 + uTime * 0.05),
      snoise(vLocalPos * 0.8 + uTime * 0.05 + 10.0),
      snoise(vLocalPos * 0.8 + uTime * 0.05 + 20.0)
    ) * warp * 0.4;
    vec3 wp = vLocalPos + warpOffset;

    float wisp1 = snoise(wp * scale + uTime * 0.08) * 0.5 + 0.5;
    float wisp2 = snoise(wp * scale * 1.7 - uTime * 0.06 + 5.0) * 0.5 + 0.5;
    float wisps = wisp1 * wisp2;
    wisps = smoothstep(0.3, 0.7, wisps) * wispDensity;

    float viewAngle = dot(N, viewDir);
    float shimmer = sin(viewAngle * 6.0 + uTime * shimmerRate * 2.0 + vRng * 6.28);
    float hueShift = shimmer * secHueOff * 0.5;

    float rim = pow(1.0 - max(viewAngle, 0.0), 1.5);
    float sss = rim * translucency * 0.6;

    float sparkle = 0.0;
    if (complexity > 0.4) {
      float sp = snoise(vLocalPos * scale * 4.0 + uTime * 0.3);
      sparkle = smoothstep(0.8, 1.0, sp) * (complexity - 0.4) * 0.3;
    }

    vec3 colorMod = vec3(0.0);
    colorMod += hsl2rgb(hueShift, 0.3, 0.02) * wisps * contrast;
    colorMod += hsl2rgb(secHueOff, 0.5, 0.15) * sss;
    colorMod += vec3(sparkle);

    float alphaMod = 0.7 + wisps * 0.3 - (1.0 - wisps) * translucency * 0.2;
    return vec4(colorMod, alphaMod);
  }

  // --- PATTERN: CORAL (porous ocean rock) ---

  vec4 patternCoral(vec3 pos, vec3 N, vec3 viewDir) {
    float scale = uPatternParams.x * 10.0 + 4.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float polypSize = uPatternParams2.x;
    float ridgeSharp = uPatternParams2.y;
    float translucency = uPatternParams2.z;
    float warp = uPatternParams2.w;

    vec3 wp = vLocalPos + snoise(vLocalPos * 1.5) * warp * 0.2;

    // Primary pore structure (worley cells as limestone pores)
    vec2 cell = worley(wp * scale);
    float pore = smoothstep(polypSize * 0.25 + 0.08, 0.0, cell.x);

    // Secondary smaller pores for micro-porosity
    vec2 cell2 = worley(wp * scale * 2.8 + 3.7);
    float microPore = smoothstep(0.12, 0.0, cell2.x) * 0.4;

    vec3 cellCenter = floor(wp * scale + 0.5);
    float cellID = hash31(cellCenter);

    // Ridge network between pores (like reef rock grain)
    float ridge = 1.0 - smoothstep(0.0, ridgeSharp * 0.1 + 0.02, cell.y - cell.x);

    // Depth darkening in pores — deeper for eroded limestone look
    float poreDark = pore * 0.16 + microPore * 0.08;

    vec3 colorMod = vec3(0.0);
    // Pore shadows (dark cavities in the stone)
    colorMod -= vec3(poreDark) * contrast;
    // Ridge highlights (raised grain between pores — lighter stone)
    colorMod += vec3(ridge * 0.07) * contrast;
    // Stone grain noise for organic rock texture
    float grain = snoise(wp * scale * 1.5) * 0.025 * contrast;
    colorMod += vec3(grain);
    // Subtle mineral staining (very faint warm grey, not green)
    if (complexity > 0.3) {
      float af = snoise(wp * scale * 0.35 + 5.0);
      float stain = smoothstep(0.05, 0.45, af) * (complexity - 0.3) * 0.25;
      colorMod += hsl2rgb(0.08, 0.06, 0.01) * stain * contrast;
    }
    // Coralline algae (very subtle pinkish-grey patches near core)
    float coralline = smoothstep(2.5, 0.5, vDistFromSpawn) * smoothstep(0.4, 0.7, cellID) * 0.20;
    colorMod += hsl2rgb(secHueOff + 0.85, 0.10, 0.015) * coralline * contrast;
    // Gentle warm tint toward edges
    float warmth = smoothstep(0.0, 2.5, vDistFromSpawn) * 0.015;
    colorMod += hsl2rgb(0.06, 0.08, warmth);

    // Subtle rim light for depth (stone is mostly opaque)
    float rim = pow(1.0 - max(dot(N, viewDir), 0.0), 3.0);
    colorMod += hsl2rgb(secHueOff, 0.08, 0.02) * rim * translucency;

    return vec4(colorMod, 1.0);
  }

  // --- PATTERN: NEURAL ---

  vec4 patternNeural(vec3 pos, vec3 N, vec3 viewDir) {
    float scale = uPatternParams.x * 8.0 + 4.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float dendriteWidth = uPatternParams2.x;
    float synapseRate = uPatternParams2.y;
    float translucency = uPatternParams2.z;
    float warp = uPatternParams2.w;

    vec3 wp = vLocalPos + snoise(vLocalPos * 2.0) * warp * 0.15;

    vec2 cell = worley(wp * scale);
    float dendrite = 1.0 - smoothstep(0.0, dendriteWidth * 0.15 + 0.03, cell.y - cell.x);

    float radialBias = smoothstep(0.0, 1.5, vDistFromSpawn) * 0.3 + 0.7;
    dendrite *= radialBias;

    vec3 cellCenter = floor(wp * scale + 0.5);
    float cellID = hash31(cellCenter);
    float isSynapse = step(1.0 - synapseRate * 0.4, cellID);
    float synapseFlash = isSynapse * (sin(uTime * 2.0 + cellID * 25.0) * 0.5 + 0.5);
    float synapseDot = smoothstep(0.12, 0.0, cell.x) * synapseFlash;

    float pulseWave = sin(uTime * 1.5 - vDistFromSpawn * 4.0) * 0.5 + 0.5;
    float pulse = pulseWave * dendrite * 0.08;

    vec3 colorMod = vec3(0.0);
    colorMod += hsl2rgb(secHueOff, 0.4, -0.04) * dendrite * contrast;
    colorMod += hsl2rgb(secHueOff * 2.0, 0.8, 0.3) * synapseDot * contrast;
    colorMod += hsl2rgb(secHueOff, 0.6, 0.1) * pulse * contrast;

    float rim = pow(1.0 - max(dot(N, viewDir), 0.0), 2.5);
    colorMod += hsl2rgb(secHueOff * 0.5, 0.5, 0.08) * rim * translucency;

    return vec4(colorMod, 1.0 + synapseDot * 0.1);
  }

  // --- PATTERN: VOID ---

  vec4 patternVoid(vec3 pos, vec3 N, vec3 viewDir) {
    float scale = uPatternParams.x * 6.0 + 3.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float erosionDepth = uPatternParams2.x;
    float voidPull = uPatternParams2.y;
    float warp = uPatternParams2.w;

    vec3 wp = vLocalPos + snoise(vLocalPos * 1.5 + uTime * 0.03) * warp * 0.25;

    float erosion = snoise(wp * scale) * 0.5 + 0.5;
    erosion = smoothstep(0.3, 0.7, erosion) * erosionDepth;

    float centerDark = smoothstep(2.0, 0.0, vDistFromSpawn) * voidPull * 0.15;

    float fissures = 0.0;
    if (complexity > 0.4) {
      vec2 cell = worley(wp * scale * 1.5);
      fissures = 1.0 - smoothstep(0.0, 0.04, cell.y - cell.x);
      fissures *= (complexity - 0.4) * 0.4;
    }

    vec3 colorMod = vec3(0.0);
    colorMod -= vec3(erosion * 0.12) * contrast;
    colorMod -= vec3(centerDark);
    colorMod -= vec3(fissures * 0.05);

    float rim = pow(1.0 - max(dot(N, viewDir), 0.0), 3.0);
    colorMod += hsl2rgb(secHueOff, 0.3, 0.04) * rim * 0.4;

    float frontierBoost = vIsFrontier * 0.08;
    colorMod += hsl2rgb(secHueOff, 0.4, 0.06) * frontierBoost;

    return vec4(colorMod, 1.0 - erosion * 0.05);
  }

  // --- PATTERN: ALIEN ---

  vec4 patternAlien(vec3 pos, vec3 N, vec3 viewDir) {
    float scale = uPatternParams.x * 8.0 + 3.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float morphRate = uPatternParams2.x;
    float colorShift = uPatternParams2.y;
    float translucency = uPatternParams2.z;
    float warp = uPatternParams2.w;

    vec3 warpOffset = vec3(
      snoise(vLocalPos * 1.2 + uTime * 0.1),
      snoise(vLocalPos * 1.2 + uTime * 0.1 + 10.0),
      snoise(vLocalPos * 1.2 + uTime * 0.1 + 20.0)
    ) * warp * 0.4;
    vec3 wp = vLocalPos + warpOffset;

    vec2 cell = worley(wp * scale + uTime * morphRate * 0.15);
    float cellPattern = cell.x * 0.5;

    float wave1 = sin(dot(wp.xz, vec2(cos(uTime*0.1), sin(uTime*0.1))) * scale);
    float wave2 = sin(dot(wp.xz, vec2(sin(uTime*0.07), cos(uTime*0.07))) * scale * 1.3);
    float interference = wave1 * wave2 * 0.5;

    float organic = 0.0;
    if (complexity > 0.5) {
      organic = snoise(wp * scale * 0.7 + uTime * 0.05) * (complexity - 0.5) * 0.3;
    }

    float hueDrift = sin(uTime * 0.12 + vDistFromSpawn * 0.5) * secHueOff * 0.5;
    float satDrift = sin(uTime * 0.08 + vRng * 6.28) * 0.15;

    vec3 colorMod = vec3(0.0);
    colorMod += hsl2rgb(hueDrift, 0.3 + satDrift, 0.0) * cellPattern * contrast;
    colorMod += vec3(interference * 0.06) * contrast;
    colorMod += hsl2rgb(hueDrift * 2.0, 0.4, organic * 0.08);

    float rim = pow(1.0 - max(dot(N, viewDir), 0.0), 2.0);
    colorMod += hsl2rgb(hueDrift, 0.5, 0.1) * rim * translucency;

    return vec4(colorMod, 1.0);
  }

  // --- PATTERN: TEMPORAL ---

  vec4 patternTemporal(vec3 pos, vec3 N, vec3 viewDir) {
    float scale = uPatternParams.x * 8.0 + 3.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float echoStrength = uPatternParams2.x;
    float phaseRate = uPatternParams2.y;
    float translucency = uPatternParams2.z;
    float warp = uPatternParams2.w;

    vec3 wp = vLocalPos + snoise(vLocalPos * 1.5) * warp * 0.15;

    float present = snoise(wp * scale) * 0.5 + 0.5;
    float echo = snoise(wp * scale + uTime * -0.3 * phaseRate) * 0.5 + 0.5;

    float phaseMask = sin(uTime * 0.6 * phaseRate + vDistFromSpawn * 2.0 + vRng * 3.14) * 0.5 + 0.5;

    float blended = present * phaseMask + echo * (1.0 - phaseMask) * echoStrength;

    float rOffset = snoise(wp * scale + uTime * -0.1) * 0.03;
    float bOffset = snoise(wp * scale + uTime * 0.1) * 0.03;

    float ghostLine = 0.0;
    if (complexity > 0.3) {
      float gl = sin(vDistFromSpawn * scale * 0.5 + uTime * -0.5 * phaseRate);
      ghostLine = smoothstep(0.7, 1.0, gl) * echoStrength * (complexity - 0.3) * 0.15;
    }

    float flicker = sin(uTime * 2.0 + vRng * 31.4) * sin(uTime * 3.1 + vDistFromSpawn * 5.0);
    flicker = flicker * 0.02;

    vec3 colorMod = vec3(0.0);
    colorMod.r += rOffset * contrast;
    colorMod.b += bOffset * contrast;
    colorMod += vec3(blended * 0.06) * contrast;
    colorMod += hsl2rgb(secHueOff, 0.3, 0.04) * ghostLine;
    colorMod += vec3(flicker);

    float rim = pow(1.0 - max(dot(N, viewDir), 0.0), 2.0);
    colorMod += hsl2rgb(secHueOff * 0.5, 0.5, 0.1) * rim * translucency;

    float alphaMod = 0.85 + phaseMask * 0.15 - (1.0 - phaseMask) * translucency * 0.1;
    return vec4(colorMod, alphaMod);
  }

  // --- PATTERN: HYBRID ---

  vec4 patternHybrid(vec3 pos, vec3 N, vec3 viewDir) {
    float mode = fract(uPatternType);
    float modeID = floor(uPatternType) - 100.0;

    float scale = uPatternParams.x * 10.0 + 3.0;
    float contrast = uPatternParams.y;
    float complexity = uPatternParams.z;
    float secHueOff = uPatternParams.w;
    float detail1 = uPatternParams2.x;
    float detail2 = uPatternParams2.y;
    float translucency = uPatternParams2.z;
    float warp = uPatternParams2.w;

    vec3 warpOffset = vec3(
      snoise(vLocalPos * 1.8 + 10.0),
      snoise(vLocalPos * 1.8 + 20.0),
      snoise(vLocalPos * 1.8 + 30.0)
    ) * warp * 0.25;
    vec3 warpedPos = vLocalPos + warpOffset;

    vec3 colorMod = vec3(0.0);
    float alphaMod = 1.0;

    if (modeID < 1.0) {
      // Mode 0: Geometric grid + organic cellular fill
      vec2 hexUV = warpedPos.xz * scale * 0.7;
      vec2 hc = hexCenter(hexUV);
      float edgeDist = hexDist(hc);
      float edge = smoothstep(0.35, 0.5, edgeDist);

      vec2 cell = worley(warpedPos * scale * 1.5);
      float cellTex = cell.x * detail2;
      float vein = 1.0 - smoothstep(0.0, detail1 * 0.2, cell.y - cell.x);
      vein *= (1.0 - edge);

      colorMod += hsl2rgb(secHueOff, 0.3, 0.0) * edge * contrast * 0.5;
      colorMod += vec3(cellTex * 0.06 - 0.03) * contrast;
      colorMod += hsl2rgb(secHueOff * 1.5, 0.4, -0.08) * vein * contrast;
      alphaMod = 1.0 + edge * 0.05;

    } else if (modeID < 2.0) {
      // Mode 1: Organic veins with angular/geometric paths
      vec3 angularPos = warpedPos;
      angularPos.x = floor(angularPos.x * scale * 0.5 + 0.5) / (scale * 0.5);

      vec2 cell = worley(angularPos * scale);
      float vein = 1.0 - smoothstep(0.0, detail1 * 0.3, cell.y - cell.x);

      float terrace = fract(vDistFromSpawn * (3.0 + complexity * 4.0));
      float ridge = smoothstep(0.0, 0.1, terrace) * smoothstep(0.2, 0.1, terrace);

      colorMod += hsl2rgb(secHueOff, 0.4, -0.06) * vein * contrast;
      colorMod += vec3(ridge * 0.07 * contrast);
      float sss = pow(1.0 - max(dot(N, viewDir), 0.0), 2.5) * translucency;
      colorMod += hsl2rgb(secHueOff * 0.5, 0.5, 0.12) * sss;

    } else if (modeID < 3.0) {
      // Mode 2: Large faceted cells + organic membrane boundaries
      vec2 cell = worley(warpedPos * scale * 0.6);
      float d1 = cell.x;
      float d2 = cell.y;

      vec3 facetCenter = floor(warpedPos * scale * 0.6 + 0.5);
      float facetID = hash31(facetCenter);
      float facetBright = (facetID - 0.5) * 0.15;

      float membrane = 1.0 - smoothstep(0.0, detail1 * 0.15 + 0.03, d2 - d1);
      float membraneGlow = membrane * sin(uTime * 0.8 + facetID * 6.28) * 0.3 + membrane * 0.7;

      colorMod += vec3(facetBright) * contrast;
      colorMod += hsl2rgb(facetID * detail2 * 0.2 + secHueOff, 0.2, 0.0) * contrast;
      colorMod += hsl2rgb(secHueOff * 2.0, 0.6, 0.1) * membraneGlow * contrast;
      alphaMod = 1.0 - (1.0 - membrane) * translucency * 0.2;

    } else if (modeID < 4.0) {
      // Mode 3: Interference / moire patterns
      float freq1 = scale * 0.8;
      float freq2 = scale * 1.1;
      float angle1 = mode * 3.14159;
      float angle2 = angle1 + 1.047;

      vec2 p1 = vec2(cos(angle1), sin(angle1));
      vec2 p2 = vec2(cos(angle2), sin(angle2));

      float wave1 = sin(dot(warpedPos.xz, p1) * freq1 + uTime * 0.2);
      float wave2 = sin(dot(warpedPos.xz, p2) * freq2 - uTime * 0.15);
      float interference = wave1 * wave2;

      float bright = interference * contrast * 0.15;
      float hueShift = interference * secHueOff * 0.5;

      vec2 cell = worley(warpedPos * scale * 0.5);
      float cellDark = cell.x * 0.08 * detail2;

      colorMod += vec3(bright) + hsl2rgb(hueShift, 0.2, 0.0);
      colorMod -= vec3(cellDark);

      float rim = pow(1.0 - max(dot(N, viewDir), 0.0), 3.0);
      colorMod += hsl2rgb(secHueOff, 0.5, 0.1) * rim * translucency;

    } else if (modeID < 5.0) {
      // Mode 4: Radial pulse rings + cellular texture
      float ringDist = length(warpedPos.xz - uSpawnWorldPos.xz) * scale * 0.5;
      float ring = sin(ringDist + uTime * 0.3) * 0.5 + 0.5;
      ring = smoothstep(0.3, 0.7, ring);

      vec2 cell = worley(warpedPos * scale);
      float cellTex = cell.x * detail2 * 0.1;

      colorMod += vec3(ring * 0.08) * contrast;
      colorMod += hsl2rgb(secHueOff, 0.3, cellTex);
      float sss = pow(1.0 - max(dot(N, viewDir), 0.0), 2.0) * translucency;
      colorMod += hsl2rgb(secHueOff, 0.5, 0.1) * sss;

    } else {
      // Mode 5: Layered simplex noise blend
      float n1 = snoise(warpedPos * scale * 0.6) * 0.5 + 0.5;
      float n2 = snoise(warpedPos * scale * 1.2 + 5.0) * 0.5 + 0.5;
      float n3 = snoise(warpedPos * scale * 0.3 + uTime * 0.1) * 0.5 + 0.5;
      float layered = n1 * n2 + n3 * 0.3;

      colorMod += hsl2rgb(secHueOff * n1, 0.3, layered * 0.06) * contrast;
      colorMod += hsl2rgb(secHueOff * 2.0, 0.2, 0.0) * (1.0 - n2) * detail1 * 0.04;
      float rim = pow(1.0 - max(dot(N, viewDir), 0.0), 2.5);
      colorMod += hsl2rgb(secHueOff, 0.5, 0.08) * rim * translucency;
    }

    return vec4(colorMod, alphaMod);
  }

  // --- MAIN ---

  void main() {
    if (vAlpha < 0.01) discard;

    vec3 N = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vWorldPos);

    // Select pattern
    vec4 pattern;
    float pt = uPatternType;
    if (pt < 0.5) pattern = patternGeometric(vWorldPos, N, viewDir);
    else if (pt < 1.5) pattern = patternOrganic(vWorldPos, N, viewDir);
    else if (pt < 2.5) pattern = patternCrystalline(vWorldPos, N, viewDir);
    else if (pt < 3.5) pattern = patternFungal(vWorldPos, N, viewDir);
    else if (pt < 4.5) pattern = patternMechanical(vWorldPos, N, viewDir);
    else if (pt < 5.5) pattern = patternElectronic(vWorldPos, N, viewDir);
    else if (pt < 6.5) pattern = patternEthereal(vWorldPos, N, viewDir);
    else if (pt < 7.5) pattern = patternCoral(vWorldPos, N, viewDir);
    else if (pt < 8.5) pattern = patternNeural(vWorldPos, N, viewDir);
    else if (pt < 9.5) pattern = patternVoid(vWorldPos, N, viewDir);
    else if (pt < 10.5) pattern = patternAlien(vWorldPos, N, viewDir);
    else if (pt < 11.5) pattern = patternTemporal(vWorldPos, N, viewDir);
    else pattern = patternHybrid(vWorldPos, N, viewDir);

    vec3 baseColor = vColor + pattern.rgb;
    float finalAlpha = vAlpha * pattern.a;

    // --- ENHANCED PBR LIGHTING ---
    float diff1 = max(dot(N, uLightDir1), 0.0) * 0.7;
    float diff2 = max(dot(N, uLightDir2), 0.0) * 0.35;
    float ambient = 0.25;

    vec3 halfDir = normalize(uLightDir1 + viewDir);
    float shininess = mix(8.0, 120.0, 1.0 - uRoughness);
    float spec = pow(max(dot(N, halfDir), 0.0), shininess) * uMetalness * 0.6;

    vec3 halfDir2 = normalize(uLightDir2 + viewDir);
    float spec2 = pow(max(dot(N, halfDir2), 0.0), shininess * 0.5) * uMetalness * 0.2;

    float fresnel = pow(1.0 - max(dot(N, viewDir), 0.0), 3.0) * 0.15;
    float ao = smoothstep(0.0, 0.1, vHeight) * 0.3 + 0.7;
    float frontierGlow = vIsFrontier * 0.06;

    vec3 emissive = baseColor * (uEmissive * 0.3 + frontierGlow);

    vec3 color = baseColor * (ambient + diff1 + diff2) * ao
               + vec3(1.0) * (spec + spec2)
               + emissive
               + vec3(1.0) * fresnel;

    gl_FragColor = vec4(color, finalAlpha);
  }
`;

const VisualStrategies = {
  shell: class ShellVisual {
    constructor(organism, config, scene) {
      this.config = config;
      this.scene = scene;
      this.organism = organism;

      const genome = organism.genome;
      const canvas = organism.canvas;
      const N = canvas.vertices.length;

      // Base color from genome
      this.baseHue = genome.hue;
      this.baseSat = genome.saturation;
      this.baseLight = genome.value * 0.5 + 0.25;
      this.color = new THREE.Color().setHSL(this.baseHue, this.baseSat, this.baseLight);

      // Clone the shell geometry
      this.geo = canvas.shellGeo.clone();

      // Per-vertex custom attributes
      this.heightArr = new Float32Array(N);
      this.colorArr = new Float32Array(N * 3);
      this.alphaArr = new Float32Array(N);
      this.distFromSpawnArr = new Float32Array(N);
      this.rngArr = new Float32Array(N);
      this.vertexDataArr = new Float32Array(N * 2);

      this.geo.setAttribute('aHeight', new THREE.BufferAttribute(this.heightArr, 1));
      this.geo.setAttribute('aColor', new THREE.BufferAttribute(this.colorArr, 3));
      this.geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alphaArr, 1));
      this.geo.setAttribute('aDistFromSpawn', new THREE.BufferAttribute(this.distFromSpawnArr, 1));
      this.geo.setAttribute('aRng', new THREE.BufferAttribute(this.rngArr, 1));
      this.geo.setAttribute('aVertexData', new THREE.BufferAttribute(this.vertexDataArr, 2));

      // Custom shader material — organism shader with procedural patterns
      this.mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: true,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uLightDir1: { value: new THREE.Vector3(0.4, 0.7, 0.5).normalize() },
          uLightDir2: { value: new THREE.Vector3(-0.5, 0.3, -0.4).normalize() },
          uMetalness: { value: genome.metalness },
          uRoughness: { value: genome.roughness },
          uEmissive: { value: genome.emissive },
          uPatternType: { value: this._computePatternType(organism) },
          uSpawnWorldPos: { value: organism.spawnVertex.position.clone() },
          uPatternParams: { value: new THREE.Vector4(
            genome.patternScale || 0.5,
            genome.patternContrast || 0.5,
            genome.patternComplexity || 0.5,
            genome.secondaryHueOffset || 0.05
          )},
          uPatternParams2: { value: new THREE.Vector4(
            genome.patternDetail1 || 0.5,
            genome.patternDetail2 || 0.5,
            genome.translucency || 0.1,
            genome.warpStrength || 0.2
          )},
          uOrganismAge: { value: 0 },
        },
        vertexShader: ORGANISM_VERT,
        fragmentShader: ORGANISM_FRAG,
      });

      this.mesh = new THREE.Mesh(this.geo, this.mat);
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
      this.mesh.frustumCulled = false;
      scene.add(this.mesh);

      this.pulsePhase = Math.random() * 6.28;
      this._tmpColor = new THREE.Color();
      this._white = new THREE.Color(1, 1, 1);
      this.profile = VisualProfiles[organism.seedDef.visualProfile || 'geometric'];
    }

    _computePatternType(organism) {
      const def = organism.seedDef;
      if (def.patternTypeValue !== undefined) return def.patternTypeValue;
      const typeMap = {
        geometric: 0, organic: 1, crystalline: 2, fungal: 3,
        mechanical: 4, electronic: 5, ethereal: 6, coral: 7,
        neural: 8, void_: 9, alien: 10, temporal: 11,
      };
      const val = typeMap[def.visualProfile];
      if (val !== undefined) return val;
      return 0;
    }

    getColor() { return this.color; }

    getTargetHeight(genome) {
      return this.config.interiorHeight;
    }

    ease(t) { return 1 - (1 - t) * (1 - t) * (1 - t); }

    update(organism, dt) {
      const cfg = this.config;
      const canvas = organism.canvas;
      const N = canvas.vertices.length;
      const genome = organism.genome;
      const stressFactor = organism.stress || 0;
      const profile = this.profile;

      this.pulsePhase += dt * cfg.pulseSpeed;
      this.mat.uniforms.uTime.value += dt;

      // Catalyst glow
      const catalystGlow = organism.catalystTimer > 0 ? 0.3 : 0;
      const nurtureGlow = organism.nurtureTimer > 0 ? 0.2 : 0;
      this.mat.uniforms.uEmissive.value = organism.genome.emissive + catalystGlow + nurtureGlow;

      const spawnIdx = organism.spawnVertex.index;
      const spawnPos = organism.spawnVertex.position;

      for (let vi = 0; vi < N; vi++) {
        const v = canvas.vertices[vi];

        if (v.owner !== organism) {
          this.heightArr[vi] = 0;
          this.alphaArr[vi] = 0;
          this.distFromSpawnArr[vi] = 0;
          this.rngArr[vi] = 0;
          this.vertexDataArr[vi * 2] = 0;
          this.vertexDataArr[vi * 2 + 1] = 0;
          continue;
        }

        const pr = Math.min(1, v.claimProgress || 0);

        // Determine role
        const isSpawn = v.index === spawnIdx;
        const isFrontier = organism.frontier.has(v);

        // Neighbor ownership ratio
        const neighbors = canvas.getNeighbors(v);
        const ownedRatio = neighbors.filter(n => n.owner === organism).length / Math.max(neighbors.length, 1);

        // Distance from spawn (used by both height and color profiles)
        const distFromSpawn = v.position.distanceTo(spawnPos);

        // Build context for visual profile
        const ctx = { v, isSpawn, isFrontier, ownedRatio, distFromSpawn, neighbors, genome, config: cfg, organism, time: this.pulsePhase };

        // === HEIGHT via profile ===
        let targetH = profile.height(ctx);

        // Combat height bulge at contested borders
        if (isFrontier && v.pressure > 0 && v.contestedBy) {
          const combatBulge = Math.min(v.pressure, 2.5) * 0.12;
          targetH += combatBulge;
        }

        // Stress reduces height
        targetH *= (1 - stressFactor * 0.25);

        // Smooth based on neighbor ownership
        targetH *= (cfg.smoothing + (1 - cfg.smoothing) * ownedRatio);

        // Boundary taper for plane canvas edges
        if (v._isBoundary) targetH *= 0.3;

        // Emergence animation
        const ease = this.ease(pr);
        const h = targetH * ease;

        // Growth flash
        const freshness = Math.max(0, 1 - (organism.age - v.claimTime) / 0.8);

        // Decay combat flash
        if (v.combatFlash > 0) {
          v.combatFlash = Math.max(0, v.combatFlash - dt * 3.0);
        }

        this.heightArr[vi] = h + freshness * cfg.flashHeight + v.combatFlash * 0.15;

        // === NEW PATTERN ATTRIBUTES ===
        this.distFromSpawnArr[vi] = distFromSpawn;
        this.rngArr[vi] = v.rng;
        const vdIdx = vi * 2;
        this.vertexDataArr[vdIdx] = isFrontier ? 1.0 : 0.0;
        this.vertexDataArr[vdIdx + 1] = ownedRatio;

        // === ALPHA via profile ===
        const profileAlpha = profile.alpha ? profile.alpha(ctx) : 1.0;
        this.alphaArr[vi] = Math.min(1, pr * 2) * profileAlpha;

        // === COLOR via profile ===
        const colorAdj = profile.color(ctx);

        const shimmer = Math.sin(this.pulsePhase + distFromSpawn * 1.2) * cfg.pulseDepth;
        const frontierBright = isFrontier ? 0.04 : 0;
        const freshBright = freshness * 0.12;

        // Combat color shift
        let combatHueShift = 0, combatBrightBoost = 0, combatSatBoost = 0;
        if (v.pressure > 0 && v.contestedBy) {
          const intensity = Math.min(v.pressure / 2.0, 1.0);
          combatHueShift = intensity * 0.04;
          combatBrightBoost = intensity * 0.12;
          combatSatBoost = intensity * 0.1;
        }

        // Stress desaturation
        const finalSat = (this.baseSat * colorAdj.sMult + combatSatBoost) * (1 - stressFactor * 0.5);

        this._tmpColor.setHSL(
          this.baseHue + colorAdj.hShift + combatHueShift,
          finalSat,
          Math.max(0, Math.min(1, this.baseLight + colorAdj.lShift + frontierBright + shimmer + freshBright + combatBrightBoost))
        );

        // Combat flash — white blend
        if (v.combatFlash > 0) {
          this._tmpColor.lerp(this._white, v.combatFlash * 0.7);
        }

        const i3 = vi * 3;
        this.colorArr[i3]     = this._tmpColor.r;
        this.colorArr[i3 + 1] = this._tmpColor.g;
        this.colorArr[i3 + 2] = this._tmpColor.b;
      }

      this.geo.getAttribute('aHeight').needsUpdate = true;
      this.geo.getAttribute('aColor').needsUpdate = true;
      this.geo.getAttribute('aAlpha').needsUpdate = true;
      this.geo.getAttribute('aDistFromSpawn').needsUpdate = true;
      this.geo.getAttribute('aRng').needsUpdate = true;
      this.geo.getAttribute('aVertexData').needsUpdate = true;
      this.mat.uniforms.uOrganismAge.value = organism.age;
    }

    setDecay(progress, collapseOrigin) {
      const canvas = this.organism.canvas;
      const maxDist = canvas.radius * 2;
      const waveFront = progress * maxDist * 1.5;
      for (let i = 0; i < this.alphaArr.length; i++) {
        if (this.alphaArr[i] > 0) {
          if (collapseOrigin) {
            const v = canvas.vertices[i];
            const dist = v.position.distanceTo(collapseOrigin);
            const localFade = Math.max(0, 1 - Math.max(0, waveFront - dist) / (maxDist * 0.3));
            this.alphaArr[i] *= localFade;
          } else {
            this.alphaArr[i] *= (1 - progress * 0.05);
          }
        }
      }
      this.geo.getAttribute('aAlpha').needsUpdate = true;
    }

    dispose() {
      if (this.mesh) {
        this.scene.remove(this.mesh);
        this.geo.dispose();
        this.mat.dispose();
        this.mesh = null;
      }
    }
  },
};

/* ═══════════════════════════════════════════
   AUDIO ENGINE — Generative Soundscape
   ═══════════════════════════════════════════ */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isEnabled = true;
    this.isInitialized = false;
    this.isPlaying = false;

    this.droneOsc = null;
    this.droneGain = null;
    this.droneSub = null;
    this.droneSubGain = null;
    this.droneFilter = null;
    this.harmonicLayers = [];
    this.ambientGain = null;
    this.eventGain = null;
    this.uiGain = null;

    this.lastGrainTime = 0;
    this.grainMinInterval = 0.25;

    this.smoothCoverage = 0;
    this.smoothConflict = 0;
    this.smoothOrganismCount = 0;
    this.smoothGrowthRate = 0;

    const saved = localStorage.getItem('garden-audio-enabled');
    if (saved !== null) this.isEnabled = saved === 'true';
  }

  init() {
    if (this.isInitialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isEnabled ? 1.0 : 0.0;
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0.35;

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.value = 400;
      this.droneFilter.Q.value = 0.7;

      this.ambientGain.connect(this.droneFilter);
      this.droneFilter.connect(this.masterGain);

      this.eventGain = this.ctx.createGain();
      this.eventGain.gain.value = 0.5;
      this.eventGain.connect(this.masterGain);

      this.uiGain = this.ctx.createGain();
      this.uiGain.gain.value = 0.25;
      this.uiGain.connect(this.masterGain);

      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioEngine: Web Audio not available', e);
      this.isEnabled = false;
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('garden-audio-enabled', this.isEnabled);

    document.getElementById('audio-icon-on').style.display = this.isEnabled ? '' : 'none';
    document.getElementById('audio-icon-off').style.display = this.isEnabled ? 'none' : '';
    document.getElementById('audio-label').textContent = this.isEnabled ? 'Audio On' : 'Audio Off';

    if (this.masterGain) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setTargetAtTime(this.isEnabled ? 1.0 : 0.0, t, 0.3);
    }

    if (this.isEnabled && this.isInitialized && !this.isPlaying && gameStarted) {
      this.startAmbient();
    }
    if (!this.isEnabled && this.isPlaying) {
      this.stopAmbient();
    }
  }

  // --- AMBIENT DRONE ---

  startAmbient() {
    if (!this.isInitialized || !this.isEnabled || this.isPlaying) return;
    const t = this.ctx.currentTime;

    this.droneOsc = this.ctx.createOscillator();
    this.droneOsc.type = 'sine';
    this.droneOsc.frequency.value = 73.42; // D2
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.value = 0;
    this.droneGain.gain.setTargetAtTime(0.12, t, 2.0);

    this.droneSub = this.ctx.createOscillator();
    this.droneSub.type = 'sine';
    this.droneSub.frequency.value = 55.0; // A1
    this.droneSubGain = this.ctx.createGain();
    this.droneSubGain.gain.value = 0;
    this.droneSubGain.gain.setTargetAtTime(0.06, t, 3.0);

    this.droneOsc.connect(this.droneGain);
    this.droneGain.connect(this.ambientGain);
    this.droneSub.connect(this.droneSubGain);
    this.droneSubGain.connect(this.ambientGain);

    this.droneOsc.start(t);
    this.droneSub.start(t);
    this.isPlaying = true;
  }

  stopAmbient() {
    if (!this.isPlaying) return;
    const t = this.ctx.currentTime;

    if (this.droneGain) this.droneGain.gain.setTargetAtTime(0, t, 0.5);
    if (this.droneSubGain) this.droneSubGain.gain.setTargetAtTime(0, t, 0.5);
    for (const layer of this.harmonicLayers) {
      layer.gain.gain.setTargetAtTime(0, t, 0.5);
    }

    setTimeout(() => {
      try {
        if (this.droneOsc) { this.droneOsc.stop(); this.droneOsc = null; }
        if (this.droneSub) { this.droneSub.stop(); this.droneSub = null; }
        for (const layer of this.harmonicLayers) { layer.osc.stop(); }
        this.harmonicLayers = [];
      } catch(e) {}
      this.isPlaying = false;
    }, 2000);
  }

  // --- AMBIENT UPDATE (called every frame) ---

  updateAmbient(ecosystemState) {
    if (!this.isInitialized || !this.isEnabled || !this.isPlaying) return;
    const { organismCount, coverage, conflictCount, growthRate, organisms: orgList } = ecosystemState;
    const t = this.ctx.currentTime;

    const smooth = 0.03;
    this.smoothCoverage += (coverage - this.smoothCoverage) * smooth;
    this.smoothConflict += (conflictCount - this.smoothConflict) * smooth;
    this.smoothOrganismCount += (organismCount - this.smoothOrganismCount) * smooth;
    this.smoothGrowthRate += (growthRate - this.smoothGrowthRate) * smooth;

    // Drone filter opens with coverage
    const filterTarget = 400 + this.smoothCoverage * 1800;
    this.droneFilter.frequency.setTargetAtTime(filterTarget, t, 0.5);

    // Conflict adds detune wobble
    const detuneAmount = Math.min(this.smoothConflict * 3, 15);
    if (this.droneOsc) {
      this.droneOsc.detune.setTargetAtTime(Math.sin(t * 0.3) * detuneAmount, t, 0.3);
    }

    // Harmonic layers — one per organism, pentatonic
    const pentatonic = [146.83, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63, 392.0];
    const aliveOrgs = orgList ? orgList.filter(o => o.isAlive) : [];

    while (this.harmonicLayers.length < aliveOrgs.length && this.harmonicLayers.length < 8) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      gain.gain.value = 0;
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      filter.Q.value = 1.0;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      osc.start(t);

      this.harmonicLayers.push({ osc, gain, filter, targetFreq: 200, targetVol: 0 });
    }

    while (this.harmonicLayers.length > aliveOrgs.length) {
      const layer = this.harmonicLayers.pop();
      layer.gain.gain.setTargetAtTime(0, t, 0.5);
      setTimeout(() => { try { layer.osc.stop(); } catch(e) {} }, 2000);
    }

    for (let i = 0; i < Math.min(this.harmonicLayers.length, aliveOrgs.length); i++) {
      const layer = this.harmonicLayers[i];
      const org = aliveOrgs[i];
      const genome = org.genome;

      const noteIdx = Math.floor(genome.hue * pentatonic.length) % pentatonic.length;
      const baseFreq = pentatonic[noteIdx];
      const detune = (genome.speed - 0.5) * 20;

      const sizeRatio = org.claimed.size / (org.canvas ? org.canvas.vertexCount : 100000);
      const vol = Math.min(0.08, 0.03 + sizeRatio * 0.05);

      const stress = org.stress || 0;
      const filterFreq = 800 - stress * 400;

      layer.osc.frequency.setTargetAtTime(baseFreq, t, 0.5);
      layer.osc.detune.setTargetAtTime(detune, t, 0.3);
      layer.gain.gain.setTargetAtTime(vol, t, 0.5);
      layer.filter.frequency.setTargetAtTime(filterFreq, t, 0.3);

      const profile = org.seedDef.visualProfile;
      if (profile === 'organic') layer.osc.type = 'sine';
      else if (profile === 'geometric') layer.osc.type = 'triangle';
      else layer.osc.type = 'sine';
    }

    // Drone volume grows with ecosystem richness
    const richness = Math.min(1, this.smoothOrganismCount * 0.15 + this.smoothCoverage * 0.3);
    if (this.droneGain) {
      this.droneGain.gain.setTargetAtTime(0.08 + richness * 0.08, t, 1.0);
    }
  }

  // --- GROWTH GRAINS ---

  playGrowthGrain(growthAmount, dominantType) {
    if (!this.isInitialized || !this.isEnabled) return;
    if (growthAmount < 1) return;
    const now = this.ctx.currentTime;
    if (now - this.lastGrainTime < this.grainMinInterval) return;
    this.lastGrainTime = now;
    const intensity = Math.min(1, growthAmount / 10);
    switch (dominantType) {
      case 'geometric':   this._grainGeometric(now, intensity); break;
      case 'organic':     this._grainOrganic(now, intensity); break;
      case 'crystalline': this._grainCrystalline(now, intensity); break;
      case 'fungal':      this._grainFungal(now, intensity); break;
      case 'mechanical':  this._grainMechanical(now, intensity); break;
      case 'electronic':  this._grainElectronic(now, intensity); break;
      case 'ethereal':    this._grainEthereal(now, intensity); break;
      case 'coral':       this._grainCoral(now, intensity); break;
      case 'neural':      this._grainNeural(now, intensity); break;
      case 'void_':       this._grainVoid(now, intensity); break;
      case 'alien':       this._grainAlien(now, intensity); break;
      case 'temporal':    this._grainTemporal(now, intensity); break;
      default:            this._grainGeometric(now, intensity); break;
    }
  }

  _grainGeometric(t, intensity) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1200 + intensity * 1500 + Math.random() * 800;
    const vol = 0.04 + intensity * 0.06;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03 + Math.random() * 0.02);
    osc.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  _grainOrganic(t, intensity) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.value = 300 + Math.random() * 400;
    filter.type = 'bandpass';
    filter.frequency.value = 500 + intensity * 600;
    filter.Q.value = 2;
    const vol = 0.05 + intensity * 0.05;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05 + Math.random() * 0.04);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  _grainCrystalline(t, intensity) {
    for (let i = 0; i < 2; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 2000 + intensity * 1500 + Math.random() * 500 + i * 15;
      const vol = (0.03 + intensity * 0.04) * (i === 0 ? 1 : 0.6);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05 + Math.random() * 0.03);
      osc.connect(gain);
      gain.connect(this.uiGain);
      osc.start(t);
      osc.stop(t + 0.1);
    }
  }

  _grainFungal(t, intensity) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = 'sine';
    osc.frequency.value = 200 + Math.random() * 150;
    filter.type = 'lowpass';
    filter.frequency.value = 400 + intensity * 300;
    filter.Q.value = 3;
    const vol = 0.04 + intensity * 0.04;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06 + Math.random() * 0.04);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  _grainMechanical(t, intensity) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 400 + intensity * 200 + Math.random() * 100;
    const vol = 0.03 + intensity * 0.04;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
    osc.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  _grainElectronic(t, intensity) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, t);
    osc.frequency.exponentialRampToValueAtTime(2000 + intensity * 2000, t + 0.02);
    const vol = 0.03 + intensity * 0.04;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    osc.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  _grainEthereal(t, intensity) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = 'sine';
    osc.frequency.value = 600 + Math.random() * 800;
    filter.type = 'bandpass';
    filter.frequency.value = 800 + Math.random() * 400;
    filter.Q.value = 8;
    const vol = 0.02 + intensity * 0.03;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1 + Math.random() * 0.06);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  _grainCoral(t, intensity) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 900 + Math.random() * 600 + intensity * 400;
    const vol = 0.04 + intensity * 0.04;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025 + Math.random() * 0.015);
    osc.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  _grainNeural(t, intensity) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(3000 + intensity * 1500, t);
    osc.frequency.exponentialRampToValueAtTime(500, t + 0.04);
    const vol = 0.04 + intensity * 0.05;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  _grainVoid(t, intensity) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 50 + Math.random() * 30;
    const vol = 0.06 + intensity * 0.06;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  _grainAlien(t, intensity) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const types = ['sine', 'triangle', 'square', 'sawtooth'];
    osc.type = types[Math.floor(Math.random() * types.length)];
    osc.frequency.value = 200 + Math.random() * 3000;
    const vol = 0.03 + intensity * 0.04;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02 + Math.random() * 0.04);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500 + Math.random() * 2000;
    filter.Q.value = 1 + Math.random() * 4;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  _grainTemporal(t, intensity) {
    for (let i = 0; i < 2; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 700 + Math.random() * 500;
      const offset = i * 0.04;
      const vol = (0.04 + intensity * 0.03) * (i === 0 ? 1 : 0.4);
      gain.gain.setValueAtTime(0, t + offset);
      gain.gain.linearRampToValueAtTime(vol, t + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.05);
      osc.connect(gain);
      gain.connect(this.uiGain);
      osc.start(t + offset);
      osc.stop(t + offset + 0.1);
    }
  }

  // --- EVENT STINGS ---

  playSeedPlanted(seedType) {
    if (!this.isInitialized || !this.isEnabled) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const toneMap = {
      geometric:   { type: 'triangle', f0: 330, f1: 440,  dur: 0.3 },
      organic:     { type: 'sine',     f0: 220, f1: 330,  dur: 0.4 },
      crystalline: { type: 'sine',     f0: 440, f1: 660,  dur: 0.25 },
      fungal:      { type: 'sine',     f0: 165, f1: 220,  dur: 0.5 },
      mechanical:  { type: 'square',   f0: 220, f1: 293,  dur: 0.2 },
      electronic:  { type: 'square',   f0: 440, f1: 880,  dur: 0.15 },
      ethereal:    { type: 'sine',     f0: 392, f1: 523,  dur: 0.5 },
      coral:       { type: 'triangle', f0: 262, f1: 349,  dur: 0.35 },
      neural:      { type: 'sine',     f0: 523, f1: 698,  dur: 0.2 },
      void_:       { type: 'sine',     f0: 147, f1: 110,  dur: 0.4 },
      alien:       { type: 'sawtooth', f0: 300, f1: 400,  dur: 0.3 },
      temporal:    { type: 'sine',     f0: 330, f1: 415,  dur: 0.35 },
    };
    const tone = toneMap[seedType] || toneMap.geometric;

    osc.type = tone.type;
    osc.frequency.setValueAtTime(tone.f0, t);
    osc.frequency.exponentialRampToValueAtTime(tone.f1, t + tone.dur);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + tone.dur + 0.3);

    if (seedType === 'electronic') {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, t);
      filter.frequency.exponentialRampToValueAtTime(4000, t + tone.dur);
      osc.connect(filter);
      filter.connect(gain);
    } else {
      osc.connect(gain);
    }

    gain.connect(this.eventGain);
    osc.start(t);
    osc.stop(t + tone.dur + 0.4);
  }

  playHybridEmerged() {
    if (!this.isInitialized || !this.isEnabled) return;
    const t = this.ctx.currentTime;
    const notes = [220, 277.18, 329.63];
    const types = ['sine', 'triangle', 'sine'];

    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = types[i];
      osc.frequency.setValueAtTime(notes[i] * 0.5, t);
      osc.frequency.exponentialRampToValueAtTime(notes[i], t + 0.8);

      const offset = i * 0.15;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.1 + offset);
      gain.gain.setTargetAtTime(0.06, t + 0.5 + offset, 0.3);
      gain.gain.setTargetAtTime(0.001, t + 1.5, 0.4);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, t);
      filter.frequency.exponentialRampToValueAtTime(2000, t + 1.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.eventGain);
      osc.start(t);
      osc.stop(t + 2.5);
    }
  }

  playOrganismDeath() {
    if (!this.isInitialized || !this.isEnabled) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 1.5);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.setTargetAtTime(0.001, t + 0.3, 0.5);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.eventGain);
    osc.start(t);
    osc.stop(t + 2.0);
  }

  playConflictStart() {
    if (!this.isInitialized || !this.isEnabled) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 55 + Math.random() * 20;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.1);
    gain.gain.setTargetAtTime(0.001, t + 0.4, 0.2);
    osc.connect(gain);
    gain.connect(this.eventGain);
    osc.start(t);
    osc.stop(t + 1.0);
  }

  playCatalyst() {
    if (!this.isInitialized || !this.isEnabled) return;
    const t = this.ctx.currentTime;
    const notes = [330, 440, 554, 659];
    for (let i = 0; i < notes.length; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = notes[i];
      const start = t + i * 0.06;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.08 - i * 0.015, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
      osc.connect(gain);
      gain.connect(this.eventGain);
      osc.start(start);
      osc.stop(start + 0.3);
    }
  }

  // --- UI SOUNDS ---

  playPrune() {
    if (!this.isInitialized || !this.isEnabled) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1800 + Math.random() * 600;
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    osc.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  playBarrier() {
    if (!this.isInitialized || !this.isEnabled) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.08);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  playBarrierRemove() {
    if (!this.isInitialized || !this.isEnabled) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.06);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  playNurture() {
    if (!this.isInitialized || !this.isEnabled) return;
    const t = this.ctx.currentTime;
    // Warm ascending chime: A4 → C5 → E5
    const notes = [440, 523.25, 659.25];
    for (let i = 0; i < notes.length; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[i], t + i * 0.12);
      gain.gain.setValueAtTime(0, t + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.06, t + i * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.35);
      osc.connect(gain);
      gain.connect(this.uiGain);
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.4);
    }
    // Shimmer overtone
    const shim = this.ctx.createOscillator();
    const shimGain = this.ctx.createGain();
    shim.type = 'triangle';
    shim.frequency.setValueAtTime(1318.5, t + 0.15);
    shimGain.gain.setValueAtTime(0.015, t + 0.15);
    shimGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    shim.connect(shimGain);
    shimGain.connect(this.uiGain);
    shim.start(t + 0.15);
    shim.stop(t + 0.65);
  }

  playCooldown() {
    if (!this.isInitialized || !this.isEnabled) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = 'sawtooth';
    osc.frequency.value = 180;
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.uiGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  dispose() {
    this.stopAmbient();
    if (this.ctx && this.ctx.state !== 'closed') this.ctx.close();
  }
}

const audioEngine = new AudioEngine();

// Sync audio UI on load
if (!audioEngine.isEnabled) {
  document.getElementById('audio-icon-on').style.display = 'none';
  document.getElementById('audio-icon-off').style.display = '';
  document.getElementById('audio-label').textContent = 'Audio Off';
}

// Resume AudioContext on user gesture
document.addEventListener('click', function() {
  if (audioEngine.ctx && audioEngine.ctx.state === 'suspended') {
    audioEngine.ctx.resume();
  }
});

/* ═══════════════════════════════════════════
   ORGANISM (Generic Base)
   ═══════════════════════════════════════════ */
let uid = 0;
const contestedPairs = new Set(); // track organism pairs that have fought (for notifications)


/* ═══════════════════════════════════════════
   ADORNMENTS (micro-geometry details)
   ═══════════════════════════════════════════ */
class FungalAdornment {
  constructor(organism, scene) {
    this.organism = organism;
    this.scene = scene;

    // Hard cap for safety.
    this.MAX = 3500;

    // Distance normalization scale (core -> frontier). Prefer canvas radius if present.
    this._normScale = (organism.canvas && typeof organism.canvas.radius === 'number')
      ? (organism.canvas.radius * 2.0)
      : this._estimateNormScale();

    // Spawn control: keep things readable.
    this._pending = [];
    this._spawnedVerts = new Set();

    // Simple surface spacing (world-space hash grid).
    this._cellSize = 0.14 * Math.max(1.0, this._normScale * 0.15);
    this._grid = new Map();

    // Rate limiter (attempts per second), and a soft population target.
    this._spawnRate = 1.5; // attempts / sec (slow, meditative)
    this._attemptAcc = 0;

    // Growth animation for new instances
    this._time = 0;
    this._growDuration = 420.0; // seconds to sprout into mature size (slow, meditative)
    this._pinMin = 12.0; // seconds staying as visible pin
    this._pinMax = 40.0;

    // Long-tail aging growth (core mushrooms slowly mature over time)
    this._ageDuration = 900.0; // seconds for long-tail core maturation
    this._aging = []; // { mesh, index, pos, quat, baseScale, coreFactor, startTime }
    this._agingCursor = 0;
    this._growing = []; // { mesh, index, pos, quat, targetScale, startTime }

    // Mushroom families (instanced)
    this._families = [];
    this._initFamilies();

    // One "hero" mega mushroom at the core.
    this._hero = null;
    this._heroBaseScale = 0.25;
    this._initHero();
  }

  _estimateNormScale() {
    try {
      let maxLen = 1;
      const verts = this.organism.canvas?.vertices || [];
      for (let i = 0; i < verts.length; i++) {
        const p = verts[i].position;
        const L = Math.sqrt(p.x*p.x + p.y*p.y + p.z*p.z);
        if (L > maxLen) maxLen = L;
      }
      return maxLen * 2.0;
    } catch {
      return 10.0;
    }
  }

  _initFamilies() {
    const mkMushroomGeometry = (stemH=0.20, stemR=0.038, capR=0.14, capSquash=0.62) => {
      const stem = new THREE.CylinderGeometry(stemR*0.85, stemR, stemH, 8, 1, false);
      stem.translate(0, stemH*0.5, 0);

      const cap = new THREE.SphereGeometry(capR, 12, 10, 0, Math.PI*2, 0, Math.PI*0.58);
      cap.scale(1, capSquash, 1);
      cap.translate(0, stemH + capR*capSquash*0.55, 0);

      return mergeBufferGeometries([stem, cap]);
    };

    const mkShelfGeometry = (w=0.18, h=0.06, t=0.05) => {
      // A bracket/shelf fungus: squashed cap rotated sideways with a small nub.
      const cap = new THREE.SphereGeometry(w, 12, 10, 0, Math.PI*1.1, 0, Math.PI*0.62);
      cap.scale(1.0, h / w, t / w);
      cap.rotateZ(Math.PI * 0.5);
      cap.translate(0, 0.08, 0);

      const nub = new THREE.CylinderGeometry(0.03, 0.04, 0.08, 8, 1, false);
      nub.rotateZ(Math.PI * 0.5);
      nub.translate(0, 0.02, 0);

      return mergeBufferGeometries([nub, cap]);
    };
    const perturbGeometry = (geo, amp=0.010, yMin=-1e9, yMax=1e9, seed=1.0) => {
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        if (y < yMin || y > yMax) continue;
        const x = pos.getX(i), z = pos.getZ(i);
        const n = (hash3(x*11.7 + seed, y*9.3 + seed*2.1, z*13.1 + seed*3.7) - 0.5) * 2.0;
        const n2 = (hash3(x*7.1 + seed*4.2, y*5.9 + seed*1.3, z*8.4 + seed*0.9) - 0.5) * 2.0;
        pos.setX(i, x + n * amp * 0.6);
        pos.setZ(i, z + n2 * amp * 0.6);
        pos.setY(i, y + (n * amp * 0.25));
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      return geo;
    };

    const mkCoralGeometry = (h=0.22, r=0.020, branches=4) => {
      const parts = [];
      const base = new THREE.CylinderGeometry(r*1.25, r*1.6, h, 7, 1, false);
      base.translate(0, h*0.5, 0);
      parts.push(base);

      for (let i = 0; i < branches; i++) {
        const bh = h * lerp(0.45, 0.75, hash3(i*2.3, 4.1, 7.7));
        const br = r * lerp(0.85, 1.15, hash3(i*3.7, 2.2, 5.9));
        const b = new THREE.CylinderGeometry(br*0.85, br, bh, 6, 1, false);
        b.translate(0, bh*0.5, 0);

        const ang = (i / Math.max(1, branches)) * Math.PI*2 + hash3(i*1.1, 1.7, 9.2)*0.6;
        const tilt = lerp(0.35, 0.85, hash3(i*5.3, 6.6, 2.4));
        b.rotateZ(tilt);
        b.rotateY(ang);
        b.translate(Math.cos(ang)*r*2.2, h*0.55 + i*0.01, Math.sin(ang)*r*2.2);
        parts.push(b);
      }

      return mergeBufferGeometries(parts);
    };

    const mkShaggyGeometry = (stemH=0.20, stemR=0.034, capR=0.16) => {
      const core = mkMushroomGeometry(stemH, stemR, capR, 0.55);
      const spikes = [];
      const spikeCount = 18;
      for (let i = 0; i < spikeCount; i++) {
        const sH = capR * lerp(0.18, 0.35, hash3(i*1.9, 3.3, 8.8));
        const sR = capR * 0.06;
        const cone = new THREE.ConeGeometry(sR, sH, 5, 1);
        const ang = (i / spikeCount) * Math.PI*2;
        const ring = capR * lerp(0.45, 0.95, hash3(i*2.7, 7.1, 1.4));
        cone.translate(0, sH*0.5, 0);
        cone.rotateX(Math.PI);
        cone.rotateY(ang);
        cone.translate(Math.cos(ang)*ring, stemH + capR*0.48, Math.sin(ang)*ring);
        spikes.push(cone);
      }
      return mergeBufferGeometries([core, ...spikes]);
    };

    const mkPuffballClusterGeometry = (count=5, r=0.075) => {
      const parts = [];
      for (let i = 0; i < count; i++) {
        const rr = r * lerp(0.75, 1.15, hash3(i*2.1, 4.4, 7.0));
        const s = new THREE.SphereGeometry(rr, 10, 8);
        const ang = (i / count) * Math.PI*2 + hash3(i*1.3, 1.1, 9.9)*0.6;
        const rad = r * lerp(0.2, 0.9, hash3(i*3.3, 6.2, 2.8));
        const y = rr * lerp(0.55, 1.10, hash3(i*4.9, 2.6, 5.1));
        s.translate(Math.cos(ang)*rad, y, Math.sin(ang)*rad);
        parts.push(s);
      }
      return mergeBufferGeometries(parts);
    };



    const mkChanterelleGeometry = (stemH=0.20, stemR=0.030, funnelR=0.22, funnelH=0.18) => {
      // A funnel / chanterelle-like silhouette with a wavy rim.
      const stem = new THREE.CylinderGeometry(stemR*0.85, stemR, stemH, 10, 1, false);
      stem.translate(0, stemH*0.5, 0);

      // Open-sided funnel (use openEnded cylinder as cone-ish)
      const funnel = new THREE.CylinderGeometry(funnelR*0.10, funnelR, funnelH, 16, 1, true);
      funnel.translate(0, stemH + funnelH*0.45, 0);

      // Rim waviness: push top ring vertices outward/inward.
      const pa = funnel.getAttribute('position');
      for (let i = 0; i < pa.count; i++) {
        const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
        // top rim vertices have higher y
        const top = smoothstep(stemH + funnelH*0.55, stemH + funnelH*0.90, y);
        if (top > 0.001) {
          const a = Math.atan2(z, x);
          const w = Math.sin(a*5.0) * 0.06 + Math.sin(a*11.0) * 0.03;
          const r = Math.sqrt(x*x + z*z);
          const nr = r * (1.0 + w * top);
          const k = (r > 1e-6) ? (nr / r) : 1.0;
          pa.setX(i, x * k);
          pa.setZ(i, z * k);
        }
      }
      pa.needsUpdate = true;
      funnel.computeVertexNormals();

      return mergeBufferGeometries([stem, funnel]);
    };
    // Materials for instanced mushroom families

    const baseMat = (opts={}) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.62,
        metalness: 0.02,
        transmission: 0.10,
        thickness: 0.25,
        clearcoat: 0.10,
        clearcoatRoughness: 0.65,
        vertexColors: true,
        // Tiny emissive floor prevents "pure black" in shadow without looking neon.
        emissive: new THREE.Color(0x0a0806),
        emissiveIntensity: 0.35
      });
      return mat;
};

    // Families: each base family has a few geometry variants with baked vertex-color cap patterns.
// This avoids fragile shader injection (onBeforeCompile) while keeping rich, believable detail.
    const bakeVertexColors = (geo, patType, opts={}) => {
      const capY = (opts.capY != null) ? opts.capY : 0.20;
      const capBlend = (opts.capBlend != null) ? opts.capBlend : 0.10;
      const isShelf = !!opts.isShelf;

      const pos = geo.getAttribute('position');
      const colors = new Float32Array(pos.count * 3);

      const fract = (v) => v - Math.floor(v);
      const h2 = (x, z) => fract(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453);

      // Pattern scale per family (kept subtle).
      const pScale = (opts.pScale != null) ? opts.pScale : 1.0;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);

        // Cap mask: shelves are treated as all-cap. Others split on local Y.
        const capMask = isShelf ? 1.0 : smoothstep(capY - capBlend, capY + capBlend, y);

        // Base: slightly warm stem tone; caps start neutral.
        let r = 1.0, g = 1.0, b = 1.0;
        if (capMask < 0.5) { r = 0.94; g = 0.90; b = 0.84; }

        // Pattern on caps only (baked into vertex colors; instanceColor adds per-instance tint).
        let pat = 0.0;
        if (capMask > 0.001) {
          const px = x * pScale, pz = z * pScale;

          if (patType === 0) {
            // Spots / warts: cell hash, softened.
            const cx = Math.floor(px * 6.0 + 7.0);
            const cz = Math.floor(pz * 6.0 + 3.0);
            const n = h2(cx + patType * 13.1, cz + patType * 19.7);
            pat = smoothstep(0.80, 0.98, n);
          } else if (patType === 1) {
            // Concentric rings (turkey-tail-ish)
            const rr = Math.sqrt(px*px + pz*pz);
            const s = 0.5 + 0.5 * Math.sin(rr * 10.0 + 1.7);
            pat = smoothstep(0.55, 0.92, s);
          } else if (patType === 2) {
            // Radial striations
            const a = Math.atan2(pz, px);
            const s = 0.5 + 0.5 * Math.sin(a * 16.0 + 0.8);
            pat = smoothstep(0.50, 0.92, s);
          } else {
            // Honeycomb-ish (morel hint)
            const qx = px * 3.2, qz = pz * 3.2;
            const gx = fract(qx) - 0.5, gz = fract(qz) - 0.5;
            const d = Math.abs(gx * gz) * 6.0;
            pat = smoothstep(0.20, 0.62, d);
          }

          // Break up the pattern so it feels grown (irregular, incomplete), not stamped.
          const breakup = smoothstep(0.15, 0.95, h2(px*17.0 + 9.0, pz*19.0 + 3.0));
          const partial = smoothstep(0.25, 0.85, h2(px*7.0 + 2.3, pz*9.0 + 8.1));
          const pat2 = pat * (0.55 + 0.45 * breakup) * (0.35 + 0.65 * partial);

          // Apply as subtle modulation
          const dark = 1.0 - 0.22 * pat2 * capMask;
          const lift = 0.05 * pat2 * capMask;
r = Math.min(1.0, r * dark + lift);
          g = Math.min(1.0, g * dark + lift);
          b = Math.min(1.0, b * dark + lift);
        }

        colors[i*3+0] = r;
        colors[i*3+1] = g;
        colors[i*3+2] = b;
      }

      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.attributes.color.needsUpdate = true;
      return geo;
    };

    // Build variant sets and also keep a flat list for counting/disposal.
    this._familyVariants = { classic: [], flatcap: [], chanterelle: [], buttons: [], shelf: [], coral: [], shaggy: [], puffball: [] };
    this._families.length = 0;

    const makeVariants = ({ baseName, baseGeo, baseGeos, mat, scale, isCluster=false, isShelf=false, capY=0.20, capBlend=0.10, pScale=1.0, patTypes=[0,1,2] }) => {
      const patNames = {0:'spots',1:'rings',2:'striations',3:'honeycomb'};
      for (let k = 0; k < patTypes.length; k++) {
        const pt = patTypes[k];
        const geos = (baseGeos && baseGeos.length) ? baseGeos : [baseGeo];
        for (let v = 0; v < geos.length; v++) {
          const g0 = geos[v];
          const g = bakeVertexColors(g0.clone(), pt, { capY, capBlend, isShelf, pScale });
          const m = this._makeFamily({
          name: baseName + '_' + (patNames[pt] || 'pat'+pt),
          geo: g,
          mat,
          scale,
          isCluster,
          isShelf
        });
        m.userData._baseName = baseName;
        m.userData._patType = pt;
        this._familyVariants[baseName].push(m);
        this._families.push(m);
        }
      }
    };

    const matClassic = baseMat();
    const matFlat = baseMat();
    const matChan = baseMat();
    const matButtons = baseMat();
    const matShelf = baseMat();
    const matCoral = baseMat();
    const matShaggy = baseMat();
    const matPuff = baseMat();

    // A: classic cap
    makeVariants({
      baseName: 'classic',
      baseGeo: mkMushroomGeometry(0.22, 0.038, 0.15, 0.62),
      mat: matClassic,
      scale: { min: 0.18, max: 0.90 },
      capY: 0.22, capBlend: 0.10, pScale: 1.0,
      patTypes: [0,1,2]
    });

    // B: flatter caps
    makeVariants({
      baseName: 'flatcap',
      baseGeo: mkMushroomGeometry(0.20, 0.034, 0.18, 0.45),
      mat: matFlat,
      scale: { min: 0.18, max: 0.82 },
      capY: 0.18, capBlend: 0.10, pScale: 1.0,
      patTypes: [1,2,0]
    });

    // B2: chanterelle / funnel (wavy rim)
    makeVariants({
      baseName: 'chanterelle',
      baseGeo: mkChanterelleGeometry(0.20, 0.030, 0.22, 0.18),
      mat: matChan,
      scale: { min: 0.16, max: 0.82 },
      capY: 0.20, capBlend: 0.12, pScale: 0.9,
      patTypes: [2,1,0]
    });

    // C: button clusters (tiny)
    makeVariants({
      baseName: 'buttons',
      baseGeo: mkMushroomGeometry(0.14, 0.028, 0.10, 0.70),
      mat: matButtons,
      scale: { min: 0.12, max: 0.55 },
      isCluster: true,
      capY: 0.14, capBlend: 0.08, pScale: 1.1,
      patTypes: [0,2,1]
    });

    // D: shelf / bracket fungi
    makeVariants({
      baseName: 'shelf',
      baseGeo: mkShelfGeometry(0.20, 0.07, 0.06),
      mat: matShelf,
      scale: { min: 0.16, max: 0.75 },
      isShelf: true,
      capY: 0.00, capBlend: 0.20, pScale: 0.85,
      patTypes: [1,0,2]
    });

    // E: coral / branching fungus
    makeVariants({
      baseName: 'coral',
      baseGeos: [
        mkCoralGeometry(0.22, 0.020, 4),
        perturbGeometry(mkCoralGeometry(0.22, 0.020, 5), 0.012, 0.05, 1e9, 2.3),
      ],
      baseGeo: mkCoralGeometry(0.22, 0.020, 4),
      mat: matCoral,
      scale: { min: 0.12, max: 0.60 },
      capY: 0.18, capBlend: 0.18, pScale: 0.9,
      patTypes: [2,0,1]
    });

    // F: shaggy mane (frayed cap)
    makeVariants({
      baseName: 'shaggy',
      baseGeos: [
        mkShaggyGeometry(0.20, 0.034, 0.16),
        perturbGeometry(mkShaggyGeometry(0.20, 0.034, 0.16), 0.010, 0.18, 1e9, 4.7),
      ],
      baseGeo: mkShaggyGeometry(0.20, 0.034, 0.16),
      mat: matShaggy,
      scale: { min: 0.14, max: 0.78 },
      capY: 0.20, capBlend: 0.12, pScale: 1.0,
      patTypes: [0,2,1]
    });

    // G: puffball clusters (stemless)
    makeVariants({
      baseName: 'puffball',
      baseGeos: [
        mkPuffballClusterGeometry(5, 0.075),
        mkPuffballClusterGeometry(7, 0.070),
      ],
      baseGeo: mkPuffballClusterGeometry(5, 0.075),
      mat: matPuff,
      scale: { min: 0.10, max: 0.55 },
      isCluster: true,
      capY: 0.10, capBlend: 0.18, pScale: 0.9,
      patTypes: [0,1,2]
    });

  }

  
  _makeFamily({ name, geo, mat, scale, isCluster=false, isShelf=false }) {
    const mesh = new THREE.InstancedMesh(geo, mat, this.MAX);
    mesh.frustumCulled = false;
    mesh.count = 0;

    mesh.renderOrder = 4;
    mesh.userData._scale = scale;
    mesh.userData._isCluster = isCluster;
    mesh.userData._isShelf = isShelf;
    this.scene.add(mesh);
    return mesh;
  }

  _initHero() {
    const spawn = this.organism.spawnVertex;
    if (!spawn) return;

    const geo = (() => {
      const stem = new THREE.CylinderGeometry(0.06, 0.075, 0.45, 10, 1, false);
      stem.translate(0, 0.225, 0);
      const cap = new THREE.SphereGeometry(0.26, 18, 14, 0, Math.PI*2, 0, Math.PI*0.62);
      cap.scale(1.0, 0.58, 1.0);
      cap.translate(0, 0.45 + 0.26*0.58*0.52, 0);
      return mergeBufferGeometries([stem, cap]);
    })();

    const mat = new THREE.MeshPhysicalMaterial({
      // Older, woody core tone (substrate-like) so the fruiting bodies read as the stars.
      color: new THREE.Color().setHSL(0.10, 0.22, 0.62),
      roughness: 0.72,
      metalness: 0.01,
      transmission: 0.10,
      thickness: 0.28,
      clearcoat: 0.10,
      clearcoatRoughness: 0.75
    });

    const mesh = new THREE.Mesh(geo, mat);

    mesh.renderOrder = 5;

    const p = spawn.position.clone();
    let n;
    if (this.organism.canvas && typeof this.organism.canvas.radius === 'number') {
      n = p.clone().normalize();
    } else {
      n = (spawn.normal || new THREE.Vector3(0,1,0)).clone().normalize();
    }
    const up = new THREE.Vector3(0,1,0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, n);

    // Slight lean so it feels organic.
    const lean = (hash3(p.x*1.3, p.y*1.3, p.z*1.3) - 0.5) * 0.25;
    const qLean = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), lean);
    quat.multiply(qLean);

    mesh.position.copy(p).addScaledVector(n, 0.02);
    mesh.quaternion.copy(quat);
    mesh.scale.setScalar(this._heroBaseScale);

    // Store data for substrate height tracking
    this._heroVi = spawn.index;
    this._heroBasePos = p.clone();
    this._heroBaseNormal = n.clone();
    this._heroLift = 0.02;

    this.scene.add(mesh);
    this._hero = mesh;
  }

  dispose() {
    for (const m of this._families) {
      this.scene.remove(m);
      m.geometry.dispose();
      m.material.dispose();
    }
    this._families.length = 0;

    if (this._hero) {
      // Dispose hero satellites if present.
      if (this._heroBabies) {
        this._hero.remove(this._heroBabies);
        this._heroBabies.geometry.dispose();
        this._heroBabies.material.dispose();
        this._heroBabies = null;
        this._heroBabyPts = null;
      }

      this.scene.remove(this._hero);
      this._hero.geometry.dispose();
      this._hero.material.dispose();
      this._hero = null;
    }

    this._pending.length = 0;
    this._growing.length = 0;
    this._spawnedVerts.clear();
    this._grid.clear();
  }

  onClaim(v) {
    if (!v) return;
    if (this._spawnedVerts.has(v.index)) return;
    this._spawnedVerts.add(v.index);
    this._pending.push(v.index);
  }

  update(dt) {
    this._time += dt;

    // Animate newly spawned mushrooms (scale-in).
    if (this._growing.length) this._updateGrowing();

    // Slow, long-tail maturation for older/core mushrooms.
    if (this._aging.length) this._updateAging(dt);

    // Grow hero mega mushroom with organism maturity.
    this._updateHero(dt);

    // Soft population target: grows with territory but stays readable.
    const claimedN = this.organism.claimed?.size || 0;
    const target = Math.min(this.MAX, Math.floor(18 * Math.sqrt(Math.max(1, claimedN))));
    const current = this._families.reduce((sum, f) => sum + (f.count || 0), 0);
    if (current >= target) return;

    // Rate-limited spawn attempts.
    this._attemptAcc += dt * this._spawnRate;
    const budget = Math.min(6, Math.floor(this._attemptAcc));
    if (budget <= 0) return;
    this._attemptAcc -= budget;

    for (let i = 0; i < budget; i++) {
      if (!this._pending.length) break;

      // Pull a random pending vertex for patchy distribution.
      const j = (hash3(this._time + i*0.77, i*1.91, 9.13) * this._pending.length) | 0;
      const vi = this._pending[j];

      const v = this.organism.canvas?.vertices?.[vi];
      if (!v) continue;

      // Distance falloff for ecology.
      const spawnP = this.organism.spawnVertex?.position || new THREE.Vector3();
      const p = v.position;
      const dx = p.x - spawnP.x, dy = p.y - spawnP.y, dz = p.z - spawnP.z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      const t = clamp(dist / (this._normScale || 10), 0, 1); // 0 core, 1 frontier

      // Spawn probability is modest and depends on ring.
      // Core: higher, Frontier: very low.
      const baseProb = lerp(0.18, 0.05, smoothstep(0.02, 0.92, t));
      const r = hash3(p.x*2.3, p.y*2.3, p.z*2.3);
      if (r > baseProb) continue;

      // Spacing: keep silhouettes readable.
      const minDist = lerp(0.20, 0.10, t) * Math.max(0.6, lerp(1.0, 0.7, r));
      if (!this._canPlace(p, minDist)) continue;

      const family = this._pickFamily(p, t);
      if (!family) continue;

      // Cluster behavior
      const isCluster = !!family.userData._isCluster;
      const clusterCount = isCluster ? (r < 0.10 ? 3 : (r < 0.28 ? 2 : 1)) : 1;

      for (let c = 0; c < clusterCount; c++) {
        this._spawnOne(family, v, t, c);
      }

      // Remove this pending vertex only once it successfully spawned.
      this._pending[j] = this._pending[this._pending.length - 1];
      this._pending.pop();

      // Try to keep up with the target but avoid filling instantly.
      const nowCount = this._families.reduce((sum, f) => sum + (f.count || 0), 0);
      if (nowCount >= target) break;
    }
  }

  _updateHero(dt) {
    if (!this._hero) return;

    // Track substrate height
    const heightArr = this.organism.heightArr;
    if (heightArr && this._heroVi != null && this._heroBasePos) {
      const h = heightArr[this._heroVi] || 0;
      const pos = this._heroBasePos.clone().addScaledVector(this._heroBaseNormal, h + this._heroLift);
      this._hero.position.copy(pos);
    }

    const claimedN = this.organism.claimed?.size || 0;

    // Maturity rises with territory but saturates.
    const maturity = clamp(Math.sqrt(claimedN / 160.0), 0, 2.4);
    const m01 = clamp(maturity / 2.2, 0, 1);

    // Hero: slow -> strong -> plateau (a single mother structure).
    const targetScale = this._heroBaseScale * (1.0 + 1.85 * smoothstep(0.05, 1.0, m01));
    const s = this._hero.scale.x;
    const ns = lerp(s, targetScale, clamp(dt * 0.60, 0, 1));
    this._hero.scale.setScalar(ns);
  }


  _updateGrowing() {
    const heightArr = this.organism.heightArr;
    const keep = [];
    for (let i = 0; i < this._growing.length; i++) {
      const g = this._growing[i];
      const elapsed = (this._time - g.startTime);

      // Recompute position from current substrate height
      let pos = g.pos;
      if (heightArr && g.vi != null && g.basePos && g.baseNormal) {
        const h = heightArr[g.vi] || 0;
        pos = g.basePos.clone()
          .addScaledVector(g.baseNormal, h + g.normalLift)
          .add(g.tangentOffset);
      }

      // Stage 1: remain a tiny pin for a while (especially on the frontier).
      const pinTime = g.pinTime || this._pinMin;
      const pinScale = g.pinScale || 0.048;

      let sc = pinScale;

      if (elapsed > pinTime) {
        // Stage 2: slow sprout into the target scale.
        const t = clamp((elapsed - pinTime) / this._growDuration, 0, 1);
        const k = t * t * (3 - 2*t); // smoothstep
        sc = lerp(pinScale, g.targetScale, k);
      }

      const m = new THREE.Matrix4();
      m.compose(pos, g.quat, new THREE.Vector3(sc, sc, sc));
      g.mesh.setMatrixAt(g.index, m);
      g.mesh.instanceMatrix.needsUpdate = true;

      // Keep updating until sprout is complete, then hand off to aging.
      if (elapsed <= (pinTime + this._growDuration)) {
        keep.push(g);
      } else {
        if (!g._aged) {
          g._aged = true;
          this._aging.push({
            mesh: g.mesh,
            index: g.index,
            vi: g.vi,
            basePos: g.basePos,
            baseNormal: g.baseNormal,
            normalLift: g.normalLift,
            tangentOffset: g.tangentOffset,
            pos,
            quat: g.quat,
            baseScale: g.targetScale,
            coreFactor: g.coreFactor ?? 0.0,
            startTime: g.startTime,
          });
        }
      }
    }
    this._growing = keep;
  }


  _updateAging(dt) {
    if (!this._aging.length) return;

    // Update a limited budget per frame to keep perf stable.
    const budget = 90;
    const heightArr = this.organism.heightArr;
    const up = new THREE.Vector3(0, 1, 0);
    let n = 0;

    for (; n < budget && this._aging.length; n++) {
      const idx = this._agingCursor % this._aging.length;
      const a = this._aging[idx];

      // Recompute position from current substrate height
      let pos = a.pos;
      if (heightArr && a.vi != null && a.basePos && a.baseNormal) {
        const h = heightArr[a.vi] || 0;
        pos = a.basePos.clone()
          .addScaledVector(a.baseNormal, h + a.normalLift)
          .add(a.tangentOffset);
        a.pos = pos; // update stored position for final placement
      }

      const ageT = clamp((this._time - a.startTime) / this._ageDuration, 0, 1);
      const k = ageT * ageT * (3 - 2 * ageT); // smoothstep

      // Core mushrooms continue growing the most; frontier barely changes.
      const growMul = 1.0 + (0.55 * (a.coreFactor || 0.0) * k);
      const sc = a.baseScale * growMul;

      const m = new THREE.Matrix4();
      m.compose(pos, a.quat, new THREE.Vector3(sc, sc, sc));
      a.mesh.setMatrixAt(a.index, m);
      a.mesh.instanceMatrix.needsUpdate = true;

      // Once fully aged, remove from list to stop updating.
      if (ageT >= 1.0) {
        this._aging.splice(idx, 1);
        // keep cursor stable
        if (this._aging.length) this._agingCursor %= this._aging.length;
      } else {
        this._agingCursor = (idx + 1) % this._aging.length;
      }
    }
  }


  _pickFamily(p, t) {
    // Patch coherence: stable hash drives base family choice.
    const h = hash3(p.x*1.7, p.y*1.7, p.z*1.7);

    // t: 0 = core, 1 = frontier
    // Core: shelves + shaggy + coral + chanterelles. Frontier: buttons + puffballs.
    let wShelf    = lerp(0.22, 0.08, t);
    let wShaggy   = lerp(0.18, 0.10, t);
    let wCoral    = lerp(0.14, 0.08, t);
    let wChanter  = lerp(0.18, 0.12, t);
    let wClassic  = lerp(0.14, 0.10, t);
    let wFlat     = lerp(0.08, 0.10, t);
    let wButtons  = lerp(0.04, 0.28, t);
    let wPuffball = lerp(0.02, 0.14, t);

    // Normalize.
    const sum = wShelf+wShaggy+wCoral+wChanter+wClassic+wFlat+wButtons+wPuffball;
    wShelf/=sum; wShaggy/=sum; wCoral/=sum; wChanter/=sum;
    wClassic/=sum; wFlat/=sum; wButtons/=sum; wPuffball/=sum;

    let base = 'buttons';
    let acc = wShelf;
    if (h < acc) base = 'shelf';
    else {
      acc += wShaggy;
      if (h < acc) base = 'shaggy';
      else {
        acc += wCoral;
        if (h < acc) base = 'coral';
        else {
          acc += wChanter;
          if (h < acc) base = 'chanterelle';
          else {
            acc += wClassic;
            if (h < acc) base = 'classic';
            else {
              acc += wFlat;
              if (h < acc) base = 'flatcap';
              else {
                acc += wButtons;
                if (h < acc) base = 'buttons';
                else base = 'puffball';
              }
            }
          }
        }
      }
    }

    const vars = this._familyVariants[base] || this._families;
    if (!vars.length) return this._families[(h * this._families.length) | 0];
    return vars[(h * vars.length) | 0];
  }



  _cellKey(p, cellSize) {
    const x = Math.floor(p.x / cellSize);
    const y = Math.floor(p.y / cellSize);
    const z = Math.floor(p.z / cellSize);
    return x + '|' + y + '|' + z;
  }

  _canPlace(p, minDist) {
    const cs = Math.max(0.06, this._cellSize);
    const key = this._cellKey(p, cs);
    const parts = key.split('|').map(n => parseInt(n, 10));
    const [cx, cy, cz] = parts;

    const r = 1; // check neighbor cells
    const minD2 = minDist * minDist;

    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dz = -r; dz <= r; dz++) {
          const k = (cx+dx) + '|' + (cy+dy) + '|' + (cz+dz);
          const arr = this._grid.get(k);
          if (!arr) continue;
          for (let i = 0; i < arr.length; i++) {
            const q = arr[i];
            const ddx = p.x - q.x, ddy = p.y - q.y, ddz = p.z - q.z;
            const d2 = ddx*ddx + ddy*ddy + ddz*ddz;
            if (d2 < minD2) return false;
          }
        }
      }
    }

    // Accept: register point
    if (!this._grid.has(key)) this._grid.set(key, []);
    this._grid.get(key).push({ x: p.x, y: p.y, z: p.z });

    // Keep memory bounded (rough cap per cell)
    const cell = this._grid.get(key);
    if (cell.length > 12) cell.shift();

    return true;
  }

  _spawnOne(family, v, t, clusterIndex) {
    if (!family || family.count >= this.MAX) return;

    const p = v.position;
    let n;
    if (this.organism.canvas && typeof this.organism.canvas.radius === 'number') {
      n = p.clone().normalize(); // true radial outward for sphere
    } else {
      n = (v.normal || new THREE.Vector3(0,1,0)).clone().normalize();
      const outward = p.clone().normalize();
      if (n.dot(outward) < 0) n.negate();
    }


    // Base orientation
    const up = new THREE.Vector3(0,1,0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, n);

    // If shelf fungus: rotate to grow sideways along tangent.
    if (family.userData._isShelf) {
      const twistShelf = (hash3(p.x+11.0, p.y+3.0, p.z+7.0) - 0.5) * Math.PI * 1.2;
      const qTw = new THREE.Quaternion().setFromAxisAngle(n, twistShelf);
      quat.multiply(qTw);

      const qSide = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI*0.45);
      quat.multiply(qSide);
    } else {
      const twist = (hash3(p.x + clusterIndex*0.7, p.y, p.z) - 0.5) * 0.9;
      const lean  = (hash3(p.x, p.y + clusterIndex*0.9, p.z) - 0.5) * 0.30;
      const q2 = new THREE.Quaternion().setFromAxisAngle(n, twist);
      quat.multiply(q2);
      const qLean = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), lean);
      quat.multiply(qLean);
    }

    // Size: strong core->frontier gradient
    const sRange = family.userData._scale || {min:0.15, max:0.85};
    const sJit = hash3(p.x*2.1 + clusterIndex*0.5, p.y*2.1, p.z*2.1);
    const base = lerp(sRange.max, sRange.min, t);
    const s = base * lerp(0.75, 1.18, sJit);

    // Position offset + cluster spread
    const tangent = new THREE.Vector3(1,0,0).applyQuaternion(quat).normalize();
    const bitan = new THREE.Vector3(0,0,1).applyQuaternion(quat).normalize();
    const spread = clusterIndex ? 0.05 * (clusterIndex) : 0.0;
    const jitter = (hash3(p.x+9.1*clusterIndex, p.y+2.3, p.z+6.7) - 0.5) * 0.09;

    // Separate normal lift from tangent offsets for height tracking
    const normalLift = 0.030 + 0.040 * clamp(s, 0.0, 1.5);
    const tangentOffset = new THREE.Vector3()
      .addScaledVector(tangent, spread)
      .addScaledVector(bitan, jitter);

    // Read current substrate height
    const h = this.organism.heightArr ? (this.organism.heightArr[v.index] || 0) : 0;

    const pos = new THREE.Vector3().copy(p)
      .addScaledVector(n, h + normalLift)
      .add(tangentOffset);

    const index = family.count;

        // Color & pattern: biologically-plausible palettes + per-patch coherence.
    // (No clown RGB; think forest floor: creams, ochres, rusts, smoky grays, bruised purples.)
    const patch = hash3(p.x*0.37, p.y*0.37, p.z*0.37);
    const k = hash3(p.x+1.1, p.y+3.3, p.z+5.5);

    const palettes = [
      // [h, s, l] cap base (HSL in 0..1)
      [0.09, 0.30, 0.70], // cream/ochre
      [0.06, 0.38, 0.62], // warm tan
      [0.03, 0.55, 0.52], // rust/brown
      [0.72, 0.22, 0.55], // bruised violet/gray
      [0.10, 0.18, 0.50], // smoky umber
    ];
    const pi = Math.floor(patch * palettes.length) % palettes.length;
    let [h0, s0, l0] = palettes[pi];

    // Core gets a bit richer/brighter; frontier slightly duller.
    const coreBoost = lerp(1.12, 0.88, t);
    const sat = clamp((s0 * lerp(0.85, 1.25, k)) * lerp(1.05, 0.85, t), 0.10, 0.72);
    const lit = clamp((l0 * lerp(0.90, 1.10, hash3(p.x+7.7, p.y+8.8, p.z+9.9))) * coreBoost, 0.42, 0.86);

    // Slight hue drift (within a palette), not rainbow.
    const hue = (h0 + (hash3(p.x*1.9, p.y*1.1, p.z*1.3) - 0.5) * 0.035 + 1.0) % 1.0;

    const col = new THREE.Color().setHSL(hue, sat, lit);
    family.setColorAt(index, col);

    // Per-instance pattern controls (subtle, cap-only in shader).
    const seed = hash3(p.x*3.13 + clusterIndex*0.77, p.y*2.71, p.z*3.91);

    // Pattern type by family, with slight patch variation.

    // Spawn with scale 0, animate to target.
    const m = new THREE.Matrix4();
    m.compose(pos, quat, new THREE.Vector3(0.001, 0.001, 0.001));
    family.setMatrixAt(index, m);

    family.count += 1;
    family.instanceMatrix.needsUpdate = true;
    if (family.instanceColor) family.instanceColor.needsUpdate = true;

    this._growing.push({
      mesh: family,
      index,
      pos,
      quat,
      vi: v.index,               // vertex index for height lookup
      basePos: p.clone(),        // undisplaced sphere position
      baseNormal: n.clone(),     // outward-facing normal
      normalLift,                // lift along normal
      tangentOffset: tangentOffset.clone(),
      targetScale: s,
        coreFactor: clamp(1.0 - t, 0, 1),
        pinTime: lerp(this._pinMin, this._pinMax, 1.0 - clamp(1.0 - t, 0, 1)) + (hash3(v.index*1.13, this._time*0.17, 4.7) * 10.0),
        pinScale: lerp(0.032, 0.060, hash3(v.index*0.71, 2.9, 8.1)),
        startTime: this._time
    });
  }
}

// Minimal geometry merge helper (avoids BufferGeometryUtils dependency)
function mergeBufferGeometries(geos) {
  const merged = new THREE.BufferGeometry();
  let positions = [];
  let normals = [];
  let uvs = [];
  let indices = [];
  let vertOffset = 0;

  for (const g of geos) {
    const geo = g.index ? g.toNonIndexed() : g;
    const pa = geo.getAttribute('position');
    const na = geo.getAttribute('normal');
    const ua = geo.getAttribute('uv');

    for (let i = 0; i < pa.count; i++) {
      positions.push(pa.getX(i), pa.getY(i), pa.getZ(i));
      if (na) normals.push(na.getX(i), na.getY(i), na.getZ(i));
      if (ua) uvs.push(ua.getX(i), ua.getY(i));
    }

    // Non-indexed geometry; create sequential indices
    for (let i = 0; i < pa.count; i++) {
      indices.push(vertOffset + i);
    }
    vertOffset += pa.count;

    // Dispose intermediates if they are throwaways
    // (We keep originals alive only during construction)
  }

  merged.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  if (normals.length) merged.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  if (uvs.length) merged.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  merged.setIndex(indices);
  merged.computeBoundingSphere();
  return merged;
}


/* ═══════════════════════════════════════════
   GLB MODEL LOADING & ANIMATED INSTANCING
   ═══════════════════════════════════════════ */

/**
 * ModelRegistry — loads GLB models, normalizes geometry, caches by name.
 *
 * Usage:
 *   await modelRegistry.load('coral-branch', 'data:application/octet-stream;base64,...', { targetHeight: 0.25 });
 *   const geo = modelRegistry.get('coral-branch'); // BufferGeometry ready for InstancedMesh
 */
const modelRegistry = {
  _cache: new Map(),
  _loader: new GLTFLoader(),

  /**
   * Load a GLB model and normalize it for use in instanced meshes.
   * @param {string} name - Registry key
   * @param {string} url - URL or data URI for the .glb file
   * @param {Object} opts
   * @param {number} opts.targetHeight - Desired height in world units (default 0.25)
   * @param {boolean} opts.centerXZ - Center on XZ plane (default true)
   * @param {boolean} opts.floorY - Move bottom to Y=0 (default true)
   * @returns {Promise<THREE.BufferGeometry>}
   */
  async load(name, url, opts = {}) {
    if (this._cache.has(name)) return this._cache.get(name);

    const targetHeight = opts.targetHeight ?? 0.25;
    const centerXZ = opts.centerXZ ?? true;
    const floorY = opts.floorY ?? true;

    return new Promise((resolve, reject) => {
      this._loader.load(url, (gltf) => {
        // Extract all mesh geometries from the scene and merge
        const geometries = [];
        gltf.scene.traverse((child) => {
          if (child.isMesh && child.geometry) {
            // Apply any transforms baked into the scene graph
            child.updateWorldMatrix(true, false);
            const geo = child.geometry.clone();
            geo.applyMatrix4(child.matrixWorld);
            geometries.push(geo);
          }
        });

        if (geometries.length === 0) {
          reject(new Error(`No mesh geometry found in model '${name}'`));
          return;
        }

        // Merge all geometries into one
        const merged = geometries.length === 1 ? geometries[0] : mergeBufferGeometries(geometries);
        merged.computeBoundingBox();

        const box = merged.boundingBox;
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Normalize: scale to target height
        const scale = targetHeight / Math.max(size.y, 0.001);
        merged.scale(scale, scale, scale);

        // Recompute after scale
        merged.computeBoundingBox();
        const box2 = merged.boundingBox;
        const center2 = new THREE.Vector3();
        box2.getCenter(center2);

        // Center XZ
        if (centerXZ) {
          merged.translate(-center2.x, 0, -center2.z);
        }

        // Floor Y (bottom of bounding box at y=0)
        if (floorY) {
          merged.computeBoundingBox();
          merged.translate(0, -merged.boundingBox.min.y, 0);
        }

        merged.computeVertexNormals();
        merged.computeBoundingSphere();

        // Add a normalized height attribute (0 at base, 1 at top) for sway animation
        const posArr = merged.getAttribute('position');
        merged.computeBoundingBox();
        const minY = merged.boundingBox.min.y;
        const maxY = merged.boundingBox.max.y;
        const hRange = maxY - minY || 1;
        const heightNorm = new Float32Array(posArr.count);
        for (let i = 0; i < posArr.count; i++) {
          heightNorm[i] = (posArr.getY(i) - minY) / hRange;
        }
        merged.setAttribute('aHeightNorm', new THREE.BufferAttribute(heightNorm, 1));

        this._cache.set(name, merged);
        console.log(`ModelRegistry: loaded '${name}' (${posArr.count} verts, scaled ${scale.toFixed(3)}x)`);
        resolve(merged);
      }, undefined, (err) => {
        console.error(`ModelRegistry: failed to load '${name}':`, err);
        reject(err);
      });
    });
  },

  get(name) {
    return this._cache.get(name) || null;
  },

  has(name) {
    return this._cache.has(name);
  },

  dispose(name) {
    const geo = this._cache.get(name);
    if (geo) { geo.dispose(); this._cache.delete(name); }
  },

  disposeAll() {
    for (const geo of this._cache.values()) geo.dispose();
    this._cache.clear();
  },

  _manifest: null,

  /**
   * Load manifest.json and pre-load all GLB models listed in it.
   * Silently falls back to procedural geometry if manifest or any model is missing.
   */
  async loadFromManifest(manifestUrl = 'models/manifest.json') {
    try {
      const resp = await fetch(manifestUrl);
      if (!resp.ok) {
        console.log('ModelRegistry: no manifest found, using procedural geometry');
        return;
      }
      this._manifest = await resp.json();
      const basePath = this._manifest.basePath || 'models/';

      // Gather all model entries from all categories
      const allEntries = [];
      for (const key of ['coral', 'fungal']) {
        if (Array.isArray(this._manifest[key])) {
          for (const entry of this._manifest[key]) {
            allEntries.push(entry);
          }
        }
      }
      // Hero models
      if (this._manifest.hero) {
        for (const heroEntry of Object.values(this._manifest.hero)) {
          if (heroEntry && heroEntry.file) allEntries.push(heroEntry);
        }
      }

      // Load all in parallel, tolerating individual failures
      const results = await Promise.allSettled(
        allEntries.map(entry =>
          this.load(entry.id, basePath + entry.file, { targetHeight: entry.targetHeight })
        )
      );

      const loaded = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      console.log(`ModelRegistry: ${loaded} models loaded, ${failed} unavailable (procedural fallback)`);
    } catch (e) {
      console.log('ModelRegistry: manifest loading failed, using procedural geometry:', e.message);
    }
  },

  /**
   * Get manifest configs for a seed type, filtered to only those whose GLBs actually loaded.
   * Returns [] if no manifest or no loaded models for this type.
   */
  getModelsForSeed(seedType) {
    if (!this._manifest) return [];
    const entries = this._manifest[seedType];
    if (!Array.isArray(entries)) return [];
    return entries.filter(entry => this.has(entry.id));
  },

  /**
   * Get hero model config for a seed type (if loaded).
   * Returns null if unavailable.
   */
  getHeroForSeed(seedType) {
    if (!this._manifest || !this._manifest.hero) return null;
    const entry = this._manifest.hero[seedType];
    if (!entry || !this.has(entry.id)) return null;
    return entry;
  }
};


/**
 * Create a ShaderMaterial for instanced meshes with organic sway animation.
 *
 * Supports:
 * - Per-instance color (via instanceColor attribute)
 * - Per-instance random phase (via aInstancePhase attribute)
 * - Vertex displacement weighted by height (tips sway more than base)
 * - Configurable sway speed, strength, and direction
 *
 * @param {Object} opts
 * @param {THREE.Color} opts.baseColor - Base diffuse color (default white, tinted by instance color)
 * @param {number} opts.roughness - PBR roughness (default 0.7)
 * @param {number} opts.emissiveIntensity - Glow strength (default 0.2)
 * @param {number} opts.swayStrength - Max displacement in world units (default 0.015)
 * @param {number} opts.swaySpeed - Oscillation speed (default 1.2)
 * @param {boolean} opts.transparent - Enable alpha blending (default false)
 * @param {number} opts.opacity - Alpha (default 1.0)
 * @returns {THREE.ShaderMaterial}
 */
function createSwayMaterial(opts = {}) {
  const baseColor = opts.baseColor || new THREE.Color(1, 1, 1);
  const roughness = opts.roughness ?? 0.7;
  const emissiveIntensity = opts.emissiveIntensity ?? 0.2;
  const swayStrength = opts.swayStrength ?? 0.015;
  const swaySpeed = opts.swaySpeed ?? 1.2;
  const transparent = opts.transparent ?? false;
  const opacity = opts.opacity ?? 1.0;

  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSwayStrength: { value: swayStrength },
      uSwaySpeed: { value: swaySpeed },
      uBaseColor: { value: baseColor },
      uRoughness: { value: roughness },
      uEmissiveIntensity: { value: emissiveIntensity },
      uOpacity: { value: opacity },
      // Lighting (simplified 3-light setup matching scene)
      uLightDir1: { value: new THREE.Vector3(0.5, 1.0, 0.3).normalize() },
      uLightColor1: { value: new THREE.Color(1.0, 0.95, 0.85) },
      uLightDir2: { value: new THREE.Vector3(-0.4, 0.6, -0.5).normalize() },
      uLightColor2: { value: new THREE.Color(0.6, 0.65, 0.8) },
      uAmbient: { value: new THREE.Color(0.15, 0.13, 0.12) },
    },
    vertexShader: `
      attribute float aHeightNorm;
      attribute float aInstancePhase;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vInstanceColor;
      varying float vHeightNorm;

      uniform float uTime;
      uniform float uSwayStrength;
      uniform float uSwaySpeed;

      void main() {
        vHeightNorm = aHeightNorm;

        // Per-instance color (from instanceColor buffer)
        #ifdef USE_INSTANCING_COLOR
          vInstanceColor = instanceColor;
        #else
          vInstanceColor = vec3(1.0);
        #endif

        // Sway displacement: height-weighted sine wave with per-instance phase
        float phase = aInstancePhase;
        float heightWeight = aHeightNorm * aHeightNorm; // quadratic: tips move much more
        float swayX = sin(uTime * uSwaySpeed + phase * 6.283) * heightWeight * uSwayStrength;
        float swayZ = cos(uTime * uSwaySpeed * 0.7 + phase * 6.283 + 1.57) * heightWeight * uSwayStrength * 0.6;
        // Slight vertical pulse (breathing)
        float swayY = sin(uTime * uSwaySpeed * 0.4 + phase * 3.14) * heightWeight * uSwayStrength * 0.15;

        vec3 displaced = position + vec3(swayX, swayY, swayZ);

        // Standard instanced transform
        vec4 worldPos = instanceMatrix * vec4(displaced, 1.0);
        vWorldPos = worldPos.xyz;
        vNormal = normalize((instanceMatrix * vec4(normal, 0.0)).xyz);

        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      precision highp float;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vInstanceColor;
      varying float vHeightNorm;

      uniform vec3 uBaseColor;
      uniform float uRoughness;
      uniform float uEmissiveIntensity;
      uniform float uOpacity;
      uniform vec3 uLightDir1;
      uniform vec3 uLightColor1;
      uniform vec3 uLightDir2;
      uniform vec3 uLightColor2;
      uniform vec3 uAmbient;

      void main() {
        vec3 N = normalize(vNormal);
        vec3 diffuseColor = uBaseColor * vInstanceColor;

        // Two-light diffuse
        float NdL1 = max(dot(N, uLightDir1), 0.0);
        float NdL2 = max(dot(N, uLightDir2), 0.0);
        vec3 lighting = uAmbient
          + uLightColor1 * NdL1 * 0.8
          + uLightColor2 * NdL2 * 0.4;

        // Fake subsurface scattering for organic look (light through thin parts)
        float sss = max(0.0, dot(-N, uLightDir1)) * vHeightNorm * 0.15;

        vec3 color = diffuseColor * lighting + diffuseColor * sss;

        // Emissive glow (stronger at tips for anemones etc)
        color += diffuseColor * uEmissiveIntensity * (0.5 + vHeightNorm * 0.5);

        gl_FragColor = vec4(color, uOpacity);
      }
    `,
    transparent,
    side: THREE.DoubleSide,
  });
}


/**
 * Set up per-instance phase attribute on an InstancedMesh for sway animation.
 * Call this after creating the InstancedMesh with a sway material.
 *
 * @param {THREE.InstancedMesh} mesh
 * @param {number} maxInstances
 */
function addInstancePhaseAttribute(mesh, maxInstances) {
  const phases = new Float32Array(maxInstances);
  for (let i = 0; i < maxInstances; i++) {
    phases[i] = Math.random(); // 0-1 random phase per instance
  }
  mesh.geometry.setAttribute('aInstancePhase',
    new THREE.InstancedBufferAttribute(phases, 1)
  );
}


/**
 * Helper to create an InstancedMesh from a model registry entry with sway animation.
 *
 * @param {string} modelName - Key in modelRegistry
 * @param {number} maxCount - Max instances
 * @param {Object} materialOpts - Options for createSwayMaterial
 * @returns {THREE.InstancedMesh|null}
 */
function createAnimatedInstancedMesh(modelName, maxCount, materialOpts = {}) {
  const geo = modelRegistry.get(modelName);
  if (!geo) {
    console.warn(`createAnimatedInstancedMesh: model '${modelName}' not loaded`);
    return null;
  }

  const mat = createSwayMaterial(materialOpts);
  const mesh = new THREE.InstancedMesh(geo, mat, maxCount);
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.receiveShadow = false;

  // Per-instance color
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(maxCount * 3), 3);

  // Per-instance phase for sway
  addInstancePhaseAttribute(mesh, maxCount);

  mesh.count = 0;
  mesh.userData = { nextIndex: 0, _swayMat: mat };

  // Register for time updates (caller must deregister on dispose)
  if (typeof _swayMaterials !== 'undefined') _swayMaterials.add(mat);

  return mesh;
}


function hash3(x, y, z) {
  // Deterministic pseudo-random in [0,1)
  const s = Math.sin(x*12.9898 + y*78.233 + z*37.719) * 43758.5453;
  return s - Math.floor(s);
}

function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function smoothstep(a, b, x) {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function rand01(seed) {
  return hash3(seed, seed * 0.7137, seed * 1.3171);
}


class CoralAdornment {
  constructor(organism, scene) {
    this.organism = organism;
    this.scene = scene;

    this.MAX = 2600;

    this._pending = [];
    this._spawnedVerts = new Set();

    // Keep colonies readable: simple spacing grid on surface.
    this._cellSize = 0.16;
    this._grid = new Map();

    // Slow, meditative colonization.
    this._spawnRate = 0.55; // attempts / sec
    this._attemptAcc = 0;
    this._time = 0;

    // Growth animation
    this._growDuration = 520.0; // seconds to mature (very slow)
    this._pinMin = 18.0;
    this._pinMax = 55.0;

    this._growing = [];
    this._settled = [];

    // Build a small library of coral "pins" (phase 1: one family, 3 variants + anemone).
    this._buildMeshes();
    this._initHero();
  }

  _initHero() {
    const spawn = this.organism.spawnVertex;
    if (!spawn) return;

    // Lumpy rock: main dome + offset bumps for organic shape
    const main = new THREE.SphereGeometry(0.18, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const posAttr = main.getAttribute('position');
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i), y = posAttr.getY(i), z = posAttr.getZ(i);
      const noise = Math.sin(x*7.3 + y*5.1) * Math.cos(z*6.2 + x*3.7) * 0.12;
      const scale = 1.0 + noise + (y > 0 ? 0.08 : -0.04);
      posAttr.setXYZ(i, x * scale, y * scale * 1.1, z * scale);
    }
    main.computeVertexNormals();
    main.translate(0, 0.02, 0);

    const b1 = new THREE.SphereGeometry(0.11, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55);
    b1.translate(0.13, 0.03, 0.08);
    const b2 = new THREE.SphereGeometry(0.09, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55);
    b2.translate(-0.11, 0.04, -0.07);
    const b3 = new THREE.SphereGeometry(0.075, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55);
    b3.translate(0.04, 0.08, -0.12);

    const heroGeo = mergeBufferGeometries([main, b1, b2, b3]);

    const heroMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setHSL(0.08, 0.07, 0.60),
      roughness: 0.92,
      metalness: 0.02,
    });

    const mesh = new THREE.Mesh(heroGeo, heroMat);
    mesh.renderOrder = 5;

    const p = spawn.position.clone();
    let n;
    if (this.organism.canvas && typeof this.organism.canvas.radius === 'number') {
      n = p.clone().normalize();
    } else {
      n = (spawn.normal || new THREE.Vector3(0,1,0)).clone().normalize();
    }

    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), n);
    // Slight lean
    const lean = (hash3(p.x*1.3, p.y*1.3, p.z*1.3) - 0.5) * 0.15;
    const qLean = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), lean);
    quat.multiply(qLean);

    mesh.position.copy(p).addScaledVector(n, 0.02);
    mesh.quaternion.copy(quat);

    this._heroBaseScale = 0.55;
    mesh.scale.setScalar(this._heroBaseScale);

    this._heroVi = spawn.index;
    this._heroBasePos = p.clone();
    this._heroBaseNormal = n.clone();
    this._heroLift = 0.02;

    this.scene.add(mesh);
    this._hero = mesh;
  }

  _updateHero() {
    if (!this._hero) return;
    const claimed = this.organism.claimed?.size || 0;
    // Scale grows logarithmically with territory
    const growthFactor = 0.55 + Math.log2(1 + claimed * 0.008) * 0.4;
    const targetScale = Math.min(2.2, this._heroBaseScale * growthFactor);
    const current = this._hero.scale.x;
    const s = current + (targetScale - current) * 0.015;
    this._hero.scale.setScalar(s);

    // Track substrate height
    const heightArr = this.organism.heightArr;
    if (heightArr && this._heroVi != null) {
      const h = heightArr[this._heroVi] || 0;
      this._hero.position.copy(this._heroBasePos).addScaledVector(this._heroBaseNormal, h + this._heroLift);
    }
  }

  reset() {
    this._pending.length = 0;
    this._spawnedVerts.clear();
    this._grid.clear();
    this._growing.length = 0;
    this._settled.length = 0;

    if (this._instanced) {
      for (const m of this._instanced) {
        m.userData.nextIndex = 0;
        m.count = 0;
      }
    }
    if (this._hero) {
      this._hero.scale.setScalar(this._heroBaseScale || 0.55);
    }
  }

  dispose() {
    if (this._instanced) {
      for (const m of this._instanced) {
        this.scene.remove(m);
        // Deregister sway material if present
        if (m.userData._swayMat) _swayMaterials.delete(m.userData._swayMat);
        m.geometry.dispose();
        m.material.dispose();
      }
      this._instanced.length = 0;
    }
    if (this._hero) {
      this.scene.remove(this._hero);
      this._hero.geometry.dispose();
      this._hero.material.dispose();
      this._hero = null;
    }
    this._pending.length = 0;
    this._growing.length = 0;
    this._settled.length = 0;
    this._spawnedVerts.clear();
    this._grid.clear();
  }

  onClaim(v) {
    if (!v) return;
    if (this._spawnedVerts.has(v.index)) return;
    // Store indices only; resolve to vertex at spawn time.
    this._pending.push(v.index);
  }

  _allocIndex(mesh) {
    mesh.userData = mesh.userData || {};
    if (mesh.userData.nextIndex == null) {
      mesh.userData.nextIndex = 0;
      mesh.count = 0;
    }
    const idx = mesh.userData.nextIndex | 0;
    mesh.userData.nextIndex = idx + 1;
    mesh.count = mesh.userData.nextIndex;
    return idx;
  }

  _gridKey(p) {
    const s = this._cellSize;
    const ix = Math.floor(p.x / s);
    const iy = Math.floor(p.y / s);
    const iz = Math.floor(p.z / s);
    return ((ix & 1023) << 20) ^ ((iy & 1023) << 10) ^ (iz & 1023);
  }

  _gridOk(p) {
    const k = this._gridKey(p);
    if (this._grid.has(k)) return false;
    this._grid.set(k, 1);
    return true;
  }

  _buildMeshes() {
    this._instanced = [];
    this._spawnWeights = []; // cumulative weight table for weighted random selection

    // ── Try manifest-driven GLB models first ──
    const models = modelRegistry.getModelsForSeed('coral');
    if (models.length > 0) {
      for (const config of models) {
        const mesh = createAnimatedInstancedMesh(config.id, this.MAX, {
          swayStrength: config.sway?.strength ?? 0.004,
          swaySpeed: config.sway?.speed ?? 0.8,
          roughness: config.material?.roughness ?? 0.78,
          emissiveIntensity: config.material?.emissiveIntensity ?? 0.25,
          transparent: config.material?.transparent ?? false,
          opacity: config.material?.opacity ?? 1.0,
        });
        if (mesh) {
          mesh.userData.palette = (config.palette || []).map(c => new THREE.Color(c));
          mesh.userData.weight = config.weight ?? (1.0 / models.length);
          mesh.userData.variant = this._instanced.length;
          mesh.userData.isGLB = true;
          mesh.userData.modelId = config.id;
          this.scene.add(mesh);
          this._instanced.push(mesh);
        }
      }
      console.log(`CoralAdornment: using ${this._instanced.length} GLB models`);
    }

    // ── Fallback: procedural geometry ──
    if (this._instanced.length === 0) {
      this._buildProceduralMeshes();
    }

    // ── Build cumulative weight table for spawn selection ──
    this._buildWeightTable();
  }

  _buildWeightTable() {
    this._spawnWeights = [];
    let cumulative = 0;
    for (let i = 0; i < this._instanced.length; i++) {
      cumulative += (this._instanced[i].userData.weight || 1.0);
      this._spawnWeights.push(cumulative);
    }
    // Normalize
    if (cumulative > 0) {
      for (let i = 0; i < this._spawnWeights.length; i++) {
        this._spawnWeights[i] /= cumulative;
      }
    }
  }

  /** Pick a mesh variant by weighted random selection */
  _pickMeshWeighted(vi) {
    const r = rand01(vi * 2.71);
    for (let i = 0; i < this._spawnWeights.length; i++) {
      if (r < this._spawnWeights[i]) return this._instanced[i];
    }
    return this._instanced[this._instanced.length - 1];
  }

  _buildProceduralMeshes() {
    // Coral forms: visible, surface-hugging structures.

    // Form 1: Stubby branching polyp (cylinder + small top sphere)
    const stem1 = new THREE.CylinderGeometry(0.06, 0.08, 0.22, 8, 1, false);
    stem1.translate(0, 0.11, 0);
    const tip1 = new THREE.SphereGeometry(0.07, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6);
    tip1.translate(0, 0.24, 0);
    const base1 = mergeBufferGeometries([stem1, tip1]);

    // Form 2: Finger coral (tapered cone, taller)
    const stem2 = new THREE.CylinderGeometry(0.04, 0.09, 0.30, 8, 1, false);
    stem2.translate(0, 0.15, 0);
    const tip2 = new THREE.SphereGeometry(0.05, 8, 6);
    tip2.scale(1, 0.7, 1);
    tip2.translate(0, 0.30, 0);
    const base2 = mergeBufferGeometries([stem2, tip2]);

    // Form 3: Knobby mound (hemisphere cluster, low to surface)
    const m3a = new THREE.SphereGeometry(0.09, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55);
    m3a.translate(0, 0.02, 0);
    const m3b = new THREE.SphereGeometry(0.065, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55);
    m3b.translate(0.07, 0.01, 0.04);
    const m3c = new THREE.SphereGeometry(0.055, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55);
    m3c.translate(-0.05, 0.01, 0.06);
    const base3 = mergeBufferGeometries([m3a, m3b, m3c]);

    const geoms = [base1, base2, base3];

    // Form 4: Sea anemone — disc body + tentacle crown
    const anemBody = new THREE.CylinderGeometry(0.065, 0.085, 0.07, 10, 1, false);
    anemBody.translate(0, 0.035, 0);
    const anemDisc = new THREE.CylinderGeometry(0.075, 0.065, 0.012, 10, 1, false);
    anemDisc.translate(0, 0.076, 0);
    const tentParts = [anemBody, anemDisc];
    const tentCount = 12;
    for (let ti = 0; ti < tentCount; ti++) {
      const angle = (ti / tentCount) * Math.PI * 2;
      const inner = ti % 2 === 0;
      const tLen = inner ? 0.10 : 0.14;
      const tent = new THREE.CylinderGeometry(0.003, 0.011, tLen, 4, 3, false);
      const tP = tent.getAttribute('position');
      for (let tj = 0; tj < tP.count; tj++) {
        const ty = tP.getY(tj);
        if (ty > 0) {
          const curve = (ty / (tLen * 0.5)) * 0.025;
          tP.setX(tj, tP.getX(tj) + curve);
          tP.setY(tj, tP.getY(tj) - curve * 0.4);
        }
      }
      tent.computeVertexNormals();
      tent.rotateZ(inner ? 0.40 : 0.60);
      tent.translate(inner ? 0.045 : 0.06, 0.078, 0);
      tent.rotateY(angle);
      tentParts.push(tent);
    }
    geoms.push(mergeBufferGeometries(tentParts));

    const palette = [
      new THREE.Color('#ffb36b'), new THREE.Color('#ff6aa2'), new THREE.Color('#ffd36a'),
      new THREE.Color('#7fe3d4'), new THREE.Color('#b59cff'), new THREE.Color('#ff7f50'),
    ];
    const anemonePalette = [
      new THREE.Color('#39ff14'), new THREE.Color('#bf40bf'), new THREE.Color('#ff6b9d'),
      new THREE.Color('#ff8c42'), new THREE.Color('#4deeea'), new THREE.Color('#e8daef'),
    ];

    for (let i = 0; i < geoms.length; i++) {
      const isAnemone = (i === 3);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: isAnemone ? 0.55 : 0.78,
        metalness: isAnemone ? 0.01 : 0.02,
        clearcoat: isAnemone ? 0.15 : 0.08,
        clearcoatRoughness: isAnemone ? 0.4 : 0.7,
        emissive: new THREE.Color(isAnemone ? 0x0f0a18 : 0x0a0604),
        emissiveIntensity: isAnemone ? 0.4 : 0.25,
        transparent: isAnemone,
        opacity: isAnemone ? 0.92 : 1.0,
      });

      const mesh = new THREE.InstancedMesh(geoms[i], mat, this.MAX);
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(this.MAX * 3), 3);

      // Weights: 30% each for coral forms, 10% for anemone (procedural fallback)
      mesh.userData = {
        nextIndex: 0,
        palette: isAnemone ? anemonePalette : palette,
        variant: i,
        isAnemone,
        weight: isAnemone ? 0.10 : 0.30,
        isGLB: false,
      };
      mesh.count = 0;

      this.scene.add(mesh);
      this._instanced.push(mesh);
    }
  }

  _pickColor(mesh, coreFactor) {
    const pal = mesh.userData.palette;
    // Warmer near core, cooler toward frontier.
    const t = clamp(1 - coreFactor, 0, 1);
    const a = pal[Math.floor(rand01(mesh.userData.variant * 131 + t * 17) * pal.length) % pal.length];
    const b = pal[Math.floor(rand01(mesh.userData.variant * 271 + t * 29 + 0.37) * pal.length) % pal.length];
    const c = a.clone().lerp(b, 0.55 + 0.35 * (t));
    // Slight desaturation for realism.
    c.offsetHSL(0, -0.10, -0.02);
    return c;
  }

  _spawnOne(vi, coreFactor) {
    if (vi == null) return false;
    if (this._spawnedVerts.has(vi)) return false;

    const v = this.organism.canvas?.vertices?.[vi];
    if (!v || !v.position || !v.normal) return false;

    const p = v.position;
    // Spacing: avoid over-dense reefs.
    if (!this._gridOk(p)) return false;

    // Choose form via weighted random selection (works with any number of models)
    const mesh = this._pickMeshWeighted(vi);
    if (!mesh) return false;

    // Capacity check
    const used = (mesh.userData.nextIndex | 0);
    if (used >= this.MAX) return false;

    // Reserve this vertex
    this._spawnedVerts.add(vi);

    // Orientation: on sphere use radial outward (face-averaged normals can be wonky)
    let up;
    if (this.organism.canvas && typeof this.organism.canvas.radius === 'number') {
      up = p.clone().normalize(); // true radial outward for sphere
    } else {
      up = v.normal.clone().normalize();
      const outward = p.clone().normalize();
      if (up.dot(outward) < 0) up.negate();
    }

    // Small natural tilt (0-12°) for organic variety
    const tiltAngle = rand01(vi * 5.17) * 0.21;
    const tiltAxis = new THREE.Vector3(
      rand01(vi * 3.29) - 0.5, rand01(vi * 7.43) - 0.5, rand01(vi * 11.07) - 0.5
    ).normalize();
    tiltAxis.sub(up.clone().multiplyScalar(tiltAxis.dot(up))).normalize();
    if (tiltAxis.lengthSq() > 0.01) {
      const qTilt = new THREE.Quaternion().setFromAxisAngle(tiltAxis, tiltAngle);
      up.applyQuaternion(qTilt);
    }

    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);

    // Slight random twist around normal
    const twist = new THREE.Quaternion().setFromAxisAngle(up, (rand01(vi * 0.73) * Math.PI * 2));
    q.multiply(twist);

    // Scale: core is larger and denser; edges start as tiny pins.
    const sCore = lerp(0.30, 0.90, 1 - coreFactor);
    const sJit = 0.85 + rand01(vi * 9.1) * 0.35;
    const targetScale = sCore * sJit;

    // Lift above substrate — scale-proportional so larger forms don't clip
    const lift = 0.025 + 0.035 * targetScale;

    // Read current substrate height for this vertex
    const h = this.organism.heightArr ? (this.organism.heightArr[vi] || 0) : 0;
    // Position = base sphere pos + normal * (substrate height + lift)
    const pos = p.clone().addScaledVector(up, h + lift);

    const idx = this._allocIndex(mesh);

    // Start as small visible pin, then grow.
    const startScale = targetScale * 0.15;

    const mat4 = new THREE.Matrix4().compose(pos, q, new THREE.Vector3(startScale, startScale, startScale));
    mesh.setMatrixAt(idx, mat4);

    // Color per instance
    if (mesh.instanceColor) {
      const col = this._pickColor(mesh, coreFactor);
      mesh.setColorAt(idx, col);
      mesh.instanceColor.needsUpdate = true;
    }

    mesh.instanceMatrix.needsUpdate = true;

    this._growing.push({
      mesh,
      index: idx,
      vi,                      // vertex index for height lookup
      basePos: p.clone(),      // undisplaced sphere position
      baseNormal: up.clone(),  // outward-facing normal
      quat: q,
      lift,
      targetScale,
      startTime: this._time,
      pinHold: lerp(this._pinMin, this._pinMax, rand01(vi * 3.33)),
    });

    return true;
  }

  _updateGrowing() {
    if (!this._growing.length) return;
    const heightArr = this.organism.heightArr;
    const keep = [];
    for (let i = 0; i < this._growing.length; i++) {
      const g = this._growing[i];
      const age = this._time - g.startTime;

      // Recompute position from current substrate height
      const h = (heightArr && g.vi != null) ? (heightArr[g.vi] || 0) : 0;
      const pos = g.basePos.clone().addScaledVector(g.baseNormal, h + g.lift);

      // Stage 1: visible pin hold (almost static)
      let a = 0;
      if (age < g.pinHold) {
        a = 0.12;
      } else {
        // Stage 2: slow growth
        const t = clamp((age - g.pinHold) / this._growDuration, 0, 1);
        a = 0.12 + (1 - Math.pow(1 - t, 3)) * 0.88;
      }

      const s = g.targetScale * (0.15 + a * 0.85);

      const mat4 = new THREE.Matrix4().compose(pos, g.quat, new THREE.Vector3(s, s, s));
      g.mesh.setMatrixAt(g.index, mat4);
      g.mesh.instanceMatrix.needsUpdate = true;

      if (a < 0.999) {
        keep.push(g);
      } else {
        // Move to settled — still tracks height but updates less often
        this._settled.push({
          mesh: g.mesh,
          index: g.index,
          vi: g.vi,
          basePos: g.basePos,
          baseNormal: g.baseNormal,
          quat: g.quat,
          lift: g.lift,
          scale: g.targetScale,
        });
      }
    }
    this._growing = keep;
  }

  _updateSettled() {
    // Update settled instances every ~30 frames to track substrate height changes
    if (!this._settled.length) return;
    this._settledTick = (this._settledTick || 0) + 1;
    if (this._settledTick % 30 !== 0) return;

    const heightArr = this.organism.heightArr;
    if (!heightArr) return;

    for (let i = 0; i < this._settled.length; i++) {
      const g = this._settled[i];
      const h = (g.vi != null) ? (heightArr[g.vi] || 0) : 0;
      const pos = g.basePos.clone().addScaledVector(g.baseNormal, h + g.lift);
      const mat4 = new THREE.Matrix4().compose(pos, g.quat, new THREE.Vector3(g.scale, g.scale, g.scale));
      g.mesh.setMatrixAt(g.index, mat4);
      g.mesh.instanceMatrix.needsUpdate = true;
    }
  }

  update(dt) {
    this._time += dt;

    // Animate growth
    if (this._growing.length) this._updateGrowing();
    // Track substrate height for finished instances
    this._updateSettled();
    // Update hero rock
    this._updateHero();

    // Spawn attempts
    this._attemptAcc += dt * this._spawnRate;

    // Soft target based on territory
    const claimedN = this.organism.claimed?.size || 0;
    const target = Math.min(this.MAX, Math.floor(120 + Math.pow(claimedN, 0.55) * 3.6));
    const canSpawn = (this._spawnedVerts.size < target);

    if (!canSpawn) return;

    let safety = 0;
    while (this._attemptAcc >= 1.0) {
      this._attemptAcc -= 1.0;
      safety++;
      if (safety > 8) break;
      if (!this._pending.length) break;

      // Pull a random pending vertex
      const j = (hash3(this.organism._tick || 0, (this._pending.length * 3) | 0, 7) % this._pending.length) | 0;
      const vi = this._pending[j];
      // swap-pop
      this._pending[j] = this._pending[this._pending.length - 1];
      this._pending.pop();

      const v = this.organism.canvas?.vertices?.[vi];
      if (!v || !v.position) continue;

      // Core factor based on distance from spawn.
      const spawnP = this.organism.spawnVertex?.position || new THREE.Vector3();
      const p = v.position;
      const dx = p.x - spawnP.x, dy = p.y - spawnP.y, dz = p.z - spawnP.z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      const coreFactor = clamp(dist / (this.organism.canvas?.radius * 2.0 || 12), 0, 1);

      // Chance gate (more likely near core, but still possible on edges)
      const baseProb = lerp(0.55, 0.18, smoothstep(0.02, 0.92, coreFactor));
      if (Math.random() > baseProb) continue;

      this._spawnOne(vi, coreFactor);

      if (this._spawnedVerts.size >= target) break;
    }

    // HUD
    const el = document.getElementById('stat-coral');
    if (el) el.textContent = `coral ${this._spawnedVerts.size} (pending ${this._pending.length})`;
  }
}



class Organism {
  constructor(spawn, seedDef, genome, canvas, scene) {
    this.id = uid++;
    this.seedType = seedDef.id;
    this.seedDef = seedDef;
    this.genome = genome;
    this.canvas = canvas;
    this.scene = scene;
    this.spawnVertex = spawn;

    // Territory
    this.claimed = new Set();
    this.frontier = new Set();

    // Lifecycle
    this.energy = seedDef.energy.initial;
    this.isAlive = true;
    this.isDecaying = false;
    this.decayProgress = 0;
    this.age = 0;
    this.growthAcc = 0;
    this.grewThisTick = 0;

    // Combat tracking
    this.stress = 0;
    this._peakTerritory = 1;
    this._collapseOrigin = null;
    this._lastBreachVertex = null;

    // Hybridization tracking
    this.hybridPartners = new Map();
    this.isShrinking = false;
    this.shrinkTarget = 0.4;
    this.isHybrid = false;
    this.parentTypes = null;

    // Catalyst
    this.catalystTimer = 0;
    this.catalystCooldown = 0;
    this.nurtureTimer = 0;
    this.nurtureCooldown = 0;

    // Temporal echo
    this._temporalEchoTimer = 0;

    // Pluggable strategies
    this.growth = GrowthStrategies[seedDef.growthStrategy];
    this.visual = new VisualStrategies[seedDef.visualStrategy](this, seedDef.visual, scene);

    // Seed-specific micro-geometry adornments (kept lightweight)
    this.adornment = (this.seedType === 'fungal') ? new FungalAdornment(this, scene)
      : (this.seedType === 'coral') ? new CoralAdornment(this, scene)
      : null;

    this._claim(spawn);
  }

  _claim(v) {
    if (v.isBarrier) return false;
    if (v.owner && v.owner !== this) return false;
    v.owner = this;
    v.claimStrength = 1;
    v.claimProgress = 0;
    v.claimTime = this.age;
    v.color.copy(this.visual.getColor());
    v.targetHeight = this.visual.getTargetHeight(this.genome);
    // Per-vertex visual variety
    v.rng = Math.random();
    v.hueShift = (Math.random() - 0.5) * 0.04;
    v.lightnessShift = (Math.random() - 0.5) * 0.16;
    v.rotOffset = (Math.random() - 0.5) * 0.6;
    this.claimed.add(v);
    if (this.adornment) this.adornment.onClaim(v);
    this._peakTerritory = Math.max(this._peakTerritory, this.claimed.size);
    this._updateFrontier();
    return true;
  }

  _combatClaim(v) {
    if (v.isBarrier) return;
    v.owner = this;
    v.claimStrength = 1;
    v.claimProgress = 0.3; // partial — contested, not freshly grown
    v.claimTime = this.age;
    v.color.copy(this.visual.getColor());
    v.targetHeight = this.visual.getTargetHeight(this.genome);
    v.rng = Math.random();
    v.hueShift = (Math.random() - 0.5) * 0.04;
    v.lightnessShift = (Math.random() - 0.5) * 0.16;
    v.rotOffset = (Math.random() - 0.5) * 0.6;
    v.combatFlash = 1.0;
    v.pressure = 0;
    v.lastFlipTime = this.age;
    this.claimed.add(v);
    this._peakTerritory = Math.max(this._peakTerritory, this.claimed.size);
  }

  _updateFrontier() {
    this.frontier.clear();
    for (const v of this.claimed) {
      if (this.canvas.getNeighbors(v).some(n => n.owner !== this))
        this.frontier.add(v);
    }
  }

  _applyBorderPressure(dt) {
    const eCfg = this.seedDef.energy;
    const isWeak = (this.energy / eCfg.maxEnergy) < (eCfg.weaknessThreshold || 0.3);

    for (const v of this.frontier) {
      const neighbors = this.canvas.getNeighbors(v);
      let enemyCount = 0;
      let friendlyCount = 0;
      let dominantEnemy = null;
      let dominantEnemyCount = 0;
      const enemyCounts = new Map();

      for (const n of neighbors) {
        if (n.isBarrier) continue;
        if (n.owner === this) {
          friendlyCount++;
        } else if (n.owner && n.owner !== this && n.owner.isAlive) {
          enemyCount++;
          const c = (enemyCounts.get(n.owner) || 0) + 1;
          enemyCounts.set(n.owner, c);
          if (c > dominantEnemyCount) {
            dominantEnemyCount = c;
            dominantEnemy = n.owner;
          }
        }
      }

      if (enemyCount === 0) {
        // Not a contested border — bleed off pressure
        v.pressure = Math.max(0, v.pressure - dt * 2);
        v.contestedBy = null;
        continue;
      }

      v.contestedBy = dominantEnemy;

      // Calculate local pressure this tick
      let localPressure = (enemyCount / neighbors.length) * dominantEnemy.genome.aggression * 1.5;

      // Momentum: advancing enemy pushes harder
      if (dominantEnemy.grewThisTick > 0) {
        localPressure *= 1.3;
      }

      // Defense: resilience resists pressure
      localPressure -= this.genome.resilience * (eCfg.pressureResist || 0.5);

      // Always at least a trickle of pressure at contested borders
      localPressure = Math.max(0.05, localPressure);

      // Anti-oscillation: recently captured vertices resist harder
      const entrench = eCfg.entrenchDuration || 1.5;
      if ((this.age - v.lastFlipTime) < entrench) {
        localPressure *= 0.3;
      }

      // Weak organisms crumble faster
      if (isWeak) {
        localPressure += 0.3;
      }

      const nurtureShield = this.nurtureTimer > 0 ? 0.35 : 1.0;
      v.pressure += localPressure * dt * nurtureShield;

      // Notify on first meaningful contest between this pair
      if (v.pressure > 0.5 && dominantEnemy) {
        const pairKey = Math.min(this.id, dominantEnemy.id) + ':' + Math.max(this.id, dominantEnemy.id);
        if (!contestedPairs.has(pairKey)) {
          contestedPairs.add(pairKey);
          notify('territories contested');
          audioEngine.playConflictStart();
        }
      }
    }
  }

  _resolveCombat(dt) {
    const eCfg = this.seedDef.energy;
    const snapshot = [...this.frontier];
    let breached = false;

    for (const v of snapshot) {
      if (v.pressure < 1.0) continue;
      if (!v.contestedBy || v.contestedBy === this || !v.contestedBy.isAlive) continue;
      if (v.owner !== this) continue; // might have been taken already this tick

      const attacker = v.contestedBy;
      const attackerECfg = attacker.seedDef.energy;

      // Check attacker can afford it
      if (attacker.energy < attackerECfg.combatCost) continue;

      // Contest roll
      const neighbors = this.canvas.getNeighbors(v);
      const friendlyCount = neighbors.filter(n => n.owner === this).length;

      const attackPower = v.pressure * attacker.genome.aggression *
        (attacker.energy / (attacker.energy + this.energy + 1));
      const defendPower = this.genome.resilience * (1 + friendlyCount * 0.15);
      const chance = Math.max(0, Math.min(0.8, (attackPower - defendPower * 0.6) * dt * 2));

      if (Math.random() >= chance) continue; // failed — pressure stays, keeps building

      // === SUCCESSFUL CAPTURE ===

      // Remove from defender
      this.claimed.delete(v);
      this.energy -= eCfg.combatLoss;

      // Attacker claims it
      attacker._combatClaim(v);
      attacker.energy -= attackerECfg.combatCost;

      // Cascade boost: neighbors still owned by defender get pressure spike
      const cascadeAmount = eCfg.cascadeBoost || 0.4;
      for (const n of neighbors) {
        if (n.owner === this) {
          n.pressure += cascadeAmount;
        }
      }

      // Track breach for collapse origin
      this._lastBreachVertex = v;

      // Notify on first breach between this pair
      if (!breached) {
        breached = true;
        const pairKey = 'breach:' + Math.min(this.id, attacker.id) + ':' + Math.max(this.id, attacker.id);
        if (!contestedPairs.has(pairKey)) {
          contestedPairs.add(pairKey);
          notify('border breached');
        }
      }

      // Update frontiers for both
      this._updateFrontier();
      attacker._updateFrontier();

      // Check collapse
      if (this.isAlive && this.claimed.size <= eCfg.collapseThreshold) {
        this._collapseOrigin = this._lastBreachVertex ? this._lastBreachVertex.position.clone() : null;
        this.isDecaying = true;
        this.isAlive = false;
        this.frontier.clear();
        notify('organism overwhelmed');
        audioEngine.playOrganismDeath();
        break;
      }
    }
  }

  _updateStress() {
    const eCfg = this.seedDef.energy;
    const energyRatio = this.energy / eCfg.maxEnergy;
    const territoryTrend = this.claimed.size / Math.max(this._peakTerritory, 1);
    this.stress = Math.max(0, 1 - (energyRatio * 0.5 + territoryTrend * 0.5));
  }

  _checkHybridization(dt) {
    if (this.isShrinking || this.isHybrid) return;
    if (this.claimed.size < 50) return;

    const enemyContact = new Map();
    for (const v of this.frontier) {
      if (!v.contestedBy || v.contestedBy === this) continue;
      const enemy = v.contestedBy;
      if (enemy.isShrinking || enemy.isHybrid || !enemy.isAlive) continue;
      if (enemy.claimed.size < 50) continue;
      enemyContact.set(enemy.id, (enemyContact.get(enemy.id) || 0) + 1);
    }

    for (const [enemyId, contactCount] of enemyContact) {
      if (contactCount < 15) continue;

      if (!this.hybridPartners.has(enemyId)) {
        this.hybridPartners.set(enemyId, { contactTime: 0 });
      }
      const tracker = this.hybridPartners.get(enemyId);
      tracker.contactTime += dt;

      if (tracker.contactTime >= 20) {
        const pairKey = 'hybrid:' + Math.min(this.id, enemyId) + ':' + Math.max(this.id, enemyId);
        if (!contestedPairs.has(pairKey)) {
          contestedPairs.add(pairKey);
          const enemy = organisms.find(o => o.id === enemyId);
          if (enemy && enemy.isAlive && !enemy.isShrinking) {
            this._triggerHybridization(enemy);
          }
        }
      }
    }

    for (const [eid, tracker] of this.hybridPartners) {
      if (!enemyContact.has(eid)) {
        tracker.contactTime = Math.max(0, tracker.contactTime - dt * 2);
        if (tracker.contactTime <= 0) this.hybridPartners.delete(eid);
      }
    }
  }

  _triggerHybridization(enemy) {
    let borderCenter = new THREE.Vector3();
    let borderCount = 0;
    for (const v of this.frontier) {
      if (v.contestedBy === enemy) {
        borderCenter.add(v.position);
        borderCount++;
      }
    }
    if (borderCount === 0) return;
    borderCenter.divideScalar(borderCount);

    const spawnTarget = this.canvas.getNearestVertex(borderCenter.clone().normalize().multiplyScalar(this.canvas.radius));

    if (spawnTarget.owner) {
      const owner = spawnTarget.owner;
      owner.claimed.delete(spawnTarget);
      owner._updateFrontier();
      this.canvas.releaseVertex(spawnTarget);
    }

    this.isShrinking = true;
    enemy.isShrinking = true;
    this.shrinkTarget = 0.4;
    enemy.shrinkTarget = 0.4;

    const hybridGenome = createHybridGenome(this.genome, enemy.genome, this.seedType, enemy.seedType);
    const hybridDef = createHybridDef(this.seedDef, enemy.seedDef, this.seedType, enemy.seedType);

    const hybrid = new Organism(spawnTarget, hybridDef, hybridGenome, this.canvas, this.scene);
    hybrid.isHybrid = true;
    hybrid.parentTypes = [this.seedType, enemy.seedType].sort();
    hybrid.energy = hybridDef.energy.initial;
    organisms.push(hybrid);

    notify(`hybrid emerged · ${this.seedDef.name.toLowerCase()} × ${enemy.seedDef.name.toLowerCase()}`);
    audioEngine.playHybridEmerged();
  }

  _shrink(dt) {
    const targetSize = Math.floor(this._peakTerritory * this.shrinkTarget);
    if (this.claimed.size <= targetSize) {
      this.isShrinking = false;
      return;
    }

    const releaseCount = Math.ceil(2 + this.genome.speed * 3);
    const frontier = [...this.frontier];
    for (let i = frontier.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [frontier[i], frontier[j]] = [frontier[j], frontier[i]];
    }

    let released = 0;
    for (const v of frontier) {
      if (released >= releaseCount) break;
      if (this.claimed.size <= targetSize) break;
      this.claimed.delete(v);
      this.canvas.releaseVertex(v);
      released++;
    }
    this._updateFrontier();
  }

  _grow(dt) {
    if (!this.isAlive) return;
    if (this.isShrinking) return; // no growth while shrinking for hybrid
    this.grewThisTick = 0;

    const eCfg = this.seedDef.energy;
    const frontierBonus = Math.min(this.frontier.size, 12) * 0.25;
    const catalystMul = this.catalystTimer > 0 ? 3.0 : 1.0;
    this.growthAcc += this.genome.speed * dt * (1.5 + frontierBonus) * catalystMul;
    const max = Math.floor(this.growthAcc);
    if (max < 1) return;

    const fr = [...this.frontier];
    for (let i = fr.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [fr[i], fr[j]] = [fr[j], fr[i]];
    }

    let got = 0;
    for (const fv of fr) {
      if (got >= max) break;

      const candidates = this.growth.filterCandidates(this, fv);
      if (!candidates.length) continue;

      const tgt = this.growth.pickTarget(this, fv, candidates);

      if (!tgt.owner) {
        // Eating unclaimed territory — gains energy
        if (this._claim(tgt)) {
          got++;
          this.grewThisTick++;
          this.energy = Math.min(this.energy + eCfg.perVertex, eCfg.maxEnergy);
          this.growthAcc -= 1;
        }
      }
      // No combat here — all territory contests handled by pressure system
    }
    this.growthAcc = Math.min(this.growthAcc, 5);
  }

  update(dt) {
    if (!this.isAlive && !this.isDecaying) return;
    this.age += dt;

    if (this.adornment) this.adornment.update(dt);

    if (this.isAlive) {
      // Catalyst decay
      if (this.catalystTimer > 0) this.catalystTimer -= dt;
      if (this.catalystCooldown > 0) this.catalystCooldown -= dt;
      if (this.nurtureTimer > 0) this.nurtureTimer -= dt;
      if (this.nurtureCooldown > 0) this.nurtureCooldown -= dt;

      this._applyBorderPressure(dt);
      this._resolveCombat(dt);
      this._grow(dt);
      this._updateStress();
      this._checkHybridization(dt);
      if (this.isShrinking) this._shrink(dt);

      // Temporal echo: periodically release frontier vertices
      if (this.seedDef.id === 'temporal' || (this.parentTypes && this.parentTypes.includes('temporal'))) {
        this._temporalEchoTimer -= dt;
        if (this._temporalEchoTimer <= 0) {
          this._temporalEchoTimer = 3 + Math.random() * 4; // 3-7s
          const frontierArr = [...this.frontier];
          const releaseCount = Math.max(1, Math.floor(frontierArr.length * (0.1 + Math.random() * 0.1)));
          for (let i = 0; i < releaseCount && frontierArr.length > 0; i++) {
            const idx = Math.floor(Math.random() * frontierArr.length);
            const v = frontierArr.splice(idx, 1)[0];
            if (v && v.owner === this && this.claimed.size > 3) {
              this.claimed.delete(v);
              this.canvas.releaseVertex(v);
            }
          }
          this._updateFrontier();
        }
      }
    }

    if (this.isDecaying) {
      this.decayProgress += dt * this.genome.decayRate * 0.3;
      if (this.decayProgress >= 1) { this.die(); return; }
      this.visual.setDecay(this.decayProgress, this._collapseOrigin);
    }

    for (const v of this.claimed) {
      if (v.claimProgress < 1) {
        v.claimProgress = Math.min(1, v.claimProgress + dt * 3);
        v.height = v.targetHeight * this.visual.ease(v.claimProgress);
      }
    }

    this.visual.update(this, dt);
  }

  die() {
    for (const v of this.claimed) this.canvas.releaseVertex(v);
    this.claimed.clear();
    this.isAlive = false;
    this.isDecaying = false;
    if (this.adornment) { this.adornment.dispose(); this.adornment = null; }
    this.visual.dispose();
  }
}

/* ═══════════════════════════════════════════
   SCENE SETUP
   ═══════════════════════════════════════════ */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, innerWidth/innerHeight, 0.1, 200);
camera.position.set(0, 2.5, 15);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0xd8d2ca, 1);
document.getElementById('app').prepend(renderer.domElement);

// Background gradient
const bgS = new THREE.Mesh(new THREE.SphereGeometry(80,32,32), new THREE.ShaderMaterial({
  side:THREE.BackSide, depthWrite:false,
  vertexShader:`varying vec3 vW;void main(){vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);}`,
  fragmentShader:`varying vec3 vW;void main(){float y=normalize(vW).y*.5+.5;
    vec3 t=vec3(.92,.90,.87),m=vec3(.85,.82,.78),b=vec3(.75,.74,.72);
    vec3 c=y>.5?mix(m,t,(y-.5)*2.):mix(b,m,y*2.); c*=1.-length(normalize(vW).xz)*.15; gl_FragColor=vec4(c,1.);}`
}));
bgS.renderOrder=-100; scene.add(bgS);

// Ground plane
const gndMat = new THREE.ShaderMaterial({transparent:true,depthWrite:false,
  uniforms:{uSP:{value:new THREE.Vector3(0,0,0)},uSR:{value:5.}},
  vertexShader:`varying vec3 vW;void main(){vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);}`,
  fragmentShader:`uniform vec3 uSP;uniform float uSR;varying vec3 vW;void main(){
    float d=length(vW.xz-uSP.xz);float sh=pow(1.-smoothstep(0.,uSR*1.6,d),2.)*.25;
    float ef=1.-smoothstep(15.,28.,d);float a=(.4+sh)*ef;vec3 c=vec3(.78,.76,.73)*(1.-sh*.5);gl_FragColor=vec4(c,a);}`
});
const gnd=new THREE.Mesh(new THREE.PlaneGeometry(60,60),gndMat);
gnd.rotation.x=-Math.PI/2;gnd.position.y=-5.2;gnd.renderOrder=-50;scene.add(gnd);

// Controls
const ctrl = new OrbitControls(camera, renderer.domElement);
ctrl.enableDamping=true;ctrl.dampingFactor=.04;ctrl.rotateSpeed=.5;ctrl.zoomSpeed=.8;
ctrl.minDistance=8;ctrl.maxDistance=35;ctrl.enablePan=false;ctrl.autoRotate=true;ctrl.autoRotateSpeed=.2;
ctrl.minPolarAngle=0;ctrl.maxPolarAngle=Math.PI;

// Lighting
const sun=new THREE.DirectionalLight(0xfff3e0,2.2);sun.position.set(5,10,7);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.near=.5;sun.shadow.camera.far=40;
sun.shadow.camera.left=-10;sun.shadow.camera.right=10;sun.shadow.camera.top=10;sun.shadow.camera.bottom=-10;scene.add(sun);
const fillL=new THREE.DirectionalLight(0xd4dce8,.9);fillL.position.set(-7,5,-3);scene.add(fillL);
const rimL=new THREE.DirectionalLight(0xf0e8dd,.6);rimL.position.set(-2,-3,8);scene.add(rimL);
const botL=new THREE.DirectionalLight(0xe8e0d6,.35);botL.position.set(0,-6,2);scene.add(botL);
scene.add(new THREE.AmbientLight(0xe8e2da,.9));
scene.add(new THREE.HemisphereLight(0xf0ebe4,0xd0ccc6,.6));

// Env map
const pmrem=new THREE.PMREMGenerator(renderer);const envSc=new THREE.Scene();
envSc.add(new THREE.Mesh(new THREE.SphereGeometry(50,32,32),new THREE.ShaderMaterial({side:THREE.BackSide,
  vertexShader:`varying vec3 vP;void main(){vP=(modelMatrix*vec4(position,1)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vP,1);}`,
  fragmentShader:`varying vec3 vP;void main(){float y=normalize(vP).y*.5+.5;gl_FragColor=vec4(mix(vec3(.7,.68,.65),vec3(.9,.88,.85),y),1.);}`})));
const eL1=new THREE.PointLight(0xfff0dd,70);eL1.position.set(12,18,12);envSc.add(eL1);
const eL2=new THREE.PointLight(0xd8e0ee,40);eL2.position.set(-14,8,-8);envSc.add(eL2);
const eL3=new THREE.PointLight(0xf5ece0,25);eL3.position.set(0,-12,8);envSc.add(eL3);
scene.environment=pmrem.fromScene(envSc,.04).texture;pmrem.dispose();

// Post-processing
const composer=new EffectComposer(renderer);
composer.addPass(new RenderPass(scene,camera));
composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.2,.4,.92));
composer.addPass(new ShaderPass({uniforms:{tDiffuse:{value:null}},
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1);}`,
  fragmentShader:`uniform sampler2D tDiffuse;varying vec2 vUv;void main(){vec4 c=texture2D(tDiffuse,vUv);
    c.r*=1.02;c.b*=.98;float g=dot(c.rgb,vec3(.299,.587,.114));c.rgb=mix(vec3(g),c.rgb,1.1);
    vec2 u=(vUv-.5)*2.;c.rgb*=1.-.04*dot(u,u);gl_FragColor=c;}`}));

// Preview sphere for landing page ambiance
const previewSphere = new THREE.Group();
(function buildPreview() {
  const r = 5;
  const glowGeo = new THREE.SphereGeometry(r * 0.93, 32, 24);
  const glowMat = _makeGlowMat();
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  glowMesh.renderOrder = -1;
  previewSphere.add(glowMesh);

  const sphereGeo = new THREE.SphereGeometry(r, 64, 48);
  const jellyMat = _makeJellyMat();
  const glassMesh = new THREE.Mesh(sphereGeo, jellyMat);
  glassMesh.renderOrder = 0;
  previewSphere.add(glassMesh);

  const backMat = _makeBackMat();
  const backMesh = new THREE.Mesh(sphereGeo.clone(), backMat);
  backMesh.renderOrder = -2;
  previewSphere.add(backMesh);

  previewSphere._glowMat = glowMat;
  previewSphere._jellyMat = jellyMat;
})();
scene.add(previewSphere);

// Canvas — created lazily when player selects canvas type or loads save
let activeCanvas = null;
let activeCanvasType = 'sphere';

function createCanvas(type) {
  // Remove preview sphere
  if (previewSphere.parent) {
    scene.remove(previewSphere);
    previewSphere.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
  }
  if (activeCanvas && activeCanvas.dispose) activeCanvas.dispose();
  activeCanvasType = type;
  switch (type) {
    case 'cube':
      activeCanvas = new CubeCanvas(scene, 5);
      camera.position.set(0, 3, 16);
      break;
    case 'plane':
      activeCanvas = new PlaneCanvas(scene, 5);
      camera.position.set(0, 12, 8);
      break;
    case 'sphere':
    default:
      activeCanvas = new SphereCanvas(scene, 5, 100);
      camera.position.set(0, 2.5, 15);
      break;
  }
  ctrl.target.set(0, 0, 0);
  ctrl.update();
  initBarrierVisual();
  console.log(`Canvas: ${type} · ${activeCanvas.vertexCount} vertices`);
  return activeCanvas;
}

/* ═══════════════════════════════════════════
   BARRIER VISUAL SYSTEM
   ═══════════════════════════════════════════ */
let barrierVisual = null;

function initBarrierVisual() {
  if (barrierVisual) {
    scene.remove(barrierVisual.mesh);
    barrierVisual.geo.dispose();
    barrierVisual.mat.dispose();
  }
  if (!activeCanvas) return;

  const N = activeCanvas.vertices.length;
  const geo = activeCanvas.shellGeo.clone();
  const heightArr = new Float32Array(N);
  const colorArr = new Float32Array(N * 3);
  const alphaArr = new Float32Array(N);

  geo.setAttribute('aHeight', new THREE.BufferAttribute(heightArr, 1));
  geo.setAttribute('aColor', new THREE.BufferAttribute(colorArr, 3));
  geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphaArr, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: true,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uLightDir1: { value: new THREE.Vector3(0.4, 0.7, 0.5).normalize() },
      uLightDir2: { value: new THREE.Vector3(-0.5, 0.3, -0.4).normalize() },
      uMetalness: { value: 0.3 },
      uRoughness: { value: 0.4 },
      uEmissive: { value: 0.5 },
    },
    vertexShader: SHELL_VERT,
    fragmentShader: SHELL_FRAG,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 5;
  scene.add(mesh);

  barrierVisual = { geo, mat, mesh, heightArr, colorArr, alphaArr };
}

function updateBarrierVisual() {
  if (!barrierVisual || !activeCanvas) return;

  const { heightArr, colorArr, alphaArr } = barrierVisual;
  const time = barrierVisual.mat.uniforms.uTime.value;

  heightArr.fill(0);
  colorArr.fill(0);
  alphaArr.fill(0);

  const bColor = new THREE.Color().setHSL(0.1, 0.45, 0.7);

  for (const idx of barriers) {
    const v = activeCanvas.vertices[idx];
    if (!v) continue;

    // Edge vertices (bordering non-barrier) are taller = wall ridge
    const neighbors = activeCanvas.getNeighbors(v);
    const barrierNeighbors = neighbors.filter(n => n.isBarrier).length;
    const isEdge = barrierNeighbors < neighbors.length;

    const baseHeight = isEdge ? 0.22 : 0.12;
    const pulse = baseHeight + Math.sin(time * 1.5 + idx * 0.3) * 0.02;

    const i3 = idx * 3;
    heightArr[idx] = pulse;
    colorArr[i3] = bColor.r;
    colorArr[i3 + 1] = bColor.g;
    colorArr[i3 + 2] = bColor.b;
    alphaArr[idx] = 0.85;
  }

  barrierVisual.geo.attributes.aHeight.needsUpdate = true;
  barrierVisual.geo.attributes.aColor.needsUpdate = true;
  barrierVisual.geo.attributes.aAlpha.needsUpdate = true;
}

function placeBarrier(vertex) {
  if (vertex.isBarrier) return;
  if (vertex.owner) {
    const org = vertex.owner;
    org.claimed.delete(vertex);
    org._updateFrontier();
    activeCanvas.releaseVertex(vertex);
  }
  vertex.isBarrier = true;
  barriers.add(vertex.index);
  updateBarrierVisual();
  audioEngine.playBarrier();
  saveGame();
}

function removeBarrier(vertex) {
  if (!vertex.isBarrier) return;
  vertex.isBarrier = false;
  barriers.delete(vertex.index);
  updateBarrierVisual();
  audioEngine.playBarrierRemove();
  saveGame();
}

function pruneVertex(vertex) {
  if (!vertex.owner) return;
  const org = vertex.owner;
  org.claimed.delete(vertex);
  org._updateFrontier();
  activeCanvas.releaseVertex(vertex);
  org.energy -= 0.5;
  audioEngine.playPrune();
}

function applyCatalyst(organism) {
  if (!organism || !organism.isAlive) return;
  if (organism.catalystCooldown > 0) {
    notify('catalyst on cooldown');
    audioEngine.playCooldown();
    return;
  }
  organism.catalystTimer = 8;
  organism.catalystCooldown = 15;
  notify('catalyst applied');
  audioEngine.playCatalyst();
}

function applyNurture(organism) {
  if (!organism || !organism.isAlive) return;
  if (organism.nurtureCooldown > 0) {
    notify('nurture on cooldown');
    audioEngine.playCooldown();
    return;
  }
  const eCfg = organism.seedDef.energy;
  organism.energy = Math.min(organism.energy + eCfg.maxEnergy * 0.5, eCfg.maxEnergy);
  organism.stress = Math.max(0, organism.stress - 0.4);
  organism.nurtureTimer = 12;
  organism.nurtureCooldown = 20;
  notify('nurture applied');
  audioEngine.playNurture();
}

/* ═══════════════════════════════════════════
   ORGANISM INSPECTOR
   ═══════════════════════════════════════════ */
let inspectedOrganism = null;

function openInspector(organism) {
  inspectedOrganism = organism;
  document.getElementById('inspector').classList.add('visible');
  updateInspector();
}

function closeInspector() {
  inspectedOrganism = null;
  document.getElementById('inspector').classList.remove('visible');
}

function updateInspector() {
  const o = inspectedOrganism;
  if (!o || !o.isAlive) { closeInspector(); return; }

  const seedDef = o.seedDef;
  const eCfg = seedDef.energy;

  // Name
  const typeLabel = o.isHybrid ? 'Hybrid' : (seedDef.name || o.seedType);
  document.getElementById('inspector-name').textContent = `${typeLabel} #${o.id}`;

  // Type
  document.getElementById('insp-type').textContent = o.isHybrid
    ? `${o.parentTypes[0]} × ${o.parentTypes[1]}`
    : seedDef.name || o.seedType;

  // Territory
  document.getElementById('insp-territory').textContent = `${o.claimed.size} vertices`;

  // Energy bar
  const energyPct = Math.max(0, Math.min(100, (o.energy / eCfg.maxEnergy) * 100));
  document.getElementById('insp-energy-bar').style.width = energyPct + '%';

  // Stress bar
  const stressPct = Math.max(0, Math.min(100, o.stress * 100));
  document.getElementById('insp-stress-bar').style.width = stressPct + '%';

  // Age
  const mins = Math.floor(o.age / 60);
  const secs = Math.floor(o.age % 60);
  document.getElementById('insp-age').textContent = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  // Growth strategy
  document.getElementById('insp-growth').textContent = seedDef.growthStrategy;

  // Conflicts
  let conflictCount = 0;
  for (const v of o.frontier) {
    if (v.pressure > 0.5 && v.contestedBy) conflictCount++;
  }
  document.getElementById('insp-conflicts').textContent = conflictCount > 0
    ? `${conflictCount} active` : 'none';

  // Hybrid info
  const hybridRow = document.getElementById('insp-hybrid-row');
  if (o.isHybrid && o.parentTypes) {
    hybridRow.style.display = 'flex';
    document.getElementById('insp-parents').textContent = o.parentTypes.join(' × ');
  } else {
    hybridRow.style.display = 'none';
  }

  // Catalyst info
  const catRow = document.getElementById('insp-catalyst-row');
  if (o.catalystTimer > 0) {
    catRow.style.display = 'flex';
    document.getElementById('insp-catalyst').textContent = `${o.catalystTimer.toFixed(1)}s boost`;
  } else if (o.catalystCooldown > 0) {
    catRow.style.display = 'flex';
    document.getElementById('insp-catalyst').textContent = `cooldown ${o.catalystCooldown.toFixed(0)}s`;
  } else {
    catRow.style.display = 'none';
  }

  // Nurture info
  const nurRow = document.getElementById('insp-nurture-row');
  if (o.nurtureTimer > 0) {
    nurRow.style.display = 'flex';
    document.getElementById('insp-nurture').textContent = `${o.nurtureTimer.toFixed(1)}s shield`;
  } else if (o.nurtureCooldown > 0) {
    nurRow.style.display = 'flex';
    document.getElementById('insp-nurture').textContent = `cooldown ${o.nurtureCooldown.toFixed(0)}s`;
  } else {
    nurRow.style.display = 'none';
  }

  // Color swatch
  if (o.visual && o.visual.color) {
    document.getElementById('insp-swatch').style.background = '#' + o.visual.color.getHexString();
  }
}

document.getElementById('inspector-close').addEventListener('click', closeInspector);

const hoverDot = new THREE.Mesh(
  new THREE.SphereGeometry(0.06, 10, 10),
  new THREE.MeshBasicMaterial({ color: 0xb89878, transparent: true, opacity: 0, depthTest: false })
);
hoverDot.renderOrder = 99;
scene.add(hoverDot);

let hoverVisible = false;
const _hoverNormal = new THREE.Vector3();
// Track raw mouse for render-loop hover update
let mouseScreenX = 0, mouseScreenY = 0;

/* ═══════════════════════════════════════════
   GAME STATE
   ═══════════════════════════════════════════ */
const organisms = [];
const _swayMaterials = new Set(); // ShaderMaterials that need uTime updates
let timeSpeed = 1, paused = false;
const clock = new THREE.Clock();
const rc = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function notify(txt) {
  const el = document.createElement('div');
  el.className = 'notif'; el.textContent = txt;
  document.getElementById('notifs').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function plant(vertex) {
  const seedDef = SEED_DEFS[currentSeed];
  if (!seedDef) return;
  const genome = rollGenome(seedDef.genome);
  organisms.push(new Organism(vertex, seedDef, genome, activeCanvas, scene));
  const seedData = SEEDS.find(s => s.id === currentSeed);
  notify(`seed planted · ${seedData ? seedData.name.toLowerCase() : currentSeed}`);
  audioEngine.playSeedPlanted(currentSeed);
  ctrl.autoRotate = false;
  saveGame();
}

// Pointer events
let pointerDownPos = null;
const DRAG_THRESHOLD = 5;

renderer.domElement.addEventListener('pointerdown', e => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
  lastDragX = e.clientX;
  if (gameStarted && (currentAction === 'barrier' || currentAction === 'prune')) {
    ctrl.enabled = false;
  }
});

renderer.domElement.addEventListener('pointermove', e => {
  mouseScreenX = e.clientX;
  mouseScreenY = e.clientY;
  mouse.x = (e.clientX/innerWidth)*2-1;
  mouse.y = -(e.clientY/innerHeight)*2+1;
  // Track drag direction for spin
  if (pointerDownPos && spinActive) {
    const dx = e.clientX - lastDragX;
    if (Math.abs(dx) > 2) {
      spinDirection = dx > 0 ? 1 : -1;
    }
    lastDragX = e.clientX;
  }
  // Barrier/Prune drag-painting
  if (gameStarted && !photoModeActive && activeCanvas && (currentAction === 'barrier' || currentAction === 'prune') && pointerDownPos) {
    const dx = e.clientX - pointerDownPos.x;
    const dy = e.clientY - pointerDownPos.y;
    if (Math.sqrt(dx*dx + dy*dy) > DRAG_THRESHOLD) {
      rc.setFromCamera(mouse, camera);
      const hit = activeCanvas.raycast(rc);
      if (hit) {
        const nv = activeCanvas.getNearestVertex(hit.point);
        if (nv) {
          if (currentAction === 'barrier' && !nv.isBarrier) placeBarrier(nv);
          else if (currentAction === 'prune' && nv.owner) pruneVertex(nv);
        }
      }
    }
  }
});

renderer.domElement.addEventListener('pointerup', e => {
  ctrl.enabled = true;
  if (photoModeActive) { pointerDownPos = null; return; }
  if (!gameStarted || !pointerDownPos || !activeCanvas) return;
  const dx = e.clientX - pointerDownPos.x;
  const dy = e.clientY - pointerDownPos.y;
  const dist = Math.sqrt(dx*dx + dy*dy);
  pointerDownPos = null;
  if (dist > DRAG_THRESHOLD) return;
  rc.setFromCamera(mouse, camera);
  const hit = activeCanvas.raycast(rc);
  if (!hit) return;
  const nv = activeCanvas.getNearestVertex(hit.point);
  if (!nv) return;

  if (currentAction === 'barrier') {
    placeBarrier(nv);
  } else if (currentAction === 'prune') {
    if (nv.owner) pruneVertex(nv);
  } else if (currentAction === 'catalyst') {
    if (nv.owner && nv.owner.isAlive) applyCatalyst(nv.owner);
  } else if (currentAction === 'nurture') {
    if (nv.owner && nv.owner.isAlive) applyNurture(nv.owner);
  } else if (currentAction === 'observe' && nv.owner && nv.owner.isAlive) {
    openInspector(nv.owner);
  } else if (!nv.owner && !nv.isBarrier) {
    closeInspector();
    plant(nv);
  }
});

renderer.domElement.addEventListener('contextmenu', e => {
  e.preventDefault();
  if (!gameStarted || !activeCanvas || currentAction !== 'barrier') return;
  mouse.x = (e.clientX/innerWidth)*2-1;
  mouse.y = -(e.clientY/innerHeight)*2+1;
  rc.setFromCamera(mouse, camera);
  const hit = activeCanvas.raycast(rc);
  if (!hit) return;
  const nv = activeCanvas.getNearestVertex(hit.point);
  if (nv && nv.isBarrier) removeBarrier(nv);
});

function setSpeed(sp) {
  paused = sp === 0; timeSpeed = sp;
  document.querySelectorAll('.ctrl-btn').forEach(b =>
    b.classList.toggle('active', parseInt(b.dataset.speed) === sp));
}

document.querySelectorAll('.ctrl-btn[data-speed]').forEach(b =>
  b.addEventListener('click', () => setSpeed(parseInt(b.dataset.speed))));

window.addEventListener('keydown', e => {
  if (!gameStarted) return;
  // Photo mode keyboard
  if (photoModeActive) {
    if (e.key === 'Escape') {
      // Close innermost layer first: preview → gallery → photo mode
      if (document.getElementById('gallery-preview').classList.contains('open')) { closePreview(); }
      else if (document.getElementById('photo-gallery').classList.contains('open')) { closeGallery(); }
      else { exitPhotoMode(); }
      return;
    }
    if (e.key === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      // Only capture if gallery/preview aren't open
      if (!document.getElementById('photo-gallery').classList.contains('open') &&
          !document.getElementById('gallery-preview').classList.contains('open')) {
        captureScreenshot();
      }
      return;
    }
    // G key opens gallery
    if (e.key === 'g' || e.key === 'G') {
      if (!document.getElementById('photo-gallery').classList.contains('open')) openGallery();
      else closeGallery();
      return;
    }
    return;
  }
  if (e.code === 'Space') { e.preventDefault(); setSpeed(paused ? 1 : 0); }
  if (e.code === 'Digit1') setSpeed(1);
  if (e.code === 'Digit2') setSpeed(2);
  if (e.code === 'Digit3') setSpeed(5);
  if (e.code === 'Digit4') setSpeed(10);
});

window.addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
});

/* ═══════════════════════════════════════════
   GAME FLOW
   ═══════════════════════════════════════════ */
async function startGame(loadData, canvasType) {
  gameStarted = true;
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('canvas-select').classList.remove('visible');

  // Load GLB models from manifest before showing HUD
  await modelRegistry.loadFromManifest('models/manifest.json');

  document.getElementById('hud').classList.add('visible');

  // Determine and create canvas
  const type = (loadData && loadData.canvasType) ? loadData.canvasType : (canvasType || 'sphere');
  createCanvas(type);

  // Initialize audio
  audioEngine.init();
  audioEngine.startAmbient();

  // Update hint text
  const hintMap = {
    sphere: 'click sphere to plant · scroll to zoom · drag to orbit',
    cube: 'click cube to plant · scroll to zoom · drag to orbit',
    plane: 'click surface to plant · scroll to zoom · drag to orbit',
  };
  document.getElementById('hint').textContent = hintMap[type] || hintMap.sphere;

  // Show tutorial for new games only
  if (!loadData) {
    TutorialController.start();
  }

  if (loadData) {
    elapsedTime = loadData.elapsedTime || 0;
    currentSeed = loadData.currentSeed || 'geometric';
    currentAction = loadData.currentAction || 'observe';

    // Restore barriers BEFORE organisms
    barriers.clear();
    if (loadData.barriers) {
      for (const idx of loadData.barriers) {
        const v = activeCanvas.vertices[idx];
        if (v) {
          v.isBarrier = true;
          barriers.add(idx);
        }
      }
      updateBarrierVisual();
    }

    // Restore organisms
    if (loadData.organisms) {
      for (const od of loadData.organisms) {
        if (!od.isAlive) continue;
        const sv = activeCanvas.vertices[od.spawnIndex];
        if (!sv) continue;
        // Handle hybrid organisms — reconstruct their seed def
        let seedDef = SEED_DEFS[od.seedType || 'geometric'];
        if (!seedDef && od.isHybrid && od.parentTypes) {
          const defA = SEED_DEFS[od.parentTypes[0]];
          const defB = SEED_DEFS[od.parentTypes[1]];
          if (defA && defB) {
            seedDef = createHybridDef(defA, defB, od.parentTypes[0], od.parentTypes[1]);
            // Restore saved pattern type value
            if (od.patternTypeValue != null) {
              seedDef.patternTypeValue = od.patternTypeValue;
            }
          }
        }
        if (!seedDef) continue;
        const org = new Organism(sv, seedDef, od.genome, activeCanvas, scene);
        org.energy = od.energy;
        org.age = od.age;
        org.stress = od.stress || 0;
        org._peakTerritory = od.peakTerritory || 1;
        org.isHybrid = od.isHybrid || false;
        org.parentTypes = od.parentTypes || null;
        org.isShrinking = od.isShrinking || false;
        org.catalystTimer = od.catalystTimer || 0;
        org.catalystCooldown = od.catalystCooldown || 0;
        org.nurtureTimer = od.nurtureTimer || 0;
        org.nurtureCooldown = od.nurtureCooldown || 0;
        // Claim saved vertices (supports old format: [int] and new format: [{i, rng, hs, ls, ro}])
        for (const vd of od.claimed) {
          const vi = typeof vd === 'number' ? vd : vd.i;
          const v = activeCanvas.vertices[vi];
          if (v && !v.owner) {
            org._claim(v);
            // Restore per-vertex visual data if available
            if (typeof vd === 'object') {
              v.rng = vd.rng;
              v.hueShift = vd.hs;
              v.lightnessShift = vd.ls;
              v.rotOffset = vd.ro;
              v.pressure = vd.pr || 0;
              v.lastFlipTime = vd.lft || 0;
            }
          }
        }
        organisms.push(org);
      }
    }
    // Update selected seed card
    document.querySelectorAll('.seed-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.seed === currentSeed);
    });
  }

  if (!spinActive) ctrl.autoRotate = organisms.length === 0;
}

// Expose to standalone landing script
window._startGame = startGame;
// Debug exposure
window._debug = { organisms, activeCanvas, SEED_DEFS, GrowthStrategies };

/* ═══════════════════════════════════════════
   RENDER LOOP
   ═══════════════════════════════════════════ */
function loop() {
  requestAnimationFrame(loop);
  const rawDt = clock.getDelta();
  const dt = paused ? 0 : rawDt * timeSpeed;

  // Spin control
  if (spinActive) {
    ctrl.autoRotate = true;
    ctrl.autoRotateSpeed = 0.5 * spinDirection;
  }

  ctrl.update();
  if (activeCanvas) activeCanvas.update(rawDt);

  if (gameStarted && !paused && activeCanvas) {
    elapsedTime += dt;
    let growthThisFrame = 0;
    for (let i = organisms.length - 1; i >= 0; i--) {
      organisms[i].update(dt);
      growthThisFrame += organisms[i].grewThisTick || 0;
      if (!organisms[i].isAlive && !organisms[i].isDecaying)
        organisms.splice(i, 1);
    }
    // Smooth glow pulse toward growth activity
    const glowTarget = growthThisFrame * 0.15;
    const glowCurrent = activeCanvas.glowMat.uniforms.uGrowthPulse.value;
    activeCanvas.glowMat.uniforms.uGrowthPulse.value += (glowTarget - glowCurrent) * 0.1;

    // Audio: growth grains
    if (growthThisFrame > 0) {
      let dominantType = 'geometric';
      let maxGrowth = 0;
      for (const o of organisms) {
        if (o.grewThisTick > maxGrowth && o.isAlive) {
          maxGrowth = o.grewThisTick;
          dominantType = o.seedDef.visualProfile || 'geometric';
        }
      }
      audioEngine.playGrowthGrain(growthThisFrame, dominantType);
    }
  }

  // Hover indicator — raycast every frame for zero-lag tracking
  if (gameStarted && activeCanvas) {
    rc.setFromCamera(mouse, camera);
    const hits = rc.intersectObject(activeCanvas.mesh, false);
    if (hits.length > 0) {
      const hit = hits[0];
      const pt = hit.point;
      // Use face normal for correct hover offset on any geometry
      const faceNormal = hit.face.normal.clone().transformDirection(activeCanvas.mesh.matrixWorld);
      hoverDot.position.copy(pt).addScaledVector(faceNormal, 0.04);
      const nv = activeCanvas.getNearestVertex(pt);
      if (currentAction === 'barrier') {
        hoverDot.material.color.setHex(0xc8a060);
        hoverDot.scale.setScalar(nv && nv.isBarrier ? 0.5 : 1.5);
        hoverDot.material.opacity = 0.6;
      } else if (currentAction === 'prune') {
        hoverDot.material.color.setHex(0xc06060);
        hoverDot.scale.setScalar(1.2);
        hoverDot.material.opacity = (nv && nv.owner) ? 0.7 : 0.15;
      } else if (currentAction === 'catalyst') {
        hoverDot.material.color.setHex(0x60c080);
        hoverDot.scale.setScalar(2.0);
        hoverDot.material.opacity = (nv && nv.owner) ? 0.7 : 0.15;
      } else {
        hoverDot.material.color.setHex(0xb89878);
        hoverDot.scale.setScalar(1);
        hoverDot.material.opacity = (nv && nv.owner) ? 0.2 : 0.5;
      }
      hoverVisible = true;
      renderer.domElement.style.cursor = 'none';
    } else {
      hoverDot.material.opacity = 0;
      hoverVisible = false;
      renderer.domElement.style.cursor = 'default';
    }
  }

  // HUD updates
  if (gameStarted && activeCanvas) {
    const alive = organisms.filter(o => o.isAlive).length;
    const dec = organisms.length - alive;
    let tc = 0; let frontierInfluence = 0;
    for (const o of organisms) {
      if (!o.isAlive) continue;
      tc += o.claimed.size;
      frontierInfluence += (o.frontier ? o.frontier.size : 0) * 0.5;
    }
    const visualTC = tc + frontierInfluence;
    const pct = activeCanvas.vertexCount > 0 ? Math.min(100, (visualTC / activeCanvas.vertexCount * 100)).toFixed(0) : 0;
    // Debug (fungal only): show pending/spawned counts for the first fungal organism
    let fungalDbg = '';
    for (const o of organisms) {
      if (o.isAlive && o.seedType === 'fungal' && o.adornment && o.adornment._pending) {
        const pend = o.adornment._pending.length;
        const counts = (o.adornment._families || []).reduce((s,f)=>s+(f.count||0), 0);
        fungalDbg = ` · fungal ${counts} (pending ${pend})`;
        break;
      }
    }
    document.getElementById('stat-org').textContent = `organisms ${alive}${dec ? ` · ${dec} decaying` : ''}${fungalDbg}`;
    // Clear coral debug when no living coral exists
    const hasLiveCoral = organisms.some(o => o.isAlive && o.seedType === 'coral');
    const coralEl = document.getElementById('stat-coral');
    if (coralEl && !hasLiveCoral) coralEl.textContent = '';
    document.getElementById('stat-surface').textContent = `surface ${pct}%`;
    // Count active border conflicts
    let conflicts = 0;
    for (const o of organisms) {
      if (!o.isAlive) continue;
      for (const v of o.frontier) {
        if (v.pressure > 0.5 && v.contestedBy) conflicts++;
      }
    }
    document.getElementById('stat-conflicts').textContent = conflicts > 0 ? `conflicts ${conflicts}` : '';
    const hybridCount = organisms.filter(o => o.isHybrid && o.isAlive).length;
    document.getElementById('stat-hybrids').textContent = hybridCount > 0 ? `hybrids ${hybridCount}` : '';
    document.getElementById('stat-time').textContent = formatTime(elapsedTime);

    // Update inspector if open
    if (inspectedOrganism) updateInspector();

    // Audio: ambient update
    audioEngine.updateAmbient({
      organismCount: alive,
      coverage: pct / 100,
      conflictCount: conflicts,
      growthRate: 0,
      organisms: organisms,
    });
  }

  // Animate preview sphere (landing page)
  if (previewSphere.parent) {
    previewSphere._jellyMat.uniforms.uTime.value += rawDt;
    previewSphere._glowMat.uniforms.uTime.value += rawDt;
  }

  // Update barrier visual
  if (barrierVisual) {
    barrierVisual.mat.uniforms.uTime.value += rawDt;
    if (barriers.size > 0) updateBarrierVisual();
  }

  // Update sway materials (GLB animated adornments)
  for (const mat of _swayMaterials) {
    mat.uniforms.uTime.value += rawDt;
  }

  composer.render();
}

loop();
console.log('Garden of Emergence · ready');
