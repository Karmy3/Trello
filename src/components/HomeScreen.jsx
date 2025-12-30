
import Header from './Header';
import { Link } from "react-router-dom";
import capture from '../assets/capture.png'
import './HomeScreen.css'

import { useEffect, useState } from 'react';
import CreateBoards from './CreateBoards';

// 1. On crée le composant Layout (le squelette)
function Layout({ children }) {
  return (
    <div className="trello-app">
      <Header />  
      <main>
        {/* C'est ici que le contenu de la page sera injecté */}
        {children}
      </main>
    </div>
  );
}

// 2. On utilise ce Layout dans nos pages
function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    
    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // --- LES ÉTATS (STATES) ---
    const [showModal, setShowModal] = useState(false);
    const [allBoards, setAllBoards] = useState([]);
    const [recentBoards, setRecentBoards] = useState([]);

    // --- CHARGEMENT DES DONNÉES ---
    useEffect(() => {
        // Charger tous les tableaux
        fetch('http://localhost:5000/api/boards')
            .then(res => res.json())
            .then(data => setAllBoards(data));

        // Charger les tableaux récents
        fetch('http://localhost:5000/api/boards/recent')
            .then(res => res.json())
            .then(data => setRecentBoards(data));
    }, []);

  return (
    <Layout>
            <div className='home-container'>
                <div className='sidebar-left'>
                    <Link to="/boards">
                        <button className='btn-sidebar'>
                           <i className='bx  bx-table'></i>
                            <span>Tableaux</span>
                        </button>
                    </Link>
                    <Link to="/templates">
                        <button className='btn-sidebar'>
                            <i className ='bx  bx-show'></i>
                            <span>Modeles</span>
                        </button>
                    </Link>
                    <Link to="/">
                        <button className='btn-sidebar'>
                            <i className='bx  bx-home'></i>
                            <span>Acceuil</span>
                        </button>
                    </Link>
                    <hr />
                    <h3>Espaces de travail</h3>

                    <div class="sidebar">
                        <div className='container-combox'>
                            <div className='logo-e'>
                                <span>E</span>
                            </div>
                            <div className=''>
                                <p>Espaces de travail de Safari<br /> BEZARA</p>
                            </div>
                        </div>

                        <div className="sidebar-menu">
                            <li className="btn-sidebar"><i className='bx  bx-table'></i> Tableaux</li>
                            <li className="btn-sidebar"><i className='bx  bx-user-plus bx-flip-horizontal'></i> Membres</li>
                            <li className="btn-sidebar"><i className='bx  bx-cog'></i> Paramètres</li>
                        </div>

                        <div className="premium-card">
                            <h3>Essayez Trello Premium</h3>
                            <p>Profitez du Planificateur, de la mise en miroir des cartes, et bien d'autres avantages !</p>
                            <a href="#" className="btn-trial">Commencer l'essai gratuit</a>
                        </div>
                    </div>

                </div>

                <div className='main-center'>
                    <div className='container-fond'>
                        <img src={capture} className="fond home" alt="fond Home" />
                    </div>
                    <div className='container-text'>
                        <h1>Restez sur la bonne voie et à jour</h1>
                        <p>
                            Invitez des personnes à rejoindre des tableaux et des cartes, laissez des <br />
                            commentaires, ajoutez des dates limites et consultez l'activité la plus <br />
                            importante ici.
                        </p>
                    </div>
                </div>

                <div className='sidebar-right'>
                    <div>
                        <div className='container-title'>
                            <div className="card-info">
                                <button className='btn-title'>
                                    <i className='bx bx-clock'></i> 
                                    <span>Recement consultes</span>
                                </button>
                            </div>
                            {recentBoards.map(board => (
                                /* Le Link entoure chaque carte individuellement */
                                <Link to={`/b/${board._id}`} key={board._id} className="container-card-link">
                                    <div className="container-card">
                                        <div className="container-modele-right">
                                            {/* On affiche directement l'image stockée dans la BD */}
                                            <img src={board.background} className="modele" alt={board.title} />
                                        </div>
                                        
                                        <div className='container-card-center'>
                                            <p>
                                                <strong>{board.title}</strong> 
                                                <br />
                                                Espace de travail de Safari BEZARA 
                                            </p>
                                        </div>

                                        <div className='container-icon-left'>
                                            <button className='btn-icon-list' onClick={(e) => e.preventDefault()}>
                                                <i className='bx bx-star'></i> 
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                                                    </div>

                        {/* Conteneur relatif pour le bouton et la modale */}
                        <div style={{ position: 'relative', display: 'block' }}>
                            <div className='nav-creation-boards' onClick={() => setShowModal(!showModal)}>
                                <p>Liens</p>
                                <div className='nav-link'>
                                    <button className='btn-icon-list'>
                                        <i className='bx  bx-plus'></i> 
                                    </button>
                                    <p>Creer un tableau</p>
                                </div>
                            </div>

                            {/* On passe une fonction pour fermer la modale */}
                            {showModal && <CreateBoards close={() => setShowModal(false)} />}
                                
                        </div>

                        </div>
                    </div> 
            </div> 
    </Layout>
  );
}

export default Home