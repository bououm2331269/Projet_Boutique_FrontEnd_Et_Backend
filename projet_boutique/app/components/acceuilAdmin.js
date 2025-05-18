"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import HeaderAdmin from "./headerAdmin";

export default function AcceuilAdmin() {
  const [produits, setProduits] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:3000/produits")
      .then((res) => res.json())
      .then((data) => setProduits(data))
      .catch((err) => console.error(err));
  }, []);

  const updateProduitBackend = async (id, updatedFields) => {
    try {
      const res = await fetch(`http://localhost:3000/produits/${id}`, {
        method: "PATCH", // Ou PUT selon ton backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      return await res.json();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour du produit.");
      return null;
    }
  };

  const deleteProduitBackend = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/produits/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      return true;
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression du produit.");
      return false;
    }
  };

  const augmenterQuantite = async (id) => {
    const produit = produits.find((p) => p.id === id);
    if (!produit) return;

    const nouvelleQuantite = produit.quantiteStock + 1;

    const updatedProduit = await updateProduitBackend(id, { quantiteStock: nouvelleQuantite });
    if (updatedProduit) {
      setProduits((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, quantiteStock: nouvelleQuantite } : p
        )
      );
    }
  };

  const diminuerQuantite = async (id) => {
    const produit = produits.find((p) => p.id === id);
    if (!produit) return;

    if (produit.quantiteStock <= 1) {
      // Si quantité 0 ou 1, supprimer le produit
      const confirmed = confirm("La quantité va passer à 0, voulez-vous supprimer ce produit ?");
      if (!confirmed) return;

      const deleted = await deleteProduitBackend(id);
      if (deleted) {
        setProduits((prev) => prev.filter((p) => p.id !== id));
      }
    } else {
      const nouvelleQuantite = produit.quantiteStock - 1;

      const updatedProduit = await updateProduitBackend(id, { quantiteStock: nouvelleQuantite });
      if (updatedProduit) {
        setProduits((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, quantiteStock: nouvelleQuantite } : p
          )
        );
      }
    }
  };

  const modifierProduit = async (id) => {
    const nouveauNom = prompt("Entrez le nouveau nom du produit :");
    if (!nouveauNom) return;

    const updatedProduit = await updateProduitBackend(id, { nom: nouveauNom });
    if (updatedProduit) {
      setProduits((prev) =>
        prev.map((p) => (p.id === id ? { ...p, nom: nouveauNom } : p))
      );
    }
  };

  return (
    <>
  <HeaderAdmin />
    <div className="container-fluid my-5">
      <h1 className="text-center mb-5">Gestion des Produits</h1>

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
                <p
                  className="card-text text-muted flex-grow-1"
                  style={{
                    fontSize: "0.9rem",
                    overflow: "hidden",
                    maxHeight: "4.5em",
                    lineHeight: "1.5em",
                  }}
                >
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
