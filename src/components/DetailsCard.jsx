import Header from './Header';
import './DetailsCard.css'
import firsttest from '../assets/firsttest.jpg'

function Layout({ children }) {
  return (
    <div className="trello-app">
      <Header />  
      <main>
        {children}
      </main>
    </div>
  );
}

function DetailsCard(){
    return(
       <Layout>
        <div 
            className='details-main'
            style={{ backgroundImage: `url(${firsttest})`}}
        >
            <div className="header-details">
                <div className="nav-right">
                    <div className="btn-title-card">first test</div>
                    <div className="btn-vue">
                        <i class='bx  bx-caret-down'></i> 
                        <i class='bx  bx-caret-down'></i>
                    </div>
                </div>
                <div className="nav-left">
                    <div className="container-profil"></div>
                    <div className="btn-icon-details"><i class='bx  bx-rocket'></i> </div>
                    <div className="btn-icon-details"><i class="bx bx-bot"/></div>
                    <div className="btn-icon-details"><i class='bx  bx-menu'></i> </div>
                    <div className="btn-icon-details"><i class='bx  bx-star'></i> </div>
                    <div className="btn-icon-details"><i class='bx  bx-lock'></i> </div>
                    <div className="btn-action">
                        <i class='bx  bx-user-plus bx-flip-horizontal'></i> 
                        <span>Partager</span>
                    </div>
                    <div className="btn-icon-details"><i class='bx  bx-dots-horizontal-rounded'></i></div>
                </div>
            </div>
            
            <div className="container-global">
                <div className="container-start">
                    <div className="container-type-one">
                        <div className="first-container">
                            <div className="btn-working">A faire</div>
                            <div className="btn-icon-list"><i class='bx  bx-plus'></i> </div>
                            <div className="btn-icon-list"><i class='bx  bx-dots-horizontal-rounded'></i></div>
                        </div>
                        <div className="second-container">
                            <div className="nav-text">
                                <div className="btn-check"><i class='bx  bx-check'></i> </div>
                                <div className="text-check">
                                    <span>Analyse des reseaux en marche</span>
                                    <div className="btn-icon"> <i class='bx  bx-archive-alt'></i></div>
                                    <div className="btn-icon"> <i class='bx  bx-edit'></i></div>
                                </div> 
                            </div>
                            <div className="container-timer">
                                <div className="btn-check"><i class='bx  bx-timer'></i> </div>
                                <div className="text-diedlilne">25 dec.</div>
                            </div>
                        </div>
                        <div className="thrirst-container">
                            <div className="btn-sidebar">
                                <i class='bx  bx-plus'></i> 
                                <span>Ajouter une carte</span>
                            </div>
                            <div className="btn-icon-list"><i class='bx  bx-images'></i> </div>
                        </div>
                    </div>

                    <div className="container-type-one">
                        <div className="first-container">
                            <div className="btn-working">Au cours</div>
                            <div className="btn-icon-list"><i class='bx  bx-plus'></i> </div>
                            <div className="btn-icon-list"><i class='bx  bx-dots-horizontal-rounded'></i></div>
                        </div>
                        <div className="thrirst-container">
                            <div className="btn-sidebar">
                                <i class='bx  bx-plus'></i> 
                                <span>Ajouter une carte</span>
                            </div>
                            <div className="btn-icon-list"><i class='bx  bx-images'></i> </div>
                        </div>
                    </div>

                    <div className="container-type-one">
                        <div className="first-container">
                            <div className="btn-working">Termine</div>
                            <div className="btn-icon-list"><i class='bx  bx-plus'></i> </div>
                            <div className="btn-icon-list"><i class='bx  bx-dots-horizontal-rounded'></i></div>
                        </div>
                        <div className="thrirst-container">
                            <div className="btn-sidebar">
                                <i class='bx  bx-plus'></i> 
                                <span>Ajouter une carte</span>
                            </div>
                            <div className="btn-icon-list"><i class='bx  bx-images'></i> </div>
                        </div>
                    </div>

                    <div className="container-type-two">
                        <div className="btn-title-card">
                            <i class='bx  bx-plus'></i> 
                            <span>Ajouter une autre list</span>
                        </div>
                    </div>

                </div>

                <div className="container-end">
                    <li className='btn-end'><i class='bx  bx-box'></i> Boite de reception</li>
                    <li className='btn-end'><i class='bx  bx-calendar-minus'></i> Agenda</li>
                    <li className='btn-end'><i class='bx  bx-table'></i> Tableau</li>
                    <li className='btn-end'><i class='bx  bx-windows'></i> Changer de tableau</li>
                </div>

          </div>
        </div>
       </Layout>
    );
}
export default DetailsCard