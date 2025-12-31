import Header from './Header';
import './DetailsCard.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListColumn from './ListColumn'; 

function Layout({ children }) {
    return (
        <div className="trello-app">
            <Header />  
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

    useEffect(() => {
        fetch(`http://localhost:5000/api/boards/${id}`)
            .then(res => res.json())
            .then(data => setBoard(data));

        fetch(`http://localhost:5000/api/lists/${id}`)
            .then(res => res.json())
            .then(data => setLists(data));
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

    if (!board) return <div className="loading">Chargement...</div>;

    return (
        <Layout>
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
                            <ListColumn key={list._id} list={list} boardId={id} />
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
        </Layout>
    );
}

export default DetailsCard;