"use client";

import { useEffect, useState, useContext } from "react";
import { CartContext } from "@/app/components/panier";
import { useRouter } from "next/navigation";

export default function ProductAjoute({ id }) {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);

    const { addToCart } = useContext(CartContext); // Récupérez la méthode addToCart
    const router = useRouter();

    async function fetchProduct() {
        try {
            const response = await fetch(`http://localhost:3000/produits/${id}`);
            if (!response.ok) {
                throw new Error("Erreur lors du chargement du fichier JSON");
            }
            const data = await response.json();
            setProduct(data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors du chargement des produits:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProduct();
    }, []);

    if (loading) {
        return <div>Chargement en cours...</div>;
    }

    if (!product) {
        return <div>Aucun produit disponible.</div>;
    }


    return (
        <div className="container my-5">
            <h1 className="text-center mb-4 text-primary">Produit Ajoute</h1>
            <div className="row">
                <div className="col-md-6 text-center">
                    <img
                        src={product.image}
                        alt={product.nom}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "600px", objectFit: "contain" }}
                    />
                </div>

                <div className="col-md-6">
                    <h1 className="mb-3">{product.nom}</h1>
                    <p className="text-muted mb-4">{product.description}</p>

                    <div className="mb-4">
                        <span className="h4 text-success">{product.prix} $</span>
                        <p className="text-muted">
                            <strong>Quantité en stock :</strong> {product.quantiteStock}
                        </p>
                    </div>
                   
                </div>
            </div>
        </div>
    );
}
