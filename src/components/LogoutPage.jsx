import './LogoutPage.css'
import React from 'react';

function LogoutPage(){
    const handleFinalLogout = () => {
        // C'EST ICI QU'ON DÉCONNECTE VRAIMENT
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null); // L'utilisateur devient null, il est expulsé
        
        // On redirige vers le login
        window.location.href = '/auth';
    };

    return (
        <div className="auth-container logout-bg">
        <img src="/trello-logo.png" alt="Trello" className="auth-logo" />
        
        <div className="auth-card">
            <h3>Déconnexion de vos comptes Atlassian</h3>
            <button className="btn-auth-primary" onClick={handleFinalLogout}>
            Se déconnecter de tous les comptes
            </button>
            <div className="auth-footer">
            <a href="/auth">Connexion à un autre compte</a>
            </div>
        </div>

        {/* Illustrations Trello sur les côtés */}
        <div className="logout-illustration left">
            <img src="/illustration-left.png" alt="" />
        </div>
        <div className="logout-illustration right">
            <img src="/illustration-right.png" alt="" />
        </div>
        </div>
    );
}
export default LogoutPage;