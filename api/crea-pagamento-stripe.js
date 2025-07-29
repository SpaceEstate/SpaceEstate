const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Abilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
          unit_amount: Math.round(totale * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://spaceestate.github.io/SpaceEstate/checkin/successo.html',
      cancel_url: 'https://spaceestate.github.io/SpaceEstate/checkin/checkin.html',
    });
    
    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Errore Stripe:', error);
    res.status(500).json({ error: 'Errore nella creazione del pagamento' });
  }
}
