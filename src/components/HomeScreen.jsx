
import Header from './Header';
import { Link } from "react-router-dom";
import capture from '../assets/capture.png'
import firsttest from '../assets/firsttest.jpg'
import './HomeScreen.css'

// 1. On crée le composant Layout (le squelette)
function Layout({ children }) {
  return (
    <div className="trello-app">
      <Header />  
      <main>
        {/* C'est ici que le contenu de la page sera injecté */}
        {children}
      </main>
    </div>
  );
}

// 2. On utilise ce Layout dans nos pages
function Home() {
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
                    <div>
                        <div className='container-title'>
                            <div className="card-info">
                                <button className='btn-title'>
                                    <i className='bx bx-clock'></i> 
                                    <span>Recement consultes</span>
                                </button>
                            </div>

                            <div className='container-card'>
                                <div className="container-modele-right">
                                    <img src={firsttest} className="modele" alt="First Test" />
                                </div>
                                <div className='container-card-center'>
                                    <p>first test <br />Espace de travail de Safari BEZARA </p>
                                </div>
                                 <div className='container-icon-left'>
                                    <button className='btn-icon-list'>
                                        <i className='bx  bx-star'></i> 
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='nav-creation-boards'>
                            <p>Liens</p>
                            <div className='nav-link'>
                                <button className='btn-icon-list'>
                                    <i className='bx  bx-plus'></i> 
                                </button>
                                <p>Creer un tableau</p>
                            </div>
                        </div>
                    </div>
                </div> 
        </div> 
    </Layout>
  );
}

export default Home