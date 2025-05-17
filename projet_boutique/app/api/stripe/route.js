import { NextResponse } from 'next/server';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  // Vérifiez si la clé secrète Stripe est configurée
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "La clé Stripe n'est pas configurée dans l'environnement." },
      { status: 500 }
    );
  }

  try {
    const { amount } = await request.json();

    // Valider le montant
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Le montant doit être un nombre positif valide." },
        { status: 400 }
      );
    }

    // Créer un PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Montant en centimes
      currency: "cad",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Retourne le client_secret
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Erreur Stripe:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création du PaymentIntent." },
      { status: 500 }
    );
  }
}
