import Header from './Header';
import './DetailsCard.css'
import firsttest from '../assets/firsttest.jpg'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="trello-app">
      <Header />  
      <main>
        {children}
      </main>
    </div>
  );
}

function DetailsCard(){
    const { id } = useParams(); // Récupère l'ID du tableau dans l'URL
    const [board, setBoard] = useState(null);

    useEffect(() => {
        // On va chercher le tableau dans la BD
        fetch(`http://localhost:5000/api/boards/${id}`)
            .then(res => res.json())
            .then(data => setBoard(data));
    }, [id]);

    const handleAddList = (title) => {
        // Envoie une lettre au serveur avec le titre de la nouvelle liste
        fetch('http://localhost:5000/api/lists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: title, 
                boardId: id // Très important : dit à MongoDB à quel tableau cette liste appartient
            })
        })
        .then(res => res.json())
        .then(newList => {
            // Ajoute la nouvelle liste à celles qui sont déjà à l'écran sans recharger la page
            setLists([...lists, newList]); 
        });
    };

    const [lists, setLists] = useState([]); // Crée une boîte vide pour stocker les listes
    useEffect(() => {
        // Demande au serveur : "Donne-moi toutes les listes qui appartiennent au tableau "
        fetch(`http://localhost:5000/api/lists/${id}`)
            .then(res => res.json())
            .then(data => setLists(data)); // Remplit la boîte 'lists' avec les données reçues
    }, [id]);

    const [isAdding, setIsAdding] = useState(false); // Pour savoir si on affiche l'input ou le bouton
    const [listTitle, setListTitle] = useState("");

    // Fonction pour fermer et réinitialiser
    const closeForm = () => {
        setIsAdding(false);
        setListTitle("");
    };

    // Fonction pour gérer la validation
    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (listTitle.trim()) {
            handleAddList(listTitle);
            closeForm();
        } else {
            closeForm(); // Si vide, on ferme simplement
        }
    };

    const handleAddCards = (title) => {
        // Envoie une lettre au serveur avec le titre de la nouvelle liste
        fetch('http://localhost:5000/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: title, 
                listId: id // Très important : dit à MongoDB à quel tableau cette carte appartient a un list
            })
        })
        .then(res => res.json())
        .then(newList => {
            // Ajoute la nouvelle liste à celles qui sont déjà à l'écran sans recharger la page
            setCards([...cards, newCard]); 
        });
    };

    const [cards, setCards] = useState([]); // Crée une boîte vide pour stocker les cartes
    useEffect(() => {
        // Demande au serveur : "Donne-moi toutes les listes qui appartiennent au tableau "
        fetch(`http://localhost:5000/api/cards/${id}`)
            .then(res => res.json())
            .then(data => setLists(data)); // Remplit la boîte 'lists' avec les données reçues
    }, [id]);

    const [isAddingCards, setIsAddingCards] = useState(false); // Pour savoir si on affiche l'input ou le bouton
    const [cardTitle, seCardTitle] = useState("");

    // Fonction pour fermer et réinitialiser
    const closeFormCards = () => {
        setIsAdding(false);
        setCardTitle("");
    };

    // Fonction pour gérer la validation
    const handleOnSubmitCards = (e) => {
        e.preventDefault();
        if (cardTitle.trim()) {
            handleAddCSard(cardTitle);
            closeFormCards();
        } else {

            closeFormCards(); // Si vide, on ferme simplement
        }
    };

    if (!board) return <div>Chargement...</div>;

    return(
       <Layout>
        <div 
            className='details-main'
            style={{ backgroundImage: `url(${board.background})` }}
        >
            <div className="header-details">
                <div className="nav-right">
                    <div className="btn-title-card">{board.title}</div>
                    <div className="btn-vue">
                        <i className='bx  bx-caret-down'></i> 
                        <i className='bx  bx-caret-down'></i>
                    </div>
                </div>
                <div className="nav-left">
                    <div className="container-profil"></div>
                    <div className="btn-icon-details"><i className='bx  bx-rocket'></i> </div>
                    <div className="btn-icon-details"><i className="bx bx-bot"/></div>
                    <div className="btn-icon-details"><i className='bx  bx-menu'></i> </div>
                    <div className="btn-icon-details"><i className='bx  bx-star'></i> </div>
                    <div className="btn-icon-details"><i className='bx  bx-lock'></i> </div>
                    <div className="btn-action">
                        <i className='bx  bx-user-plus bx-flip-horizontal'></i> 
                        <span>Partager</span>
                    </div>
                    <div className="btn-icon-details"><i className='bx  bx-dots-horizontal-rounded'></i></div>
                </div>
            </div>
            
            <div className="container-global">
                <div className="container-start">

                    {lists.map(list => (
                        <div key={list._id} className="container-type-one">
                            <div className="first-container">
                                <div className="btn-working">{list.title}</div>
                                <div className="btn-icon-list"><i className='bx  bx-plus'></i> </div>
                                <div className="btn-icon-list"><i className='bx  bx-dots-horizontal-rounded'></i></div>
                            </div>
                            <div className="thrirst-container">
                                <div className="btn-sidebar"> 
                                    <i className='bx  bx-plus'></i> 
                                    <span>Ajouter une carte</span>
                                </div>
                                <div className="btn-icon-list"><i className='bx  bx-images'></i> </div>
                            </div>

                        </div>

                    ))}

                    {isAdding ? (
                        <form onSubmit={handleOnSubmit} className="add-list-form">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Saisissez le titre de la liste..."
                                value={listTitle}
                                onChange={(e) => setListTitle(e.target.value)}
                                // SI L'USER CLIQUE AILLEURS :
                                onBlur={() => {
                                    // On met un petit délai pour permettre au clic sur le bouton "Ajouter" 
                                    // de fonctionner avant que le formulaire ne disparaisse
                                    setTimeout(() => {
                                        if (!listTitle.trim()) closeForm();
                                    }, 150);
                                }}
                            />
                            <div className="add-list-actions">
                                <button type="submit">Ajouter une liste</button>
                                <button type="button" onClick={closeForm}>
                                    <i className="bx bx-x"></i>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="add-list-placeholder" onClick={() => setIsAdding(true)}>
                            <span>+ Ajouter une autre liste</span>
                        </div>
                    )}
                </div>
                
                <div className="container-end">
                    <li className='btn-end'><i className='bx  bx-box'></i> Boite de reception</li>
                    <li className='btn-end'><i className='bx  bx-calendar-minus'></i> Agenda</li>
                    <li className='btn-end'><i className='bx  bx-table'></i> Tableau</li>
                    <li className='btn-end'><i className='bx  bx-windows'></i> Changer de tableau</li>
                </div>

          </div>
        </div>
       </Layout>
    );
}
export default DetailsCard