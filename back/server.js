require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
// ✅ Accueil
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API de l'application de quizz !");
});
// ✅ Récupérer tous les véhicules
app.get("/vehicles", async (req, res) => {
  try {
    const [vehicles] = await db.query("SELECT * FROM vehicles");

    const formattedVehicles = vehicles.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
      model: vehicle.model_path, // Renomme "model_path" en "model"
      scale: vehicle.scale,
      position: [vehicle.position_x, vehicle.position_y, vehicle.position_z], // Regroupe en tableau
      price: vehicle.price,
    }));

    res.json(formattedVehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

app.get("/question/:env", async (req, res) => {
  const { env } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT id, question, choix1, choix2, choix3, choix4, reponse_correcte FROM questions WHERE environnement = ? ORDER BY RAND() LIMIT 1",
      [env]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune question trouvée pour cet environnement." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Démarrer le serveur
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
