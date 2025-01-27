import React from "react";
import "./styles.css";

import CustomImgComponent from "../CustomImgComponent";

import Logo from "../../assets/logo-with-name-white.png";


function Footer() {
  return (
    <footer className="column-centered">
        <div className="footer-columns-container row-centered">
          <div className="footer-column column-centered">
            <CustomImgComponent img={Logo} width="206px" height="65px" style={{alignSelf: 'start'}}/>
            <ul className="footer-list">
              <a href="/policy"><li>Politica de privacidade</li></a>
              <a href="/"><li>Novos recursos</li></a>
              <a href="/"><li>Blog</li></a>
              <a href="/"><li>Newsletter</li></a>
              <a href="/"><li>Informações da empresa</li></a>
            </ul>
          </div>
          <div className="footer-column column-centered">
            <span className="footer-column-header">Atendimento</span>
            <ul className="footer-list">
              <a href="/"><li>Central de ajuda</li></a>
              <a href="/"><li>Antidiscriminação</li></a>
              <a href="/"><li>Apoio à pessoa com deficiência</li></a>
              <a href="/"><li>Reporte um problema</li></a>
            </ul>
          </div>
          <div className="footer-column column-centered">
            <span className="footer-column-header">Como funciona</span>
            <ul className="footer-list">
              <a href="/"><li>Anuncie seus serviços na Sindi</li></a>
              <a href="/"><li>Recursos para condominios</li></a>
              <a href="/"><li>Como contratar um síndico</li></a>
              <a href="/"><li>Consultorias</li></a>
            </ul>
          </div>
        </div>
        <div className="footer-copyrigth-container row-centered">
          <span>© 2025. Todos os direitos reservados</span>
          <span>Desenvolvido por Sindi.</span>
        </div>
    </footer>
  );
}

export default Footer;