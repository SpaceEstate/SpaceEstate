// api/get-session.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.status(200).json({
      appartamento: session.metadata.appartamento || "Sconosciuto"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore recupero sessione" });
  }
}
