// Carica date occupate per un appartamento
async function loadOccupiedDates(apartmentId) {
  try {
    const response = await fetch(`./calendars/${apartmentId}.json`);
    if (!response.ok) throw new Error('Calendario non trovato');
    
    const data = await response.json();
    return data.occupiedDates || [];
  } catch (error) {
    console.error('Errore caricamento calendario:', error);
    return [];
  }
}

// Controlla se una data è occupata
function isDateOccupied(date, occupiedDates) {
  const dateStr = date instanceof Date 
    ? date.toISOString().split('T')[0]
    : date;
  return occupiedDates.includes(dateStr);
}

// Inizializzazione calendario nella pagina
let occupiedDates = [];
let currentMonth = new Date(); // Mese corrente
const maxMonth = new Date();
maxMonth.setMonth(maxMonth.getMonth() + 6); // Limite: 6 mesi nel futuro

async function initCalendar(apartmentId) {
  occupiedDates = await loadOccupiedDates(apartmentId);
  console.log(`Caricate ${occupiedDates.length} date occupate`);
  renderCalendar();
}

function renderCalendar() {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const calendarGrid = document.getElementById('calendarGrid');
  if (!calendarGrid) return;
  
  calendarGrid.innerHTML = '';
  
  // Data corrente per disabilitare giorni passati
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Giorni vuoti iniziali
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendarGrid.appendChild(emptyDay);
  }
  
  // Giorni del mese
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const currentDate = new Date(year, month, day);
    const isPast = currentDate < today;
    const occupied = occupiedDates.includes(dateStr);
    
    const dayEl = document.createElement('div');
    
    // Giorni passati: mostra come non disponibili
    if (isPast) {
      dayEl.className = 'calendar-day occupied';
      dayEl.style.opacity = '0.4';
    } else if (occupied) {
      dayEl.className = 'calendar-day occupied';
    } else {
      dayEl.className = 'calendar-day available';
      dayEl.style.cursor = 'pointer';
      dayEl.onclick = () => selectDate(dateStr);
    }
    
    dayEl.textContent = day;
    calendarGrid.appendChild(dayEl);
  }
  
  // Aggiorna titolo mese
  const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  const currentMonthEl = document.getElementById('currentMonth');
  if (currentMonthEl) {
    currentMonthEl.textContent = `${monthNames[month]} ${year}`;
  }
  
  // Aggiorna stato pulsanti navigazione
  updateNavigationButtons();
}

function updateNavigationButtons() {
  const prevButton = document.querySelector('.calendar-nav:first-of-type');
  const nextButton = document.querySelector('.calendar-nav:last-of-type');
  
  const today = new Date();
  today.setDate(1);
  today.setHours(0, 0, 0, 0);
  
  const currentMonthStart = new Date(currentMonth);
  currentMonthStart.setDate(1);
  currentMonthStart.setHours(0, 0, 0, 0);
  
  const maxMonthStart = new Date(maxMonth);
  maxMonthStart.setDate(1);
  maxMonthStart.setHours(0, 0, 0, 0);
  
  // Disabilita bottone "precedente" se siamo nel mese corrente
  if (prevButton) {
    if (currentMonthStart <= today) {
      prevButton.disabled = true;
      prevButton.style.opacity = '0.3';
      prevButton.style.cursor = 'not-allowed';
    } else {
      prevButton.disabled = false;
      prevButton.style.opacity = '1';
      prevButton.style.cursor = 'pointer';
    }
  }
  
  // Disabilita bottone "successivo" se siamo a 6 mesi nel futuro
  if (nextButton) {
    if (currentMonthStart >= maxMonthStart) {
      nextButton.disabled = true;
      nextButton.style.opacity = '0.3';
      nextButton.style.cursor = 'not-allowed';
    } else {
      nextButton.disabled = false;
      nextButton.style.opacity = '1';
      nextButton.style.cursor = 'pointer';
    }
  }
}

function changeMonth(direction) {
  const newMonth = new Date(currentMonth);
  newMonth.setMonth(newMonth.getMonth() + direction);
  
  const today = new Date();
  today.setDate(1);
  today.setHours(0, 0, 0, 0);
  
  const maxMonthStart = new Date(maxMonth);
  maxMonthStart.setDate(1);
  maxMonthStart.setHours(0, 0, 0, 0);
  
  // Verifica che il nuovo mese sia nel range permesso
  if (newMonth >= today && newMonth <= maxMonthStart) {
    currentMonth = newMonth;
    renderCalendar();
  }
}

function selectDate(dateStr) {
  console.log('Data selezionata:', dateStr);
  // Qui puoi aggiungere logica per il form di prenotazione
}

// Inizializza quando la pagina è pronta
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCalendar('la-columbera-corte');
  });
} else {
  initCalendar('la-columbera-corte');
}
