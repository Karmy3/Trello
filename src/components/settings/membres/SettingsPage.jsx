import React from 'react';
import { useState } from 'react';
import InviteModal from './InviteModal';
import { 
  User, Activity, CreditCard, Settings, 
  Layout, Users, ExternalLink, X 
} from 'lucide-react';


const SettingsPage = () => {

  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-700">
      {/* Sidebar Gauche */}
      <aside className="w
      ,-64 border-r border-gray-200 p-4 bg-gray-50/50">
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Paramètres personnels</h3>
          <nav className="space-y-1">
            <SidebarItem icon={<User size={18}/>} label="Profil et visibilité" />
            <SidebarItem icon={<Activity size={18}/>} label="Activité" />
            <SidebarItem icon={<CreditCard size={18}/>} label="Cartes" />
            <SidebarItem icon={<Settings size={18}/>} label="Paramètres" />
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Espace de travail</h3>
          <nav className="space-y-1">
            <div className="flex items-center p-2 text-sm font-medium">
              <span className="bg-blue-600 text-white w-5 h-5 rounded flex items-center justify-center mr-2 text-[10px]">E</span>
              Espace de travail de Safari B...
            </div>
            <SidebarItem icon={<Layout size={18}/>} label="Tableaux" />
            <SidebarItem icon={<Users size={18}/>} label="Membres" active />
            <SidebarItem icon={<Settings size={18}/>} label="Paramètres" />
            <SidebarItem icon={<CreditCard size={18}/>} label="Mettre à niveau l'espace de travail" />
          </nav>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <span className="text-[10px] border border-gray-300 px-1 rounded font-bold text-gray-500 uppercase">Gratuit</span>
        </div>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 p-8 max-w-4xl relative">
        <button className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
          <X size={20} className="text-gray-500" />
        </button>

        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            Collaborateurs <span className="text-sm font-normal bg-gray-200 px-2 py-0.5 rounded-full">1 / 10</span>
          </h1>

          <div className="p-8">
            <button 
              onClick={() => setModalOpen(true)}
              className="bg-[#0052cc] hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2">
              <Users size={16} /> Inviter des membres dans l'espace de travail
            </button>
            <InviteModal 
              isOpen={isModalOpen} 
              onClose={() => setModalOpen(false)} 
            />
          </div>

        </header>

        <div className="flex gap-8">
          {/* Sous-navigation Gauche */}
          <div className="w-48 shrink-0">
            <div className="bg-blue-50 text-blue-700 p-2 rounded text-sm font-medium mb-1">
              Membres de l'espace de travail (1)
            </div>
            <div className="p-2 text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
              Invités (0)
            </div>
            <hr className="my-4" />
            <div className="p-2 text-sm text-gray-600">Demandes d'ajout (0)</div>
            
            {/* Bannière Violette */}
            <div className="mt-8 bg-[#6e5dc6] text-white p-4 rounded-lg relative overflow-hidden">
              <h4 className="font-bold text-sm mb-2 leading-tight">Passez à la version payante pour plus de commandes relatives aux permissions</h4>
              <p className="text-xs opacity-90 mb-4">Décidez des personnes qui peuvent envoyer des invitations, modifiez les paramètres des espaces de travail et plus encore avec Premium.</p>
              <button className="text-xs underline font-medium">En savoir plus</button>
              <div className="absolute -bottom-2 -right-2 opacity-20 transform rotate-12">
                <Layout size={60} />
              </div>
            </div>
          </div>

          {/* Liste et Invitations */}
          <div className="flex-1">
            <section className="mb-8">
              <h2 className="font-bold mb-2">Membres de l'espace de travail (1)</h2>
              <p className="text-sm text-gray-600 leading-relaxed border-b pb-4">
                Les membres d'espaces de travail peuvent consulter et rejoindre tous les tableaux visibles par les membres d'un espace de travail et peuvent créer de nouveaux tableaux au sein de l'espace de travail.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-bold mb-2">Inviter les membres à vous rejoindre</h2>
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                  Toutes les personnes qui possèdent un lien d'invitation peuvent rejoindre cet espace de travail gratuit. Vous pouvez également désactiver un lien et en créer un nouveau pour cet espace de travail à tout moment. Les invitations en attente comptent pour la limite de 10 collaborateurs.
                </p>
                <div className="flex gap-2">
                  <button className="text-sm text-gray-700 hover:underline">Désactiver le lien d'invitation</button>
                  <button className="bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-1.5 rounded flex items-center gap-2 text-sm font-medium">
                    <ExternalLink size={14} /> Inviter avec un lien
                  </button>
                </div>
              </div>
            </section>

            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Filtrer par nom" 
                className="border border-gray-300 p-2 rounded w-64 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Liste des membres */}
            <div className="flex items-center justify-between py-4 border-t">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">SB</div>
                <div>
                  <div className="font-bold text-sm">Safari BEZARA</div>
                  <div className="text-xs text-gray-500">@safaribezara • Dernière activité le January 2026</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-sm bg-gray-50 px-3 py-1 rounded border border-gray-200">Voir les tableaux (3)</button>
                <button className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded cursor-not-allowed flex items-center gap-1">
                  Administrateur <span className="text-[10px]">?</span>
                </button>
                <button className="text-sm bg-gray-100 px-3 py-1 rounded border border-gray-200 flex items-center gap-1">
                  <X size={14} /> Quitter...
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-2 p-2 rounded text-sm cursor-pointer transition-colors ${active ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}>
    {icon}
    <span className={active ? "font-semibold" : ""}>{label}</span>
  </div>
);

export default SettingsPage;