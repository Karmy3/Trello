import { useState } from 'react';

function UploadTrello() {
  const [image, setImage] = useState(null);

  // On récupère les variables Vite
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET_PHOTO;

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadToCloudinaryAndMongo = async () => {
    if (!image) return alert("Sélectionne d'abord une image !");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", uploadPreset);

    try {
      // --- ÉTAPE 1 : ENVOI À CLOUDINARY ---
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
        { method: "POST", body: formData }
      );

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error("Erreur lors de l'upload vers Cloudinary");
      }

      const linkCloudinary = data.secure_url;
      console.log("Image sur Cloudinary :", linkCloudinary);

      // --- ÉTAPE 2 : ENVOI À  SERVEUR NODE/MONGODB ---
      const mongoResponse = await fetch("http://localhost:5000/api/background_boards_photos", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: image.name,        
          imageUrl: linkCloudinary, 
          type: "photo"             
        }),
      });

      if (mongoResponse.ok) {
        alert("Succès ! Image sauvegardée partout.");
      }

    } catch (error) {
      console.error("Erreur globale :", error);
      alert("Une erreur est survenue lors de l'envoi.");
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Ajouter un fond Trello</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadToCloudinaryAndMongo} style={{ marginTop: '10px', cursor: 'pointer' }}>
        Lancer l'Upload Total
      </button>
    </div>
  );
}

export default UploadTrello;