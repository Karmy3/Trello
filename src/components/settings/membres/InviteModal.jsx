import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InviteModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]); // Liste des utilisateurs trouvés
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Simulation d'une recherche
  useEffect(() => {
    if (search.length > 1) {
      fetch(`http://localhost:5000/api/users?search=${search}`)
        .then(res => res.json())
        .then(data => setUsers(data));
    } else {
      setUsers([]);
    }
  }, [search]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          {/* Conteneur de la Modale */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-[#22272b] text-[#b6c2cf] rounded-xl shadow-2xl border border-[#384148] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#384148]">
              <h2 className="text-xl font-semibold">Inviter dans l'espace de travail</h2>
              <button onClick={onClose} className="hover:bg-[#384148] p-1 rounded-md transition-colors">
                <i className='bx bx-x text-2xl'></i>
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Adresse e-mail ou nom"
                  className="w-full bg-[#1d2125] border border-[#384148] rounded-md p-2.5 outline-none focus:border-[#579dff] transition-all text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <button className="absolute right-2 top-1.5 bg-[#579dff] hover:bg-[#85b8ff] text-[#1d2125] font-bold py-1 px-4 rounded transition-colors text-sm">
                  Inviter
                </button>
              </div>

              <p className="text-xs text-[#9fadbc]">
                Invitez quelqu'un à cet espace de travail grâce à un lien : 
                <span className="text-[#579dff] cursor-pointer hover:underline ml-1">Désactiver le lien</span>
              </p>

              {/* Liste des résultats de recherche */}
              {users.length > 0 && (
                <div className="mt-4 bg-[#1d2125] rounded-md border border-[#384148] max-h-40 overflow-y-auto">
                  {users.map(u => (
                    <div key={u._id} className="flex items-center p-2 hover:bg-[#384148] cursor-pointer transition-colors">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3 text-xs font-bold">
                        {u.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col text-sm">
                        <span>{u.username}</span>
                        <span className="text-xs text-[#9fadbc]">{u.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Section Membres Invités */}
              <div className="mt-6 pt-4 border-t border-[#384148]">
                <h3 className="text-sm font-bold mb-3">Membres invités</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center">
                      <img src="https://via.placeholder.com/32" className="w-8 h-8 rounded-full mr-3" alt="avatar" />
                      <div className="text-sm">
                        <p className="font-medium text-[#b6c2cf]">Karl L.</p>
                        <p className="text-xs text-[#9fadbc]">Ne s'est pas connecté récemment</p>
                      </div>
                    </div>
                    <button className="text-xs bg-[#384148] hover:bg-[#454f59] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Copier le lien
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Toast local */}
            <div className="p-2 bg-[#1d2125] flex justify-center">
               <div className="bg-[#1f845a] text-white text-xs py-1 px-3 rounded-md flex items-center">
                  <i className='bx bx-check-circle mr-2'></i> Lien copié !
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InviteModal;