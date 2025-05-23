"use client";
import { useState, createContext, useContext, useEffect } from "react";
import { useUser } from "./userContext";
import { useRouter } from "next/navigation";
import set from "localbase/localbase/api/actions/set";

// Contexte pour le panier
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useUser();
  
  const router = useRouter();

  // Charger le panier depuis le localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product) => {
    if (!user || !user.token) {
      alert("Veuillez vous connecter pour ajouter un produit au panier.");
      router.push("/connexion");
      return;
    }

    try {
      const res = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Paniers/user/${user.id}/produits`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          produitId: product.id,
          quantite: 1,
        }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout au panier.");
      }

      // Mise à jour du panier local
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);
        if (existingItem) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error.message);
    }
  };
  const removeFromCart = async (productId) => {
    if (!user || !user.token) return;
  
    try {
      // Appel à l'API pour supprimer le produit du panier
      const response = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Paniers/user/${user.id}/delete/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression du produit.");
      }
  
      // Mise à jour locale : retirer le produit du panier
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
      console.log("Produit supprimé du panier avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error.message);
      alert(error.message); // Optionnel : afficher une alerte à l'utilisateur
    }
  };
  

  const clearCart = async () => {
    if (!user || !user.token) return;

    try {
      const response = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Paniers/user/${user.id}/clear`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur lors du vidage du panier.");

      setCartItems([]);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Erreur lors du vidage du panier :", error.message);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
  
    console.log("Produit ID :", productId);
    console.log("Quantité demandée :", quantity);
    console.log("Utilisateur ID :", user.id);
  
    try {
      // Appel à l'API
      const response = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Paniers/user/${user.id}/produits/${productId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${user.token}`, 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantite: quantity }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Message d'erreur :", errorData.message || "Erreur inconnue.");
        alert(errorData.message || "Erreur lors de la mise à jour de la quantité.");
        return; // Empêche la mise à jour de l'état local en cas d'erreur
      }
  
      // Mettre à jour l'état local après la réussite de l'API
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité :", error.message);
      alert(error.message); 
    }
  };
  
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.prix * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        setCartItems,
       // clearCart,
        updateQuantity,
        cartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const CartComponent = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
   // clearCart,
    totalPrice,
  } = useContext(CartContext);
  const { user } = useUser(); // Récupérer les informations utilisateur
 const router = useRouter();
 const handleCheckout = async () => {
  if (!user || !user.id) {
    alert("Veuillez vous connecter pour passer une commande.");
    router.push("/connexion");
    return;
  }

  try {
    const dateCommande = new Date().toISOString();

    // Construire les données à envoyer
    const commande = {
      userId: user.id,
      dateCommande,
    };

    const commandesProduits = cartItems.map((item) => ({
      produitId: item.id,
      quantite: item.quantity,
    }));

    // Appeler l'API pour créer une commande
    const response = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/Commandes/user/${user.id}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${user.token}`, // Inclure le token si nécessaire
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commande,
        commandesProduits,
      }),
    });

    // Vérification de la réponse
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'enregistrement de la commande.");
    }

    const result = await response.json();
    console.log("Commande créée :", result);

    // **Vider le panier localStorage 
    localStorage.removeItem("cart");

    router.push("/paiement");
  } catch (error) {
    console.error("Erreur lors du paiement :", error.message);
    alert(error.message || "Une erreur est survenue lors du traitement de la commande.");
  }
};


  return (
    <div className="container my-5">
      <h2 className="text-center mb-5">Votre Panier</h2>
      {cartItems.length === 0 ? (
        <div className="text-center text-muted">Votre panier est vide.</div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="row mb-4 p-3 bg-white shadow rounded">
              <div className="col-md-4 text-center">
                <img
                  src={item.image}
                  alt={item.nom}
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: "200px", objectFit: "contain" }}
                />
              </div>
              <div className="col-md-8">
                <h3>{item.nom}</h3>
                <p className="text-muted">{item.description}</p>
                <div>
                  <span className="h4 text-success">{item.prix.toFixed(2)} $</span>
                </div>
                <div className="d-flex align-items-center gap-3 mt-3">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="form-control w-25"
                  />
                  <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="text-end mt-4">
            <h3>Total : {totalPrice.toFixed(2)} $</h3>
            <button className="btn btn-primary mt-3" onClick={handleCheckout}>
              Passer à la caisse
            </button>
          </div>
        </>
      )}
    </div>
  );
};

























