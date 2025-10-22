const https = require('https');
const fs = require('fs');

// Configurazione appartamenti
const apartments = {
  'la-columbera-corte': {
    booking: 'https://ical.booking.com/v1/export?t=d5232092-4c34-47b1-b2e8-c435f5e6169f',
    airbnb: 'https://www.airbnb.it/calendar/ical/21897262.ics?s=ac74abfbed5c0fe4915529e86f1ee2db'
  }
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
      console.log('  ⬇️  Download calendario Booking...');
      const bookingData = await downloadIcal(urls.booking);
      
      console.log('  ⬇️  Download calendario Airbnb...');
      const airbnbData = await downloadIcal(urls.airbnb);
      
      console.log('  📊 Elaborazione date...');
      const bookingDates = parseIcalDates(bookingData);
      const airbnbDates = parseIcalDates(airbnbData);
      
      const allDates = [...new Set([...bookingDates, ...airbnbDates])].sort();
      
      console.log(`  ✅ Trovate ${allDates.length} date occupate`);
      console.log(`     - Booking: ${bookingDates.length} date`);
      console.log(`     - Airbnb: ${airbnbDates.length} date`);
      
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

syncCalendars();
