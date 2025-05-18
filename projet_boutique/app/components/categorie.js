"use client";
import React, { useEffect, useState } from "react";

export default function Categorie() {
  const [categories, setCategorie] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchCategorie() {
    try {
      const response = await fetch("http://localhost:3000/categories");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du fichier JSON");
      }
      const data = await response.json();
      setCategorie(data);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategorie();
  }, []);

  return (
    <div className="container-fluid my-5">
      <h1 className="text-center mb-4">Nos Catégories</h1>
      {loading ? (
        <p className="text-center">Chargement des catégories...</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {categories.map((category, index) => (
            <div className="col" key={index}>

              <div className="card h-100 shadow-sm">
                <img
                  src={category.image}
                  alt={category.nom}
                  className="card-img-top"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{category.nom}</h5>
                  <p className="card-text text-muted">
                    {category.description.length > 100
                      ? category.description.substring(0, 97) + "..."
                      : category.description}
                  </p>
                </div>
                <div className="card-footer">
                  <a
                    href={`/categorieDetails/${category.id}`}
                    className="btn btn-primary w-100"
                  >
                    Voir plus
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
