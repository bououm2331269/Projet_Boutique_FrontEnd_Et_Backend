"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaKey, FaUser } from "react-icons/fa";
import { useUser } from "./userContext";
import {userProvider} from "./userContext";
import jwt from "jsonwebtoken";





export default function Connexion() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { loginUser } = useUser();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  async function handleSubmit(e) {
    e.preventDefault();
  
    if (!username || !password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

  
    try {
      const response = await fetch("https://projet-prog4e06.cegepjonquiere.ca/api/Accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username,email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion.");
      }
  
      setSuccess("Connexion reussie!");
      const token = data.token; // Token renvoyé par l'API
      const userId = data.userId;
  
      const decodedToken = jwt.decode(token); 
      console.log("Decoded Token:", decodedToken);
  
      // Stocker les données utilisateur
      const userData = {
        id: userId, 
        role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        token,
      };
  
      console.log("User data:", userData);
  
     // localStorage.setItem("user", JSON.stringify(userData)); // Stocke les données utilisateur
      loginUser(userData); // Mettre à jour le contexte utilisateur
  
      // Redirection basée sur le rôle
    if (userData.role === "Administrateur") {
      router.push("/pageAdmin"); // Rediriger vers le tableau de bord admin
    } else {
      router.push("/acceuil"); // Rediriger vers la page d'accueil pour utilisateurs classiques
    }
    } catch (err) {
      setError(err.message);
    }
  }
  


  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" >
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                  
                    <img src="/image/connexion1.svg" className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" alt=""/>
                    {error && <p className="text-danger text-center">{error}</p>}
                    {success && (
                      <p className="text-success text-center">{success}</p>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className=" mb-4 d-flex align-items-center">
                        <FaUser className="me-3 fs-4"/>
                          <input type="text" id="username" className="form-control" value={username} onChange={handleUsernameChange} required placeholder="Username" />
                        </div>
                        <div className=" mb-4 d-flex align-items-center">
                      <FaKey className="me-3 fs-4"/>
                          <input type="email" id="email" className="form-control" value={email} onChange={handleEmailChange} placeholder="Email" required/>
                      </div>

                      <div className=" mb-4 d-flex align-items-center">
                      <FaKey className="me-3 fs-4"/>
                          <input type="password" id="password" className="form-control" value={password} onChange={handlePasswordChange} placeholder="Password" required/>
                      </div>

                      <div className="row mb-4">
                        <div className="col d-flex justify-content-center">
                          <div className="form-check">
                            <input
                              className="form-check-input"  type="checkbox" value="" id="form1Example3" defaultChecked/>
                            <label className="form-check-label" >  Remember me </label>
                          </div>
                        </div>
                        <div className="col">
                          <a href="#!">Forgot password?</a>
                        </div>
                      </div>


                      <div className="d-flex justify-content-center">
                        <button type="submit"  className="btn btn-primary btn-block">  Sign in </button>
                      </div>
                    </form>
                  </div>

                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img src="https://img.freepik.com/free-vector/access-control-system-abstract-concept-illustration-security-system-authorize-entry-login-credentials-electronic-access-password-pass-phrase-pin-verification_335657-3373.jpg?t=st=1746257807~exp=1746261407~hmac=c27bd4519377b612aad13217ebed54e91cd982363f81e2cb969ef89b5f37273c&w=740" className="img-fluid"  alt="Login Illustration"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
