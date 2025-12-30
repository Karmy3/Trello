import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateBoards.css';

function CreateBoards({ close }) {
    const [photos, setPhotos] = useState([]);
    const [colors, setColors] = useState([]);
    const [selectedBg, setSelectedBg] = useState("");

    useEffect(() => {
        // Fetch Photos (limité à 6)
        fetch("http://localhost:5000/api/background_boards_photos")
            .then(res => res.json())
            .then(data => {
                setPhotos(data.slice(0, 6));
                if(data.length > 0) setSelectedBg(data[0].imageUrl);
            });

        // Fetch Colors (limité à 4)
        fetch("http://localhost:5000/api/background_boards_colors")
            .then(res => res.json())
            .then(data => setColors(data.slice(0, 4)));
    }, []);


    const [title, setTitle] = useState("");
    const [visibility, setVisibility] = useState("");
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!title) return alert("Le titre est obligatoire");
        if (!visibility) return alert("L'espace de travail est obligatoire");

        const response = await fetch("http://localhost:5000/api/boards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title,
                background: selectedBg // C'est l'URL sélectionnée (photo ou couleur)
            })
        });

        if (response.ok) {
            const data = await response.json();
            close(); // Ferme la modale
            navigate(`/b/${data._id}`); // Redirige vers la page de détails
        }
    };

    return (
        <div className="modal-board">
            <div className="modal-header">
                <span>Créer un tableau</span>
                <button onClick={close} className="btn-close">x</button>
            </div>

            <div className="board-preview" style={{ 
                backgroundImage: selectedBg.includes('http') ? `url(${selectedBg})` : 'none',
                backgroundColor: !selectedBg.includes('http') ? selectedBg : 'transparent'
            }}>
                <img src="https://a.trellocdn.com/prgb/dist/images/board-preview-skeleton.14cda5dc635d1f13bc48.svg" alt="skeleton" />
            </div>

            <label className="label-title">Fond d'écran</label>
            
            <div className="selector-grid">
                {/* Section Photos (Affiche les 6 photos) */}
                <div className="nav-photo">
                    {photos.map(p => (
                        <div key={p._id} className="img-item" 
                            style={{ backgroundImage: `url(${p.imageUrl})` }}
                            onClick={() => setSelectedBg(p.imageUrl)} />
                    ))}
                </div>

                {/* Section Couleurs (Affiche les 4 couleurs) */}
                <div className="nav-color">
                    {colors.map(c => (
                        <div key={c._id} className="color-item" 
                            style={{ backgroundColor: c.imageUrl }}
                            onClick={() => setSelectedBg(c.imageUrl)} />
                    ))}
                    {/* Le petit bouton "..." à la fin */}
                    <div className="color-item more-item">...</div>
                </div>
            </div>

            <label className="label-title">Titre du tableau <span>*</span></label>
            <input 
                type="text" 
                className="input-title" 
                placeholder="Ajouter le titre du tableau" 
                onChange={(e) => setTitle(e.target.value)} 
            />

            <label className="label-title">Visibilité <span>*</span></label>
            <input 
                type="text" 
                className="input-visibility" 
                placeholder="Prive| Protected| Public" 
                onChange={(e) => setVisibility(e.target.value)} 
            />

            <button className="btn-submit" onClick={handleCreate} >Créer</button>
        </div>
    );
}

export default CreateBoards;