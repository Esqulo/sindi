import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import Logo from "../../assets/logo-with-name.png";

import Api from "../../Api";

function Banner(){

    const navigate = useNavigate();

    // const [openDropdown, setOpenDropdown] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedDropdown, setloggedDropdown] = useState(false);

    // const toggleDropdown = (menu) => {
    //   setOpenDropdown((prev) => (prev === menu ? null : menu));
    // };

    async function handleLogOut (){
        try{
            let apiResponse = await Api.logout();
            if(!apiResponse) throw new Error ("erro ao efetura requisição");
            setIsLoggedIn(false)
            localStorage.removeItem('token');
            navigate("/");
        }catch(err){
            alert(err.message || "algo deu errado, por favor tente novamente")
        }
    }

    useEffect(()=>{
        let token = localStorage.getItem("token");
        if (token) setIsLoggedIn(true);
    },[isLoggedIn]);

    return(
        <div className="mainheader-container">
            <div className="mainheader-contents">
                <img src={Logo} className="mainheader-logo" alt="Logo" onClick={() => {navigate("/")}}/>
                {/* <div className="mainheader-option-container">
                    
                    <a href="/"><div className="mainheader-item">Início</div></a>

                    <div className="mainheader-item" onClick={() => toggleDropdown("services")}>
                        Conheça a Sindi
                        <div className={`mainheader-dropdown ${ openDropdown === "services" ? "show" : ""}`}>
                            <div className="mainheader-dropdown-item">Sobre a Sindi</div>
                            <div className="mainheader-dropdown-item">Contratações</div>
                            <div className="mainheader-dropdown-item">Pagamentos</div>
                        </div>
                    </div>

                    <div className="mainheader-item">É síndico? Anuncie seus serviços na Sindi</div>

                </div> */}
                <div className="mainheader-account-container">
                    {!isLoggedIn &&
                        <div className="logged-out">
                            <button className="mainheader-account-sign clickable" onClick={() => {navigate("signup")}}>Criar conta</button>
                            <button className="mainheader-account-log clickable" onClick={() => {navigate("login")}}>Entrar</button>
                        </div>
                    }
                    {isLoggedIn && 
                        <div className="logged-in">
                            <button className="logged-in-menu" onClick={() => {setloggedDropdown(!loggedDropdown)}}>
                                <span className="material-symbols-outlined icon">menu</span>
                                {loggedDropdown &&
                                    <ul className="logged-in-menu-options">
                                        <li onClick={() => navigate("profile")}><span className="material-symbols-outlined icon">person</span><label>Meu Perfil</label></li>
                                        <li onClick={() => navigate("chat")}><span className="material-symbols-outlined icon">chat</span><label>Chat</label></li>
                                        <li onClick={() => navigate("deals")}><span className="material-symbols-outlined icon">handshake</span><label>Propostas</label></li>
                                        <li onClick={() => navigate("settings")}><span className="material-symbols-outlined icon">settings</span><label>Configurações</label></li>
                                        <li onClick={handleLogOut}><span className="material-symbols-outlined icon">logout</span><label>Sair</label></li>
                                    </ul>
                                }
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Banner;