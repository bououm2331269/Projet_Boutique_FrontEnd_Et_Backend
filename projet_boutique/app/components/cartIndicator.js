"use client";
import { useContext } from "react";
import { CartContext } from "@/app/components/panier";
import { ShoppingCart } from "lucide-react";

export default function CartIndicator() {
  const { cartCount } = useContext(CartContext);

  return (
    <div className="position-relative d-inline-block">

      <ShoppingCart size={32} className="text-gray-500" />

      {cartCount >= 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
          {cartCount}
          <span className="visually-hidden">articles dans le panier</span>
        </span>
      )}
    </div>
  );
}
