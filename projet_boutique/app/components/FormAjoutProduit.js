"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./userContext";

export default function FormAjoutProduit() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { user } = useUser();


  useEffect(() => {
    fetch("https://projet-prog4e06.cegepjonquiere.ca/api/Categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, [user]);

  async function ajouterProduit(event) {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    const description = formData.get("description");
    const image = formData.get("image");
    const nomProduit = formData.get("nomProduit");
    const categorie = formData.get("categorie");
    const quantiteStock = Number(formData.get("quantite"));
    const prix = Number(formData.get("prix"));

    if (!nomProduit || !description || !image || !categorie || !quantiteStock || !prix) {
      alert("Tous les champs doivent être remplis !");
      return;
    }

    if (prix <= 0) {
        alert("Le prix doit être un nombre positif !");
        return;
      }

    const categorieId = categories.find((p) => p.nom === categorie)?.id;

    if (!categorieId) {
      alert("Catégorie invalide !");
      return;
    }

    const response = await fetch("https://projet-prog4e06.cegepjonquiere.ca/api/Produits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify({
        nom: nomProduit,
        description: description,
        image: image,
        quantiteStock: quantiteStock,
        categorieProduitId: categorieId,
        prix: prix,
      }),
    });
    if(!response.ok) {
      alert("Une erreur s'est produite lors de l'ajout du produit.");
      return;
    }

    const newProduit = await response.json();
console.log(newProduit);
    alert("Produit ajouté avec succès !");
    router.push(`/produitAjoute/${newProduit.id}`);
    event.target.reset();
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 text-primary">Ajouter un Nouveau Produit</h1>
      <form onSubmit={ajouterProduit} className="p-4 border rounded shadow-sm bg-white">
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="nomProduit" className="form-label fw-bold text-primary">
              Nom du Produit
            </label>
            <input type="text" className="form-control" id="nomProduit" name="nomProduit" />
          </div>
          <div className="col-md-6">
            <label htmlFor="prix" className="form-label fw-bold text-primary">
              Prix ($)
            </label>
            <input type="number" className="form-control" id="prix" name="prix" />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label fw-bold text-primary">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            style={{ height: "100px" }}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label fw-bold text-primary">
            URL de l'Image
          </label>
          <input type="text" className="form-control" id="image" name="image" />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="categorie" className="form-label fw-bold text-primary">
              Catégorie
            </label>
            <select id="categorie" className="form-select" name="categorie">
            {categories.map((cat, index) => (
                <option key={index} value={cat.nom}>
                    {cat.nom}
                </option>
                ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="quantite" className="form-label fw-bold text-primary">
              Quantité en Stock
            </label>
            <input type="number" className="form-control" id="quantite" name="quantite" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Ajouter le Produit
        </button>
      </form>
    </div>
  );
}
