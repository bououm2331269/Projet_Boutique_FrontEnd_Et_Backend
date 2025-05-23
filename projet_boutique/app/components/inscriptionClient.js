"use client";
import { FaUser, FaIdBadge, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaKey } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InscriptionClient() {
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Prenom: "",
    Adresse: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form data
    if (
      !formData.Username ||
      !formData.Email ||
      !formData.Password ||
      !formData.ConfirmPassword ||
      !formData.Prenom
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      setError("L'adresse e-mail est invalide.");
      return;
    }
  
    if (formData.Username.length <= 4) {
      setError("Le nom d'utilisateur doit comporter plus de 4 caractères.");
      return;
    }
  
    if (formData.Prenom.length <= 4) {
      setError("Le prénom doit comporter plus de 4 caractères.");
      return;
    }
  
    if (formData.Password !== formData.ConfirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
  
    if (
      formData.Password.length <= 4 ||
      !/[A-Z]/.test(formData.Password) ||
      !/[!@#$%^&*(),.?":{}|<>/]/.test(formData.Password)
    ) {
      setError(
        "Le mot de passe doit comporter plus de 4 caractères, inclure une majuscule et un caractère spécial."
      );
      return;
    }
     // Check if Username is available
  try {
    const usernameCheck = await fetch(
      `https://projet-prog4e06.cegepjonquiere.ca/api/Accounts/check-username?username=${formData.Username}`
    );
    const isAvailable = await usernameCheck.json();

    if (!isAvailable) {
      setError("Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.");
      return;
    }
  } catch (err) {
    setError("Une erreur est survenue lors de la vérification du nom d'utilisateur.");
    return;
  }
  
    // Reset error state and show loading
    setError("");
    setLoading(true);
  
    try {
      // Call your API
      const response = await fetch("https://projet-prog4e06.cegepjonquiere.ca/api/Accounts/register-client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.Username,
          email: formData.Email,
          password: formData.Password,
          phoneNumber: formData.PhoneNumber,
          prenom: formData.Prenom,
          adresse: formData.Adresse,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      setSuccess("Inscription réussie !");
      setFormData({
        Username: "",
        Email: "",
        PhoneNumber: "",
        Prenom: "",
        Adresse: "",
        Password: "",
        ConfirmPassword: "",
      });
  
      setTimeout(() => {
        router.push("/connexion");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section id="inscription">
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <img src="/image/inscription1.svg" className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" alt="" />
                    {error && <p className="text-danger text-center">{error}</p>}
                    {success && <p className="text-success text-center">{success}</p>}
                    {loading && <p className="text-center">Inscription en cours...</p>}

                    <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                      {[
                        { name: "Username", type: "text", placeholder: "Votre Nom", icon: <FaUser /> },
                        { name: "Prenom", type: "text", placeholder: "Votre Prénom", icon: <FaIdBadge /> },
                        { name: "Email", type: "email", placeholder: "Votre Email", icon: <FaEnvelope /> },
                        { name: "PhoneNumber", type: "text", placeholder: "Votre Téléphone", icon: <FaPhone /> },
                        { name: "Adresse", type: "text", placeholder: "Votre Adresse", icon: <FaMapMarkerAlt /> },
                        { name: "Password", type: "password", placeholder: "Mot de passe", icon: <FaLock /> },
                        { name: "ConfirmPassword", type: "password", placeholder: "Confirmez le mot de passe", icon: <FaKey /> },
                      ].map(({ name, type, placeholder, icon }) => (
                        <div className="d-flex align-items-center mb-4" key={name}>
                          {icon && <span className="fa-lg me-3 fs-4">{icon}</span>}
                          <input
                            type={type}
                            id={name}
                            name={name}
                            className="form-control flex-grow-1"
                            placeholder={placeholder}
                            value={formData[name] || ""}
                            onChange={handleChange}
                            required={["Username", "Email", "Password", "ConfirmPassword"].includes(name)}
                          />
                        </div>
                      ))}

                      <div className="form-check d-flex justify-content-center mb-5">
                        <input className="form-check-input me-2" type="checkbox" id="terms" required />
                        <label className="form-check-label" htmlFor="terms">
                          J'accepte les <a href="/conditionUtilisation">conditions d'utilisation</a>
                        </label>
                      </div>

                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                          S'inscrire
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid"
                      alt="Sample"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
