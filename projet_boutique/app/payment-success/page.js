"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useContext } from "react";
import { CartContext } from "@/app/components/panier";
import { useUser } from "@/app/components/userContext";
import Header from "@/app/components/header";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const { clearCart } = useContext(CartContext);
  const { user } = useUser();

  useEffect(() => {
    if (user && user.id) {
      console.log("Appel de clearCart pour l'utilisateur :", user);
      clearCart();
    }
  }, [user]);

  if (!user) {
    return <div>Chargement des données utilisateur...</div>;
  }

  if (!amount) {
    return (
      <>
      <Header />
      <div className="container my-5">
        <div className="card text-center bg-danger text-white">
          <div className="card-body">
            <h1 className="card-title display-4">Error!</h1>
            <p className="card-text h4">No amount provided</p>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
  <>
  <Header />
    <div className="container my-5">
      <div className="card text-center bg-primary text-white">
        <div className="card-body">
          <h1 className="card-title display-4">Thank you!</h1>
          <p className="card-text h4">You successfully sent</p>
          <div className="mt-4 bg-white text-primary py-2 px-4 rounded-pill d-inline-block">
            <strong>${parseFloat(amount / 100).toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
