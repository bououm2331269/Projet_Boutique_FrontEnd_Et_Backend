"use client";
import React, { useEffect, useState } from "react";

export default function Carousel() {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchProduits() {
        try {
            const response = await fetch("https://projet-prog4e06.cegepjonquiere.ca/api/Produits");
            if (!response.ok) {
                throw new Error("Erreur lors du chargement du fichier JSON");
            }
            const data = await response.json();
            setProduits(data || []);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors du chargement des produits:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProduits();
    }, []);


    if (produits.length === 0) {
        return <div>Aucun produit disponible.</div>;
    }

    return (
        <div className="">
            <div id="carouselExampleIndicators" className="carousel slide mx-auto h-25" data-bs-ride="carousel"  data-bs-interval="2000">
                <div className="carousel-indicators">
                    {produits.map((produit, index) => (
                        <button
                            key={produit.id}
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? "true" : undefined}
                            aria-label={`Slide ${index + 1}`}
                        ></button>
                    ))}
                </div>

                <div className="carousel-inner">
                    {produits.map((produit, index) => (
                        <div
                            key={produit.id}
                            className={`carousel-item ${index === 0 ? "active" : ""}`}
                        >
                            <img
                                src={produit.imagePathe}
                                className="d-block w-100 rounded"
                                alt={produit.nom}
                                style={{
                                    maxHeight: "1000px", // Limite la hauteur maximale
                                    objectFit: "cover", // Empêche le recadrage de l'image
                                    width: "auto", 
                                }}
                              
                            />
                        </div>
                    ))}
                </div>

                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            <div
                className="  position-absolute top-50 start-50 translate-middle text-center text-white"
                style={{
                    zIndex: 10,
                    width: "100%", 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center", 
                    justifyContent: "center",     
                }}
            >
                <h1 className="display-4">Bienvenue sur notre Boutique</h1>
                <p className="lead">Découvrez nos meilleurs produits aujourd'hui.</p>
                <a href={`/categorie`}>
                    <button className="btn btn-primary btn-lg"  style={{ boxShadow: "none", outline: "none" }}>Explorez</button>
                </a>
            </div>

        </div>
    );
}

