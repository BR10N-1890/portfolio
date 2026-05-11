document.addEventListener('DOMContentLoaded', function () {

    const mobileBurger = document.getElementById('mobileBurger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  if (!mobileBurger || !mobileMenu) return;
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mobileBurger.setAttribute('aria-expanded', 'false');
}

function toggleMobileMenu(e) {
  if (!mobileBurger || !mobileMenu) return;
  e.stopPropagation();
  const open = mobileMenu.classList.toggle('open');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  mobileBurger.setAttribute('aria-expanded', String(open));
}

if (mobileBurger && mobileMenu) {
  mobileBurger.addEventListener('click', toggleMobileMenu);

  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => closeMobileMenu());
  });

  document.addEventListener('click', () => closeMobileMenu());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

const mobileFooter = document.getElementById('mobileFooter');
const mobileFooterToggle = document.getElementById('mobileFooterToggle');

function closeMobileFooter() {
  if (!mobileFooter || !mobileFooterToggle) return;
  mobileFooter.classList.remove('open');
  mobileFooter.setAttribute('aria-hidden', 'true');
  mobileFooterToggle.setAttribute('aria-expanded', 'false');
}

function toggleMobileFooter(e) {
  if (!mobileFooter || !mobileFooterToggle) return;
  e.stopPropagation();
  const open = mobileFooter.classList.toggle('open');
  mobileFooter.setAttribute('aria-hidden', String(!open));
  mobileFooterToggle.setAttribute('aria-expanded', String(open));
}

function closeMobileFooter() {
  if (!mobileFooter || !mobileFooterToggle) return;
  mobileFooter.classList.remove('open');
  document.body.classList.remove('footer-open');   // <-- add
  mobileFooter.setAttribute('aria-hidden', 'true');
  mobileFooterToggle.setAttribute('aria-expanded', 'false');
}

function toggleMobileFooter(e) {
  if (!mobileFooter || !mobileFooterToggle) return;
  e.stopPropagation();
  const open = mobileFooter.classList.toggle('open');
  document.body.classList.toggle('footer-open', open); // <-- add
  mobileFooter.setAttribute('aria-hidden', String(!open));
  mobileFooterToggle.setAttribute('aria-expanded', String(open));
  mobileFooterToggle.textContent = open ? '✕' : 'ⓘ';
}

if (mobileFooter && mobileFooterToggle) {
  mobileFooterToggle.addEventListener('click', toggleMobileFooter);

  document.addEventListener('click', () => closeMobileFooter());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileFooter();
  });
}

    // ===============================
    // Sélection des éléments utiles
    // ===============================

    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const topNavLinks = document.querySelectorAll('.nav-link');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.section-page');
    const yearSpan = document.getElementById('year');

    // On regroupe tous les liens de navigation (header + sidebar)
    const allNavLinks = [...topNavLinks, ...sidebarLinks];

    // ===============================
    // Mise à jour de l’année en footer
    // ===============================

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ===============================
    // Helpers
    // ===============================

    function escapeHtml(value) {
  const str = String(value ?? '');
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

    function normalizeId(raw) {
        if (!raw) return '';
        return raw.replace('#', '').trim();
    }

    function setActiveLinkState(id) {
        allNavLinks.forEach(function (link) {
            const href = link.getAttribute('href');
            if (href === '#' + id) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    // ===============================
// BTS - fermeture (safe) : ne plante jamais si éléments absents
// ===============================
let openedBtsCard = null; // une seule déclaration dans tout le fichier

function closeBtsTable() {
  const wrap = document.getElementById('btsTableWrap');
  const grid = document.getElementById('btsTableGrid');

  if (wrap) {
    wrap.classList.remove('is-visible');
    wrap.setAttribute('aria-hidden', 'true');
  }
  if (grid) grid.innerHTML = '';

  document.querySelectorAll('.bts-card.is-selected')
    .forEach(c => c.classList.remove('is-selected'));

  openedBtsCard = null;
}

    // ===============================
    // Fonction d'affichage d'une "page"
    // ===============================

    function showSectionById(id, options) {
        const opts = options || {};
        const updateUrl = opts.updateUrl !== false;

        // Masquer toutes les sections
        sections.forEach(function (section) {
            section.classList.remove('active-section');
        });

        closeBtsTable();

        // Afficher celle qui correspond à l'id
        const target = document.getElementById(id);

        // Fallback si id invalide
        const finalTarget = target || document.getElementById('accueil');
        if (!finalTarget) return;

        finalTarget.classList.add('active-section');
        setActiveLinkState(finalTarget.id);

        // Mettre à jour l'URL (hash) pour partage / refresh / bouton retour
        if (updateUrl) {
            if (location.hash !== '#' + finalTarget.id) {
                history.pushState({ section: finalTarget.id }, '', '#' + finalTarget.id);
            }
        }
    }

    // ===============================
    // Affichage initial : hash ou accueil
    // ===============================

    const initialId = normalizeId(location.hash) || 'accueil';
    showSectionById(initialId, { updateUrl: false });

    // ===============================
    // Gestion bouton "Retour" navigateur
    // ===============================

    window.addEventListener('popstate', function () {
        const idFromHash = normalizeId(location.hash) || 'accueil';
        showSectionById(idFromHash, { updateUrl: false });
    });

    // ===============================
    // Gestion du menu burger (mobile)
    // ===============================

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
        });
    }

    // ===============================
    // Navigation type SPA (sans scroll)
    // ===============================

    allNavLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const targetId = normalizeId(this.getAttribute('href'));
            if (!targetId) return;

            showSectionById(targetId);

            // Fermer le menu horizontal sur mobile après clic
            if (window.innerWidth <= 768 && mainNav && navToggle) {
                mainNav.classList.remove('open');
                navToggle.classList.remove('open');
            }
        });
    });

