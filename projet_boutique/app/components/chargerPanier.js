"use client";
import { useEffect, useContext } from "react";
import { CartContext } from "./panier";
import { useUser } from "./userContext";

export default function ChargerPanier() {
  const { setCartItems } = useContext(CartContext);
  const { user } = useUser();

  useEffect(() => {
    if (!user || !user.id || !user.token || user.role !== "Client") {
      console.warn("Utilisateur non connecté ou non autorisé.");
      return; 
    }

    const fetchCartForUser = async () => {
      try {
        const response = await fetch(
          `https://projet-prog4e06.cegepjonquiere.ca/api/paniers/user/${user.id}/current`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.status === 404) {
          console.warn("Aucun panier trouvé pour cet utilisateur.");
          setCartItems([]); 
          return;
        }

        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const panierData = await response.json();

        if (!panierData || !panierData.produits || panierData.produits.length === 0) {
          console.warn("Aucun produit trouvé dans le panier.");
          setCartItems([]); 
          return;
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
