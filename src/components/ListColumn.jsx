import { useState, useEffect } from 'react';
import './ListColumn.css';
import CardModal from './CardModal';

function ListColumn({ list, boardId }) {
    const [cards, setCards] = useState([]);
    const [isAddingCards, setIsAddingCards] = useState(false);
    const [cardTitle, setCardTitle] = useState("");
    const [cardToOpen, setCardToOpen] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/cards/${list._id}`)
            .then(res => res.json())
            .then(data => setCards(data));
    }, [list._id]);

    // --- CETTE FONCTION MANQUAIT ---
    const handleCardUpdate = (updatedCard) => {
        // 1. Met à jour la liste des cartes en arrière-plan
        setCards(prevCards => prevCards.map(c => 
            c._id === updatedCard._id ? updatedCard : c
        ));
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
            setCards([...cards, newCard]);
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

            <div className="cards-area">
                {cards.map(card => (
                    <div 
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
                ))}

                {cardToOpen && (
                    <CardModal 
                        card={cardToOpen} 
                        listTitle={list.title} 
                        onClose={() => setCardToOpen(null)} 
                        onUpdate={handleCardUpdate} // ✅ ON AJOUTE ÇA ICI
                    />
                )}
            </div>

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