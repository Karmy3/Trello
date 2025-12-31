import React from 'react';
import './CardModal.css';

function CardModal({ card, onClose }) {
    if (!card) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header de la Modal */}
                <div className="modal-header">
                    <div className="modal-title-section">
                        <i className='bx bx-credit-card'></i>
                        <div className="title-text">
                            <h2>{card.title}</h2>
                            <p>Dans la liste <span>{card.listName || "À faire"}</span></p>
                        </div>
                    </div>
                    <button className="close-modal" onClick={onClose}>
                        <i className='bx bx-x'></i>
                    </button>
                </div>

                <div className="modal-body">
                    {/* Colonne de gauche : Contenu */}
                    <div className="modal-main-col">
                        {/* Boutons d'actions rapides sous le titre */}
                        <div className="quick-actions">
                            <button className="btn-modal-action"><i className='bx bx-plus'></i> Ajouter</button>
                            <button className="btn-modal-action"><i className='bx bx-purchase-tag'></i> Étiquettes</button>
                            <button className="btn-modal-action"><i className='bx bx-time-five'></i> Dates</button>
                            <button className="btn-modal-action"><i className='bx bx-check-square'></i> Checklist</button>
                            <button className="btn-modal-action"><i className='bx bx-user'></i> Membres</button>
                        </div>

                        {/* Description */}
                        <div className="modal-section">
                            <div className="section-title">
                                <i className='bx bx-align-left'></i>
                                <h3>Description</h3>
                            </div>
                            <textarea 
                                className="description-input" 
                                placeholder="Ajouter une description plus détaillée..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Colonne de droite : Commentaires & Activité */}
                    <div className="modal-side-col">
                        <div className="section-title">
                            <i className='bx bx-list-ul'></i>
                            <h3>Commentaires et activité</h3>
                            <button className="btn-show-details">Afficher les détails</button>
                        </div>
                        <div className="comment-box">
                            <div className="user-avatar-small"></div>
                            <input type="text" placeholder="Écrivez un commentaire..." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardModal;