import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // Récupérer les données de la requête
        const body = await request.json();
        const { userId, product } = body;
        if (!userId || !product) {
            return NextResponse.json(
              { message: "userId et produit sont requis." },
              { status: 400 }
            );
          }

          // Appel à l'API pour récupérer les utilisateurs
        const response = await fetch(`http://localhost:3000/paniers?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { message: "Erreur lors de la récupération des utilisateurs." },
          { status: 500 }
        );
      }

      const paniers = await response.json();
      let panier = paniers.find((p) => p.userId === userId);
      
    // Si aucun panier trouvé, créer un nouveau
    if (!panier) {
        panier = { id: String(Date.now()), userId, produits: [] };
      }
  
      // Vérifier si le produit existe déjà dans le panier
      const existingProduct = panier.produits.find((item) => item.id === product.id);
  
      if (existingProduct) {
        // Mettre à jour la quantité si le produit existe
        existingProduct.quantite += product.quantity;
      } else {
        // Ajouter le produit au panier
        panier.produits.push({ id: product.id, quantite: product.quantity });
      }
  
      // Sauvegarder les modifications (mise à jour ou création)
      const saveResponse = await fetch(`http://localhost:3000/paniers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(panier),
      });
  
      if (!saveResponse.ok) {
        return NextResponse.json(
          { message: "Erreur lors de la sauvegarde du panier." },
          { status: 500 }
        );
      }
  
      return NextResponse.json({ message: "Produit ajouté au panier avec succès." });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du panier :", error);
      return NextResponse.json(
        { message: "Erreur interne du serveur.", error: error.message },
        { status: 500 }
      );
    }
}