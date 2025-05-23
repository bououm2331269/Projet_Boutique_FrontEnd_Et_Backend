"use client";
import { use, useState, useEffect } from "react";
import Categorie from "@/app/components/categorie";
import Header from "@/app/components/header";

export default function CategoriePage() {
    return (
        <>
            <Header />
            <Categorie />
        </>
    );
}