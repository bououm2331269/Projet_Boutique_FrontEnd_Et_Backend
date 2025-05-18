import FormModifProduit from "../../components/FormModifProduit";
import HeaderAdmin from "@/app/components/headerAdmin";
export default function({params}){
    return(
        <>
        <HeaderAdmin/>
        <FormModifProduit id  = {params.id}/>
        </>
    )
}