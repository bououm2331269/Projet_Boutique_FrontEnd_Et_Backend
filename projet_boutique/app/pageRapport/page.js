import  RapportsPaiement from "@/app/components/rapport";
import RapportsPaiementGraphique from "@/app/components/graphiqueRapport";
import HeaderAdmin from "@/app/components/headerAdmin";
// Import du composant avec désactivation du SSR
//const DynamicLineChart = dynamic(() => import('./LineChartComponent'), { ssr: false });


export default function RapportsPaiementPage() {
    return (
        <>
            <HeaderAdmin />
            <RapportsPaiementGraphique />
            <RapportsPaiement /> 
        </>
    );
}