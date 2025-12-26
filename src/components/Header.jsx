import { Link } from "react-router-dom";
import { useState } from 'react';
import trelloLogo from '../assets/trello.jpg'
import './Header.css'

function Header(){
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };
    return(
        <header className="main-header">
            <Link to="/boards">
                <nav  className="nav-container">
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
                <button>
                    Creer
                </button>
            </div>

            <div className = "container-left">
                <button className="btn-icon-list">
                    <i className='bx  bx-megaphone'></i>
                </button>
                <button className="btn-icon-list">
                    <i className='bx  bx-bell'></i>
                </button>
                <button className="btn-icon-list">
                    <i className='bx  bx-help-circle'></i>
                </button>
                <button className="btn-icon-list">
                    <img src={trelloLogo} className="img-profil" alt="Profil User" />
                </button>
            </div>
        </header>
    )
}
export default Header;