"use client";

import React from "react";

export default function PageCondition() {
  return (
    <div className="min-h-screen bg-light text-dark p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-primary mb-4">Conditions d'utilisation</h1>
        <p className="text-lg mb-4">
          Bienvenue sur notre application. En utilisant nos services, vous acceptez les
          conditions suivantes. Veuillez les lire attentivement.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-6 mb-2">
          1. Acceptation des conditions
        </h2>
        <p className="mb-4">
          En accédant à notre application, vous acceptez de respecter les présentes
          conditions d'utilisation, ainsi que toutes les lois et réglementations
          applicables. Si vous n'acceptez pas ces conditions, veuillez ne pas
          utiliser nos services.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-6 mb-2">
          2. Utilisation des services
        </h2>
        <p className="mb-4">
          Vous êtes responsable de toute activité réalisée à partir de votre compte.
          Vous vous engagez à utiliser notre application uniquement à des fins
          légales et conformes à nos politiques.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-6 mb-2">
          3. Propriété intellectuelle
        </h2>
        <p className="mb-4">
          Tout le contenu, les marques, les logos et autres éléments présents dans
          notre application sont protégés par les lois sur la propriété
          intellectuelle et ne peuvent être utilisés sans autorisation.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-6 mb-2">
          4. Limitation de responsabilité
        </h2>
        <p className="mb-4">
          Nous ne serons pas responsables des dommages directs ou indirects liés à
          l'utilisation ou à l'impossibilité d'utiliser nos services.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-6 mb-2">
          5. Modifications des conditions
        </h2>
        <p className="mb-4">
          Nous nous réservons le droit de modifier ces conditions à tout moment. Les
          modifications prendront effet dès leur publication sur cette page.
        </p>

        <h2 className="text-2xl font-semibold text-secondary mt-6 mb-2">
          6. Contact
        </h2>
        <p className="mb-4">
          Pour toute question ou préoccupation concernant ces conditions, veuillez
          nous contacter à <span className="text-primary">support@electroHub.com</span>.
        </p>

        <p className="text-sm text-center text-dark mt-6">
          Dernière mise à jour : 23-05-2025
        </p>
      </div>
    </div>
  );
}
