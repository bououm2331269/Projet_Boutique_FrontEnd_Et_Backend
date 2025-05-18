"use client";
import { useEffect, useState } from "react";

export default function RapportsPaiement() {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRapports() {
      try {
        const res = await fetch("/api/rapport");
        const data = await res.json();
        setRapports(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des rapports :", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRapports();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700 animate-pulse">
          Chargement des rapports...
        </p>
      </div>
    );

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-4 py-8">
    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 text-primary">
      Rapports de Paiements
    </h1>
    <div className="w-full max-w-4xl overflow-x-auto shadow-lg rounded-lg bg-white">
      <table className="w-100">
        <thead>
          <tr className="bg-gray-100 text-gray-1000">
            <th className="px-4 py-2 text-center text-primary">Montant</th>
            <th className="px-4 py-2 text-center text-primary">Devise</th>
            <th className="px-4 py-2 text-center text-primary">Statut</th>
            <th className="px-4 py-2 text-center text-primary">Date</th>
          </tr>
        </thead>
        <tbody >
          {rapports.map((rapport, index) => (
            <tr
              key={rapport.id}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <td className="px-4 py-2 border-t border-gray-200 text-center ">
                ${rapport.amount}
              </td>
              <td className="px-4 py-2 border-t border-gray-200 text-center ">
                {rapport.currency}
              </td>
              <td
                className={`px-4 py-2 border-t border-gray-200 text-center ${
                  rapport.status === "Paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {rapport.status}
              </td>
              <td className="px-4 py-2 border-t border-gray-200 text-center ">
                {rapport.created}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  );
}
