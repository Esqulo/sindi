import React from "react";
import './styles.css';

import bannerImage from "../../assets/images/home_banner.jpg";

export default function Index(){

    //on start check for token and send to /home if necessary

    const bannerBackground = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImage})`;

    return (
        <div className="index_container">
            <div className="index_bannner_container" style={{backgroundImage: bannerBackground}}>
                <div className="banner_text">
                    <span className="highlight_text">Com a <b>Sindi</b>, conectar  síndicos e condomínios ficou <b>muito</b> mais fácil</span>
                    <span className="description_text">Cadastre-se e tenha acesso direto a síndicos experientes ou ofereça seus serviços com visibilidade, credibilidade e segurança.</span>
                </div>
            </div>
        </div>
    )
}