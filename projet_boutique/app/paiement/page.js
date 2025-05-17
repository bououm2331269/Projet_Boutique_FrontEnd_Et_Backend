"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/app/components/checkoutForms";
import { useContext } from "react";
import { CartContext } from "@/app/components/panier";

console.log("Stripe Public Key:", process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function CheckoutPage() {
  const { cartItems } = useContext(CartContext);

  // Validate and calculate total amount
  const totalAmount = cartItems.reduce((total, item) => {
    if (item.prix > 0 && item.quantity > 0) {
      return total + item.prix * item.quantity;
    }
    return total;
  }, 0);

  const amountInCents = Math.round(totalAmount * 100);

  console.log("Cart Items:", cartItems);
  console.log("Total Amount:", totalAmount);
  console.log("Amount sent to backend (in cents):", amountInCents);

  if (!cartItems || cartItems.length === 0 || totalAmount <= 0) {
    return <div>Votre panier est vide. Veuillez ajouter des articles avant de continuer.</div>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: amountInCents,
        currency: "cad",
      }}
    >
      <CheckoutForm amount={amountInCents} />
    </Elements>
  );
}