// ===============================
// Navigation au scroll + clavier (améliorée)
// - Scroll bas  => section suivante
// - Scroll haut => section précédente
// Ordre basé sur la SIDEBAR
// ===============================

const sectionOrder = Array.from(sidebarLinks)
    .map(link => normalizeId(link.getAttribute('href')))
    .filter(Boolean);

let navLocked = false;
const NAV_LOCK_MS = 650;

function lockNavBriefly() {
    navLocked = true;
    setTimeout(() => (navLocked = false), NAV_LOCK_MS);
}

function getActiveSectionEl() {
    return document.querySelector('.section-page.active-section');
}

function getActiveSectionId() {
    const el = getActiveSectionEl();
    return el ? el.id : (sectionOrder[0] || 'accueil');
}

function goToSectionByIndex(index, options) {
    if (index < 0 || index >= sectionOrder.length) return;
    showSectionById(sectionOrder[index], options);
}

function goToByDelta(delta) {
    const currentId = getActiveSectionId();
    const index = sectionOrder.indexOf(currentId);
    if (index === -1) return;
    goToSectionByIndex(index + delta);
}

function elementCanScroll(el) {
    return el && el.scrollHeight > el.clientHeight + 1;
}

function isAtTop(el) {
    return !el || el.scrollTop <= 0;
}

function isAtBottom(el) {
    return !el || (el.scrollTop + el.clientHeight >= el.scrollHeight - 1);
}

// Détermine quel élément scrolle réellement :
// - si la section active est en overflow auto/scroll => elle
// - sinon => le document (page)
function getPrimaryScroller() {
    const active = getActiveSectionEl();
    const docScroller = document.scrollingElement || document.documentElement;

    if (!active) return docScroller;

    const overflowY = window.getComputedStyle(active).overflowY;
    const sectionIsScrollable =
        (overflowY === 'auto' || overflowY === 'scroll') && elementCanScroll(active);

    return sectionIsScrollable ? active : docScroller;
}

// Ignore les interactions si on est en train d’écrire (formulaire / champs)
function isTypingTarget(target) {
    if (!target) return false;
    const tag = target.tagName ? target.tagName.toLowerCase() : '';
    return tag === 'input' || tag === 'textarea' || target.isContentEditable;
}

// Laisser scroller une zone interne (ex: procédures) tant qu'elle n'est pas aux extrémités
function shouldLetInnerScroll(target, directionDown) {
    const inner = target.closest('.bts-procedures-list');
    if (!inner) return false;
    if (!elementCanScroll(inner)) return false;

    if (directionDown) return !isAtBottom(inner);
    return !isAtTop(inner);
}

window.addEventListener('wheel', function (event) {
    if (navLocked) return;
    if (isTypingTarget(event.target)) return;

    const directionDown = event.deltaY > 0;

    // 1) laisser scroller les listes internes (procédures) si elles le peuvent
    if (shouldLetInnerScroll(event.target, directionDown)) return;

    // 2) utiliser le bon conteneur de scroll (section ou page)
    const scroller = getPrimaryScroller();
    if (!scroller) return;

    // 3) si on peut encore scroller dans la direction, on laisse faire
    if (elementCanScroll(scroller)) {
        if (directionDown && !isAtBottom(scroller)) return;
        if (!directionDown && !isAtTop(scroller)) return;
    }

    // 4) sinon on change de section
    event.preventDefault();
    goToByDelta(directionDown ? 1 : -1);
    lockNavBriefly();
}, { passive: false });

