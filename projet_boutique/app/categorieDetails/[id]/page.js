"use client";
import React, { use,useEffect, useState } from "react";
import CategorieDetails from "@/app/components/categorieDetails";
import Header from "@/app/components/header";

export default function CategorieProduit({params}) {
    const p = use(params);
    const id  =  p.id;
    const [categorieId, setIdCategorie] = useState(id);
    useEffect(() => {
        setIdCategorie(id);
    })
    return (
        <>
            <Header />
            <CategorieDetails id={categorieId} />
        </>
        
    );

}