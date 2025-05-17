"use client";
import { useState, useEffect } from "react";

export default function FormAjoutProduit(){
    
    let [categories, setCategorie] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/categories")
        .then(res => res.json())
        .then(data => setCategorie(data));
    }, [])

    async function ajouterProduit(formData){
       // "use server"
        
        
        const description = formData.get("description");
        const image = formData.get("image");
        const nomProduit = formData.get("nomProduit");
        const categorie = formData.get("categorie");
        const quantiteStock = formData.get("quantite");
        const prix = formData.get("prix");
        let categorieId
        

       
        
        categories.filter(p => p.nom == categorie);
        categorieId = categories[0].id
        
        fetch(`http://localhost:3000/produits/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "nom": nomProduit,
                "description": description,
                "image": image,
                "quantiteStock": quantiteStock,
                "categorieProduitId": categorieId,
                "prix": prix
            })
        });
    }


    return <form action={ajouterProduit}>
        <div className="m-3">
            <label htmlFor="nomProduit" className="form-label">Nom</label>
            <input type="text" className="form-control" id="nomProduit" name="nomProduit"></input>
        </div>
        <div className="m-3">
            <label htmlFor="description" className="form-label">description</label>
            <textarea className="form-control" placeholder="Leave a comment here" id="description" style={{height: "100px"}}name="description"></textarea>
        </div>
        <div className="m-3">
            <label htmlFor="image" className="form-label">Image</label>
            <input type="text" className="form-control" id="image" name="image"></input>
            {/* <input className="form-control" type="file" id="image" /> */}
        </div>
        <div className="m-3">
            <label htmlFor="categorie" className="form-label">Password</label>
            <select id="categorie" className="form-select" name="categorie">
                <option>Telephones</option>
                <option>Ordinateurs</option>
                <option>Appareils tactiles</option>
                <option>téléviseurs</option>
                <option>Écouteurs</option>
                <option>Caméras et appareils photos</option>
                <option>Consoles de jeux</option>
                <option>Montres intelligentes</option>
                <option>Périphériques</option>
                <option>Composants PC</option>
            </select>
        </div>
        <div className="m-3">
            <label htmlFor="quantite" className="form-label">Quantitée</label>
            <input type="number" className="form-control" id="quantite" name="quantite"></input>
        </div>
        <div className="m-3">
            <label htmlFor="prix" className="form-label">Prix</label>
            <input type="number" className="form-control" id="prix" name="prix"></input>
        </div>    
        <input type="submit" className="btn btn-primary m-3" name="submit" value="envoyer" />
    </form>
}