// ===============================
// Navigation clavier
// - ↑/↓ : section précédente/suivante
// - PageUp/PageDown : idem
// - Home/End : première/dernière section
// - Space : suivante | Shift+Space : précédente
// ===============================

window.addEventListener('keydown', function (event) {
    if (navLocked) return;
    if (isTypingTarget(event.target)) return;

    const key = event.key;

    const nextKeys = new Set(['ArrowDown', 'PageDown', ' ']); // espace
    const prevKeys = new Set(['ArrowUp', 'PageUp']);

    // Space + Shift => précédent
    const isSpace = key === ' ';
    const wantsPrev = isSpace ? event.shiftKey : prevKeys.has(key);
    const wantsNext = isSpace ? !event.shiftKey : nextKeys.has(key);

    if (!wantsPrev && !wantsNext && key !== 'Home' && key !== 'End') return;

    event.preventDefault();

    if (key === 'Home') {
        goToSectionByIndex(0);
        lockNavBriefly();
        return;
    }

    if (key === 'End') {
        goToSectionByIndex(sectionOrder.length - 1);
        lockNavBriefly();
        return;
    }

    goToByDelta(wantsNext ? 1 : -1);
    lockNavBriefly();
});

// ===============================
// BTS : tableau 3 colonnes sous les cartes
// ===============================

const btsTableWrap  = document.getElementById('btsTableWrap');
const btsTableTitle = document.getElementById('btsTableTitle');
const btsTableGrid  = document.getElementById('btsTableGrid');
const btsCards = document.querySelectorAll('.bts-card[data-bloc]');

async function ensureProceduresLoaded(card) {
  const list = card.querySelector('.bts-procedures-list[data-src]');
  if (!list) return null;

  if (list.dataset.loaded === 'true') return list;

  const src = list.getAttribute('data-src');
  if (!src) return list;

  try {
    const res = await fetch(src, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    list.innerHTML = await res.text();
    list.dataset.loaded = 'true';
  } catch (err) {
    console.error('Impossible de charger', src, err);
    list.innerHTML = `<div class="bts-load-error">Erreur de chargement des procédures.</div>`;
    list.dataset.loaded = 'true';
  }

  return list;
}

function renderTableFromList(list) {
  if (!btsTableWrap || !btsTableGrid) return;

  const procedures = list ? list.querySelectorAll('.procedure-card') : [];
  btsTableGrid.innerHTML = Array.from(procedures).map(proc => {
    const titleEl = proc.querySelector('.procedure-title');
    const linkEl  = proc.querySelector('.procedure-download');

    const title = titleEl ? titleEl.textContent.trim() : 'Procédure';
    const href  = linkEl ? linkEl.getAttribute('href') : '#';

    return `
      <div class="bts-cell">
        <div class="cell-title">${escapeHtml(title)}</div>
        <a class="btn btn-ghost btn-small procedure-download" href="${escapeHtml(href)}">Télécharger</a>
      </div>
    `;
  }).join('');

  btsTableWrap.classList.add('is-visible');
  btsTableWrap.setAttribute('aria-hidden', 'false');

  // Ramener le tableau dans la vue (sinon il peut être sous les cartes)
  btsTableWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

btsCards.forEach(card => {
  card.addEventListener('click', async () => {
    const isVisible = btsTableWrap && btsTableWrap.classList.contains('is-visible');
    if (isVisible && openedBtsCard === card) {
      closeBtsTable();
      return;
    }

    const bloc = card.getAttribute('data-bloc') || '';
    if (btsTableTitle) btsTableTitle.textContent = `Procédures – Bloc ${bloc}`;

    const list = await ensureProceduresLoaded(card);
    renderTableFromList(list);

    document.querySelectorAll('.bts-card.is-selected').forEach(c => c.classList.remove('is-selected'));
    card.classList.add('is-selected');
    openedBtsCard = card;
  });
});

// Empêcher les clics internes (boutons / liste scrollable) de re-déclencher le clic carte
document.addEventListener('click', (e) => {
  if (e.target.closest('.procedure-download') || e.target.closest('.bts-procedures-list')) {
    e.stopPropagation();
  }
}, true);
})