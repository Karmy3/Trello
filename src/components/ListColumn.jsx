import { useState, useEffect } from 'react';
import './ListColumn.css';

function ListColumn({ list, boardId }) {
    const [cards, setCards] = useState([]);
    const [isAddingCards, setIsAddingCards] = useState(false);
    const [cardTitle, setCardTitle] = useState("");

    useEffect(() => {
        fetch(`http://localhost:5000/api/cards/${list._id}`)
            .then(res => res.json())
            .then(data => setCards(data));
    }, [list._id]);

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

            {/* Affichage des cartes réelles venant de MongoDB */}
            <div className="cards-area">
                {cards.map(card => (
                    <div key={card._id} className="card-item-styled">
                        <span>{card.title}</span>
                    </div>
                ))}
            </div>

            {isAddingCards ? (
                <form onSubmit={handleOnSubmitCards} className="add-card-form">
                    <textarea
                        autoFocus
                        placeholder="Saisissez un titre ou copiez un lien..."
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
                    <div className="btn-icon-list"><i className='bx bx-images'></i> </div>
                </div>
            )}
        </div>
    );
}

export default ListColumn;