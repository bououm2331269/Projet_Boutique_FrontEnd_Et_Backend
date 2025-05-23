import CartIndicator  from "@/app/components/cartIndicator";
import LogoutButton from "@/app/components/deconnexion";
import { UserCircle, Home } from "lucide-react";
export default function Header() {
    return (
        <div className="d-flex justify-content-between align-items-center m-2 bg-light">
            <a href={`/acceuil`}>
                <img src="../image/logo.png" alt="Logo" height="100" className="m-3" />
            </a>
           

            <a href={`/acceuil`} className="d-flex align-items-center" style={{   color: "rgb(255, 145, 73)",   fontSize: "24px",   textDecoration: "none",  }}>
                <Home size={32} className="text-gray-500" />
                <span className="ms-2">Accueil</span>
            </a>

            <a href={`/panier`} style={{ color: "rgb(255, 145, 73)", fontSize: "24px",textDecoration: "none" }}>
                <CartIndicator size={32} className="text-gray-500"/>
                <span className="ms-2">Panier</span>
            </a>
            <nav className="navbar navbar-expand-lg navbar-dark ">
            <button className="btn text-dark border-rounded text-primary" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style={{ background: "none", border: "none" }} >
                <UserCircle size={32} className="text-gray-500 text-primary" />
                <span className="ms-2" style={{ fontSize: "24px", color: "rgb(255, 145, 73)" }}>
                    Profil
                </span>
            </button>
            
            <ul className="dropdown-menu bg-transparent dropdown-menu-end" aria-labelledby="dropdownMenuButton"  >
                <li>
                    <a className="dropdown-item d-flex align-items-center text-primary" href="/inscription">Inscription</a>
                </li>
                <li>
                    <a className="dropdown-item d-flex align-items-center text-primary " href="/connexion">Connexion</a>
                </li>
                <li className="mx-1">
                    <LogoutButton />     
                </li>
            </ul>
            </nav>
        </div>
    );
}
