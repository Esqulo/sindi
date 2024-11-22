import React from "react";
import "./styles.css";

function LandingPageContent(){

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return(
        <div className="lpcontent-container">
            <p class="lpcontent-paragraph upper">
                <b>
                    Cansado de correr atrás de clientes e não obter os
                    resultados desejados? Está com dificuldade de ser visto
                    no mercado condominial? Não consegue se destacar na região?
                </b>
            </p>
            <p class="lpcontent-paragraph bottom">
                <b>A sindi está aqui para resolver esses problemas.</b> Nossa missão é
                tornar fácil e sem complicações a conexão entre síndicos
                profissionais e condomínios, ajudando você a encontrar as
                melhores oportunidades quando e onde quiser.
            </p>
            <button class="lpcontent-button" onClick={scrollToTop}>Não quero ficar de fora!</button>
            <span className="lpcontent-highlight">
                <b>Por que ser parceiro da Sindi?</b>
            </span>
            <div class="lpcontent-benefits-container">
                <div class="lpcontent-benefits-item">
                    <div id="handshakeIcon" class="lpcontent-benefits-image"/>
                    <span className="lpcontent-benefits-header">
                        Feche mais contratos
                    </span>
                    <span className="lpcontent-benefits-description">
                        Na plataforma, você é visto por milhares de condomínios todos os dias, aumentando suas chances de fechar contratos de forma rápida e fácil.
                    </span>
                </div>
                <div class="lpcontent-benefits-item">
                    <div id="helpIcon" class="lpcontent-benefits-image"/>
                    <span className="lpcontent-benefits-header">
                        Precisa de ajuda?
                    </span>
                    <span className="lpcontent-benefits-description">
                        Aproveite os conteúdos gratuitos na plataforma ou solicite ajuda aos nossos consultores jurídicos e comerciais para te auxiliar.
                    </span>
                </div>
                <div class="lpcontent-benefits-item">
                    <div id="securityIcon" class="lpcontent-benefits-image"/>
                    <span className="lpcontent-benefits-header">
                        Mais segurança para você
                    </span>
                    <span className="lpcontent-benefits-description">
                        Com diversas medidas de segurança e suporte especializado, você se sente mais seguro para ganhar dinheiro.
                    </span>
                </div>
            </div>
        </div>
    );
}

export default LandingPageContent;