"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // Supprimez les données liées à la session de l'utilisateur
        localStorage.removeItem("userToken");
        localStorage.removeItem("cart");
        localStorage.removeItem("user");  
        sessionStorage.removeItem("userSession");

        // Redirigez l'utilisateur vers la page de connexion
        router.push("/connexion");
    };

    return (
        <button onClick={handleLogout}  className="btn btn-link text-primary " style={{ textDecoration: "none" }}>
        Déconnexion
        </button>
    );
}
