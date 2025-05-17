import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe sont obligatoires." },
        { status: 400 }
      );
    }

    // Appel à l'API pour récupérer les utilisateurs
    const response = await fetch(`http://localhost:3000/users?email=${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Erreur lors de la récupération des utilisateurs." },
        { status: 500 }
      );
    }

    const users = await response.json();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    // Vérification du mot de passe en clair (à remplacer par un hashage sécurisé en production)
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Mot de passe incorrect." },
        { status: 401 }
      );
    }

    // Simuler la génération d'un token (remplacez par une implémentation JWT réelle)
    const token = `fake-token-for-${email}`;

    // Retourner les détails utilisateur avec le token
    return NextResponse.json(
      {
        message: "Connexion réussie.",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur dans la route de connexion :", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la connexion." },
      { status: 500 }
    );
  }
}
