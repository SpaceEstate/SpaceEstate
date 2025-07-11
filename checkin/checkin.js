let currentStep = 1;
let numeroOspiti = 0;
let numeroNotti = 0;
let stepGenerated = false;

// Stati del mondo
const stati = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua e Barbuda", "Arabia Saudita", "Argentina", "Armenia", "Australia", "Austria", "Azerbaigian", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belgio", "Belize", "Benin", "Bhutan", "Bielorussia", "Birmania", "Bolivia", "Bosnia ed Erzegovina", "Botswana", "Brasile", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambogia", "Camerun", "Canada", "Capo Verde", "Ciad", "Cile", "Cina", "Cipro", "Comore", "Corea del Nord", "Corea del Sud", "Costa d'Avorio", "Costa Rica", "Croazia", "Cuba", "Danimarca", "Dominica", "Ecuador", "Egitto", "El Salvador", "Emirati Arabi Uniti", "Eritrea", "Estonia", "Etiopia", "Figi", "Filippine", "Finlandia", "Francia", "Gabon", "Gambia", "Georgia", "Germania", "Ghana", "Giamaica", "Giappone", "Gibuti", "Giordania", "Grecia", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guinea Equatoriale", "Guyana", "Haiti", "Honduras", "India", "Indonesia", "Iran", "Iraq", "Irlanda", "Islanda", "Israele", "Italia", "Kazakistan", "Kenya", "Kirghizistan", "Kiribati", "Kuwait", "Laos", "Lesotho", "Lettonia", "Libano", "Liberia", "Libia", "Liechtenstein", "Lituania", "Lussemburgo", "Macedonia del Nord", "Madagascar", "Malawi", "Malaysia", "Maldive", "Mali", "Malta", "Marocco", "Isole Marshall", "Mauritania", "Mauritius", "Messico", "Micronesia", "Moldavia", "Monaco", "Mongolia", "Montenegro", "Mozambico", "Namibia", "Nauru", "Nepal", "Nicaragua", "Niger", "Nigeria", "Norvegia", "Nuova Zelanda", "Oman", "Paesi Bassi", "Pakistan", "Palau", "Panama", "Papua Nuova Guinea", "Paraguay", "Peru", "Polonia", "Portogallo", "Qatar", "Regno Unito", "Repubblica Ceca", "Repubblica Centrafricana", "Repubblica del Congo", "Repubblica Democratica del Congo", "Repubblica Dominicana", "Romania", "Ruanda", "Russia", "Saint Kitts e Nevis", "Saint Lucia", "Saint Vincent e Grenadine", "Samoa", "San Marino", "São Tomé e Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Siria", "Slovacchia", "Slovenia", "Somalia", "Spagna", "Sri Lanka", "Stati Uniti", "Sudafrica", "Sudan", "Sudan del Sud", "Suriname", "Svezia", "Svizzera", "Swaziland", "Tagikistan", "Tanzania", "Thailandia", "Timor Est", "Togo", "Tonga", "Trinidad e Tobago", "Tunisia", "Turchia", "Turkmenistan", "Tuvalu", "Ucraina", "Uganda", "Ungheria", "Uruguay", "Uzbekistan", "Vanuatu", "Vaticano", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// Tipi di documento
const tipiDocumento = [
  "CARTA DI IDENTITA'",
  "CARTA ID. DIPLOMATICA",
  "CARTA IDENTITA' ELETTRONICA",
  "CERTIFICATO D'IDENTITA'",
  "PASSAPORTO DI SERVIZIO",
  "PASSAPORTO DIPLOMATICO",
  "PASSAPORTO ORDINARIO",
  "PATENTE DI GUIDA",
  "PATENTE NAUTICA",
  "PORTO D'ARMI GUARDIE GIUR",
  "PORTO D'ARMI USO SPORTIVO",
  "PORTO FUCILE DIF. PERSON.",
  "PORTO FUCILE USO CACCIA",
  "PORTO PISTOLA DIF. PERSON",
  "TES. FERROV. EX DEPUTATI",
  "TES. FERROVIARIA DEPUTATI",
  "TES. POSTE E TELECOMUNIC.",
  "TES. UNICO PER LA CAMERA",
  "TES.DOGANALE RIL.MIN.FIN.",
  "TESS. AG. E AG.SC. C.F.S.",
  "TESS. AGENTI/ASS.TI P.P.",
  "TESS. AGENTI/ASS.TI P.S.",
  "TESS. APP.TO AG.CUSTODIA",
  "TESS. APP.TO CARABINIERI",
  "TESS. APP.TO FINANZIERE",
  "TESS. APP.TO/VIG. URBANO",
  "TESS. APP.TO/VIG. VV.FF.",
  "TESS. CONSIGLIO DI STATO",
  "TESS. CORTE D'APPELLO",
  "TESS. CORTE DEI CONTI",
  "TESS. FERROV. SENATO",
  "TESS. FUNZIONARI P.S.",
  "TESS. IDENTIF.TELECOM IT.",
  "TESS. ISCR. ALBO MED/CHI.",
  "TESS. ISCRIZ. ALBO ODONT.",
  "TESS. ISPETTORI P.P.",
  "TESS. ISPETTORI P.S.",
  "TESS. MEMBRO EQUIP. AEREO",
  "TESS. MILIT. M.M.",
  "TESS. MILIT. TRUPPA SISMI",
  "TESS. MILITARE E.I.",
  "TESS. MILITARE NATO",
  "TESS. MILITARE TRUPPA A.M",
  "TESS. MIN. AFFARI ESTERI",
  "TESS. MIN.BEN.E ATT.CULT.",
  "TESS. MIN.PUBB.ISTRUZIONE",
  "TESS. MINIST. TRASP/NAVIG",
  "TESS. MINISTERO DIFESA",
  "TESS. MINISTERO FINANZE",
  "TESS. MINISTERO GIUSTIZIA",
  "TESS. MINISTERO INTERNO",
  "TESS. MINISTERO LAVORI PU",
  "TESS. MINISTERO SANITA'",
  "TESS. MINISTERO TESORO",
  "TESS. ORDINE GIORNALISTI",
  "TESS. PARLAMENTARI",
  "TESS. PERS. MAGISTRATI",
  "TESS. POL. TRIB. G.D.F.",
  "TESS. POLIZIA FEMMINILE",
  "TESS. PRES.ZA CONS. MIN.",
  "TESS. PUBBLICA ISTRUZIONE",
  "TESS. S.I.S.D.E.",
  "TESS. SOTT.LI AG.CUSTODIA",
  "TESS. SOTT.LI G.D.F.",
  "TESS. SOTT.LI VIG. URBANI",
  "TESS. SOTTUFF.LI VV.FF.",
  "TESS. SOTTUFFICIALI A.M.",
  "TESS. SOTTUFFICIALI CC",
  "TESS. SOTTUFFICIALI E.I.",
  "TESS. SOTTUFFICIALI SISMI",
  "TESS. SOTTUFICIALI C.F.S.",
  "TESS. SOTTUFICIALI M.M.",
  "TESS. SOVRINTENDENTI P.P.",
  "TESS. SOVRINTENDENTI P.S.",
  "TESS. UFF.LI AG.CUSTODIA",
  "TESS. UFF.LI VIG.URBANI",
  "TESS. UFFICIALE",
  "TESS. UFFICIALI A.M.",
  "TESS. UFFICIALI C.F.S.",
  "TESS. UFFICIALI E.I.",
  "TESS. UFFICIALI G.D.F.",
  "TESS. UFFICIALI M.M.",
  "TESS. UFFICIALI P.P.",
  "TESS. UFFICIALI P.S.",
  "TESS. UFFICIALI SISMI",
  "TESS. UFFICIALI VV.FF.",
  "TESS.ISCR. ALBO INGEGNERI",
  "TESS.ISCR.ALBO ARCHITETTI",
  "TESS.MIN.POLIT.AGRIC.FOR.",
  "TESSERA DELL'ORDINE NOTAI",
  "TESSERA ISCR. ALBO AVVOC.",
  "TESSERA RICONOSC. D.I.A.",
  "TESSERA U.N.U.C.I.",
  "TITOLO VIAGGIO RIF.POLIT."
];

