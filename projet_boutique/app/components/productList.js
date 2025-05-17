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

    const handleSearch = (e) => {
        const searchQuery = e.target.value.toLowerCase();
        setQuery(searchQuery);

        if (searchQuery === "") {
            // Si la recherche est vide, afficher tous les produits
            setFilteredProduits(produits);
        } else {
            // Filtrer les produits en fonction de la recherche
            const filtered = produits.filter((produit) =>
                produit.nom.toLowerCase().includes(searchQuery)
            );
            setFilteredProduits(filtered);
        }
    };

    if (loading) {
        return <div>Chargement en cours...</div>;
    }

    return (
        <div className="container-fluid my-5">
            <h2 className="text-center mb-4">
                <img src="/images/logo-nos-produits.webp" alt="Logo" style={{ width: "100px", height: "100px" }}></img>
            </h2>
            <div className="input-group w-100 mb-3">
                <span className="input-group-text">
                    <i className="bi bi-search " style={{ color: "rgb(255, 145, 73)" }} ></i>
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
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={produit.image}
                                    className="card-img-top"
                                    alt={produit.nom}
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{produit.nom}</h5>
                                    <p className="card-text text-muted">
                                        {produit.description.length > 80
                                            ? produit.description.substring(0, 77) + "..."
                                            : produit.description}
                                    </p>
                                    <p className="fw-bold">{produit.prix} $</p>
                                    <Link href={`/produit/${produit.id}`}>
                                        <button className="btn bg-light w-100 border-0">
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
