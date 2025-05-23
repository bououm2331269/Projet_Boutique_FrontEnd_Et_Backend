"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeaderAdmin from "./headerAdmin";
import { useUser } from "./userContext";

export default function AcceuilAdmin() {
  const [produits, setProduits] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user || !user.token) return;

    fetch("https://localhost:7173/api/Produits/admin", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.error(`Erreur HTTP : ${res.status}`);
          throw new Error("Erreur lors de la récupération des produits.");
        }
        return res.json();
      })
      .then((data) => setProduits(data))
      .catch((err) => console.error("Erreur lors de la récupération :", err));
  }, [user]);

  const updateProduitBackend = async (produit) => {
    try {
      const res = await fetch(`https://localhost:7173/api/Produits/${produit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify(produit), 
      });
  
      if (res.status === 204) {
        return produit; 
      }
  
      if (!res.ok) {
        const error = await res.text(); 
        console.error("Erreur serveur :", error);
        alert(`Erreur : ${error || "Erreur de mise à jour"}`);
        return null;
      }
  
      return await res.json(); 
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      alert("Une erreur inattendue est survenue.");
      return null;
    }
  };
  

  const augmenterQuantite = async (id) => {
    const produit = produits.find((p) => p.id === id);
    if (!produit) return;
  
    const produitMiseAJour = {
      ...produit,
      quantiteStock: produit.quantiteStock + 1,
    };
  
    const updatedProduit = await updateProduitBackend(produitMiseAJour);
    if (updatedProduit) {
      setProduits((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, quantiteStock: produitMiseAJour.quantiteStock } : p
        )
      );
    }
  };
  

  const diminuerQuantite = async (id) => {
    const produit = produits.find((p) => p.id === id);
    if (!produit) return;
  
    if (produit.quantiteStock <= 1) {
      const confirmed = confirm("La quantité va passer à 0, voulez-vous supprimer ce produit ?");
      if (!confirmed) return;
  
      // Appel pour supprimer le produit
      const deleted = await deleteProduitBackend(id);
      if (deleted) {
        setProduits((prev) => prev.filter((p) => p.id !== id));
      }
    } else {
      // Prépare les données du produit mis à jour
      const produitMiseAJour = {
        ...produit,
        quantiteStock: produit.quantiteStock - 1,
      };
  
      try {
        // Appelle le backend pour mettre à jour le produit
        const updatedProduit = await updateProduitBackend(produitMiseAJour);
  
        if (updatedProduit) {
          // Met à jour l'état local si l'API a réussi
          setProduits((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, quantiteStock: produitMiseAJour.quantiteStock } : p
            )
          );
        }
      } catch (error) {
        console.error("Erreur lors de la diminution de la quantité :", error);
        alert("Une erreur est survenue lors de la mise à jour.");
      }
    }
  };
  

  const modifierProduit = async (id) => {
    const produit = produits.find((p) => p.id === id);
    if (!produit) return;

    const nouveauNom = prompt("Entrez le nouveau nom du produit :", produit.nom);
    if (!nouveauNom) return;

    const produitMiseAJour = {
      ...produit,
      nom: nouveauNom,
    };

    const updatedProduit = await updateProduitBackend(produitMiseAJour);
    if (updatedProduit) {
      setProduits((prev) =>
        prev.map((p) => (p.id === id ? { ...p, nom: produitMiseAJour.nom } : p))
      );
    }
  };

  const deleteProduitBackend = async (id) => {
    try {
      const res = await fetch(`https://localhost:7173/api/Produits/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${user.token}`,
        },
      });
  
      if (res.status === 204) {
        return true;
      }
  
      if (!res.ok) {
        const error = await res.text();
        console.error("Erreur serveur :", error);
        alert(`Erreur : ${error || "Erreur de suppression"}`);
        return false;
      }
  
      return true; 
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur inattendue est survenue.");
      return false;
    }
  };
  

  return (
    <>
      <HeaderAdmin />
      <div className="container-fluid my-5">
        <h1 className="text-center mb-5 text-primary">Gestion des Produits</h1>
        <div className="row g-4">
          {produits.map((produit) => (
            <div key={produit.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <img
                  src={produit.image}
                  className="card-img-top"
                  alt={produit.nom}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{produit.nom}</h5>
                  <p className="card-text text-muted flex-grow-1">
                    {produit.description.length > 100
                      ? produit.description.substring(0, 97) + "..."
                      : produit.description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold text-primary">${produit.prix.toFixed(2)}</span>
                    <small className="text-secondary">Quantité : {produit.quantiteStock}</small>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-danger flex-fill"
                      onClick={() => diminuerQuantite(produit.id)}
                    >
                      - Quantité
                    </button>
                    <button
                      className="btn btn-sm btn-primary flex-fill"
                      onClick={() => augmenterQuantite(produit.id)}
                    >
                      + Quantité
                    </button>
                    <button
                      className="btn btn-sm btn-secondary flex-fill"
                      onClick={() => router.push(`/pageModifProduit/${produit.id}`)}
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {produits.length === 0 && <p className="text-center">Aucun produit trouvé.</p>}
        </div>
      </div>
    </>
  );
}
