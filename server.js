const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors()); // Autorise React à parler au serveur
app.use(express.json()); // Permet de lire les données JSON envoyées par React

// --- CONNEXION MONGODB ---
mongoose.connect('mongodb://localhost:27017/trello')
  .then(() => console.log("Connecté à MongoDB !"))
  .catch(err => console.log("Erreur de connexion :", err));

// --- CRÉATION DU MODÈLE (Le Schéma) ---
const photoSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  type: { type: String, default: 'photo' },
  createdAt: { type: Date, default: Date.now }
});

const Photo = mongoose.model('Photo', photoSchema);

// --- LA ROUTE (Le point de contact pour React) ---
app.post('/api/photos', async (req, res) => {
  try {
    const { title, imageUrl, type } = req.body;

    // On crée l'objet à enregistrer
    const nouvellePhoto = new Photo({
      title: title,
      imageUrl: imageUrl,
      type: type
    });

    // On sauvegarde dans MongoDB
    const photoSauvegardee = await nouvellePhoto.save();
    
    console.log("Photo enregistrée en BDD :", photoSauvegardee.title);
    res.status(201).json(photoSauvegardee);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'enregistrement" });
  }
});

// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});