import { useState } from 'react';

function UploadTrello() {
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadToCloudinaryAndMongo = async () => {
    if (!image) return alert("Sélectionne d'abord une image !");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET_PHOTO);// Le preset Cloudinary

    try {
      // --- ÉTAPE 1 : ENVOI À CLOUDINARY ---

    const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, 
    { method: "POST", body: formData }
    );

      const data = await response.json();
      const linkCloudinary = data.secure_url;

      console.log("Image stockée sur Cloudinary :", linkCloudinary);

      // --- ÉTAPE 2 : ENVOI À TON SERVEUR MONGODB ---
      await fetch("http://localhost:5000/api/photos", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: image.name,        
          imageUrl: linkCloudinary, 
          type: "photo"             
        }),
      });

      alert("Succès ! L'image est sur Cloudinary et le lien est dans MongoDB.");

    } catch (error) {
      console.error("Erreur globale :", error);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>Ajouter un fond Trello</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadToCloudinaryAndMongo}>
        Lancer l'Upload Total
      </button>
    </div>
  );
}

export default UploadTrello;