import React from 'react';
import "./styles.css";

import BannerComponent from '../../components/Profile/Banner';
import DetailComponent from '../../components/Profile/Detail';
import Portifolio from '../../components/Profile/Portfolio';
import Certificates from '../../components/Profile/Certificates';
import Reviews from '../../components/Profile/Reviews';
import Similar from '../../components/Profile/Similar';
import Comments from '../../components/Profile/Comments';
import { useLocation } from 'react-router-dom';

import banner from '../../assets/images/profile/banner-profile.png';
import certificate from '../../assets/images/profile/portfolio/certificate.jpg';
import portfolio_img from '../../assets/images/profile/portfolio/img001.jpg';



function Profile(){
    const location = useLocation();
    const { id_user } = location.state || {}; //fazer a requisicao com esse ID

    const usuario = [
        { 
            id: 1, 
            name: "Usuário Teste", 
            stars: 5.89,
            bio: "Os condomínios hoje em dia são como empresas, então ter um profissional competente cuidando do seu imóvel é essencial para o bom funcionamento deste. Sou um profissional competente, empenhado, sério e extremamente engajado com meus condomínios. Tenho certificação em diversas áreas como Economia, Direito, Administração e Contabilidade. Me sinto capaz de gerir diversos condomínios. Mande agora uma proposta e vamos conversar!"
        },
      ];

      const certificates = [
        {certificate_id: 1, image: certificate, name: "Certificado 1"},
        {certificate_id: 2, image: certificate, name: "Certificado 2"},
        {certificate_id: 3, image: certificate, name: "Certificado 3"},
        {certificate_id: 4, image: certificate, name: "Certificado 4"},
        {certificate_id: 5, image: certificate, name: "Certificado 5"},
      ];
      
      const portfolio = [
        {certificate_id: 1, image: portfolio_img, name: "Certificado 1"},
        {certificate_id: 2, image: portfolio_img, name: "Certificado 2"},
        {certificate_id: 3, image: portfolio_img, name: "Certificado 3"},
        {certificate_id: 4, image: portfolio_img, name: "Certificado 4"},
        {certificate_id: 5, image: portfolio_img, name: "Certificado 5"},
      ];

    return (
        <div className='home-container'>
            {/* <BannerComponent/> */}
            <BannerComponent bannerImg={banner}/>

             {/* passei somente o id para teste, mas quando fizer a requisicao irá passar o array */} 
            <DetailComponent userData={usuario} /> 
            <Portifolio portfolioItems={portfolio} />
            <Certificates certificatesItems={certificates}/>
            <Reviews/>
            <Similar/>
            {/* <Comments/> */}
        </div>
    );
}

export default Profile;