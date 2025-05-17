"use client";
import React, { use,useEffect, useState } from "react";
import CategorieDetails from "@/app/components/categorieDetails";

export default function CategorieProduit({params}) {
    const p = use(params);
    const id  =  p.id;
    const [categorieId, setIdCategorie] = useState(id);
    useEffect(() => {
        setIdCategorie(id);
    })
    return (
        <CategorieDetails id={categorieId} />
    );

}