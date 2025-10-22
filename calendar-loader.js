// calendar-loader.js
// Gestisce il caricamento e la visualizzazione dei calendari sincronizzati

class ApartmentCalendar {
  constructor(apartmentId) {
    this.apartmentId = apartmentId;
    this.occupiedDates = [];
    this.currentMonth = new Date(2025, 5); // Giugno 2025
    this.selectedCheckin = null;
    this.selectedCheckout = null;
  }

  // Carica date occupate dal file JSON
  async loadOccupiedDates() {
    try {
      const response = await fetch(`./calendars/${this.apartmentId}.json`);
      if (!response.ok) {
        console.warn('Calendario non trovato, uso date di esempio');
        return this.getExampleDates();
      }
      
      const data = await response.json();
      this.occupiedDates = data.occupiedDates || [];
      
      console.log(`✅ Caricate ${this.occupiedDates.length} date occupate`);
      console.log(`📅 Ultimo aggiornamento: ${data.lastUpdate}`);
      
      return this.occupiedDates;
    } catch (error) {
      console.error('❌ Errore caricamento calendario:', error);
      return this.getExampleDates();
    }
  }

  // Date di esempio per test (rimuovi quando hai i dati reali)
  getExampleDates() {
    return [
      '2025-06-15', '2025-06-16', '2025-06-17',
      '2025-06-22', '2025-06-23', '2025-06-24', '2025-06-25',
      '2025-07-01', '2025-07-02', '2025-07-03', '2025-07-04', '2025-07-05'
    ];
  }

  // Controlla se una data è occupata
  isDateOccupied(dateStr) {
    return this.occupiedDates.includes(dateStr);
  }

  // Controlla se una data è nel passato
  isDatePast(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  // Renderizza il calendario
  renderCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
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
      const occupied = this.isDateOccupied(dateStr);
      const past = this.isDatePast(dateStr);
      
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.textContent = day;
      
      if (past) {
        dayEl.classList.add('past');
      } else if (occupied) {
        dayEl.classList.add('occupied');
      } else {
        dayEl.classList.add('available');
        dayEl.style.cursor = 'pointer';
        dayEl.onclick = () => this.handleDateClick(dateStr);
      }
      
      // Evidenzia date selezionate
      if (dateStr === this.selectedCheckin) {
        dayEl.classList.add('selected-checkin');
      }
      if (dateStr === this.selectedCheckout) {
        dayEl.classList.add('selected-checkout');
      }
      
      calendarGrid.appendChild(dayEl);
    }
    
    // Aggiorna titolo mese
    this.updateMonthTitle();
  }

  // Aggiorna il titolo del mese
  updateMonthTitle() {
    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    const currentMonthEl = document.getElementById('currentMonth');
    if (currentMonthEl) {
      currentMonthEl.textContent = `${monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
    }
  }

  // Cambia mese
  changeMonth(direction) {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
    this.renderCalendar();
  }

  // Gestisce il click su una data
  handleDateClick(dateStr) {
    // Se non c'è check-in, imposta check-in
    if (!this.selectedCheckin) {
      this.selectedCheckin = dateStr;
      this.updateDateInputs();
      this.renderCalendar();
      return;
    }
    
    // Se c'è già check-in ma non check-out, imposta check-out
    if (this.selectedCheckin && !this.selectedCheckout) {
      const checkinDate = new Date(this.selectedCheckin);
      const checkoutDate = new Date(dateStr);
      
      // Check-out deve essere dopo check-in
      if (checkoutDate <= checkinDate) {
        alert('La data di check-out deve essere successiva al check-in');
        return;
      }
      
      // Verifica che non ci siano date occupate nel range
      if (this.hasOccupiedDatesInRange(this.selectedCheckin, dateStr)) {
        alert('Ci sono date occupate nel periodo selezionato');
        return;
      }
      
      this.selectedCheckout = dateStr;
      this.updateDateInputs();
      this.renderCalendar();
      return;
    }
    
    // Se entrambi sono impostati, resetta e inizia da capo
    this.selectedCheckin = dateStr;
    this.selectedCheckout = null;
    this.updateDateInputs();
    this.renderCalendar();
  }

  // Controlla se ci sono date occupate in un range
  hasOccupiedDatesInRange(startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const current = new Date(start);
    
    while (current < end) {
      const dateStr = current.toISOString().split('T')[0];
      if (this.isDateOccupied(dateStr)) {
        return true;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return false;
  }

  // Aggiorna gli input delle date
  updateDateInputs() {
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput && this.selectedCheckin) {
      checkinInput.value = this.selectedCheckin;
    }
    
    if (checkoutInput && this.selectedCheckout) {
      checkoutInput.value = this.selectedCheckout;
    }
  }

  // Inizializza il calendario
  async init() {
    console.log('🔄 Inizializzazione calendario...');
    
    // Carica date occupate
    await this.loadOccupiedDates();
    
    // Renderizza calendario
    this.renderCalendar();
    
    // Setup event listeners per navigazione mese
    this.setupNavigation();
    
    console.log('✅ Calendario inizializzato');
  }

  // Setup navigazione mesi
  setupNavigation() {
    // Rimuovi event listener esistenti
    const prevBtn = document.querySelector('.calendar-nav:first-of-type');
    const nextBtn = document.querySelector('.calendar-nav:last-of-type');
    
    if (prevBtn) {
      const newPrevBtn = prevBtn.cloneNode(true);
      prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
      newPrevBtn.addEventListener('click', () => this.changeMonth(-1));
    }
    
    if (nextBtn) {
      const newNextBtn = nextBtn.cloneNode(true);
      nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
      newNextBtn.addEventListener('click', () => this.changeMonth(1));
    }
  }
}

// Funzione globale per compatibilità con HTML esistente
function changeMonth(direction) {
  if (window.apartmentCalendar) {
    window.apartmentCalendar.changeMonth(direction);
  }
}

// Funzione per gestire la prenotazione
function handleBooking() {
  const checkin = document.getElementById('checkin')?.value;
  const checkout = document.getElementById('checkout')?.value;
  const guests = document.getElementById('guests')?.value;
  
  if (!checkin || !checkout) {
    alert('Seleziona le date di check-in e check-out');
    return;
  }
  
  // Qui puoi implementare la logica di prenotazione
  console.log('Prenotazione:', { checkin, checkout, guests });
  alert(`Prenotazione:\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nOspiti: ${guests}`);
}

// Inizializza quando il DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.apartmentCalendar = new ApartmentCalendar('la-columbera-corte');
    window.apartmentCalendar.init();
  });
} else {
  window.apartmentCalendar = new ApartmentCalendar('la-columbera-corte');
  window.apartmentCalendar.init();
}
