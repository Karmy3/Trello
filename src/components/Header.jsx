import { Link } from "react-router-dom";
import { useState } from 'react';
import trelloLogo from '../assets/trello.jpg'
import './Header.css'
import CreateBoards from './CreateBoards';

// Les props { user, onLogout } doivent être ici, au niveau principal
function Header({ user, onLogout }){
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    
    // 1. État pour le menu de déconnexion
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // 2. Fonction pour ouvrir/fermer le menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return(
        <header className="main-header">
            <Link to="/boards">
                <nav className="nav-container">
                    <button className="btn-icon-list">
                        <i className="bx bx-grid-circle" />
                    </button>
                    <button className="btn-container">
                        <img src={trelloLogo} className="logo trello" alt="Trello logo" />
                        <p>Trello</p>
                    </button>
                </nav>
            </Link>

            <div className="nav-search">
                <div className="search-container">
                    <i className="bx bx-search" />
                    <input 
                        type="text"
                        placeholder="Rechercher" 
                        value={searchTerm}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button onClick={() => setShowModal(!showModal)}>
                        Creer
                    </button>
                    {showModal && <CreateBoards close={() => setShowModal(false)} />}
                </div>
            </div>

            <div className="container-left">
                <button className="btn-icon-list"><i className='bx bx-megaphone'></i></button>
                <button className="btn-icon-list"><i className='bx bx-bell'></i></button>
                <button className="btn-icon-list"><i className='bx bx-help-circle'></i></button>

                <div className="header-user-area">
                    {/* L'avatar cliquable avec les initiales */}
                    <div className="avatar-circle-header" onClick={toggleMenu}>
                        {user?.username?.substring(0, 2).toUpperCase() || "U"}
                    </div>

                    {/* Menu de profil */}
                    {isMenuOpen && (
                        <div className="profile-dropdown">
                            <div className="dropdown-section">
                                <p className="section-title">COMPTE</p>
                                <div className="user-info">
                                    <div className="avatar-circle">
                                        {user?.username?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="username">{user?.username}</p>
                                        <p className="user-email">{user?.email}</p>
                                    </div>
                                </div>
                                <ul className="dropdown-list">
                                    <li>Changer de compte</li>
                                    <li>Gérer le compte</li>
                                </ul>
                            </div>
                            <hr />
                            <div className="dropdown-section">
                                <p className="section-title">TRELLO</p>
                                <ul className="dropdown-list">
                                    <li>Profil et visibilité</li>
                                    <li>Activité</li>
                                    <li>Cartes</li>
                                    <li>Paramètres</li>
                                </ul>
                            </div>
                            <hr />
                            {/* Le bouton de déconnexion appelle la fonction passée en prop */}
                            <button className="logout-button" onClick={onLogout}>
                                Se déconnecter
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;