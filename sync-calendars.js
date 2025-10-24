const https = require('https');
const fs = require('fs');

// Configurazione appartamenti
// Configurazione appartamenti
const apartments = {
  'la-columbera-corte': {
    booking: 'https://ical.booking.com/v1/export?t=a548355b-70dd-434c-aa40-b5f826756554',
    airbnb: 'https://www.airbnb.it/calendar/ical/21897262.ics?s=ac74abfbed5c0fe4915529e86f1ee2db'
  },
  'la-columbera-torre': {
    booking: 'TUO_URL_BOOKING_TORRE',  // Inserisci URL iCal di Booking
    airbnb: 'TUO_URL_AIRBNB_TORRE'     // Inserisci URL iCal di Airbnb
  }
};

// Funzione per scaricare file iCal
function downloadIcal(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`    📦 Scaricati ${data.length} caratteri`);
        resolve(data);
      });
    }).on('error', (err) => {
      console.error(`    ❌ Errore download: ${err.message}`);
      reject(err);
    });
  });
}

// Funzione per parsare iCal e estrarre date
function parseIcalDates(icalData) {
  const occupiedDates = new Set();
  const lines = icalData.split('\n');
  
  // Limite: 6 mesi nel futuro
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 6);
  
  let inEvent = false;
  let dtstart = null;
  let dtend = null;
  let eventCount = 0;
  
  for (let line of lines) {
    line = line.trim();
    
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      dtstart = null;
      dtend = null;
      eventCount++;
    }
    
    if (line === 'END:VEVENT') {
      if (dtstart && dtend) {
        const dates = getDateRange(dtstart, dtend);
        // Filtra solo date entro 6 mesi
        dates.forEach(date => {
          const d = new Date(date);
          if (d >= today && d <= maxDate) {
            occupiedDates.add(date);
          }
        });
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
  
  console.log(`    📋 Eventi trovati: ${eventCount}`);
  console.log(`    📅 Range: ${today.toISOString().split('T')[0]} → ${maxDate.toISOString().split('T')[0]}`);
  return Array.from(occupiedDates).sort();
}

// Estrai data da riga iCal
function extractDate(line) {
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
  
  // L'end date in iCal è esclusivo (checkout), quindi sottraiamo 1 giorno
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
  console.log(`📅 Data/ora: ${new Date().toLocaleString('it-IT')}\n`);
  
  for (const [apartmentId, urls] of Object.entries(apartments)) {
    console.log(`📅 Sincronizzazione: ${apartmentId}`);
    
    try {
      let bookingDates = [];
      let airbnbDates = [];
      
      // Booking (opzionale)
      if (urls.booking) {
        try {
          console.log('  ⬇️  Download calendario Booking...');
          const bookingData = await downloadIcal(urls.booking);
          bookingDates = parseIcalDates(bookingData);
        } catch (err) {
          console.log('  ⚠️  Booking non disponibile, continuo con Airbnb...');
        }
      }
      
      // Airbnb
      if (urls.airbnb) {
        console.log('  ⬇️  Download calendario Airbnb...');
        const airbnbData = await downloadIcal(urls.airbnb);
        airbnbDates = parseIcalDates(airbnbData);
      }
      
      // Unisci e ordina
      console.log('  📊 Elaborazione date...');
      const allDates = [...new Set([...bookingDates, ...airbnbDates])].sort();
      
      console.log(`  ✅ Totale date occupate: ${allDates.length}`);
      console.log(`     - Booking: ${bookingDates.length} date`);
      console.log(`     - Airbnb: ${airbnbDates.length} date`);
      
      if (allDates.length > 0) {
        console.log(`     - Prima data: ${allDates[0]}`);
        console.log(`     - Ultima data: ${allDates[allDates.length - 1]}`);
      }
      
      // Salva risultato
      const outputPath = `./calendars/${apartmentId}.json`;
      const output = {
        apartmentId,
        lastUpdate: new Date().toISOString(),
        occupiedDates: allDates,
        sources: {
          booking: bookingDates.length,
          airbnb: airbnbDates.length
        }
      };
      
      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
      console.log(`  💾 Salvato in: ${outputPath}\n`);
      
    } catch (error) {
      console.error(`  ❌ Errore: ${error.message}`);
      console.error(`  Stack: ${error.stack}\n`);
    }
  }
  
  console.log('✅ Sincronizzazione completata!');
}

// Esegui
syncCalendars().catch(err => {
  console.error('💥 Errore fatale:', err);
  process.exit(1);
});
