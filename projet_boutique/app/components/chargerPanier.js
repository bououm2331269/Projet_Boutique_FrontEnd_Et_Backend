"use client";
import { useEffect, useContext } from "react";
import { CartContext } from "./panier";
import { useUser } from "./userContext";

export default function ChargerPanier() {
  const { setCartItems } = useContext(CartContext);
  const { user } = useUser();

  useEffect(() => {
    const fetchCartForUser = async () => {
      console.log("Utilisateur :", user);

      // Vérifiez si l'utilisateur est connecté, s'il est un client et s'il dispose des informations nécessaires
      if (!user || !user.id || !user.token || user.role !== "Client") {
        console.warn("Utilisateur non autorisé, nouveau ou informations manquantes.");
        return;
      }

      try {
        const response = await fetch(
          `https://projet-prog4e06.cegepjonquiere.ca/api/paniers/user/${user.id}/current`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        console.log("Réponse brute :", response);

        // Gérer les réponses non valides ou 404
        if (response.status === 404) {
          console.warn("Aucun panier trouvé pour cet utilisateur.");
          return setCartItems([]); // Panier vide pour un nouvel utilisateur
        }

        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const panierData = await response.json();
        console.log("Données du panier :", panierData);

        // Vérifiez et traitez les données du panier
        if (!panierData || !panierData.produits || panierData.produits.length === 0) {
          console.warn("Aucun produit trouvé dans le panier.");
          return setCartItems([]);
        }

        const detailedProducts = panierData.produits.map((p) => ({
          id: p.id,
          nom: p.nom,
          description: p.description,
          prix: p.prix,
          image: p.image,
          quantity: p.quantite,
        }));

        setCartItems(detailedProducts);
      } catch (error) {
        console.error("Erreur lors du chargement du panier :", error);
      }
    };

    fetchCartForUser();
  }, [user, setCartItems]);

  return null;
}
