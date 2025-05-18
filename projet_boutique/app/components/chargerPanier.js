"use client";
import { useEffect, useContext } from "react";
import { CartContext } from "./panier";
import { useUser } from "./userContext";

export default function ChargerPanier() {
  const { setCartItems } = useContext(CartContext); // Fonction pour mettre à jour le panier
  const { user } = useUser(); // Récupérer les informations utilisateur

  useEffect(() => {
    const fetchCartForUser = async () => {
      if (!user || !user.id) return;

      try {
        // Récupérer le panier de l'utilisateur
        const response = await fetch(`http://localhost:3000/paniers?userId=${user.id}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération du panier.");
        const data = await response.json();

        // Trouvez le panier correspondant au userId
        const userCart = data.find((panier) => panier.userId === user.id);
        if (!userCart) {
          console.log("Aucun panier trouvé pour cet utilisateur.");
          return;
        }

        // Récupérer les détails complets des produits
        const detailedProducts = await Promise.all(
          userCart.produits.map(async (produit) => {
            const produitResponse = await fetch(`http://localhost:3000/produits/${produit.id}`);
            if (!produitResponse.ok) throw new Error(`Erreur lors de la récupération du produit ID ${produit.id}.`);
            const produitDetails = await produitResponse.json();

            // Combinez les détails du produit avec la quantité du panier
            return {
              ...produitDetails,
              quantity: produit.quantite,
            };
          })
        );

        // Mettez à jour les éléments du panier dans le contexte
        setCartItems(detailedProducts);
      } catch (error) {
        console.error("Erreur lors du chargement du panier :", error);
      }
    };

    fetchCartForUser();
  }, [user, setCartItems]);

  return null; // Ce composant ne rend rien, il agit uniquement en arrière-plan
}
