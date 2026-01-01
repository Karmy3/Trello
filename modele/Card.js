const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
    description: { type: String, default: "" },

    // Stocke les étiquettes (couleur et texte)
    labels: [{ color: String, text: String }],

    // Stocke les membres (IDs User)
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // Stocke la date limite
    dueDate: { type: Date },

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
    }]

});

module.exports = mongoose.model('Card', CardSchema);