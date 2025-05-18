"use client";
import { useState, useEffect } from "react";

export default function FormModifProduit({ id }) {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    nom: "",
    description: "",
    image: "",
    quantiteStock: "",
    prix: "",
    categorieProduitId: "",
  });

  useEffect(() => {
    // Charger les catégories
    fetch("https://projet-prog4e06.cegepjonquiere.ca/api/Categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));

    // Charger le produit
    async function chargerProduit() {
      const res = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Produits/${id}`);
      const data = await res.json();
      setProduct(data);
    }

    chargerProduit();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const categorie = formData.get("categorie");
    const categorieId = categories.find((cat) => cat.nom === categorie)?.id || null;

    const updatedProduct = {
      id: Number(id),
      nom: formData.get("nomProduit"),
      description: formData.get("description"),
      image: formData.get("image"),
      quantiteStock: Number(formData.get("quantite")),
      prix: Number(formData.get("prix")),
      categorieProduitId: Number(categorieId),
    };

    const response = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Produits/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
      setProduct(updatedProduct); // Met à jour l'état du produit avec les nouvelles données
      alert("Votre produit a été modifié avec succès.");
    } else {
      alert("Une erreur est survenue lors de la modification.");
    }
  }

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col-md-6 text-center">
          <img
            src={product.image || "https://via.placeholder.com/300?text=Image+indisponible"}
            alt={product.nom}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: "300px", objectFit: "contain" }}
          />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h1 className="mb-3">{product.nom}</h1>
          <p className="text-muted">{product.description}</p>
          <div>
            <span className="h4 text-success">{product.prix} $</span>
            <p className="text-muted">
              <strong>Quantité en stock :</strong> {product.quantiteStock}
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire de modification */}
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white">
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="nomProduit" className="form-label fw-bold text-primary">
              Nom du produit
            </label>
            <input
              type="text"
              id="nomProduit"
              name="nomProduit"
              className="form-control"
              defaultValue={product.nom}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="prix" className="form-label fw-bold text-primary">
              Prix ($)
            </label>
            <input
              type="number"
              id="prix"
              name="prix"
              className="form-control"
              defaultValue={product.prix}
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-bold text-primary">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            style={{ height: "100px" }}
            defaultValue={product.description}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label fw-bold text-primary">
            URL de l'image
          </label>
          <input
            type="text"
            id="image"
            name="image"
            className="form-control"
            defaultValue={product.image}
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="categorie" className="form-label fw-bold text-primary">
              Catégorie
            </label>
            <select id="categorie" name="categorie" className="form-select">
              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.nom}
                  defaultValue={cat.id === product.categorieProduitId}
                >
                  {cat.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="quantite" className="form-label fw-bold text-primary">
              Quantité en stock
            </label>
            <input
              type="number"
              id="quantite"
              name="quantite"
              className="form-control"
              defaultValue={product.quantiteStock}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
