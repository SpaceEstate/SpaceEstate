const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Abilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { totale, appartamento, numeroOspiti, numeroNotti, ospiti } = req.body;
  
  try {
    // Validazione dati
    if (!totale || !appartamento || !numeroOspiti || !numeroNotti) {
      return res.status(400).json({ error: 'Dati mancanti' });
    }

    if (totale <= 0) {
      return res.status(400).json({ error: 'Importo non valido' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Tassa di soggiorno - ${appartamento}`,
            description: `${numeroOspiti} ospiti per ${numeroNotti} notti`,
          },
          unit_amount: Math.round(totale * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://spaceestate.github.io/SpaceEstate/checkin/successo.html?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://spaceestate.github.io/SpaceEstate/checkin/checkin.html',
      // Aggiungi metadata per la mail di riepilogo
      metadata: {
        appartamento,
        numeroOspiti: numeroOspiti.toString(),
        numeroNotti: numeroNotti.toString(),
        responsabile: ospiti && ospiti[0] ? `${ospiti[0].nome} ${ospiti[0].cognome}` : 'N/A',
        email_responsabile: ospiti && ospiti[0] ? ospiti[0].email : '',
        tipo: 'tassa_soggiorno'
      }
    });
    
    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Errore Stripe:', error);
    res.status(500).json({ 
      error: 'Errore nella creazione del pagamento',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
}
