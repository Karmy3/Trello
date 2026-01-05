import React, { useState } from 'react';
import './CardModal.css';

function CardModal({ card, listTitle, onClose, onUpdate }) {
    
    // États pour gérer l'ouverture des petits menus
    const [activeMenu, setActiveMenu] = useState(null); // 'labels', 'members', 'dates', etc.
    const [description, setDescription] = useState(card.description || "");
    const [checklistTitle, setChecklistTitle] = useState("Checklist");
    
    // --- SYNCHRONISATION DES ÉTATS ---
    const [hasStart, setHasStart] = useState(!!card.startDate);
    const [startDate, setStartDate] = useState(card.startDate ? card.startDate.split('T')[0] : "");
    const [dueDate, setDueDate] = useState(card.dueDate ? card.dueDate.split('T')[0] : "");
    const [reminder, setReminder] = useState(card.reminder || "none");
    const [isRecurring, setIsRecurring] = useState(card.isRecurring || false);

    const [isLabelsExpanded, setIsLabelsExpanded] = useState(false);

    const [isCreating, setIsCreating] = useState(false); // Pour basculer entre liste et création
    const [newLabelText, setNewLabelText] = useState("");
    const [selectedColor, setSelectedColor] = useState("#4bce97");

    // La liste de tes exemplaires (Design System)
    const defaultLabels = [
        {c: '#4bce97', t: 'Terminé'}, 
        {c: '#f5cd47', t: 'En cours'}, 
        {c: '#f87168', t: 'Urgent'}, 
        {c: '#943d73', t: 'Design'},
        {c: '#5794f2', t: 'Backend'}
    ];

    const addLabel = (color, text) => {
    // Sécurité : on vérifie si l'étiquette existe déjà pour éviter les doublons
    const exists = card.labels?.some(l => l.color === color && l.text === text);

    const addChecklist = (title) => {
    // On crée la nouvelle checklist
    const newChecklist = { 
        title: title || "Checklist", 
        items: [] 
    };

    // On l'ajoute à la liste existante (ou un tableau vide si c'est le premier)
    const newChecklists = [...(card.checklists || []), newChecklist];

    // On envoie la mise à jour globale
    handleUpdate({ checklists: newChecklists });
    };

    const toggleMember = (userId) => {
    const currentMembers = card.members || [];
    
    // On vérifie si l'utilisateur est déjà dans la liste
    const isAlreadyMember = currentMembers.includes(userId);

    let newMembers;
    if (isAlreadyMember) {
        // S'il est là, on le retire (Filter)
        newMembers = currentMembers.filter(id => id !== userId);
    } else {
        // S'il n'est pas là, on l'ajoute (Spread)
        newMembers = [...currentMembers, userId];
    }

    // On envoie la mise à jour
    handleUpdate({ members: newMembers });};
    
    // Fonction de sauvegarde unique
    const handleUpdate = async () => {
        const payload = {
            startDate: hasStart ? startDate : null,
            dueDate: dueDate || null,
            reminder: reminder,
            isRecurring: isRecurring,

            description: description,

            // Par défaut on garde ce qui est déjà dans la carte
            labels: card.labels || [],
            checklists: card.checklists || [],
            members: card.members || [],
            
            // On écrase par les nouvelles données reçues du bouton
            ...dataToUpdate
        };

        try {
            const res = await fetch(`http://localhost:5000/api/cards/${card._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const updatedData = await res.json();
            onUpdate(updatedData); // C'est ici que la BD est mise à jour et l'écran rafraîchi
            setActiveMenu(null);
        } catch (err) { 
            console.error("Erreur sauvegarde dates:", err); 
        }
        
    };

    if (!exists) {
        const newLabels = [...(card.labels || []), { color, text }];
        handleUpdate({ labels: newLabels });
    }
    };

    if (!card) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                {/* --- HEADER --- */}
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="btn-list-source">{listTitle} <i className='bx bx-chevron-down'></i></div>
                    </div>
                    <div className="modal-header-right">
                        <i className='bx bx-volume-full'></i>
                        <i className='bx bx-image'></i>
                        <i className='bx bx-dots-horizontal-rounded'></i>
                        <i className='bx bx-x close-icon' onClick={onClose}></i>
                    </div>
                </div>
                
                <div className="modal-body-layout">
                    {/* --- COLONNE GAUCHE --- */}
                    <div className="modal-main-content">
                        {/* --- TITRE --- */}
                        <div className="modal-title-container">
                            <i className='bx bx-radio-circle'></i>
                            <h2 className="modal-card-title">{card.title}</h2>
                        </div>
                        <div className="action-buttons-row">
                            <button className="btn-modal"><i className='bx bx-plus'></i> Ajouter</button>
                            
                            {/* BOUTON ÉTIQUETTES */}
                            <div className="popover-wrapper">
                                <button className="btn-modal" onClick={() => setActiveMenu(activeMenu === 'labels' ? null : 'labels')}>
                                    <i className='bx bx-purchase-tag'></i> Étiquettes
                                </button>
                                {activeMenu === 'labels' && (
                                    <div className="custom-popover labels-popover">
                                        <div className="popover-header-title">
                                            {isCreating ? "Créer une étiquette" : "Étiquettes"}
                                            <i className='bx bx-x close-icon' onClick={() => setActiveMenu(null)}></i>
                                        </div>

                                        <div className="pop-content">
                                            {!isCreating ? (
                                                <>
                                                    {/* --- VUE 1 : LES EXEMPLAIRES PRÊTS À L'EMPLOI --- */}
                                                    <input type="text" className="search-labels" placeholder="Rechercher des étiquettes..." />
                                                    
                                                    <label className="pop-label">Couleurs</label>
                                                    
                                                    <div className="labels-grid-selection">
                                                        {defaultLabels.map((colorObj, idx) => (
                                                            <div key={idx} className="label-selection-item">
                                                                <div 
                                                                    className="color-bar" 
                                                                    style={{ background: colorObj.c }}
                                                                    // --- ON UTILISE addLabel ICI ---
                                                                    onClick={() => addLabel(colorObj.c, colorObj.t)}
                                                                >
                                                                    {colorObj.t}
                                                                    {/* Petit check visuel si l'étiquette est déjà présente */}
                                                                    {card.labels?.some(l => l.color === colorObj.c && l.text === colorObj.t) && <i className='bx bx-check'></i>}
                                                                </div>
                                                                <button className="edit-label-btn"><i className='bx bx-pencil'></i></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button className="btn-create-label" onClick={() => setIsCreating(true)}>
                                                        Créer une nouvelle étiquette
                                                    </button>
                                                </>
                                            ) : (
                                                /* --- VUE 2 : LE FORMULAIRE DE CRÉATION LIBRE --- */
                                                <div className="create-label-view">
                                                    <div className="preview-box" style={{backgroundColor: selectedColor}}>
                                                        {newLabelText || "Aperçu de l'étiquette"}
                                                    </div>
                                                    
                                                    <label className="pop-label">Titre</label>
                                                    <input 
                                                        type="text" 
                                                        className="pop-input-field" 
                                                        autoFocus
                                                        value={newLabelText}
                                                        onChange={(e) => setNewLabelText(e.target.value)}
                                                    />

                                                    <label className="pop-label">Sélectionner une couleur</label>
                                                    <div className="color-palette-grid">
                                                        {defaultLabels.map((l, i) => (
                                                            <div 
                                                                key={i} 
                                                                className={`color-dot ${selectedColor === l.c ? 'active' : ''}`}
                                                                style={{backgroundColor: l.c}}
                                                                onClick={() => setSelectedColor(l.c)}
                                                            />
                                                        ))}
                                                    </div>

                                                    <div className="pop-buttons-row">
                                                        <button className="btn-save-date" onClick={() => {
                                                            if(newLabelText.trim()) {
                                                                // --- ON UTILISE addLabel ICI AUSSI ---
                                                                addLabel(selectedColor, newLabelText);
                                                                
                                                                // On réinitialise après l'ajout
                                                                setIsCreating(false);
                                                                setNewLabelText("");
                                                            }
                                                        }}>Enregistrer</button>
                                                        <button className="btn-remove-date" onClick={() => setIsCreating(false)}>Retour</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* BOUTON DATES*/}
                            <div className="popover-wrapper">
                                <button className="btn-modal" onClick={() => setActiveMenu(activeMenu === 'dates' ? null : 'dates')}>
                                    <i className='bx bx-time-five'></i> Dates
                                </button>
                                {activeMenu === 'dates' && (
                                    <div className="custom-popover dates-popover">
                                        <div className="popover-header-title">Dates <i className='bx bx-x close-icon' onClick={() => setActiveMenu(null)}></i></div>
                                        <div className="pop-content">
                                            <div className="pop-body">
                                                {/* DATE DE DÉBUT */}
                                                <div className="pop-section">
                                                    <label className="check-row">
                                                        <input type="checkbox" checked={hasStart} onChange={e => setHasStart(e.target.checked)} />
                                                        Date de début
                                                    </label>
                                                    {hasStart && <input type="date" className="date-input" value={startDate} onChange={e => setStartDate(e.target.value)} />}
                                                </div>

                                                {/* DATE D'ÉCHÉANCE */}
                                                <div className="pop-section">
                                                    <label className="check-row">Date d'échéance</label>
                                                    <div className="due-date-row">
                                                        <input type="checkbox" checked={true} readOnly />
                                                        <input type="date" className="date-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                                                    </div>
                                                </div>

                                                {/* LE SELECT DES RAPPELS (CE QUI MANQUAIT) */}
                                                <div className="pop-section">
                                                    <label className="label-title">Définir un rappel</label>
                                                    <select className="trello-select" value={reminder} onChange={e => setReminder(e.target.value)}>
                                                        <option value="none">Aucun</option>
                                                        <option value="at-time">Au moment de l'échéance</option>
                                                        <option value="5-min">5 minutes avant</option>
                                                        <option value="1-hour">1 heure avant</option>
                                                        <option value="1-day">1 jour avant</option>
                                                        <option value="2-days">2 jours avant</option>
                                                    </select>
                                                    <p className="reminder-info">Les rappels sont envoyés aux membres.</p>
                                                </div>

                                                {/* LA RÉCURRENCE (CE QUI MANQUAIT) */}
                                                <div className="pop-section recurring-section">
                                                    <label className="check-row">
                                                        <input type="checkbox" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} />
                                                        Rendre récurrent
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="pop-buttons">
                                                <button className="btn-save-date" onClick={handleUpdate}>Enregistrer</button>
                                                <button className="btn-remove-date" onClick={() => setActiveMenu(null)}>Annuler</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* BOUTON CHECKLIST */}
                            <div className="popover-wrapper">
                                <button className="btn-modal" onClick={() => setActiveMenu(activeMenu === 'checklist' ? null : 'checklist')}>
                                    <i className='bx bx-check-square'></i> Checklist
                                </button>
                                
                                {activeMenu === 'checklist' && (
                                    <div className="custom-popover">
                                        <div className="popover-header-title">Ajouter une checklist <i className='bx bx-x' onClick={() => setActiveMenu(null)}></i></div>
                                        <div className="pop-content">
                                            <label className="pop-label">Titre</label>
                                           <input 
                                                type="text" 
                                                className="pop-input-field" 
                                                placeholder="Checklist"
                                                autoFocus
                                                id="checklist-title-input" // On utilise un ID pour récupérer la valeur facilement
                                            />
                                            
                                            <button 
                                                className="btn-save-date" 
                                                onClick={() => {
                                                    const input = document.getElementById('checklist-title-input');
                                                    if (input.value.trim()) {
                                                        addChecklist(input.value);
                                                        setActiveMenu(null); // On ferme le menu
                                                    }
                                                }}
                                            >
                                                Ajouter
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* BOUTON MEMBRES */}
                            <div className="popover-wrapper">
                            <button className="btn-modal" onClick={() => setActiveMenu(activeMenu === 'members' ? null : 'members')}>
                                <i className='bx bx-user'></i> Membres
                            </button>
                            {/*
                            {activeMenu === 'members' && (
                                <div className="custom-popover members-popover">
                                <div className="popover-header-title">
                                    Membres
                                    <i className='bx bx-x close-icon' onClick={() => setActiveMenu(null)}></i>
                                </div>
                                <div className="pop-content">
                                    <input type="text" className="search-labels" placeholder="Rechercher des membres..." />
                                    <label className="pop-label">Membres du tableau</label>
                                    
                                    <div className="members-list-selection">
                                    boardMembers doit contenir la liste de tous les utilisateurs du projet 
                                    {boardMembers?.map((user) => (
                                        <div 
                                        key={user._id} 
                                        className="member-selection-item"
                                        onClick={() => toggleMember(user._id)}
                                        >
                                        <div className="member-avatar-circle">
                                            {user.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="member-name">{user.username}</span>
                                        {/* Coche bleue si membre déjà présent *
                                        {card.members?.some(m => (m._id || m) === user._id) && (
                                            <i className='bx bx-check check-member'></i>
                                        )}
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                </div>
                            )}

                            */}

                            {activeMenu === 'members' && (
                                <div className="custom-popover members-popover">
                                    <div className="popover-header-title">
                                    Membres
                                    <i className='bx bx-x close-icon' onClick={() => setActiveMenu(null)}></i>
                                    </div>
                                    
                                    <div className="pop-content">
                                    {/* Champ de recherche */}
                                    <input type="text" className="pop-input-field" placeholder="Rechercher des membres" autoFocus />
                                    
                                    <div className="members-section-list">
                                        <label className="pop-label">Membres du tableau</label>
                                        {boardMembers.map((user) => {
                                        const isMember = card.members?.some(m => (m._id || m) === user._id);
                                        return (
                                            <div key={user._id} className="member-item" onClick={() => toggleMember(user._id)}>
                                            <div className="member-avatar-small">
                                                {user.username.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="member-name">{user.username}</span>
                                            {/* On affiche la coche si l'utilisateur est déjà membre */}
                                            {isMember && <i className='bx bx-check'></i>}
                                            </div>
                                        );
                                        })}
                                    </div>
                                    </div>
                                </div>
                                )}

                            </div>
                        </div>

                        {/* AFFICHAGE */}
                        {/* Section Membres en haut de la modale */}
                        <div className="modal-top-section">
                        {card.members?.length > 0 && (
                            <div className="members-display">
                            <h3 className="section-subtitle">Membres</h3>
                            <div className="members-list">
                                {card.members.map((member, idx) => (
                                <div key={idx} className="member-avatar" title={member.username}>
                                    {/* Les initiales dans un cercle */}
                                    {member.username?.substring(0, 2).toUpperCase()}
                                </div>
                                ))}
                                {/* Le bouton "+" pour ouvrir le menu */}
                                <button className="add-member-btn" onClick={() => setActiveMenu('members')}>
                                <i className='bx bx-plus'></i>
                                </button>
                            </div>
                            </div>
                        )}
                        </div>

                        {/* Affichage des étiquettes actives sur la carte */}
                        <div className="modal-section">
                            {card.labels?.length > 0 && (
                                <div className="labels-container-main">
                                    <h3 className="section-subtitle">Étiquettes</h3>
                                    <div className="labels-list-flex">
                                        {card.labels.map((l, i) => (
                                            <div 
                                                key={i} 
                                                className={`label-badge ${isLabelsExpanded ? 'expanded' : ''}`}
                                                style={{ backgroundColor: l.color }}
                                                onClick={() => setIsLabelsExpanded(!isLabelsExpanded)}
                                                title={l.text}
                                            >
                                                {isLabelsExpanded ? l.text : ""}
                                                <span>{l.text}</span>
                                            </div>
                                        ))}
                                        {/* Bouton Plus pour ajouter rapidement */}
                                        <button className="add-label-circle" onClick={() => setActiveMenu('labels')}>
                                            <i className='bx bx-plus'></i>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* --- 1. ZONE D'AFFICHAGE DES RÉSULTATS --- */}
                        {(card.startDate || card.dueDate) && (
                        <div className="labels-container-main">
                            <h3 className="section-subtitle">Date</h3>
                            <div className="dates-display-results">
                                {card.startDate && (
                                    <div className="date-result-badge">
                                        <h4>Date de début</h4>
                                        <div className="date-pill">{new Date(card.startDate).toLocaleDateString()}</div>
                                    </div>
                                )}
                                {card.dueDate && (
                                    <div className="date-result-badge">
                                        <h4>Date limite</h4>
                                        <div className="date-pill-check">
                                            <input type="checkbox" />
                                            <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                                            {card.isRecurring && <i className='bx bx-refresh'></i>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        )}

                        <div className="description-section">
                            <div className="section-header">
                                <i className='bx bx-align-left'></i>
                                <h3>Description</h3>
                            </div>
                            <textarea 
                                className="modal-textarea" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={() => handleUpdate({ description })}
                                placeholder="Ajouter une description plus détaillée..."
                            ></textarea>
                        </div>

                        {card.checklists?.map((list, listIndex) => (
                            <div key={listIndex} className="checklist-container">
                                <div className="section-header">
                                    <i className='bx bx-check-square'></i>
                                    <h3>{list.title}</h3>
                                    <button className="btn-modal">Supprimer</button>
                                </div>
                                
                                {/* Barre de progression (Optionnel mais joli) */}
                                <div className="progress-bar-container">
                                    <span className="progress-percent">0%</span>
                                    <div className="progress-bg"><div className="progress-fill" style={{width: '0%'}}></div></div>
                                </div>

                                <div className="checklist-items">
                                    {list.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="check-item">
                                            <input type="checkbox" checked={item.isDone} />
                                            <span>{item.text}</span>
                                        </div>
                                    ))}
                                    <button className="btn-add-item">Ajouter un élément</button>
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* --- COLONNE DROITE --- */}
                    <div className="modal-activity-content">
                        <div className="section-header">
                            <i className='bx bx-message-rounded-dots'></i>
                            <h3>Commentaires et activité</h3>
                            <button className="btn-show-details">Afficher les détails</button>
                        </div>
                        <div className="comment-input-container">
                            <div className="user-avatar-placeholder">SB</div>
                            <input type="text" className="comment-field" placeholder="Écrivez un commentaire..." />
                        </div>
                    </div>
                </div>

                {/* --- BARRE DE PIED --- */}
                <div className="modal-floating-footer">
                    <div className="footer-btn"><i className='bx bx-rocket'></i> Power-Ups</div>
                    <div className="footer-btn"><i className='bx bx-bolt-circle'></i> Automatisations</div>
                    <div className="footer-btn active"><i className='bx bx-message-square-detail'></i> Commentaires</div>
                </div>
            </div>
        </div>
    );
}

export default CardModal;