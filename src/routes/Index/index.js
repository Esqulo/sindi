import React from "react";
import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import './styles.css';

import Laptop from "../../components/Laptop";
import SocialMediaIcons from "../../components/Newsletter/SocialMediaIcons"

import bannerImage from "../../assets/images/home_banner.jpg";
import handshakeIcon from "../../assets/images/landing_page/handshake_icon.png";
import helpIcon from "../../assets/images/landing_page/help_icon.png";
import securityIcon from "../../assets/images/landing_page/security_icon.png";

export default function Index(){

    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token) return;
        navigate("/home")
    },[navigate])

    const bannerBackground = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerImage})`;

    const laptopItems = [
        {type: "embed", media: "https://www.youtube.com/embed/z70XJKqV-pM?si=BY5Xfbkzgy-d9geu&amp;controls=0;"},
    ];

    return (
        <div className="index_container column-centered">
            <div className="index_bannner_container" style={{backgroundImage: bannerBackground}}>
                <div className="banner_text">
                    <span className="banner_highlight_text">Com a <b>Sindi</b>, conectar  síndicos e condomínios ficou <b>muito</b> mais fácil</span>
                    <span className="banner_description_text">Cadastre-se e tenha acesso direto a síndicos experientes ou ofereça seus serviços com visibilidade, credibilidade e segurança.</span>
                </div>
            </div>
            <div className="index_content column-centered">
                <div className="index_highlight_text tight text-center short">
                    Entenda em poucos minutos como a Sindi funciona para síndicos e condomínios.
                </div>
                <div className="index_laptop">
                    <Laptop content={laptopItems} time={10000}/>
                </div>
                <div className="index_block column-centered">
                    <div className="index_paragraph font-medium tight">
                        <b>Cansado de correr atrás de clientes e não obter os resultados desejados? Está com dificuldades de ser visto no mercado condominial? Não consegue se destacar na região?</b>
                    </div>
                    <div className="index_paragraph font-small">
                        <b>A Sindi está aqui para resolver esses problemas.</b> Nossa missão é tornar fácil e sem complicações a conexão entre síndicos profissionais e condomínios, ajudando você a encontrar as melhores oportunidades quando e onde quiser.
                    </div>
                </div>
                <button className="index-sign_in"  onClick={() => {navigate("signup")}}>Cadastrar agora!</button>

                <div className="index_highlight_text text-center index-benefits-title">Por que ser parceiro da Sindi?</div>

                <div className="index-benefits-container">
                    <div className="index-benefits-item">
                        <img src={handshakeIcon} alt="handshake" className="index_benefits_image"/>
                        <span className="index-benefits-header">
                            Feche mais contratos
                        </span>
                        <span className="index-benefits-description">
                            Na plataforma, você é visto por milhares de condomínios todos os dias, aumentando suas chances de fechar contratos de forma rápida e fácil.
                        </span>
                    </div>
                    <div className="index-benefits-item">
                        <img src={helpIcon} alt="help" className="index_benefits_image"/>
                        <span className="index-benefits-header">
                            Precisa de ajuda?
                        </span>
                        <span className="index-benefits-description">
                            Aproveite os conteúdos gratuitos na plataforma ou solicite ajuda aos nossos consultores jurídicos e comerciais para te auxiliar.
                        </span>
                    </div>
                    <div className="index-benefits-item">
                        <img src={securityIcon} alt="security" className="index_benefits_image"/>
                        <span className="index-benefits-header">
                            Mais segurança para você
                        </span>
                        <span className="index-benefits-description">
                            Com diversas medidas de segurança e suporte especializado, você se sente mais seguro para ganhar dinheiro.
                        </span>
                    </div>
                </div>

                <div className="index_social_media_container">
                    <SocialMediaIcons/>
                </div>

            </div>
        </div>
    )
}