// Province italiane
const province = [
  "AG", "AL", "AN", "AO", "AR", "AP", "AT", "AV", "BA", "BT", "BL", "BN", "BG", "BI", "BO", "BZ", "BS", "BR", "CA", "CL", "CB", "CI", "CE", "CT", "CZ", "CH", "CO", "CS", "CR", "KR", "CN", "EN", "FM", "FE", "FI", "FG", "FC", "FR", "GE", "GO", "GR", "IM", "IS", "SP", "AQ", "LT", "LE", "LC", "LI", "LO", "LU", "MC", "MN", "MS", "MT", "ME", "MI", "MO", "MB", "NA", "NO", "NU", "OT", "OR", "PD", "PA", "PR", "PV", "PG", "PU", "PE", "PC", "PI", "PT", "PN", "PZ", "PO", "RG", "RA", "RC", "RE", "RI", "RN", "RM", "RO", "SA", "VS", "SS", "SV", "SI", "SR", "SO", "TA", "TE", "TR", "TO", "OG", "TP", "TN", "TV", "TS", "UD", "VA", "VE", "VB", "VC", "VR", "VV", "VI", "VT"
];

// Funzioni di utilità
function calcolaEta(dataNascita) {
  const nascita = new Date(dataNascita);
  const oggi = new Date();
  let eta = oggi.getFullYear() - nascita.getFullYear();
  const meseCompleanno = oggi.getMonth() - nascita.getMonth();
  
  if (meseCompleanno < 0 || (meseCompleanno === 0 && oggi.getDate() < nascita.getDate())) {
    eta--;
  }
  
  return eta;
}

function calcolaTotale() {
  const tassaPerNotte = 1.50;
  let ospitiSoggetti = 0;
  
  for (let i = 1; i <= numeroOspiti; i++) {
    const nascita = document.querySelector(`input[name="ospite${i}_nascita"]`).value;
    if (nascita) {
      const eta = calcolaEta(nascita);
      if (eta >= 4) {
        ospitiSoggetti++;
      }
    }
  }
  
  return ospitiSoggetti * numeroNotti * tassaPerNotte;
}

