"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function CategorieDetails({id}) {
    const [categories, setCategorieDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    async function fetchCategorieDetails() {
        try {
            const response = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Produits/groupByCategory/${id}`);
            if (!response.ok) {
                throw new Error("Erreur lors du chargement du fichier JSON");
            }
            const data = await response.json();
            setCategorieDetails(data);
            console.log(data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors du chargement des produits:", error);
            setLoading(false);
        }
        
    }

    useEffect(() => {
        fetchCategorieDetails();
    }, []);
    return (
        <div className="container-fluid my-5">
        <h2 className="text-center mb-4">Nos Produits</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {categories.map((produit) => (
                <div className="col" key={produit.id}>
                    <div className="card h-100 shadow-sm">
                        <img
                            src={produit.image}
                            className="card-img-top"
                            alt={produit.nom}
                            style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body" key={produit.id}>
                            <h5 className="card-title">{produit.nom}</h5>
                            <p className="card-text text-muted">
                                {produit.description.length > 80
                                    ? produit.description.substring(0, 77) + "..."
                                    : produit.description}
                            </p>
                            <p className="fw-bold">{produit.prix} $</p>
                            <Link href={`/produit/${produit.id}`}>
                                <button className="btn btn-light w-100 border-0">
                                    Voir les détails
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
}