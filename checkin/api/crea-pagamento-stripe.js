// api/crea-pagamento-stripe.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://spaceestate.github.io");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  try {
    const { totale, appartamento } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: "Tassa di soggiorno" },
            unit_amount: Math.round(totale * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/checkin/successo-pagamento.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkin/checkin.html`,
      metadata: { appartamento },
    });

    res.status(200).json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("Errore creazione pagamento:", err);
    res.status(500).json({ error: "Errore creazione sessione Stripe" });
  }
}
