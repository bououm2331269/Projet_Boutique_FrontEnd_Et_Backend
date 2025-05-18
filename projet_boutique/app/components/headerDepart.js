import CartIndicator from "@/app/components/cartIndicator";
import LogoutButton from "@/app/components/deconnexion";
import { UserCircle, Home, LogIn, UserPlus } from "lucide-react";

export default function HeaderDepart() {
  return (
    <header className="bg-light py-3 px-4 mb-3 ">
      <div className="container d-flex justify-content-between align-items-center">
        <a href="#" className="d-flex align-items-center text-decoration-none">
          <img
            src="../image/logo.png"
            alt="Logo"
            height="100"
            className="me-3"
          />
        
        </a>

        <nav className="d-flex align-items-center gap-4">
          <a
            href="/inscription"
            className="d-flex align-items-center text-decoration-none text-success"
          >
            <UserPlus size={24} className="me-2" />
            <span className="fw-bold">Inscription</span>
          </a>

          <a
            href="/connexion"
            className="d-flex align-items-center text-decoration-none text-primary"
          >
            <LogIn size={24} className="me-2" />
            <span className="fw-bold">Connexion</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
