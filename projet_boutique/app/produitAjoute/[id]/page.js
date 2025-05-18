import ProduitAjoute from "@/app/components/newProduct";
import HeaderAdmin from "@/app/components/headerAdmin";

export default function ProductAjoutePage({ params }) {
    return(
        <>
        <HeaderAdmin/>
        <ProduitAjoute id={params.id} />;
        </>
    ) 
}