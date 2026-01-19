import Header from './Header';
import './DetailsCard.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListColumn from './ListColumn'; 
import { DragDropContext } from '@hello-pangea/dnd';

function Layout({ children, user, onLogout }) {
    return (
        <div className="trello-app"> 
            <Header user={user} onLogout={onLogout} />
            <main>{children}</main>
        </div>
    );
}

function DetailsCard() {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [lists, setLists] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [listTitle, setListTitle] = useState("");
    const [allCards, setAllCards] = useState({}); // Pour stocker les cartes de chaque liste

    useEffect(() => {
    const loadData = async () => {
        try {
        const response = await fetch(`http://localhost:5000/api/boards/${id}/full`);
        const data = await response.json(); 

        // 1. On stocke les infos du tableau (titre, fond, etc.)
        setBoard(data); 
        
        // 2. On stocke les listes
        setLists(data.lists); 

        // 3. IMPORTANT : Pour que tes composants <ListColumn /> ne plantent pas,
        // on transforme le tableau 'allCards' en l'objet que ton code attend déjà.
        const cardsByList = {};
        data.allCards.forEach(card => {
            if (!cardsByList[card.listId]) {
            cardsByList[card.listId] = [];
            }
            cardsByList[card.listId].push(card);
        });
        
        setAllCards(cardsByList);

        } catch (error) {
        console.error("Erreur lors du chargement complet :", error);
        }
    };
    loadData();
    }, [id]);

    const handleAddList = (e) => {
        e.preventDefault();
        if (!listTitle.trim()) return setIsAdding(false);

        fetch('http://localhost:5000/api/lists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: listTitle, boardId: id })
        })
        .then(res => res.json())
        .then(newList => {
            setLists([...lists, newList]);
            setListTitle("");
            setIsAdding(false);
        });
    };

    const handleUpdateAllCards = (listId, newCards) => {
        setAllCards(prev => ({ ...prev, [listId]: newCards }));
    };

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        const startListId = source.droppableId;
        const finishListId = destination.droppableId;

        // 1. On crée une copie profonde de tout l'état allCards
        const newAllCards = { ...allCards };

        // 2. On récupère et copie les listes concernées
        const startCards = [...(allCards[startListId] || [])];
        const finishCards = startListId === finishListId 
            ? startCards 
            : [...(allCards[finishListId] || [])];

        // 3. On extrait la carte
        const [movedCard] = startCards.splice(source.index, 1);
        
        // On met à jour l'ID de liste sur la carte
        const updatedCard = { ...movedCard, listId: finishListId };

        // 4. On insère dans la destination
        if (startListId === finishListId) {
            startCards.splice(destination.index, 0, updatedCard);
            newAllCards[startListId] = startCards;
        } else {
            finishCards.splice(destination.index, 0, updatedCard);
            newAllCards[startListId] = startCards;
            newAllCards[finishListId] = finishCards;
        }

        // 5. Mise à jour du State
        setAllCards(newAllCards);

        // 6. API Call
        fetch(`http://localhost:5000/api/cards/${draggableId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                listId: finishListId,
                order: destination.index 
            })
        })
        .then(res => res.json())
        .then(data => console.log("✅ Sauvegardé en DB:", data))
        .catch(err => console.error("❌ Erreur:", err));
    };

    if (!board) return <div className="loading">Chargement...</div>;

    return (
        <Layout>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='details-main' style={{ backgroundImage: `url(${board.background})` }}>
                    {/* --- TON HEADER DE TABLEAU COMPLET --- */}
                    <div className="header-details">
                        <div className="nav-right">
                            <div className="btn-title-card">{board.title}</div>
                            <div className="btn-vue">
                                <i className='bx bx-caret-down'></i> 
                                <i className='bx bx-caret-down'></i>
                            </div>
                        </div>
                        <div className="nav-left">
                            <div className="container-profil"></div>
                            <div className="btn-icon-details"><i className='bx bx-rocket'></i> </div>
                            <div className="btn-icon-details"><i className="bx bx-bot"/></div>
                            <div className="btn-icon-details"><i className='bx bx-menu'></i> </div>
                            <div className="btn-icon-details"><i className='bx bx-star'></i> </div>
                            <div className="btn-icon-details"><i className='bx bx-lock'></i> </div>
                            <div className="btn-action">
                                <i className='bx bx-user-plus bx-flip-horizontal'></i> 
                                <span>Partager</span>
                            </div>
                            <div className="btn-icon-details"><i className='bx bx-dots-horizontal-rounded'></i></div>
                        </div>
                    </div>
                    
                    {/* --- ZONE DES LISTES --- */}
                    <div className="container-global">
                        <div className="container-start">
                            {/* Chaque liste est gérée par ListColumn pour éviter les bugs d'ouverture simultanée */}
                            {lists.map(list => (
                                <ListColumn 
                                    key={list._id} 
                                    list={list} 
                                    boardId={id} 
                                    // On passe les cartes de la liste actuelle
                                    cards={allCards[list._id] || []} 
                                    onCardAdded={(listId, newCard) => setAllCards(prev => ({...prev, [listId]: [...(prev[listId] || []), newCard]}))}
                                    onUpdateCards={handleUpdateAllCards}
                                />
                            ))}

                            <div className="add-list-wrapper">
                                {isAdding ? (
                                    <form onSubmit={handleAddList} className="add-list-form">
                                        <input
                                            autoFocus
                                            placeholder="Titre de la liste..."
                                            value={listTitle}
                                            onChange={(e) => setListTitle(e.target.value)}
                                            onBlur={() => setTimeout(() => { if(!listTitle) setIsAdding(false) }, 150)}
                                        />
                                        <div className="add-list-actions">
                                            <button type="submit">Ajouter une liste</button>
                                            <button type="button" onClick={() => setIsAdding(false)}><i className="bx bx-x"></i></button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="add-list-placeholder" onClick={() => setIsAdding(true)}>
                                        <span>+ Ajouter une autre liste</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- BARRE LATERALE DROITE --- */}
                        <div className="container-end">
                            <li className='btn-end'><i className='bx bx-box'></i> Boite de reception</li>
                            <li className='btn-end'><i className='bx bx-calendar-minus'></i> Agenda</li>
                            <li className='btn-end'><i className='bx bx-table'></i> Tableau</li>
                            <li className='btn-end'><i className='bx bx-windows'></i> Changer de tableau</li>
                        </div>
                    </div>
                </div>
            </DragDropContext>
        </Layout>
    );
}

export default DetailsCard;