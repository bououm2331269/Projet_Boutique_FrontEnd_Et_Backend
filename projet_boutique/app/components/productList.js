"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function ProductCards() {
    const [produits, setProduits] = useState([]);
    const [filteredProduits, setFilteredProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    async function fetchProduits() {
        try {
            const response = await fetch("https://projet-prog4e06.cegepjonquiere.ca/api/Produits");
            if (!response.ok) {
                throw new Error("Erreur lors du chargement du fichier JSON");
            }
            const data = await response.json();
            setProduits(data || []);
            setFilteredProduits(data || []); // Par défaut, tous les produits sont affichés
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors du chargement des produits:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProduits();
    }, []);

    const handleSearch = async (e) => {
        const searchQuery = e.target.value.toLowerCase();
        setQuery(searchQuery);

        if (searchQuery === "") {
            // Si la recherche est vide, réinitialiser les produits
            setFilteredProduits(produits);
        } else {
            try {
                const response = await fetch(
                    `https://projet-prog4e06.cegepjonquiere.ca/api/Produits/search?nom=${encodeURIComponent(searchQuery)}`
                );
                if (!response.ok) {
                    throw new Error(`Erreur HTTP : ${response.status}`);
                }
                const data = await response.json();
                setFilteredProduits(data);
            } catch (error) {
                console.error("Erreur lors de la recherche :", error);
                setFilteredProduits([]);
            }
        }
    };

    if (loading) {
        return <div>Chargement en cours...</div>;
    }

    return (
        <div className="container-fluid my-5">
        <div className="input-group w-100 mb-3">
            <span className="input-group-text">
                <i className="bi bi-search" style={{ color: "rgb(255, 145, 73)" }}></i>
            </span>
            <input
                type="text"
                className="form-control"
                placeholder="Rechercher un produit..."
                value={query}
                onChange={handleSearch}
            />
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {filteredProduits.length > 0 ? (
                filteredProduits.map((produit) => (
                    <div className="col" key={produit.id}>
                        <div 
                            className="card h-100 shadow-sm" 
                            style={{
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.boxShadow = "0px 10px 20px rgb(255, 145, 73)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <img
                                src={produit.image}
                                className="card-img-top"
                                alt={produit.nom}
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{produit.nom}</h5>
                                <p className="card-text text-muted" style={{ flexGrow: 1 }}>
                                    {produit.description.length > 80
                                        ? produit.description.substring(0, 77) + "..."
                                        : produit.description}
                                </p>
                                <p className="fw-bold">{produit.prix} $</p>
                                <Link href={`/produit/${produit.id}`}>
                                    <button 
                                        className="btn btn-light w-100 mt-auto" 
                                        style={{
                                            position: "relative",
                                            bottom: "0",
                                            transition: "color 0.3s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = "rgb(255, 145, 73)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = "";
                                        }}
                                    >
                                        Voir les détails
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col">
                    <p>Aucun produit correspondant à la recherche.</p>
                </div>
            )}
        </div>
    </div>
    );
}
