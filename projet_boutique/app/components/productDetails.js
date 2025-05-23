"use client";

import { useEffect, useState, useContext } from "react";
import { CartContext } from "@/app/components/panier";
import { useRouter } from "next/navigation";

export default function ProductDetails({ id }) {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);

    const { addToCart } = useContext(CartContext); 
    const router = useRouter();

    async function fetchProduct() {
        try {
            const response = await fetch(`https://projet-prog4e06.cegepjonquiere.ca/api/Produits/${id}`);
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

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            nom: product.nom,
            prix: product.prix,
            image: product.image,
            quantity: 1, 
        });
       // alert(`${product.nom} a été ajouté au panier !`);
        
        router.push("/panier");
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6 text-center">
                    <img
                        src={product.image}
                        alt={product.nom}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxHeight: "400px", objectFit: "contain" }}
                    />
                </div>

                <div className="col-md-6">
                    <h1 className="mb-3">{product.nom}</h1>
                    <p className="text-muted mb-4">{product.description}</p>

                    <div className="mb-4">
                        <span className="h4 text-success">{product.prix} $</span>
                    </div>

                    <button
                        className="btn btn-lg w-100 mb-3 border-0 bg-secondary"
                        onClick={handleAddToCart}
                    >
                        Ajouter au panier
                    </button>
                    <a href="/acceuil">
                        <button className="btn btn-outline-secondary btn-lg w-100 bg-light">
                            Retour
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
}
