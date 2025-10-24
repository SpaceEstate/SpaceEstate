// CONFIGURAZIONE
const MIN_NIGHTS = 2; // Soggiorno minimo richiesto

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

// Stato selezione date
let occupiedDates = [];
let currentMonth = new Date();
const maxMonth = new Date();
maxMonth.setMonth(maxMonth.getMonth() + 6);

let selectedCheckIn = null;
let selectedCheckOut = null;
let isSelectingCheckOut = false;

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
    dayEl.textContent = day;
    
    // Determina lo stato del giorno
    if (isPast) {
      dayEl.className = 'calendar-day occupied';
      dayEl.style.opacity = '0.4';
    } else if (occupied) {
      dayEl.className = 'calendar-day occupied';
    } else {
      // Giorno disponibile
      dayEl.className = 'calendar-day available';
      
      // Check-in selezionato
      if (selectedCheckIn === dateStr) {
        dayEl.classList.add('selected-checkin');
      }
      
      // Check-out selezionato
      if (selectedCheckOut === dateStr) {
        dayEl.classList.add('selected-checkout');
      }
      
      // Giorni nel range tra check-in e check-out
      if (selectedCheckIn && selectedCheckOut) {
        const checkInDate = new Date(selectedCheckIn);
        const checkOutDate = new Date(selectedCheckOut);
        if (currentDate > checkInDate && currentDate < checkOutDate) {
          dayEl.classList.add('in-range');
        }
      }
      
      // Hover preview quando si sta selezionando check-out
      if (isSelectingCheckOut && selectedCheckIn && !selectedCheckOut) {
        const checkInDate = new Date(selectedCheckIn);
        const nightsDiff = Math.floor((currentDate - checkInDate) / (1000 * 60 * 60 * 24));
        
        // Blocca solo i giorni che non raggiungono il minimo di notti
        // Con MIN_NIGHTS = 2, blocca solo il giorno dopo (1 notte)
        if (nightsDiff > 0 && nightsDiff < MIN_NIGHTS) {
          dayEl.classList.add('blocked-range');
          dayEl.style.opacity = '0.5';
          dayEl.style.cursor = 'not-allowed';
        } else if (currentDate > checkInDate && nightsDiff >= MIN_NIGHTS) {
          // Verifica che non ci siano date occupate nel mezzo
          if (canSelectRange(selectedCheckIn, dateStr)) {
            dayEl.classList.add('hover-range');
          } else {
            dayEl.classList.add('blocked-range');
          }
        }
      }
      
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
  
  updateNavigationButtons();
}

function canSelectRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);
  current.setDate(current.getDate() + 1); // Inizia dal giorno dopo check-in
  
  while (current < end) {
    const dateStr = current.toISOString().split('T')[0];
    if (occupiedDates.includes(dateStr)) {
      return false; // Trovata data occupata nel range
    }
    current.setDate(current.getDate() + 1);
  }
  
  return true;
}

function selectDate(dateStr) {
  const selectedDate = new Date(dateStr);
  
  // Se clicco sulla stessa data di check-in, deseleziona tutto
  if (selectedCheckIn === dateStr && !selectedCheckOut) {
    selectedCheckIn = null;
    selectedCheckOut = null;
    isSelectingCheckOut = false;
    updateDateInputs();
    renderCalendar();
    return;
  }
  
  if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
    // Prima selezione o reset: imposta check-in
    selectedCheckIn = dateStr;
    selectedCheckOut = null;
    isSelectingCheckOut = true;
    updateDateInputs();
    renderCalendar();
  } else if (selectedCheckIn && !selectedCheckOut) {
    // Seconda selezione: imposta check-out
    const checkInDate = new Date(selectedCheckIn);
    
    if (selectedDate <= checkInDate) {
      // Se la data è prima o uguale al check-in, ricomincia
      selectedCheckIn = dateStr;
      selectedCheckOut = null;
    } else {
      // Verifica vincolo minimo notti
      const nightsDiff = Math.floor((selectedDate - checkInDate) / (1000 * 60 * 60 * 24));
      
      if (nightsDiff < MIN_NIGHTS) {
        alert(`Soggiorno minimo richiesto: ${MIN_NIGHTS} notti.\nSeleziona una data di check-out successiva.`);
        return;
      }
      
      // Verifica che non ci siano date occupate nel range
      if (canSelectRange(selectedCheckIn, dateStr)) {
        // Range valido
        selectedCheckOut = dateStr;
        isSelectingCheckOut = false;
        updateDateInputs();
        calculatePrice();
      } else {
        // Range non valido (ci sono date occupate)
        alert('Non puoi selezionare questo periodo: ci sono date già occupate nel range selezionato.');
        return;
      }
    }
    
    renderCalendar();
  }
}

