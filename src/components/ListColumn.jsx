import { useState, useEffect } from 'react';
import './ListColumn.css';
import CardModal from './CardModal';
import { Droppable, Draggable } from '@hello-pangea/dnd';

function ListColumn({ list, boardId, cards, onCardAdded, onUpdateCards }) {
    const [isAddingCards, setIsAddingCards] = useState(false);
    const [cardTitle, setCardTitle] = useState("");
    const [cardToOpen, setCardToOpen] = useState(null);

    const handleCardUpdate = (updatedCard) => {
        // 1. Met à jour la liste des cartes en arrière-plan
        const newCards = cards.map(c => c._id === updatedCard._id ? updatedCard : c);
        onUpdateCards(list._id, newCards);

        // 2. Met à jour la carte actuellement ouverte dans la modale
        setCardToOpen(updatedCard);
    };

    const handleOnSubmitCards = (e) => {
        e.preventDefault();
        if (!cardTitle.trim()) return setIsAddingCards(false);

        fetch('http://localhost:5000/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: cardTitle, listId: list._id, boardId: boardId })
        })
        .then(res => res.json())
        .then(newCard => {
            onCardAdded(list._id, newCard);
            setCardTitle("");
            setIsAddingCards(false);
        });
    };

    return (
        <div className="container-type-one">
            <div className="first-container">
                <div className="btn-working">{list.title}</div>
                <div className="btn-icon-list"><i className='bx bx-plus'></i> </div>
                <div className="btn-icon-list"><i className='bx bx-dots-horizontal-rounded'></i></div>
            </div>

            {/* 2. On enveloppe la zone des cartes avec Droppable */}
            <Droppable droppableId={String(list._id)}>
                {(provided) => (
                    <div 
                        className="cards-area" 
                        {...provided.droppableProps}
                        ref={provided.innerRef} 
                        style={{ minHeight: "10px" }}
                    >
                        {cards.map((card, index) => (
                            /* 3. On enveloppe chaque carte avec Draggable */
                            <Draggable key={card._id} draggableId={String(card._id)} index={index}>
                                {(provided) => (
                                    <div 
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        key={card._id} 
                                        className="card-item-styled" 
                                        onClick={() => setCardToOpen(card)}
                                    >
                                        <span>{card.title}</span>
                                        {/* Optionnel: Petit indicateur visuel si la carte a des labels */}
                                        <div className="card-mini-labels">
                                            {card.labels?.map((l, i) => (
                                                <div key={i} className="mini-label" style={{backgroundColor: l.color}}></div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}

                        {/* 4. Placeholder : l'espace vide qui se crée lors du survol */}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
    
            {cardToOpen && (
                <CardModal 
                    card={cardToOpen} 
                    listTitle={list.title} 
                    onClose={() => setCardToOpen(null)} 
                    onUpdate={handleCardUpdate}
                />
            )}

            {isAddingCards ? (
                <form onSubmit={handleOnSubmitCards} className="add-card-form">
                    <textarea
                        autoFocus
                        placeholder="Saisissez un titre..."
                        value={cardTitle}
                        onChange={(e) => setCardTitle(e.target.value)}
                    />
                    <div className="add-list-actions">
                        <button type="submit">Ajouter une carte</button>
                        <button type="button" onClick={() => setIsAddingCards(false)}><i className="bx bx-x"></i></button>
                    </div>
                </form>
            ) : (
                <div className="thrirst-container">
                    <div className="btn-sidebar" onClick={() => setIsAddingCards(true)}> 
                        <i className='bx bx-plus'></i> 
                        <span>Ajouter une carte</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListColumn;