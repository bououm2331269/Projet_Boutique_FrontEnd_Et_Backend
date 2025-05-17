"use client";
import { use, useState, useEffect } from "react";
import ProductDetails from "@/app/components/productDetails";

export default function Produit({params}) {
    const p = use(params);
    const id  =  p.id;
    const [produitId, setIdProduit] = useState(id);
    useEffect(() => {
        setIdProduit(id);
    })

    return (
        <>
            <ProductDetails id={produitId} />
        </>
    );
}