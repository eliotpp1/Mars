require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Récupérer tous les véhicules
app.get("/vehicles", async (req, res) => {
  try {
    const [vehicles] = await db.query("SELECT * FROM vehicles");
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// ✅ Acheter un véhicule
app.post("/buy-vehicle", async (req, res) => {
  const { userId, vehicleId } = req.body;
  console.log(req.body);

  try {
    // Vérifier l'utilisateur et le véhicule
    const [[user]] = await db.query(
      "SELECT mars_balance FROM users WHERE id = ?",
      [userId]
    );
    const [[vehicle]] = await db.query(
      "SELECT price FROM vehicles WHERE id = ?",
      [vehicleId]
    );

    if (!user || !vehicle)
      return res
        .status(404)
        .json({ message: "Utilisateur ou véhicule non trouvé." });
    if (user.mars_balance < vehicle.price)
      return res.status(400).json({ message: "Solde Mars insuffisant." });

    // Déduire la monnaie et ajouter le véhicule
    await db.query(
      "UPDATE users SET mars_balance = mars_balance - ? WHERE id = ?",
      [vehicle.price, userId]
    );
    await db.query(
      "INSERT INTO user_vehicles (user_id, vehicle_id) VALUES (?, ?)",
      [userId, vehicleId]
    );

    res.json({ message: "Véhicule débloqué avec succès !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// ✅ Récupérer les véhicules possédés par un utilisateur
app.get("/user/:userId/vehicles", async (req, res) => {
  const { userId } = req.params;

  try {
    const [vehicles] = await db.query(
      `
            SELECT v.* FROM vehicles v
            JOIN user_vehicles uv ON v.id = uv.vehicle_id
            WHERE uv.user_id = ?
        `,
      [userId]
    );

    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// ✅ Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
