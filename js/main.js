/**
 * Gabriela Jiménez (GJ) - Interactive Script (Versión Morado Claro & Aesthetic)
 * - Sistema de física de corazones morados en Canvas (Tonos lila, lavanda y violeta suave)
 * - Filtro para "Películas & Series"
 * - Filtro para "Mi Hermano, Amistades & Familia"
 * - Conmutador de fotos y Lightbox modal
 * - Libro de visitas local interactivo
 */

document.addEventListener('DOMContentLoaded', () => {
  initPurpleHeartsEngine();
  initPhotoSwitcher();
  initMediaFilters();
  initLovedFilters();
  initGuestbook();
  initNavigation();
  initLightbox();
});

/* ==========================================================================
   1. SISTEMA DE CORAZONES MORADOS (CANVAS & FÍSICA)
   ========================================================================== */

function initPurpleHeartsEngine() {
  const canvas = document.getElementById('hearts-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Contador de corazones
  let heartCount = 0;
  const counterEl = document.getElementById('heart-counter');
  const statusEl = document.getElementById('counter-status');

  const statusMessages = [
    { count: 1, text: '¡Magia lila! ✨' },
    { count: 10, text: '¡Vibra bonita activada! 💜' },
    { count: 25, text: '¡Lluvia de corazones! 🌸' },
    { count: 50, text: '¡Gabi te manda un abrazo! 💜' },
    { count: 100, text: '¡Modo Diosa Morada! 👑' },
    { count: 200, text: '¡Amor infinito morado! 💫' }
  ];

  // Paleta de morados claros, lavandas y violetas armónicos
  const purplePalette = [
    '#a855f7', '#c084fc', '#d8b4fe', '#9333ea', 
    '#b877f8', '#8b5cf6', '#e9d5ff', '#ec4899', '#f472b6'
  ];

  const particles = [];

  class HeartParticle {
    constructor(x, y, isBurst = true) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 22 + 14;
      
      const angle = isBurst ? Math.random() * Math.PI * 2 : (Math.random() * Math.PI - Math.PI);
      const speed = isBurst ? (Math.random() * 8 + 4) : (Math.random() * 5 + 3);

      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - (isBurst ? 2.5 : 1.5);
      
      this.gravity = 0.17;
      this.friction = 0.985;
      
      this.alpha = 1;
      this.decay = Math.random() * 0.012 + 0.008;
      
      this.color = purplePalette[Math.floor(Math.random() * purplePalette.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.08;
      
      this.useEmoji = Math.random() > 0.4;
      this.emojis = ['💜', '🟣', '✨', '🌸', '🔮', '🪻'];
      this.emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      
      this.x += this.vx;
      this.y += this.vy;
      
      this.rotation += this.rotationSpeed;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.useEmoji) {
        ctx.font = `${this.size}px "Outfit", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, 0, 0);
      } else {
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        drawHeartPath(ctx, 0, 0, this.size);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function drawHeartPath(ctx, x, y, size) {
    const s = size / 30;
    ctx.beginPath();
    ctx.moveTo(x, y + 8 * s);
    ctx.bezierCurveTo(x, y + 4 * s, x - 15 * s, y - 10 * s, x - 15 * s, y - 2 * s);
    ctx.bezierCurveTo(x - 15 * s, y + 7 * s, x, y + 17 * s, x, y + 25 * s);
    ctx.bezierCurveTo(x, y + 17 * s, x + 15 * s, y + 7 * s, x + 15 * s, y - 2 * s);
    ctx.bezierCurveTo(x + 15 * s, y - 10 * s, x, y + 4 * s, x, y + 8 * s);
    ctx.closePath();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  render();

  function launchHearts(originX, originY, amount = 35) {
    playChimeSound();

    for (let i = 0; i < amount; i++) {
      particles.push(new HeartParticle(originX, originY, true));
    }

    heartCount += amount;
    if (counterEl) {
      counterEl.textContent = heartCount;
      counterEl.classList.add('pop');
      setTimeout(() => counterEl.classList.remove('pop'), 200);
    }

    if (statusEl) {
      for (let m of statusMessages) {
        if (heartCount >= m.count) {
          statusEl.textContent = m.text;
        }
      }
    }
  }

  const heartButtons = document.querySelectorAll('.trigger-hearts');
  heartButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      launchHearts(x, y, 38);
    });
  });

  window.addEventListener('dblclick', (e) => {
    launchHearts(e.clientX, e.clientY, 25);
  });
}

function playChimeSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (err) {}
}

/* ==========================================================================
   2. CONMUTADOR DE FOTOS (HERO)
   ========================================================================== */

function initPhotoSwitcher() {
  const heroImg = document.getElementById('hero-img');
  const switchChips = document.querySelectorAll('.switch-chip');

  if (!heroImg || !switchChips.length) return;

  switchChips.forEach((btn) => {
    btn.addEventListener('click', () => {
      const newSrc = btn.getAttribute('data-src');
      if (!newSrc || heroImg.src.includes(newSrc)) return;

      switchChips.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      heroImg.style.opacity = '0.3';
      heroImg.style.transform = 'scale(0.97)';

      setTimeout(() => {
        heroImg.src = newSrc;
        heroImg.style.opacity = '1';
        heroImg.style.transform = 'scale(1)';
      }, 180);
    });
  });
}

/* ==========================================================================
   3. FILTROS DE PELÍCULAS Y SERIES
   ========================================================================== */

function initMediaFilters() {
  const filterChips = document.querySelectorAll('.category-filter-bar .filter-chip[data-filter]');
  const showCards = document.querySelectorAll('.show-card');

  if (!filterChips.length || !showCards.length) return;

  filterChips.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterChips.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      showCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. FILTROS PARA GENTE QUE QUIERO (HERMANO, AMISTADES & FAMILIA)
   ========================================================================== */

function initLovedFilters() {
  const filterChips = document.querySelectorAll('.loved-filters .filter-chip[data-loved]');
  const lovedCards = document.querySelectorAll('.loved-card');

  if (!filterChips.length || !lovedCards.length) return;

  filterChips.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterChips.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-loved');

      lovedCards.forEach((card) => {
        const types = card.getAttribute('data-loved-type') || '';

        if (filter === 'all' || types.includes(filter)) {
          card.style.display = 'grid';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. LIBRO DE VISITAS / MURO DE MENSAJES (LOCALSTORAGE)
   ========================================================================== */

function initGuestbook() {
  const form = document.getElementById('guestbook-form');
  const messagesContainer = document.getElementById('messages-container');

  if (!form || !messagesContainer) return;

  const STORAGE_KEY = 'gabi_guestbook_messages_v2';

  function loadMessages() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const messages = JSON.parse(saved);
      messages.forEach((msg) => addMessageToDOM(msg, false));
    } catch (e) {
      console.error('Error cargando mensajes', e);
    }
  }

  function addMessageToDOM(data, isNew = true) {
    const card = document.createElement('div');
    card.className = 'clean-comment';

    card.innerHTML = `
      <div class="comment-head">
        <strong>${escapeHtml(data.name)}</strong>
        <span class="badge-msg-type">${escapeHtml(data.type)}</span>
      </div>
      <p>${escapeHtml(data.message)}</p>
      <span class="comment-date">${data.time || 'Hace un momento'}</span>
    `;

    if (isNew) {
      messagesContainer.prepend(card);
    } else {
      messagesContainer.appendChild(card);
    }
  }

  function saveMessageToStorage(data) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error guardando mensaje', e);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('visitor-name');
    const typeInput = document.getElementById('message-type');
    const msgInput = document.getElementById('visitor-message');

    if (!nameInput.value.trim() || !msgInput.value.trim()) return;

    const newMsg = {
      name: nameInput.value.trim(),
      type: typeInput.value,
      message: msgInput.value.trim(),
      time: 'Justo ahora'
    };

    addMessageToDOM(newMsg, true);
    saveMessageToStorage(newMsg);

    nameInput.value = '';
    msgInput.value = '';

    const mainBtn = document.getElementById('main-gj-button');
    if (mainBtn) mainBtn.click();
  });

  loadMessages();
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}

/* ==========================================================================
   6. NAVEGACIÓN Y SCROLL ACTIVO
   ========================================================================== */

function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('nav-links');
  const mobileToggle = document.getElementById('mobile-toggle');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentId = '';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    links.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }
}

/* ==========================================================================
   7. LIGHTBOX PARA FOTOS
   ========================================================================== */

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal || !imgEl) return;

  const clickableImgs = document.querySelectorAll('.zoomable-img, .like-preview-img img, .portrait-img');

  clickableImgs.forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      imgEl.src = img.src;
      if (captionEl) {
        captionEl.textContent = img.alt || 'Gabriela Jiménez 💜';
      }
      modal.classList.add('active');
    });
  });

  function closeModal() {
    modal.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-backdrop')) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
