"use client";
import { use, useState, useEffect } from "react";
import ProductDetails from "@/app/components/productDetails";
import Header from "@/app/components/header";

export default function Produit({params}) {
    const p = use(params);
    const id  =  p.id;
    const [produitId, setIdProduit] = useState(id);
    useEffect(() => {
        setIdProduit(id);
    })

    return (
        <>
            <Header />
            <ProductDetails id={produitId} />
        </>
    );
}