import './CreateBoards.css'

function Header(){
    retur(
        <div className="modal">
            <div className="fond-ecran"></div>
            
            <label htmlFor="">Fond d'ecran</label>
            <div className="container-style">
                <div className="nav-photo">
                    <div className="bloc-photo"></div>
                    <li></li>
                </div>
                <div className="nav-color">
                    <div className="bloc-color"></div>
                    <li></li>
                </div>
            </div>

            <label htmlFor="">Titre du tableau</label>
            <input type="text" name="" id="" />
            <label htmlFor="">Visibilite</label>
            <input type="text" name="" id="" />

            <button>Creer</button>
        </div>
    );
}
 Header;

function FondEcranTableau(){
    return(
        <div></div>
    );
}
export default FondEcranTableau;