"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function RapportsPaiementGraphique() {
  const [data, setData] = useState(null); // null au lieu de []

  useEffect(() => {
    async function fetchRapports() {
      try {
        const response = await fetch("/api/rapport");
        if (!response.ok) throw new Error("Erreur lors de la récupération des rapports.");
        const rapports = await response.json();

        const chartData = rapports.map((rapport) => ({
          date: rapport.created,
          amount: rapport.amount,
        }));

        setData(chartData);
      } catch (err) {
        console.error("Erreur :", err);
        setData([]); // ou gérer une erreur d’affichage
      }
    }

    fetchRapports();
  }, []);

  if (data === null) {
    // En attente de données, on peut afficher un loader ou rien
    return <p className="text-center">Chargement du graphique...</p>;
  }

  if (data.length === 0) {
    // Pas de données ou erreur
    return <p className="text-center">Aucune donnée disponible.</p>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 font-bold text-primary">Graphique des paiements</h1>
      <div className="flex justify-center">
        <LineChart
          width={1000}
          height={400}
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          clipPathId="1"
        >
          <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    </div>
  );
}
