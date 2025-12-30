import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors()); 
app.use(express.json()); 

mongoose.connect('mongodb://localhost:27017/trello')
  .then(() => console.log("✅ Connecté à MongoDB !"))
  .catch(err => console.error("❌ Erreur de connexion :", err));

const photoSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  type: { type: String, default: 'photo' },
  createdAt: { type: Date, default: Date.now }
});

// Utilise un nom de Modèle en Majuscule (convention) et force la collection
const BackgroundPhoto = mongoose.model('BackgroundPhoto', photoSchema, 'background_boards_colors');

// --- ROUTE GET ---
app.get('/api/background_boards_colors', async (req, res) => {
  try {
    // Changement du nom de la variable pour éviter le conflit
    const allPhotos = await BackgroundPhoto.find().sort({ createdAt: -1 }); 
    res.json(allPhotos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ROUTE POST ---
app.post('/api/background_boards_colors', async (req, res) => {
  try {
    const { title, imageUrl, type } = req.body;

    const nouvellePhoto = new BackgroundPhoto({
      title,
      imageUrl,
      type
    });

    const photoSauvegardee = await nouvellePhoto.save();
    console.log("💾 Enregistré dans la NOUVELLE collection :", photoSauvegardee.title);
    res.status(201).json(photoSauvegardee);

  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});