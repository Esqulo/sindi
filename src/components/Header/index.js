import React, { useState } from "react";
import "./styles.css";
import Logo from "../../assets/logo-with-name.png";

function Banner(){
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (menu) => {
      setOpenDropdown((prev) => (prev === menu ? null : menu));
    };

    return(
        <div className="mainheader-container">
            <div className="mainheader-contents">
                <img src={Logo} className="mainheader-logo" alt="Logo"/>
                <div className="mainheader-option-container">
                    
                    <div className="mainheader-item">Início</div>

                    <div className="mainheader-item" onClick={() => toggleDropdown("services")}>
                        Conheça a Sindi
                        <div className={`mainheader-dropdown ${ openDropdown === "services" ? "show" : ""}`}>
                            <div className="mainheader-dropdown-item">Sobre a Sindi</div>
                            <div className="mainheader-dropdown-item">Contratações</div>
                            <div className="mainheader-dropdown-item">Pagamentos</div>
                        </div>
                    </div>

                    <div className="mainheader-item">É síndico? Anuncie seus serviços na Sindi</div>

                </div>
                <div className="mainheader-account-container">
                    <button className="mainheader-account-sign" onClick={() => {window.location.href = "/signup"}}>Criar conta</button>
                    <button className="mainheader-account-log" onClick={() => {window.location.href = "/login"}}>Entrar</button>
                </div>
            </div>
        </div>
    )
}

export default Banner;