// include.js
document.addEventListener("DOMContentLoaded", () => {
  const includes = document.querySelectorAll("[data-include]");
  let loaded = 0;

  includes.forEach(el => {
    const file = el.getAttribute("data-include");
    fetch(file)
      .then(res => {
        if (!res.ok) throw new Error(`Impossibile caricare ${file}`);
        return res.text();
      })
      .then(data => {
        el.innerHTML = data;
        loaded++;

        // Quando tutti i file inclusi sono caricati, inizializza tutto
        if (loaded === includes.length) {
          initializeMobileMenu();
          initializeSmoothScroll();
        }
      })
      .catch(err => {
        console.error("Errore include:", err);
        el.innerHTML = "<!-- Errore nel caricamento del file -->";
      });
  });
});

// ==============================
// MOBILE MENU
// ==============================
function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (!mobileMenuBtn || !navMenu) {
    console.warn("Elementi del menu mobile non trovati");
    return;
  }

  const overlay = document.createElement("div");
  overlay.className = "mobile-menu-overlay";
  document.body.appendChild(overlay);

  // Toggle menu
  mobileMenuBtn.addEventListener("click", e => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // Chiudi al click sull’overlay
  overlay.addEventListener("click", closeMobileMenu);

  // Chiudi al click su un link
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Chiudi con ESC
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      closeMobileMenu();
    }
  });

  // Chiudi se si ridimensiona lo schermo
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMobileMenu();
  });
}

function toggleMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");
  const overlay = document.querySelector(".mobile-menu-overlay");

  const isOpen = navMenu.classList.toggle("active");
  mobileMenuBtn.classList.toggle("active", isOpen);
  overlay.classList.toggle("active", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
  mobileMenuBtn.setAttribute("aria-expanded", isOpen);
}

function closeMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");
  const overlay = document.querySelector(".mobile-menu-overlay");

  if (mobileMenuBtn && navMenu && overlay) {
    mobileMenuBtn.classList.remove("active");
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    mobileMenuBtn.setAttribute("aria-expanded", "false");
  }
}

// ==============================
// SMOOTH SCROLL
// ==============================
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}
