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
