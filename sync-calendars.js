// Sync attivo 
// ============================================
// PARTE 1: Backend Script (Node.js)
// File: sync-calendars.js
// ============================================

const https = require('https');
const fs = require('fs');

// Configurazione appartamenti
const apartments = {
  'la-columbera-corte': {
    booking: 'https://ical.booking.com/v1/export?t=d5232092-4c34-47b1-b2e8-c435f5e6169f',
    airbnb: 'https://www.airbnb.it/calendar/ical/21897262.ics?s=ac74abfbed5c0fe4915529e86f1ee2db'
  }
  // Aggiungi altri appartamenti qui
};

// Funzione per scaricare file iCal
function downloadIcal(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Funzione per parsare iCal e estrarre date
function parseIcalDates(icalData) {
  const occupiedDates = new Set();
  const lines = icalData.split('\n');
  
  let inEvent = false;
  let dtstart = null;
  let dtend = null;
  
  for (let line of lines) {
    line = line.trim();
    
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      dtstart = null;
      dtend = null;
    }
    
    if (line === 'END:VEVENT') {
      if (dtstart && dtend) {
        // Aggiungi tutte le date tra start e end
        const dates = getDateRange(dtstart, dtend);
        dates.forEach(date => occupiedDates.add(date));
      }
      inEvent = false;
    }
    
    if (inEvent) {
      if (line.startsWith('DTSTART')) {
        dtstart = extractDate(line);
      }
      if (line.startsWith('DTEND')) {
        dtend = extractDate(line);
      }
    }
  }
  
  return Array.from(occupiedDates).sort();
}

// Estrai data da riga iCal
function extractDate(line) {
  // Formato: DTSTART;VALUE=DATE:20250615 o DTSTART:20250615T140000Z
  const match = line.match(/:(\d{8})/);
  if (match) {
    const dateStr = match[1];
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}`;
  }
  return null;
}

// Genera array di date tra start e end
function getDateRange(startStr, endStr) {
  const dates = [];
  const start = new Date(startStr);
  const end = new Date(endStr);
  
  // Sottrai un giorno dalla data di fine (check-out non è occupato)
  end.setDate(end.getDate() - 1);
  
  const current = new Date(start);
  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

// Funzione principale di sincronizzazione
async function syncCalendars() {
  console.log('🔄 Inizio sincronizzazione calendari...\n');
  
  for (const [apartmentId, urls] of Object.entries(apartments)) {
    console.log(`📅 Sincronizzazione: ${apartmentId}`);
    
    try {
      // Scarica calendari
      console.log('  ⬇️  Download calendario Booking...');
      const bookingData = await downloadIcal(urls.booking);
      
      console.log('  ⬇️  Download calendario Airbnb...');
      const airbnbData = await downloadIcal(urls.airbnb);
      
      // Parsa date
      console.log('  📊 Elaborazione date...');
      const bookingDates = parseIcalDates(bookingData);
      const airbnbDates = parseIcalDates(airbnbData);
      
      // Unisci e rimuovi duplicati
      const allDates = [...new Set([...bookingDates, ...airbnbDates])].sort();
      
      console.log(`  ✅ Trovate ${allDates.length} date occupate`);
      console.log(`     - Booking: ${bookingDates.length} date`);
      console.log(`     - Airbnb: ${airbnbDates.length} date`);
      
      // Salva in JSON
      const outputPath = `./calendars/${apartmentId}.json`;
      fs.writeFileSync(outputPath, JSON.stringify({
        apartmentId,
        lastUpdate: new Date().toISOString(),
        occupiedDates: allDates,
        sources: {
          booking: bookingDates.length,
          airbnb: airbnbDates.length
        }
      }, null, 2));
      
      console.log(`  💾 Salvato in: ${outputPath}\n`);
      
    } catch (error) {
      console.error(`  ❌ Errore: ${error.message}\n`);
    }
  }
  
  console.log('✅ Sincronizzazione completata!');
}

// Esegui sincronizzazione
syncCalendars();


// ============================================
// PARTE 2: JavaScript Frontend
// File: calendar-loader.js
// ============================================

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
  // Carica date occupate
  occupiedDates = await loadOccupiedDates(apartmentId);
  console.log(`Caricate ${occupiedDates.length} date occupate`);
  
  // Renderizza calendario
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
  // Implementa logica di selezione check-in/check-out
}

// Inizializza quando la pagina è pronta
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCalendar('la-columbera-corte');
  });
} else {
  initCalendar('la-columbera-corte');
}


// ============================================
// PARTE 3: HTML - Aggiungi alla pagina
// ============================================

/*
<!-- Aggiungi questo script PRIMA della chiusura del </body> -->
<script src="./calendar-loader.js"></script>

<!-- CSS già presente in apartments-single.css -->
<!-- Assicurati che ci siano questi stili per .occupied -->

.calendar-day.occupied {
  background: #ffe8e8;
  color: #c66;
  cursor: not-allowed;
  opacity: 0.6;
}

.calendar-day.available {
  background: #e8f5e8;
  color: #2d7a2d;
}

.calendar-day.available:hover {
  background: #d4af37;
  color: white;
  transform: scale(1.1);
}
*/


// ============================================
// PARTE 4: Automazione con Cron Job
// File: package.json (aggiungi script)
// ============================================

/*
{
  "scripts": {
    "sync-calendars": "node sync-calendars.js",
    "sync-hourly": "node sync-calendars.js"
  }
}

// Su Linux/Mac, aggiungi a crontab:
// 0 * * * * cd /path/to/project && npm run sync-calendars

// Su Windows, usa Task Scheduler per eseguire:
// node C:\path\to\project\sync-calendars.js
*/


// ============================================
// PARTE 5: File .gitignore
// ============================================

/*
# Aggiungi al tuo .gitignore
calendars/*.json
!calendars/.gitkeep
*/