function showNotification(message, type = 'info') {
  // Implementa una notifica più elegante invece degli alert
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

window.toggleTipoGruppo = function() {
  const numeroOspiti = parseInt(document.getElementById("numero-ospiti").value);
  const gruppoWrapper = document.getElementById("gruppo-wrapper");
  
  if (numeroOspiti > 1) {
    gruppoWrapper.classList.add("show");
    document.getElementById("tipo-gruppo").required = true;
  } else {
    gruppoWrapper.classList.remove("show");
    document.getElementById("tipo-gruppo").required = false;
    document.getElementById("tipo-gruppo").value = "";
  }
}

window.toggleComuneProvincia = function(ospiteNum) {
  const luogoNascita = document.querySelector(`select[name="ospite${ospiteNum}_luogo_nascita"]`).value;
  const comuneProvinciaWrapper = document.getElementById(`comune-provincia-wrapper-${ospiteNum}`);
  
  if (luogoNascita === "Italia") {
    comuneProvinciaWrapper.style.display = "block";
    document.querySelector(`input[name="ospite${ospiteNum}_comune"]`).required = true;
    document.querySelector(`select[name="ospite${ospiteNum}_provincia"]`).required = true;
  } else {
    comuneProvinciaWrapper.style.display = "none";
    document.querySelector(`input[name="ospite${ospiteNum}_comune"]`).required = false;
    document.querySelector(`select[name="ospite${ospiteNum}_provincia"]`).required = false;
    document.querySelector(`input[name="ospite${ospiteNum}_comune"]`).value = "";
    document.querySelector(`select[name="ospite${ospiteNum}_provincia"]`).value = "";
  }
}

window.prossimoStep = function() {
  console.log('Prossimo step - Current step:', currentStep);
  
  if (currentStep === 1) {
    if (!validaStep1()) return;
    
    if (!stepGenerated) {
      generaStepOspiti();
      stepGenerated = true;
    }
    
    currentStep = 2;
  } else if (currentStep >= 2 && currentStep <= numeroOspiti + 1) {
    const ospiteCorrente = currentStep - 1;
    if (!validaStepOspite(ospiteCorrente)) return;
    
    if (currentStep === numeroOspiti + 1) {
      // Ultimo ospite, vai al riepilogo
      preparaRiepilogo();
      currentStep = 99;
    } else {
      currentStep++;
    }
  }

  // Rimuovi active da tutti gli step
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Attiva lo step corrente
  if (currentStep === 99) {
    const finalStep = document.getElementById('step-final');
    if (finalStep) {
      finalStep.classList.add('active');
    }
  } else {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
      currentStepElement.classList.add('active');
    }
  }
  
  console.log('Nuovo step attivo:', currentStep);
}

window.indietroStep = function() {
  console.log('Indietro - Current step:', currentStep);
  
  if (currentStep === 99) {
    currentStep = numeroOspiti + 1;
  } else if (currentStep > 1) {
    currentStep--;
  }
  
  // Rimuovi active da tutti gli step
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Attiva lo step corrente
  if (currentStep === 99) {
    const finalStep = document.getElementById('step-final');
    if (finalStep) {
      finalStep.classList.add('active');
    }
  } else {
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    if (currentStepElement) {
      currentStepElement.classList.add('active');
    }
  }
  
  console.log('Nuovo step attivo:', currentStep);
}

document.addEventListener('DOMContentLoaded', function() {
  // Assicurati che solo il primo step sia visibile
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
  });
  
  const firstStep = document.getElementById('step-1');
  if (firstStep) {
    firstStep.classList.add('active');
  }
  
  console.log('Check-in form inizializzato');
});

function validaStep1() {
  const appartamento = document.getElementById("appartamento").value;
  const numOspiti = document.getElementById("numero-ospiti").value;
  const numNotti = document.getElementById("numero-notti").value;
numeroOspiti = parseInt(numOspiti);
  numeroNotti = parseInt(numNotti);
  if (!appartamento) {
    showNotification("Seleziona un appartamento", "error");
    return false;
  }

  if (!numOspiti) {
    showNotification("Seleziona il numero di ospiti", "error");
    return false;
  }

  if (!numNotti || parseInt(numNotti) < 1) {
    showNotification("Inserisci un numero di notti valido", "error");
    return false;
  }

  

  if (numeroOspiti > 1) {
    const tipoGruppo = document.getElementById("tipo-gruppo").value;
    if (!tipoGruppo) {
      showNotification("Seleziona il tipo di gruppo", "error");
      return false;
    }
  }

  return true;
}

function validaStepOspite(numOspite) {
  const cognome = document.querySelector(`input[name="ospite${numOspite}_cognome"]`).value;
  const nome = document.querySelector(`input[name="ospite${numOspite}_nome"]`).value;
  const genere = document.querySelector(`select[name="ospite${numOspite}_genere"]`).value;
  const nascita = document.querySelector(`input[name="ospite${numOspite}_nascita"]`).value;
  const cittadinanza = document.querySelector(`select[name="ospite${numOspite}_cittadinanza"]`).value;
  const luogoNascita = document.querySelector(`select[name="ospite${numOspite}_luogo_nascita"]`).value;

  if (!cognome || !nome || !genere || !nascita || !cittadinanza || !luogoNascita) {
    showNotification("Compila tutti i campi obbligatori", "error");
    return false;
  }

  // Validazione per comune e provincia se luogo nascita è Italia
  if (luogoNascita === "Italia") {
    const comune = document.querySelector(`input[name="ospite${numOspite}_comune"]`).value;
    const provincia = document.querySelector(`select[name="ospite${numOspite}_provincia"]`).value;
    
    if (!comune || !provincia) {
      showNotification("Inserisci comune e provincia per nascita in Italia", "error");
      return false;
    }
  }

  // Validazione età per responsabile
  if (numOspite === 1) {
    const eta = calcolaEta(nascita);
    if (eta < 18) {
      showNotification("Il responsabile della prenotazione deve essere maggiorenne", "error");
      return false;
    }
  }

  // Validazione aggiuntiva per ospite 1 (responsabile)
  if (numOspite === 1) {
    const tipoDoc = document.querySelector(`select[name="ospite1_tipo_documento"]`).value;
    const numeroDoc = document.querySelector(`input[name="ospite1_numero_documento"]`).value;
    const luogoRilascio = document.querySelector(`select[name="ospite1_luogo_rilascio"]`).value;

    if (!tipoDoc || !numeroDoc || !luogoRilascio) {
      showNotification("Compila tutti i campi del documento per il responsabile", "error");
      return false;
    }
  }

  return true;
}

