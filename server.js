import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// --- MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 

// --- CONNEXION MONGODB ---
mongoose.connect('mongodb://localhost:27017/trello')
  .then(() => console.log("✅ Connecté à MongoDB !"))
  .catch(err => console.error("❌ Erreur de connexion :", err));

// --- 1. SCHÉMAS POUR LES FONDS (Modale de création) ---
const backgroundSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  type: String, // 'photo' ou 'color'
  createdAt: { type: Date, default: Date.now }
});

const BackgroundPhoto = mongoose.model('BackgroundPhoto', backgroundSchema, 'background_boards_photos');
const BackgroundColor = mongoose.model('BackgroundColor', backgroundSchema, 'background_boards_colors');

// --- 2. SCHÉMA POUR LES TABLEAUX (BOARDS) ---
const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  background: { type: String, required: true }, // L'URL choisie
  createdAt: { type: Date, default: Date.now }, // Reste fixe
  updatedAt: { type: Date, default: Date.now }  // Change à chaque consultation
});

const Board = mongoose.model('Board', boardSchema);

// --- ROUTES POUR LES FONDS (Affichage dans la modale) ---

app.get('/api/background_boards_photos', async (req, res) => {
  try {
    const allPhotos = await BackgroundPhoto.find().sort({ createdAt: -1 }); 
    res.json(allPhotos);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/background_boards_colors', async (req, res) => {
  try {
    const allColors = await BackgroundColor.find().sort({ createdAt: -1 }); 
    res.json(allColors);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- ROUTES POUR LES TABLEAUX (BOARDS) ---

// Créer un nouveau tableau
app.post('/api/boards', async (req, res) => {
  try {
    const newBoard = new Board({
      title: req.body.title,
      background: req.body.background
    });
    const savedBoard = await newBoard.save();
    res.status(201).json(savedBoard);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la création du tableau" });
  }
});

// Récupérer TOUS les tableaux (pour la liste générale)
app.get('/api/boards', async (req, res) => {
  try {
    const boards = await Board.find().sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Récupérer les 4 derniers tableaux consultés (Récents)
app.get('/api/boards/recent', async (req, res) => {
  try {
    // On trie par updatedAt (le plus récent en premier) et on limite à 4
    const recentBoards = await Board.find().sort({ updatedAt: -1 }).limit(4);
    res.json(recentBoards);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Récupérer UN tableau par son ID (ET mettre à jour sa date d'activité)
app.get('/api/boards/:id', async (req, res) => {
  try {
    // findByIdAndUpdate permet de récupérer le tableau et de changer sa date en une seule fois
    const board = await Board.findByIdAndUpdate(
      req.params.id, 
      { updatedAt: Date.now() }, // On met à jour la date d'activité à MAINTENANT
      { new: true } // Renvoie le tableau mis à jour au frontend
    );

    if (!board) return res.status(404).json({ message: "Tableau introuvable" });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération du tableau" });
  }
});

// --- SCHÉMA POUR LES LISTES ---
const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true }, // Le lien vers le tableau
  createdAt: { type: Date, default: Date.now }
});

const List = mongoose.model('List', listSchema);

// --- ROUTES POUR LES LISTES ---

// 1. Récupérer les listes d'un tableau spécifique
app.get('/api/lists/:boardId', async (req, res) => {
  try {
    const lists = await List.find({ boardId: req.params.boardId });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Créer une nouvelle liste
app.post('/api/lists', async (req, res) => {
  try {
    const newList = new List({
      
      title: req.body.title,
      boardId: req.body.boardId
    });
    await newList.save();
    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- SCHÉMA POUR LES CARTES ---
const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
      listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
      description: { type: String, default: "" },
  
      startDate: Date,
      dueDate: Date,
      reminder: { type: String, default: "none" },
      isRecurring: { type: Boolean, default: false },
      
      // Stocke les étiquettes (couleur et texte)
      labels: [{ color: String, text: String }],
  
      // Stocke les membres (IDs User)
      members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
      // Commentaires liés aux utilisateurs
      comments: [{
          text: String,
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          createdAt: { type: Date, default: Date.now }
      }],
  
      checklists: [{
          title: { type: String, default: "Checklist" },
          items: [{
              text: String,
              isDone: { type: Boolean, default: false }
          }]
      }],
  createdAt: { type: Date, default: Date.now }
});

const Card = mongoose.model('Card', cardSchema);

// --- ROUTES POUR LES CARTES ---

// 1. Récupérer les cartes d'un list spécifique
app.get('/api/cards/:listId', async (req, res) => {
  try {
    const cards = await Card.find({ listId: req.params.listId })
      .populate('members', 'username avatar');
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Créer une nouvelle carte
app.post('/api/cards', async (req, res) => {
  try {
    const newCard = new Card({
      title: req.body.title,
      listId: req.body.listId,
      labels: [],
      checklists: [],
      comments: [] 
    });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 3. METTRE À JOUR une carte (INDISPENSABLE pour la modal)
app.put('/api/cards/:id', async (req, res) => {
  try {
    // On met à jour la carte avec TOUS les champs envoyés (labels, checklists, etc.)
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, 
      { new: true } // Pour renvoyer la carte modifiée au frontend
    ).populate('members', 'username avatar');

    if (!updatedCard) {
      return res.status(404).json({ message: "Carte introuvable" });
    }

    res.json(updatedCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 4. Route pour ajouter un commentaire
app.post('/api/cards/:id/comments', async (req, res) => {
  try {
    const { text, userId } = req.body;
    const card = await Card.findById(req.params.id);
    
    card.comments.push({ text, user: userId });
    await card.save();
    
    // On repopulate pour avoir les infos de l'auteur immédiatement
    const updatedCard = await Card.findById(req.params.id).populate('comments.user', 'username avatar');
    res.json(updatedCard.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- DÉMARRAGE DU SERVEUR ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
