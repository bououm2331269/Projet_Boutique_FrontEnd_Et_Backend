import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Request body:", body);

    const { userId, commande, commandesProduits = [] } = body;

    if (!userId || !commande || commandesProduits.length === 0) {
      return NextResponse.json(
        { error: "Données invalides ou incomplètes." },
        { status: 400 }
      );
    }

    const nouvelleCommande = {
      userId,
      dateCommande: commande.dateCommande || new Date().toISOString(),
    };

    // Enregistrement de la commande
    const commandeResponse = await fetch("http://localhost:3000/commandes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nouvelleCommande),
    });

    if (!commandeResponse.ok) {
      throw new Error("Erreur lors de l'enregistrement de la commande.");
    }

    const savedCommande = await commandeResponse.json();
    const commandeId = savedCommande.id; // Assurez-vous que le service retourne l'ID de la commande

    // Enrichir chaque produit avec l'ID de la commande
    const produitsAvecCommandeId = commandesProduits.map((produit) => ({
      commandeId, // Utiliser l'ID de la commande récupéré
      produitId: produit.produitId,
      quantite: produit.quantite,
    }));

    // Enregistrement des produits associés
    const produitsPromises = produitsAvecCommandeId.map((produit) =>
      fetch("http://localhost:3000/commandesProduits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produit),
      })
    );

    const produitsResponses = await Promise.all(produitsPromises);

    if (produitsResponses.some((res) => !res.ok)) {
      throw new Error("Erreur lors de l'enregistrement des produits associés.");
    }

    return NextResponse.json({
      message: "Commande enregistrée avec succès.",
      commande: savedCommande,
      produits: produitsAvecCommandeId,
    });
  } catch (error) {
    console.error("Erreur lors du traitement de la commande:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement de la commande." },
      { status: 500 }
    );
  }
}
