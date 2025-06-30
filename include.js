// include.js
document.addEventListener("DOMContentLoaded", function () {
  const includes = document.querySelectorAll('[data-include]');
  includes.forEach(el => {
    const file = el.getAttribute('data-include');
    fetch(file)
      .then(response => {
        if (response.ok) return response.text();
        else throw new Error(`Impossibile caricare ${file}`);
      })
      .then(data => {
        el.innerHTML = data;
      })
      .catch(error => {
        console.error(error);
        el.innerHTML = "<!-- Errore nel caricamento del file -->";
      });
  });
});
// MOBILE MENU FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
  // Attendiamo che header e footer siano caricati
  setTimeout(initializeMobileMenu, 100);
});

function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  if (!mobileMenuBtn || !navMenu) {
    console.warn('Mobile menu elements not found');
    return;
  }

  // Toggle menu mobile
  mobileMenuBtn.addEventListener('click', function(e) {
    e.preventDefault();
    toggleMobileMenu();
  });

  // Chiudi menu quando si clicca su un link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMobileMenu();
    });
  });

  // Chiudi menu quando si clicca fuori
  document.addEventListener('click', function(e) {
    if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Chiudi menu con tasto ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Gestisci resize della finestra
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  // Smooth scrolling per tutti i link anchor
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function toggleMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  mobileMenuBtn.classList.toggle('active');
  navMenu.classList.toggle('active');
  
  // Gestione accessibilità
  const isOpen = navMenu.classList.contains('active');
  mobileMenuBtn.setAttribute('aria-expanded', isOpen);
  
  // Previeni scroll del body quando menu è aperto
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
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
