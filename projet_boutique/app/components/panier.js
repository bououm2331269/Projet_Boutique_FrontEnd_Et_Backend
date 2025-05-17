"use client";
import { useState, createContext, useContext, useEffect } from "react";
import { useUser } from "./userContext";
import { useRouter } from "next/navigation";

// Contexte pour le panier
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.stringify(cartItems);
    if (localStorage.getItem("cart") !== savedCart) {
      localStorage.setItem("cart", savedCart);
    }
  }, [cartItems]);
  

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    console.log("clearCart est appelé");
    setCartItems([]);
  };

  let isUpdating = false;

  const updateQuantity = async (id, quantity) => {
    if (isUpdating) return;
    isUpdating = true;
  
    try {
      const response = await fetch(`http://localhost:3000/produits/${id}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des données.");
      const product = await response.json();
  
      if (!product) {
        alert("Produit non trouvé dans les données stockées.");
        return;
      }
  
      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id) {
            if (quantity > product.quantiteStock) {
              alert(`La quantité maximale en stock pour ${product.nom} est ${product.quantiteStock}.`);
              return { ...item, quantity: product.quantiteStock };
            }
            return { ...item, quantity: Math.max(quantity, 1) };
          }
          return item;
        })
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des quantités :", error);
      alert("Une erreur est survenue lors de la vérification des stocks.");
    } finally {
      isUpdating = false;
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

     
      alert("Commande enregistrée avec succès !");
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
};
