// Dans App.js
import UploadTrello from './UploadTrello'; // Vérifie bien le chemin du fichier

function App() {
  return (
    <div className="App">
      <h1>Mon Trello Clone</h1>
      {/* On appelle le composant ici pour l'afficher */}
      <UploadTrello />
    </div>
  );
}

export default App;