import React, { useState } from 'react';

// On utilise un seul nom de fonction ici qui correspond à votre export
function Authentification({ onLoginSuccess }) { 
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isRegister ? 'register' : 'login';
        const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        
        if (res.ok) {
            // PEU IMPORTE LE MODE, ON CONNECTE DIRECTEMENT
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            onLoginSuccess(data.user); // Redirection immédiate vers l'accueil
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="auth-container">
            {/* Assurez-vous que l'image est dans votre dossier 'public' */}
            <img src="/trello-logo.png" alt="Trello" className="auth-logo" />
            
            <div className="auth-card">
                {/* Le titre change selon le mode (Vidéo 0:00) */}
                <h2>{isRegister ? "Créer un compte" : "Connectez-vous pour continuer"}</h2>
                
                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="input-group">
                            <label>Nom d'utilisateur</label>
                            <input 
                                type="text" 
                                placeholder="Entrez votre nom" 
                                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                required
                            />
                        </div>
                    )}
                    
                    <div className="input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="Saisissez votre adresse e-mail" 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Mot de passe</label>
                        <input 
                            type="password" 
                            placeholder="Saisissez votre mot de passe" 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            required
                        />
                    </div>

                    <button type="submit" className="btn-auth-primary">
                        {isRegister ? "S'inscrire" : "Continuer"}
                    </button>
                </form>
                
                <div className="auth-footer">
                    {/* Le lien switch le mode (Vidéo 0:12) */}
                    <span onClick={() => setIsRegister(!isRegister)}>
                        {isRegister ? "Déjà un compte ? Se connecter" : "Créer un compte"}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Authentification;