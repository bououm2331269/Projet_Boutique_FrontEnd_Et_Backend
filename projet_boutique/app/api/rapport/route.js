import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  try {
    // Récupère les 100 derniers paiements
    const charges = await stripe.charges.list({ limit: 100 });

    // Formatage des données pour l'affichage
    const rapports = charges.data.map((charge) => ({
      id: charge.id,
      amount: charge.amount / 100, // Montant en devise locale
      currency: charge.currency.toUpperCase(),
      description: charge.description || "Aucune description",
      status: charge.status,
      created: new Date(charge.created * 1000).toLocaleString(), // Conversion timestamp
      customer: charge.billing_details.name || "Anonyme",
    }));

    // Retourne les données sous forme de réponse JSON
    return NextResponse.json(rapports, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des rapports Stripe" },
      { status: 500 }
    );
  }
}