function generaStepOspiti() {
  const form = document.getElementById('checkin-form');
  const stepFinal = document.getElementById('step-final');
  
  for (let i = 1; i <= numeroOspiti; i++) {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step';
    stepDiv.id = `step-${i + 1}`;
    
    // Campi aggiuntivi per l'ospite 1 (responsabile)
    const campiAggiuntivi = i === 1 ? `
      <div class="form-group">
        <label class="form-label" for="ospite1_tipo_documento">Tipo documento *</label>
        <select id="ospite1_tipo_documento" name="ospite1_tipo_documento" class="form-select" required>
          <option value="">Seleziona tipo documento</option>
          ${tipiDocumento.map(tipo => `<option value="${tipo}">${tipo}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="ospite1_numero_documento">Numero documento *</label>
        <input type="text" id="ospite1_numero_documento" name="ospite1_numero_documento" class="form-input" required placeholder="Es. AA1234567">
      </div>

      <div class="form-group">
        <label class="form-label" for="ospite1_luogo_rilascio">Luogo rilascio documento *</label>
        <select id="ospite1_luogo_rilascio" name="ospite1_luogo_rilascio" class="form-select" required>
          <option value="">Seleziona luogo rilascio</option>
          ${stati.map(stato => `<option value="${stato}">${stato}</option>`).join('')}
        </select>
      </div>
    ` : '';
    
    stepDiv.innerHTML = `
      <div class="step-header">
        <h2 class="step-title">Ospite ${i}${i === 1 ? ' (Responsabile)' : ''}</h2>
        <p class="step-subtitle">Inserisci i dati dell'ospite</p>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label" for="ospite${i}_cognome">Cognome *</label>
          <input type="text" id="ospite${i}_cognome" name="ospite${i}_cognome" class="form-input" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="ospite${i}_nome">Nome *</label>
          <input type="text" id="ospite${i}_nome" name="ospite${i}_nome" class="form-input" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="ospite${i}_genere">Genere *</label>
          <select id="ospite${i}_genere" name="ospite${i}_genere" class="form-select" required>
            <option value="">Seleziona genere</option>
            <option value="M">Maschio</option>
            <option value="F">Femmina</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="ospite${i}_nascita">Data di nascita *</label>
          <input type="date" id="ospite${i}_nascita" name="ospite${i}_nascita" class="form-input" required>
        </div>

        <div class="form-group">
          <label class="form-label" for="ospite${i}_cittadinanza">Cittadinanza *</label>
          <select id="ospite${i}_cittadinanza" name="ospite${i}_cittadinanza" class="form-select" required>
            <option value="">Seleziona cittadinanza</option>
            ${stati.map(stato => `<option value="${stato}">${stato}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="ospite${i}_luogo_nascita">Luogo di nascita *</label>
          <select id="ospite${i}_luogo_nascita" name="ospite${i}_luogo_nascita" class="form-select" required onchange="toggleComuneProvincia(${i})">
            <option value="">Seleziona luogo nascita</option>
            ${stati.map(stato => `<option value="${stato}">${stato}</option>`).join('')}
          </select>
        </div>

        <div id="comune-provincia-wrapper-${i}" style="display: none;" class="form-group full-width">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="ospite${i}_comune">Comune *</label>
              <input type="text" id="ospite${i}_comune" name="ospite${i}_comune" class="form-input" placeholder="Es. Napoli">
            </div>

            <div class="form-group">
              <label class="form-label" for="ospite${i}_provincia">Provincia *</label>
              <select id="ospite${i}_provincia" name="ospite${i}_provincia" class="form-select">
                <option value="">Seleziona provincia</option>
                ${province.map(prov => `<option value="${prov}">${prov}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        ${campiAggiuntivi}
      </div>

      <div class="document-section">
        <h3 class="document-title">Documenti di identità</h3>
        <div class="document-upload">
          <div class="upload-group">
            <label for="ospite${i}_documento_file" class="upload-label">
              📎 Carica documento
            </label>
            <input type="file" id="ospite${i}_documento_file" name="ospite${i}_documento_file" 
                   class="upload-input" accept="image/*,.pdf" 
                   onchange="handleFileUpload(this, ${i})">
          </div>
          
          <div class="camera-group">
            <button type="button" class="camera-btn" onclick="openCamera(${i})">
              📷 Fotografa documento
            </button>
          </div>
        </div>
        
        <div id="camera-preview-${i}" class="camera-preview" style="display: none;">
          <video id="camera-video-${i}" autoplay playsinline></video>
          <canvas id="camera-canvas-${i}" style="display: none;"></canvas>
          <div class="camera-controls">
            <button type="button" class="capture-btn" onclick="capturePhoto(${i})">Scatta foto</button>
            <button type="button" class="close-camera-btn" onclick="closeCamera(${i})">Chiudi</button>
          </div>
        </div>
      </div>

      <div class="button-group">
        <button type="button" class="btn btn-secondary" onclick="indietroStep()">Indietro</button>
        <button type="button" class="btn btn-primary" onclick="prossimoStep()">${i === numeroOspiti ? 'Vai al riepilogo' : 'Prossimo ospite'}</button>
      </div>
    `;
    form.insertBefore(stepDiv, stepFinal);
  }
}

function preparaRiepilogo() {
  const totale = calcolaTotale();
  
  const summaryContent = document.getElementById('summary-content');
  summaryContent.innerHTML = `
    <div class="summary-item">
      <span>Appartamento:</span>
      <span>${document.getElementById('appartamento').value}</span>
    </div>
    <div class="summary-item">
      <span>Numero ospiti:</span>
      <span>${numeroOspiti}</span>
    </div>
    <div class="summary-item">
      <span>Numero notti:</span>
      <span>${numeroNotti}</span>
    </div>
    <div class="summary-item">
      <span>Tassa di soggiorno:</span>
      <span>€${totale.toFixed(2)}</span>
    </div>
  `;
}

// Gestione upload file
window.handleFileUpload = function(input, ospiteNum) {
  const file = input.files[0];
  const label = input.previousElementSibling;
  
  if (file) {
    label.textContent = `📄 ${file.name}`;
    label.classList.add('has-file');
  } else {
    label.textContent = '📎 Carica documento';
    label.classList.remove('has-file');
  }
}

// Gestione fotocamera
let currentStream = null;

async function openCamera(ospiteNum) {
  const preview = document.getElementById(`camera-preview-${ospiteNum}`);
  const video = document.getElementById(`camera-video-${ospiteNum}`);
  
  try {
    currentStream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' }
    });
    video.srcObject = currentStream;
    preview.style.display = 'block';
  } catch (err) {
    showNotification('Errore nell\'accesso alla fotocamera: ' + err.message, 'error');
  }
}

window.capturePhoto = function(ospiteNum) {
  const video = document.getElementById(`camera-video-${ospiteNum}`);
  const canvas = document.getElementById(`camera-canvas-${ospiteNum}`);
  const ctx = canvas.getContext('2d');
  
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  ctx.drawImage(video, 0, 0);
  // Continua dal punto precedente...
  
  // Converti canvas in blob
  canvas.toBlob((blob) => {
    if (blob) {
      // Crea un file fittizio dal blob
      const file = new File([blob], `documento_ospite_${ospiteNum}.jpg`, { type: 'image/jpeg' });
      
      // Simula l'input file
      const fileInput = document.getElementById(`ospite${ospiteNum}_documento_file`);
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
      
      // Aggiorna l'etichetta
      const label = fileInput.previousElementSibling;
      label.textContent = `📷 Foto scattata`;
      label.classList.add('has-file');
      
      showNotification('Foto scattata con successo!', 'success');
    }
  }, 'image/jpeg', 0.8);
  
  closeCamera(ospiteNum);
}

window.closeCamera = function(ospiteNum) {
  const preview = document.getElementById(`camera-preview-${ospiteNum}`);
  
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
  
  preview.style.display = 'none';
}

// Funzione per creare il link di pagamento Stripe
async function creaLinkPagamento() {
  const totale = calcolaTotale();
  
  // Raccogli tutti i dati del form
  const datiPrenotazione = {
    appartamento: document.getElementById('appartamento').value,
    numeroOspiti: numeroOspiti,
    numeroNotti: numeroNotti,
    tipoGruppo: document.getElementById('tipo-gruppo').value,
    totale: totale,
    ospiti: []
  };
  
  // Raccogli dati ospiti
  for (let i = 1; i <= numeroOspiti; i++) {
    const ospite = {
      cognome: document.querySelector(`input[name="ospite${i}_cognome"]`).value,
      nome: document.querySelector(`input[name="ospite${i}_nome"]`).value,
      genere: document.querySelector(`select[name="ospite${i}_genere"]`).value,
      nascita: document.querySelector(`input[name="ospite${i}_nascita"]`).value,
      cittadinanza: document.querySelector(`select[name="ospite${i}_cittadinanza"]`).value,
      luogoNascita: document.querySelector(`select[name="ospite${i}_luogo_nascita"]`).value
    };
    
    // Aggiungi comune e provincia se nato in Italia
    if (ospite.luogoNascita === 'Italia') {
      ospite.comune = document.querySelector(`input[name="ospite${i}_comune"]`).value;
      ospite.provincia = document.querySelector(`select[name="ospite${i}_provincia"]`).value;
    }
    
    // Aggiungi dati documento per il responsabile
    if (i === 1) {
      ospite.tipoDocumento = document.querySelector(`select[name="ospite1_tipo_documento"]`).value;
      ospite.numeroDocumento = document.querySelector(`input[name="ospite1_numero_documento"]`).value;
      ospite.luogoRilascio = document.querySelector(`select[name="ospite1_luogo_rilascio"]`).value;
    }
    
    datiPrenotazione.ospiti.push(ospite);
  }
  
  try {
    // Qui dovresti fare una chiamata al tuo backend per creare la sessione Stripe
    const response = await fetch('/api/crea-pagamento-stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datiPrenotazione)
    });
    
    const { checkoutUrl } = await response.json();
    
    // Reindirizza a Stripe Checkout
    window.location.href = checkoutUrl;
    
  } catch (error) {
    console.error('Errore nella creazione del pagamento:', error);
    showNotification('Errore nella creazione del pagamento. Riprova.', 'error');
  }
}

// Funzione per salvare i dati localmente prima del pagamento
function salvaDatiLocalmente() {
  const datiPrenotazione = {
    appartamento: document.getElementById('appartamento').value,
    numeroOspiti: numeroOspiti,
    numeroNotti: numeroNotti,
    tipoGruppo: document.getElementById('tipo-gruppo').value,
    totale: calcolaTotale(),
    ospiti: [],
    timestamp: new Date().toISOString()
  };
  
  // Raccogli dati ospiti
  for (let i = 1; i <= numeroOspiti; i++) {
    const ospite = {
      cognome: document.querySelector(`input[name="ospite${i}_cognome"]`).value,
      nome: document.querySelector(`input[name="ospite${i}_nome"]`).value,
      genere: document.querySelector(`select[name="ospite${i}_genere"]`).value,
      nascita: document.querySelector(`input[name="ospite${i}_nascita"]`).value,
      cittadinanza: document.querySelector(`select[name="ospite${i}_cittadinanza"]`).value,
      luogoNascita: document.querySelector(`select[name="ospite${i}_luogo_nascita"]`).value
    };
    
    if (ospite.luogoNascita === 'Italia') {
      ospite.comune = document.querySelector(`input[name="ospite${i}_comune"]`).value;
      ospite.provincia = document.querySelector(`select[name="ospite${i}_provincia"]`).value;
    }
    
    if (i === 1) {
      ospite.tipoDocumento = document.querySelector(`select[name="ospite1_tipo_documento"]`).value;
      ospite.numeroDocumento = document.querySelector(`input[name="ospite1_numero_documento"]`).value;
      ospite.luogoRilascio = document.querySelector(`select[name="ospite1_luogo_rilascio"]`).value;
    }
    
    datiPrenotazione.ospiti.push(ospite);
  }
  
  // Salva in sessionStorage per recuperarlo dopo il pagamento
  sessionStorage.setItem('datiPrenotazione', JSON.stringify(datiPrenotazione));
  
  return datiPrenotazione;
}

// Funzione per finalizzare la prenotazione (da chiamare sulla pagina di successo)
async function finalizzaPrenotazione() {
  const datiSalvati = sessionStorage.getItem('datiPrenotazione');
  
  if (!datiSalvati) {
    console.error('Nessun dato di prenotazione trovato');
    return;
  }
  
  const datiPrenotazione = JSON.parse(datiSalvati);
  
  try {
    // Salva la prenotazione nel database
    const response = await fetch('/api/salva-prenotazione', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datiPrenotazione)
    });
    
    if (response.ok) {
      // Pulisci i dati salvati
      sessionStorage.removeItem('datiPrenotazione');
      
      // Mostra messaggio di successo
      showNotification('Prenotazione completata con successo!', 'success');
      
      // Opzionale: reindirizza a una pagina di conferma
      // window.location.href = '/conferma-prenotazione';
    } else {
      throw new Error('Errore nel salvataggio della prenotazione');
    }
    
  } catch (error) {
    console.error('Errore nel salvataggio:', error);
    showNotification('Errore nel salvataggio della prenotazione', 'error');
  }
}

// Modifica la funzione per il bottone di pagamento
function aggiornaBottonePagamento() {
  const finalStep = document.getElementById('step-final');
  const buttonGroup = finalStep.querySelector('.button-group');
  
  if (buttonGroup) {
    // Sostituisci il bottone di conferma con quello di pagamento
    buttonGroup.innerHTML = `
      <button type="button" class="btn btn-secondary" onclick="indietroStep()">Indietro</button>
      <button type="button" class="btn btn-primary" onclick="procediAlPagamento()">
        Paga €${calcolaTotale().toFixed(2)} con Stripe
      </button>
    `;
  }
}

// Funzione per procedere al pagamento
async function procediAlPagamento() {
  // Salva i dati localmente
  const datiPrenotazione = salvaDatiLocalmente();
  
  // Disabilita il bottone per evitare doppi click
  const payButton = document.querySelector('.btn-primary');
  payButton.disabled = true;
  payButton.textContent = 'Creazione pagamento...';
  
  try {
    // Crea il link di pagamento
    await creaLinkPagamento();
  } catch (error) {
    // Riabilita il bottone in caso di errore
    payButton.disabled = false;
    payButton.textContent = `Paga €${calcolaTotale().toFixed(2)} con Stripe`;
  }
}

// Modifica la funzione preparaRiepilogo per includere il nuovo bottone
function preparaRiepilogo() {
  const totale = calcolaTotale();
  
  const summaryContent = document.getElementById('summary-content');
  summaryContent.innerHTML = `
    <div class="summary-item">
      <span>Appartamento:</span>
      <span>${document.getElementById('appartamento').value}</span>
    </div>
    <div class="summary-item">
      <span>Numero ospiti:</span>
      <span>${numeroOspiti}</span>
    </div>
    <div class="summary-item">
      <span>Numero notti:</span>
      <span>${numeroNotti}</span>
    </div>
    <div class="summary-item">
      <span>Tassa di soggiorno:</span>
      <span>€${totale.toFixed(2)}</span>
    </div>
  `;
  
  // Aggiorna il bottone di pagamento
  aggiornaBottonePagamento();
}

// Gestione della validazione finale prima del pagamento
function validaPrenotazioneCompleta() {
  // Verifica che tutti i dati siano stati inseriti
  for (let i = 1; i <= numeroOspiti; i++) {
    if (!validaStepOspite(i)) {
      showNotification(`Errore nei dati dell'ospite ${i}`, 'error');
      return false;
    }
  }
  
  // Verifica che almeno un documento sia stato caricato per il responsabile
  const documentoFile = document.getElementById('ospite1_documento_file');
  if (!documentoFile.files.length) {
    showNotification('È necessario caricare il documento del responsabile', 'error');
    return false;
  }
  
  return true;
}

// Esempio di endpoint backend per creare la sessione Stripe (Node.js/Express)
/*
app.post('/api/crea-pagamento-stripe', async (req, res) => {
  const { totale, appartamento, numeroOspiti, numeroNotti } = req.body;
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Tassa di soggiorno - ${appartamento}`,
            description: `${numeroOspiti} ospiti per ${numeroNotti} notti`,
          },
          unit_amount: Math.round(totale * 100), // Stripe usa centesimi
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/successo-pagamento?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/check-in`,
      metadata: {
        appartamento,
        numeroOspiti: numeroOspiti.toString(),
        numeroNotti: numeroNotti.toString(),
      }
    });
    
    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Errore Stripe:', error);
    res.status(500).json({ error: 'Errore nella creazione del pagamento' });
  }
});
// server.js (Node.js/Express)
const express = require('express');
const stripe = require('stripe')('sk_test_...'); // La tua chiave segreta Stripe
const app = express();

app.use(express.json());

app.post('/api/crea-pagamento-stripe', async (req, res) => {
  const { totale, appartamento, numeroOspiti, numeroNotti, ospiti } = req.body;
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Tassa di soggiorno - ${appartamento}`,
            description: `${numeroOspiti} ospiti per ${numeroNotti} notti`,
          },
          unit_amount: Math.round(totale * 100), // Stripe usa centesimi
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/successo-pagamento?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/check-in`,
      metadata: {
        appartamento,
        numeroOspiti: numeroOspiti.toString(),
        numeroNotti: numeroNotti.toString(),
        // Aggiungi altri metadati se necessario
      }
    });
    
    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Errore Stripe:', error);
    res.status(500).json({ error: 'Errore nella creazione del pagamento' });
  }
});

app.post('/api/salva-prenotazione', async (req, res) => {
  const datiPrenotazione = req.body;
  
  try {
    // Qui salvi i dati nel tuo database
    // Per esempio con MySQL, MongoDB, ecc.
    
    console.log('Salvando prenotazione:', datiPrenotazione);
    
    // Esempio di salvataggio (sostituisci con il tuo database)
    // await database.prenotazioni.create(datiPrenotazione);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Errore nel salvataggio:', error);
    res.status(500).json({ error: 'Errore nel salvataggio' });
  }
});

app.listen(3000, () => {
  console.log('Server in ascolto sulla porta 3000');
});
const express = require('express');
const stripe = require('stripe')('sk_test_...'); // Sostituisci con la tua chiave segreta
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise'); // o il database che preferisci

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Per servire i file statici

// Configurazione upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/documenti';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'documento-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: function (req, file, cb) {
    const allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo file non supportato'));
    }
  }
});

// Configurazione database (esempio MySQL)
const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'checkin_db'
};

// Funzione per ottenere connessione database
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// Endpoint per creare il pagamento Stripe
app.post('/api/crea-pagamento-stripe', async (req, res) => {
  const { totale, appartamento, numeroOspiti, numeroNotti, ospiti } = req.body;
  
  try {
    // Validazione dati
    if (!totale || !appartamento || !numeroOspiti || !numeroNotti || !ospiti) {
      return res.status(400).json({ error: 'Dati mancanti' });
    }

    // Crea sessione Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Tassa di soggiorno - ${appartamento}`,
            description: `${numeroOspiti} ospiti per ${numeroNotti} notti`,
          },
          unit_amount: Math.round(totale * 100), // Stripe usa centesimi
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/successo-pagamento?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/check-in`,
      metadata: {
        appartamento,
        numeroOspiti: numeroOspiti.toString(),
        numeroNotti: numeroNotti.toString(),
        responsabile: ospiti[0].nome + ' ' + ospiti[0].cognome
      }
    });
    
    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Errore Stripe:', error);
    res.status(500).json({ error: 'Errore nella creazione del pagamento' });
  }
});

// Endpoint per salvare la prenotazione
app.post('/api/salva-prenotazione', async (req, res) => {
  const datiPrenotazione = req.body;
  
  try {
    const connection = await getConnection();
    
    // Inizia transazione
    await connection.beginTransaction();
    
    try {
      // Salva prenotazione principale
      const [prenotazioneResult] = await connection.execute(
        `INSERT INTO prenotazioni (appartamento, numero_ospiti, numero_notti, tipo_gruppo, totale, data_creazione) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [datiPrenotazione.appartamento, datiPrenotazione.numeroOspiti, 
         datiPrenotazione.numeroNotti, datiPrenotazione.tipoGruppo, datiPrenotazione.totale]
      );
      
      const prenotazioneId = prenotazioneResult.insertId;
      
      // Salva ogni ospite
      for (let i = 0; i < datiPrenotazione.ospiti.length; i++) {
        const ospite = datiPrenotazione.ospiti[i];
        
        await connection.execute(
          `INSERT INTO ospiti (prenotazione_id, cognome, nome, genere, data_nascita, 
           cittadinanza, luogo_nascita, comune, provincia, tipo_documento, numero_documento, 
           luogo_rilascio, is_responsabile) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [prenotazioneId, ospite.cognome, ospite.nome, ospite.genere, ospite.nascita,
           ospite.cittadinanza, ospite.luogoNascita, ospite.comune || null, 
           ospite.provincia || null, ospite.tipoDocumento || null, 
           ospite.numeroDocumento || null, ospite.luogoRilascio || null, i === 0]
        );
      }
      
      // Conferma transazione
      await connection.commit();
      
      res.json({ success: true, prenotazioneId });
    } catch (error) {
      // Rollback in caso di errore
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
    
  } catch (error) {
    console.error('Errore nel salvataggio:', error);
    res.status(500).json({ error: 'Errore nel salvataggio della prenotazione' });
  }
});

// Endpoint per upload documenti
app.post('/api/upload-documento/:prenotazioneId/:ospiteId', upload.single('documento'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nessun file caricato' });
    }
    
    const connection = await getConnection();
    
    // Salva percorso file nel database
    await connection.execute(
      'UPDATE ospiti SET documento_path = ? WHERE prenotazione_id = ? AND id = ?',
      [req.file.path, req.params.prenotazioneId, req.params.ospiteId]
    );
    
    await connection.end();
    
    res.json({ 
      success: true, 
      filename: req.file.filename,
      path: req.file.path 
    });
    
  } catch (error) {
    console.error('Errore upload:', error);
    res.status(500).json({ error: 'Errore nel caricamento del documento' });
  }
});

// Endpoint per verificare lo stato del pagamento
app.get('/api/verifica-pagamento/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    res.json({
      status: session.payment_status,
      metadata: session.metadata
    });
    
  } catch (error) {
    console.error('Errore verifica pagamento:', error);
    res.status(500).json({ error: 'Errore nella verifica del pagamento' });
  }
});

// Webhook Stripe per conferme pagamento
app.post('/webhook/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'whsec_...'; // Il tuo webhook secret
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Gestisce l'evento di pagamento completato
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Aggiorna lo stato della prenotazione
    try {
      const connection = await getConnection();
      await connection.execute(
        'UPDATE prenotazioni SET pagamento_completato = 1, stripe_session_id = ? WHERE appartamento = ? AND numero_ospiti = ?',
        [session.id, session.metadata.appartamento, session.metadata.numeroOspiti]
      );
      await connection.end();
    } catch (error) {
      console.error('Errore aggiornamento pagamento:', error);
    }
  }
  
  res.json({received: true});
});

// Endpoint per ottenere dettagli prenotazione
app.get('/api/prenotazione/:id', async (req, res) => {
  try {
    const connection = await getConnection();
    
    const [prenotazioni] = await connection.execute(
      'SELECT * FROM prenotazioni WHERE id = ?',
      [req.params.id]
    );
    
    if (prenotazioni.length === 0) {
      return res.status(404).json({ error: 'Prenotazione non trovata' });
    }
    
    const [ospiti] = await connection.execute(
      'SELECT * FROM ospiti WHERE prenotazione_id = ? ORDER BY is_responsabile DESC',
      [req.params.id]
    );
    
    await connection.end();
    
    res.json({
      prenotazione: prenotazioni[0],
      ospiti: ospiti
    });
    
  } catch (error) {
    console.error('Errore recupero prenotazione:', error);
    res.status(500).json({ error: 'Errore nel recupero della prenotazione' });
  }
});

// Servire la pagina di successo
app.get('/successo-pagamento', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'successo.html'));
});

// Servire la pagina principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});

// Script per creare le tabelle del database
/*
CREATE TABLE prenotazioni (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appartamento VARCHAR(100) NOT NULL,
  numero_ospiti INT NOT NULL,
  numero_notti INT NOT NULL,
  tipo_gruppo VARCHAR(50),
  totale DECIMAL(10,2) NOT NULL,
  pagamento_completato BOOLEAN DEFAULT FALSE,
  stripe_session_id VARCHAR(255),
  data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ospiti (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prenotazione_id INT NOT NULL,
  cognome VARCHAR(100) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  genere ENUM('M', 'F') NOT NULL,
  data_nascita DATE NOT NULL,
  cittadinanza VARCHAR(100) NOT NULL,
  luogo_nascita VARCHAR(100) NOT NULL,
  comune VARCHAR(100),
  provincia VARCHAR(5),
  tipo_documento VARCHAR(100),
  numero_documento VARCHAR(50),
  luogo_rilascio VARCHAR(100),
  documento_path VARCHAR(255),
  is_responsabile BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (prenotazione_id) REFERENCES prenotazioni(id)
);
*/