function updateDateInputs() {
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  
  if (checkinInput && selectedCheckIn) {
    checkinInput.value = selectedCheckIn;
  }
  if (checkoutInput && selectedCheckOut) {
    checkoutInput.value = selectedCheckOut;
  }
  
   // Reset del bottone prenotazione se non ci sono date
  if (!selectedCheckIn || !selectedCheckOut) {
    const bookingBtn = document.querySelector('.booking-btn');
    if (bookingBtn) {
      const priceElement = document.querySelector('.price');
      const pricePerNight = priceElement ? parseInt(priceElement.textContent.replace('€', '')) : 120;
      bookingBtn.textContent = `Prenota Ora - €${pricePerNight}/notte`;
    }
  }
}

function calculatePrice() {
  if (!selectedCheckIn || !selectedCheckOut) return;
  
  const checkIn = new Date(selectedCheckIn);
  const checkOut = new Date(selectedCheckOut);
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  // Rileva il prezzo dalla pagina
  const priceElement = document.querySelector('.price');
  const pricePerNight = priceElement ? parseInt(priceElement.textContent.replace('€', '')) : 120;
  const totalPrice = nights * pricePerNight;
  
  // Aggiorna il bottone di prenotazione
  const bookingBtn = document.querySelector('.booking-btn');
  if (bookingBtn) {
    bookingBtn.textContent = `Prenota ${nights} ${nights === 1 ? 'notte' : 'notti'} - €${totalPrice}`;
  }
  
  console.log(`Prezzo calcolato: ${nights} notti × €${pricePerNight} = €${totalPrice}`);
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
  
  if (newMonth >= today && newMonth <= maxMonthStart) {
    currentMonth = newMonth;
    renderCalendar();
  }
}

// Gestione input manuali
function setupDateInputHandlers() {
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  
  if (checkinInput) {
    checkinInput.addEventListener('change', (e) => {
      selectedCheckIn = e.target.value;
      selectedCheckOut = null;
      isSelectingCheckOut = true;
      updateDateInputs();
      renderCalendar();
    });
  }
  
  if (checkoutInput) {
    checkoutInput.addEventListener('change', (e) => {
      if (selectedCheckIn && e.target.value > selectedCheckIn) {
        const checkIn = new Date(selectedCheckIn);
        const checkOut = new Date(e.target.value);
        const nightsDiff = Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        if (nightsDiff < MIN_NIGHTS) {
          alert(`Soggiorno minimo richiesto: ${MIN_NIGHTS} notti.`);
          e.target.value = '';
          return;
        }
        
        if (canSelectRange(selectedCheckIn, e.target.value)) {
          selectedCheckOut = e.target.value;
          isSelectingCheckOut = false;
          calculatePrice();
          renderCalendar();
        } else {
          alert('Non puoi selezionare questo periodo: ci sono date già occupate.');
          e.target.value = '';
        }
      }
    });
  }
}

// Inizializza quando la pagina è pronta
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCalendar('la-columbera-corte');
    setupDateInputHandlers();
  });
} else {
  initCalendar('la-columbera-corte');
  setupDateInputHandlers();
}
