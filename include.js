// include.js - VERSIONE AGGIORNATA CON MENU DUPLICATO
document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  let loaded = 0; 

  includes.forEach(el => {
    const file = el.getAttribute("data-include");
    fetch(file)
      .then(res => {
        if (!res.ok) throw new Error(`Errore nel caricamento di ${file}`);
        return res.text();
      })
      .then(data => {
        el.innerHTML = data;
        loaded++;
        if (loaded === includes.length) {
          // Inizializza tutto dopo il caricamento completo
          setTimeout(initializeAll, 100);
        }
      })
      .catch(err => console.error("Errore include:", err));
  });
});

function initializeAll() {
  console.log("✅ Inizializzazione completa avviata");
  
  // Crea l'overlay se non esiste
  createOverlay();
  
  // Inizializza tutte le funzioni
  activateCurrentNavLink();
  setupMobileMenu();
  setupSmoothScroll();
  
  console.log("✅ Inizializzazione completata");
}

// Crea l'overlay per il menu mobile
function createOverlay() {
  let overlay = document.querySelector('.mobile-menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    console.log("✅ Overlay creato");
  }
}

// Attiva il link corrente nella navigazione (ENTRAMBI I MENU)
function activateCurrentNavLink() {
  const currentPage = window.location.pathname;
  // Seleziona i link sia dal menu desktop che mobile
  const navLinks = document.querySelectorAll('.nav-menu-desktop a, .nav-menu-mobile a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    const pageName = href.split('/').pop();
    const cleanCurrentPage = currentPage.split('?')[0].split('#')[0];
    
    if (cleanCurrentPage.endsWith(pageName)) {
      link.classList.add('active');
    }
    else if (pageName === 'index.html' && (cleanCurrentPage.endsWith('/') || cleanCurrentPage === '')) {
      link.classList.add('active');
    }
  });
  
  console.log("✅ Link di navigazione attivato");
}

// Setup menu mobile
function setupMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenuMobile = document.querySelector('.nav-menu-mobile');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (!mobileMenuBtn || !navMenuMobile || !overlay) {
    console.warn('❌ Elementi menu mobile non trovati');
    return;
  }

  console.log("✅ Setup menu mobile");

  // Funzione per aprire il menu
  function openMenu() {
    navMenuMobile.classList.add('active');
    mobileMenuBtn.classList.add('active');
    overlay.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  // Funzione per chiudere il menu
  function closeMenu() {
    navMenuMobile.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    overlay.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Toggle menu al click del bottone hamburger
  mobileMenuBtn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navMenuMobile.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Chiudi menu al click sull'overlay
  overlay.addEventListener('click', closeMenu);

  // Chiudi menu quando si clicca su un link
  navMenuMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Chiudi menu con tasto ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenuMobile.classList.contains('active')) {
      closeMenu();
    }
  });

  // Chiudi menu su resize verso desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenuMobile.classList.contains('active')) {
      closeMenu();
    }
  });
}

// Setup smooth scroll
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  console.log("✅ Smooth scroll attivato");
}
