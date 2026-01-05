import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate,useNavigate } from "react-router-dom";
import './App.css'

import AuthPage from './components/Authentification';
import LogoutPage from './components/LogoutPage';
import Home from './components/HomeScreen';
import Boards from './components/Boards';
import Templates from './components/Templates';
import DetailsCard from './components/DetailsCard';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // On change de page vers la confirmation
    navigate('/logout-confirmation');
  };

  return (
      <Routes>
        {/* ROUTE : Page de confirmation de déconnexion */}
        <Route 
          path="/logout-confirmation" 
          element={<LogoutPage setUser={setUser} />} // On passe setUser pour plus tard
        />

        {/* Si l'utilisateur n'est pas connecté, on le redirige vers /auth */}
        <Route 
          path="/auth" 
          element={!user ? <AuthPage onLoginSuccess={(userData) => setUser(userData)} /> : <Navigate to="/" />} 
        />

        {/* Routes protégées : si l'utilisateur n'est pas là, on le renvoie vers /auth */}
        <Route 
          path="/" 
          element={user ? <Home user={user} onLogout={handleLogout}/> : <Navigate to="/auth" />} 
        />
        <Route path="/boards" element={user ? <Boards /> : <Navigate to="/auth" />} />
        <Route path="/templates" element={user ? <Templates /> : <Navigate to="/auth" />} />
        <Route path="/b/:id" element={user ? <DetailsCard /> : <Navigate to="/auth" />} />
        
        {/* Redirection par défaut si la page n'existe pas */}
        <Route path="*" element={<Navigate to={user ? "/" : "/auth"} />} />
      </Routes>
  );
}

export default App;