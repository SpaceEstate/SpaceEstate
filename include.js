// include.js
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
          // Inizializza funzioni solo dopo il caricamento completo
          setTimeout(initializeMobileMenu, 50);
        }
      })
      .catch(err => console.error("Errore include:", err));
  });
});

function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (!mobileMenuBtn || !navMenu) {
    console.warn('❌ Elementi menu mobile non trovati nel DOM');
    return;
  }

  console.log("✅ Mobile menu inizializzato");

  // Toggle menu mobile
  mobileMenuBtn.addEventListener('click', e => {
    e.preventDefault();
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');

    const isOpen = navMenu.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Chiudi menu cliccando su un link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Chiudi cliccando fuori
  document.addEventListener('click', e => {
    if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Chiudi con tasto ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Chiudi su resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobileMenu();
  });
}

function closeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.classList.remove('active');
    navMenu.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}
