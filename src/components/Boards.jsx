
import Header from './Header';
import { Link } from "react-router-dom";
import capture from '../assets/capture.png'
import firsttest from '../assets/firsttest.jpg'
import './Boards.css'

// 1. On crée le composant Layout (le squelette)
function Layout({ children }) {
  return (
    <div className="trello-app">
      <nav>
        <Header />
      </nav>
      
      <main>
        {/* C'est ici que le contenu de la page sera injecté */}
        {children}
      </main>
    </div>
  );
}

// 2. On utilise ce Layout dans nos pages
function Boards() {
  return (
    <Layout>
        <div className='home-container'>
                    <div className='sidebar-left'>
                            <Link to="/boards">
                                <button className='btn-sidebar'>
                                    <i></i>
                                    <span>Tableaux</span>
                                </button>
                            </Link>
                            <Link to="/templates">
                                <button className='btn-sidebar'>
                                    <i></i>
                                    <span>Modeles</span>
                                </button>
                            </Link>
                            <Link to="/">
                                <button className='btn-sidebar'>
                                    <i></i>
                                    <span>Acceuil</span>
                                </button>
                            </Link>
                            <hr />
                            <h3>Espaces de travail</h3>
        
                            <div class="sidebar">
                                <div className='container-combox'>
                                    <div className='logo-e'>
                                        <span>E</span>
                                    </div>
                                    <div className=''>
                                        <p>Espaces de travail de Safari<br /> BEZARA</p>
                                    </div>
                                </div>
        
                                <ul class="sidebar-menu">
                                    <li class="btn-sidebar"><i class="icon">🗂️</i> Tableaux</li>
                                    <li class="btn-sidebar"><i class="icon">👥</i> Membres <span class="plus">+</span></li>
                                    <li class="btn-sidebar"><i class="icon">⚙️</i> Paramètres</li>
                                </ul>
        
                                <div class="premium-card">
                                    <h3>Essayez Trello Premium</h3>
                                    <p>Profitez du Planificateur, de la mise en miroir des cartes, et bien d'autres avantages !</p>
                                    <a href="#" class="btn-trial">Commencer l'essai gratuit</a>
                                </div>
                                </div>
        
                        </div>
        
                        <div className='main-center'>
                            <div className='container-fond'>
                                <img src={capture} className="fond home" alt="fond Home" />
                            </div>
                            <div className='container-text'>
                                <h1>Restez sur la bonne voie et à jour</h1>
                                <p>
                                    Invitez des personnes à rejoindre des tableaux et des cartes, laissez des <br />
                                    commentaires, ajoutez des dates limites et consultez l'activité la plus <br />
                                    importante ici.
                                </p>
                            </div>
                        </div>
        
                        <div className='sidebar-right'>
                            <button className='btn-boards'><i class='bx  bx-table'></i>Tableaux</button>
                            <button className='btn-boards'><i class='bx  bx-user'></i> Membres</button>
                            <button className='btn-boards'><i class='bx  bx-cog'></i> Parametres</button>
                            <button className='btn-buy'><button className='btn-icon-buy'><i class='bx  bx-briefcase-alt'></i></button>Acheter</button>
                        </div> 
                </div> 
    </Layout>
  );
}
export default Boards