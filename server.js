import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
app.get('/api/boards/:id/full', async (req, res) => {
  try {
    const boardId = new mongoose.Types.ObjectId(req.params.id);

    const fullBoard = await Board.aggregate([
      // 1. Trouver le tableau spécifique
      { $match: { _id: boardId } },

      // 2. Aller chercher les listes qui appartiennent à ce tableau
      {
        $lookup: {
          from: "lists",          // Nom de la collection des listes
          localField: "_id",      // _id du Board
          foreignField: "boardId", // champ boardId dans List
          as: "lists"             // nom du tableau de sortie
        }
      },

      // 3. (Optionnel mais puissant) Aller chercher les cartes pour chaque liste
      // On utilise un lookup sur les listes qu'on vient de trouver
      {
        $lookup: {
          from: "cards",
          localField: "lists._id",
          foreignField: "listId",
          as: "allCards"
        }
      }
    ]);

    if (!fullBoard.length) return res.status(404).json({ message: "Tableau introuvable" });
    
    // On renvoie le premier (et seul) résultat
    res.json(fullBoard[0]);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'agrégation", error: err.message });
  }
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
      order: { type: Number, default: 0 },
  
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
        title: String,
        items: [{
            text: String,
            isDone: { type: Boolean, default: false },
            dueDate: { type: Date, default: null }, // Prêt pour l'échéance
            assignee: {                             // Prêt pour l'attribut (membre)
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User',
                default: null
            }
        }]
    }],

  createdAt: { type: Date, default: Date.now }
});

const Card = mongoose.model('Card', cardSchema);

// --- ROUTES POUR LES CARTES ---

// 1. Récupérer les cartes d'un list spécifique

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
    ).populate('members', 'username avatar')
     .populate('checklists.items.assignee', 'username avatar');

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
    // On ajoute le commentaire et on récupère la carte peuplée en une fois
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { text, user: userId } } },
      { new: true }
    ).populate('comments.user', 'username avatar').populate('members', 'username avatar');

    res.json(card); // ✅ Renvoie la CARTE entière
  } catch (err) { 
    res.status(500).json({ message: err.message });
  }
});
// SUPPRIMER un commentaire
app.delete('/api/cards/:cardId/comments/:commentId', async (req, res) => {
    try {
        const { cardId, commentId } = req.params;
        const card = await Card.findByIdAndUpdate(
            cardId,
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        ).populate('comments.user', 'username avatar').populate('members', 'username avatar');
        
        res.json(card);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// MODIFIER un commentaire
app.put('/api/cards/:cardId/comments/:commentId', async (req, res) => {
    try {
        const { cardId, commentId } = req.params;
        const { text } = req.body;
        
        const card = await Card.findOneAndUpdate(
            { _id: cardId, "comments._id": commentId },
            { $set: { "comments.$.text": text } },
            { new: true }
        ).populate('comments.user', 'username avatar').populate('members', 'username avatar');

        res.json(card);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/cards/:cardId/checklists/:checklistId/items', async (req, res) => {
    try {
        const { cardId, checklistId } = req.params;
        
        // CORRECTION ICI :ère aussi assignee et dueDate
        const { text, assignee, dueDate } = req.body; 

        const updatedCard = await Card.findOneAndUpdate(
            { _id: cardId, "checklists._id": checklistId },
            { 
                $push: { 
                    "checklists.$.items": { 
                        text, 
                        assignee,   // AJOUTÉ
                        dueDate,    // AJOUTÉ
                        isDone: false 
                    } 
                } 
            },
            { new: true }
        )
        // Pense à peupler l'assignee pour que le front reçoive l'objet membre et non juste l'ID
        .populate('members', 'username avatar')
        .populate('checklists.items.assignee', 'username avatar'); 

        if (!updatedCard) return res.status(404).json({ message: "Carte non trouvée" });
        res.json(updatedCard);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
//R écupun item en carte
app.post('/api/cards/:cardId/checklists/:checklistId/items/:itemId/convert', async (req, res) => {
    try {
        const { cardId, checklistId, itemId } = req.params;

        // 1. Trouver la carte source
        const sourceCard = await Card.findById(cardId);
        if (!sourceCard) return res.status(404).json({ message: "Carte source introuvable" });

        const checklist = sourceCard.checklists.id(checklistId);
        const item = checklist.items.id(itemId);

        // 2. Créer la nouvelle carte (Option A : Description vide par défaut)
        const newCard = new Card({
            title: item.text,
            listId: sourceCard.listId, 
            boardId: sourceCard.boardId, // Important pour qu'elle apparaisse sur le tableau
            description: "",            // On force une chaîne vide plutôt que null
            dueDate: item.dueDate || null,
            members: item.assignee ? [item.assignee] : [],
        });
        
        await newCard.save();

        // 3. Supprimer l'item de la checklist d'origine
        sourceCard.checklists.id(checklistId).items.pull(itemId);
        await sourceCard.save();

        // On renvoie les deux pour mettre à jour le frontend
        res.json({ updatedCard: sourceCard, newCard: newCard });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// TOGGLER isDone d'un item de checklist
app.put('/api/cards/:cardId/checklists/:checklistId/items/:itemId', async (req, res) => {
    try {
        const { cardId, checklistId, itemId } = req.params;

        const card = await Card.findOne({
            _id: cardId,
            "checklists._id": checklistId,
            "checklists.items._id": itemId
        });

        if (!card) {
            return res.status(404).json({ message: "Carte / Checklist / Item introuvable" });
        }

        const checklist = card.checklists.id(checklistId);
        const item = checklist.items.id(itemId);

        // TOGGLE
        item.isDone = !item.isDone;

        await card.save();

        const updatedCard = await Card.findById(cardId)
            .populate('members', 'username avatar')
            .populate('checklists.items.assignee', 'username avatar');

        res.json(updatedCard);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


// --- SCHÉMA POUR LES UTILISATEURS ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" }
});

const User = mongoose.model('User', userSchema);
// --- ROUTES POUR LES UTILISATEURS --
// ROUTE D'INSCRIPTION (Register)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // ... hachage du mot de passe ...
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // ON GÉNÈRE LE TOKEN TOUT DE SUITE
    const token = jwt.sign({ id: newUser._id }, "SECRET_KEY_TRELLO", { expiresIn: '1d' });
    
    // ON RENVOIE LES INFOS COMME POUR LE LOGIN
    res.status(201).json({ 
      token, 
      user: { id: newUser._id, username: newUser.username, email: newUser.email } 
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Récupérer TOUS les utilisateurs pour les proposer dans la modale
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('username avatar _id');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ROUTE DE CONNEXION (Login)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    // On crée un Token de session
    const token = jwt.sign({ id: user._id }, "SECRET_KEY_TRELLO", { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 1. Créer un nouvel utilisateur (Inscription)
app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar
    });
    await newUser.save();
    res.status(201).json(newUser);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Récupérer un utilisateur par son ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Ne pas renvoyer le mot de passe
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// --- DÉMARRAGE DU SERVEUR ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
