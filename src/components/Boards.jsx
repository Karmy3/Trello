
import Header from './Header';
import { Link } from "react-router-dom";

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
        <div>
                    <Link to="/boards">
                        <div>
                            <p>Tableaux </p>
                        </div>
                    </Link>
                    <Link to="/templates">
                        <div>
                            <p>Modeles</p>
                        </div>
                    </Link>
                    <Link to="/">
                        <div>
                            <p>Acceuil</p>
                        </div>
                    </Link>

                    <hr />

                    <h3>Espaces de travail</h3>

                    <div>
                        <div>
                            <i>E</i>
                        </div>
                        <div>
                            <p>Espaces de travail de</p>
                            <p>Safari BEZARA</p>
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <img src="" alt="" />
                    </div>
                    <div>
                        <h1>Restez sur la bonne voie et à jour</h1>
                        <p>
                            Invitez des personnes à rejoindre des tableaux et des cartes, laissez des <br />
                            commentaires, ajoutez des dates limites et consultez l'activité la plus <br />
                            importante ici.
                        </p>
                    </div>
                </div>

                <div>
                    <div>
                        <div>
                            <i className='bx  bx-clock'></i> 
                            <p>Recement consultes</p>
                            <div>
                                <img src="" alt="" />
                                <div>
                                    <p>first test</p>
                                    <p>Espace de travail de Safari BEZARA</p>
                                </div>
                                <i className='bx  bx-star'></i> 
                            </div>
                        </div>
                        <div>
                            <p>Liens</p>
                            <div>
                                <div>
                                    <i className='bx  bx-plus'></i>       
                                </div>
                                <p>Creer un tableau</p>
                            </div>
                        </div>
                    </div>
                </div>
    </Layout>
  );
}
export default Boards