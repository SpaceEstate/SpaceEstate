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
let currentMonth = new Date(2025, 5); // Giugno 2025

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
  
  // Giorni vuoti iniziali
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendarGrid.appendChild(emptyDay);
  }
  
  // Giorni del mese
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const occupied = occupiedDates.includes(dateStr);
    
    const dayEl = document.createElement('div');
    dayEl.className = `calendar-day ${occupied ? 'occupied' : 'available'}`;
    dayEl.textContent = day;
    
    if (!occupied) {
      dayEl.style.cursor = 'pointer';
      dayEl.onclick = () => selectDate(dateStr);
    }
    
    calendarGrid.appendChild(dayEl);
  }
  
  // Aggiorna titolo mese
  const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  const currentMonthEl = document.getElementById('currentMonth');
  if (currentMonthEl) {
    currentMonthEl.textContent = `${monthNames[month]} ${year}`;
  }
}

function changeMonth(direction) {
  currentMonth.setMonth(currentMonth.getMonth() + direction);
  renderCalendar();
}

function selectDate(dateStr) {
  console.log('Data selezionata:', dateStr);
}

// Inizializza quando la pagina è pronta
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCalendar('la-columbera-corte');
  });
} else {
  initCalendar('la-columbera-corte');
}
