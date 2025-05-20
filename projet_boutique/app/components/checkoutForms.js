"use client";
import { useState, useEffect, useContext } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { CartContext  } from "./panier";
import { useUser } from "./userContext";

export default function CheckoutForm({amount}) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser(); 

  console.log("Montant envoyé au backend:", amount);

  

  useEffect(() => {
    if (!amount || amount <= 0) {
      console.error("Invalid amount:", amount);
      setError("Le montant doit être supérieur à 0.");
      return;
    }
  
    async function fetchClientSecret() {
      try {
        console.log("Requesting clientSecret with:", { amount, currency: "cad" });
        const response = await fetch("/api/stripe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount, // Montant en cents
            currency: "cad",
          }),
        });
  
        const data = await response.json();
        if (response.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError("Erreur lors de la création du paiement.");
        }
      } catch (err) {
        setError("Erreur de communication avec l'API.");
      }
    }
  
    fetchClientSecret();
  }, [amount]);
  

  // Gestionnaire pour soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe ou Elements n'est pas disponible.");
      setLoading(false);
      return;
    }
  

    try {
      // Étape 1: Validation des champs avec elements.submit()
      const submitResult = await elements.submit();
      if (submitResult.error) {
        setError(submitResult.error.message);
        setLoading(false);
        return;
      }
  
      // Étape 2: Confirmation du paiement
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `http://localhost:3001/payment-success?amount=${amount}`,
        },
        
      });
      
      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        setSuccess(true);
        localStorage.removeItem('cart');// Vider le panier après un paiement réussi
      }
    } catch (err) {
      console.error("Erreur lors de la soumission :", err);
      setError("Une erreur est survenue lors de la tentative de paiement.");
    }
  
    setLoading(false);
  };
 
  if (!clientSecret) {
    return <div>Chargement du formulaire de paiement...</div>;
  }


  return (
    
    <>
    <div className="d-flex justify-content-center align-items-center mt-3 mb-3 border-0 ">
      <p className="d-flex flex-column align-items-center bg-light w-50 text-center text-lg font-semibold text-gray-700 p-2 font-bold rounded-lg shadow-md">
        Montant à payer : {(amount / 100).toFixed(2)} $
      </p>
    </div>

       
   
    <form className="payment-form p-4 rounded-md w-full max-w-md mx-auto bg-white" onSubmit={handleSubmit}>
      {success && <div className="success mb-4 text-center">Paiement réussi !</div>}
      {error && <div className="error mb-4 text-center text-red-500">{error}</div>}
    <div className="payment-container">
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="text-align-center btn btn-light w-100 text-black p-2 font-bold rounded-md disabled:opacity-50 disabled:animate-pulse mt-2">
        {loading ? "Chargement..." : "Payer"}
      </button>
    </div>
  </form>
    </>
  
  );
}
