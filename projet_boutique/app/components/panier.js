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
     /* const res = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Panier/user/${user.id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error("Erreur lors de la récupération du panier.");

      const paniers = await res.json();
      const panier = paniers[0];
      if (!panier) return;*/

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
          "Authorization": `Bearer ${user.token}`, // Ajouter un token si nécessaire
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
      alert(error.message); // Optionnel : afficher une alerte ou un message d'erreur
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

    // **Vider le panier localStorage ici**
    localStorage.removeItem("cart");
    // Rediriger l'utilisateur vers la page de paiement
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



























/* Contexte pour le panier
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useUser(); 

  /*useEffect(() => {
    // Charger le panier depuis le localStorage lors du montage
  /*  const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);
  useEffect(() => {
    if (!user || !user.token) {
      console.warn("Utilisateur non connecté ou jeton manquant.");
      return;
    }
  
    // Code lié à l'utilisateur ici
  }, [user]);*/
  
 /* useEffect(() => {
    // Sauvegarder le panier dans le localStorage à chaque modification
    localStorage.setItem("cart", JSON.stringify(cartItems));
    if (!user || !user.token) return;
  }, [user,cartItems]);
  console.log(user);
  


  const addToCart = async (product) => {
    try {
      // Récupérer le panier existant pour l'utilisateur
      const res = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Paniers/user/${user.id}/produits`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },body: JSON.stringify({
            produitId: product.id,
            quantite: product.quantity
        }),
         });
      if (!res.ok) throw new Error("Erreur récupération panier");
      const paniers = await res.json();
      const panier = paniers[0]; // On suppose 1 panier par user
  
      // Mettre à jour la liste des produits localement
      let updatedProduits = [];
      if (panier) {
        const existingItem = panier.produits.find(p => p.id === product.id);
        if (existingItem) {
          updatedProduits = panier.produits.map(p =>
            p.id === product.id ? { ...p, quantite: p.quantite + 1 } : p
          );
        } else {
          updatedProduits = [...panier.produits, { id: product.id, quantite: 1 }];
        }
      } else {
        // Pas de panier pour cet user, on en crée un
        updatedProduits = [{ id: product.id, quantite: 1 }];
      }
  
      // Construire le panier à envoyer
      const updatedPanier = panier
        ? { ...panier, produits: updatedProduits }
        : { userId: user.id, produits: updatedProduits };
  
      // Faire PUT ou POST selon existence
      const method = panier ? "PUT" : "POST";
      const url = panier
        ? `https://projet-prog4e06.cegepjonquiere.ca/api/Panier/${panier.id}`
        : `https://projet-prog4e06.cegepjonquiere.ca/api/Panier`;
  
      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json" ,
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify(updatedPanier),
      });
  
      if (!response.ok) {
        throw new Error("Erreur mise à jour panier");
      }
  
      // Mettre à jour le state local (avec quantité et produit complet)
      setCartItems(prev => {
        const existing = prev.find(i => i.id === product.id);
        if (existing) {
          return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout au panier");
    }
  };
  
  const removeFromCart = async (productId) => {
    try {
      // 1. Récupérer le panier existant pour l'utilisateur
      const res = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Panier/user/${user.id}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Erreur récupération panier");
      const paniers = await res.json();
      const panier = paniers[0]; // supposé 1 panier par user
  
      if (!panier) {
        alert("Aucun panier trouvé pour cet utilisateur");
        return;
      }
  
      // 2. Filtrer les produits pour enlever celui à supprimer
      const updatedProduits = panier.produits.filter(p => p.id !== productId);
  
      // 3. Construire le panier mis à jour
      const updatedPanier = { ...panier, produits: updatedProduits };
  
      // 4. Envoyer la mise à jour via PUT
      const response = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Panier/${panier.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
         },
        body: JSON.stringify(updatedPanier),
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du panier");
      }
  
      // 5. Mettre à jour le state local (React)
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du produit");
    }
  };
  const clearCart = async () => {
    try {
      // Étape 1 : Récupérer le panier de l'utilisateur
      const resPanier = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Panier/user/${user.id}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!resPanier.ok) throw new Error("Erreur récupération du panier");
      
      const paniers = await resPanier.json();
      const panier = paniers[0]; // Supposons que l'utilisateur n'a qu'un panier
      if (!panier) {
        alert("Aucun panier trouvé pour cet utilisateur");
        return;
      }

      // Étape 2 : Supprimer les produits du panier dans l'API
      const response = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Panier/${panier.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" ,
          "Authorization": `Bearer ${user.token}`,
        },
      });
  
      if (!response.ok) throw new Error("Erreur lors de la suppression des produits du panier");
  
      // Étape 3 : Supprimer le panier du localStorage
      localStorage.removeItem("cart");
  
      // Étape 4 : Mettre à jour le state local
      setCartItems([]); // Réinitialiser le panier localement
     // alert("Votre panier a été vidé avec succès.");
      console.log("Panier vidé dans l'API, le localStorage et localement.");
    } catch (error) {
      console.error("Erreur lors du vidage du panier :", error);
      alert("Une erreur est survenue lors du vidage du panier.");
    }
  };
  
  

  const updateQuantity = async (productId, quantity) => {
    try {
      // 1. Récupérer le panier actuel
      const resPanier = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Panier/user/${user.id}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!resPanier.ok) throw new Error("Erreur récupération panier");
      const paniers = await resPanier.json();
      const panier = paniers[0];
      if (!panier) {
        alert("Aucun panier trouvé pour cet utilisateur");
        return;
      }
  
      // 2. Récupérer les infos du produit pour vérifier stock
      const resProduit = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Produits/${productId},`);
      if (!resProduit.ok) throw new Error("Erreur récupération produit");
      const produit = await resProduit.json();
  
      // 3. Vérifier que la quantité demandée ne dépasse pas le stock
      const newQuantity = Math.min(Math.max(quantity, 1), produit.quantiteStock);
      if (quantity > produit.quantiteStock) {
        alert(`La quantité maximale en stock pour ${produit.nom} est atteinte.`);
      }
  
      // 4. Mettre à jour la liste des produits du panier avec la nouvelle quantité
      const updatedProduits = panier.produits.map(p =>
        p.id === productId ? { ...p, quantite: newQuantity } : p
      );
  
      // 5. Construire le panier mis à jour
      const updatedPanier = { ...panier, produits: updatedProduits };
  
      // 6. Envoyer la mise à jour au backend
      const response = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Panier/${panier.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
          
         },
        body: JSON.stringify(updatedPanier),
      });
      if (!response.ok) throw new Error("Erreur mise à jour panier");
  
      // 7. Mettre à jour le state local React
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour de la quantité");
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
        clearCart,
        updateQuantity,
        setCartItems,
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
    clearCart,
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
      //const commandeId = `${Date.now()}`;
      const dateCommande = new Date().toISOString();

      // Construire la commande principale
      const commande = {
        //id: commandeId,
        userId: user.id, // Remplacez par l'ID utilisateur approprié
        dateCommande,
      };

      // Construire les produits associés à la commande
      const commandesProduits = cartItems.map((item, index) => ({ 
        produitId: item.id,
        quantite: item.quantity,
      }));

      // Envoyer les données au serveur pour mise à jour JSON
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commande,
          commandesProduits,
          userId: user.id,
        }),

      });
      
      console.log(await response.json()); 
      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement des commandes.");
      }

      router.push("/paiement")

    } catch (error) {
      console.error("Erreur lors du paiement :", error.message);
      alert("Une erreur est survenue lors du traitement de la commande.");
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
};*/
