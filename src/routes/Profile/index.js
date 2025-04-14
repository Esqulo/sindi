import React from 'react';
import "./styles.css";

import BannerComponent from '../../components/Profile/Banner';
import DetailComponent from '../../components/Profile/Detail';
import CustomCarousel from '../../components/CustomCarousel';

import banner from '../../assets/images/profile/banner-profile.png';
import certificate from '../../assets/images/profile/portfolio/certificate.jpg';
import portfolio_img from '../../assets/images/profile/portfolio/img001.jpg';

function Profile() {

	const usuario = {
		id: 1,
		name: "Usuário Teste",
		rating: 5.89,
		reviews: 128,
		avatar: 'https://picsum.photos/300/300',
		highlight: true,
		bio: "Os condomínios hoje em dia são como empresas, então ter um profissional competente cuidando do seu imóvel é essencial para o bom funcionamento deste. Sou um profissional competente, empenhado, sério e extremamente engajado com meus condomínios. Tenho certificação em diversas áreas como Economia, Direito, Administração e Contabilidade. Me sinto capaz de gerir diversos condomínios. Mande agora uma proposta e vamos conversar! Os condomínios hoje em dia são como empresas, então ter um profissional competente cuidando do seu imóvel é essencial para o bom funcionamento deste. Sou um profissional competente, empenhado, sério e extremamente engajado com meus condomínios. Tenho certificação em diversas áreas como Economia, Direito, Administração e Contabilidade. Me sinto capaz de gerir diversos condomínios. Mande agora uma proposta e vamos conversar! Os condomínios hoje em dia são como empresas, então ter um profissional competente cuidando do seu imóvel é essencial para o bom funcionamento deste. Sou um profissional competente, empenhado, sério e extremamente engajado com meus condomínios. Tenho certificação em diversas áreas como Economia, Direito, Administração e Contabilidade. Me sinto capaz de gerir diversos condomínios. Mande agora uma proposta e vamos conversar!"
	}

	const certificates = [
		{ certificate_id: 1, image: certificate, name: "Certificado 1" },
		{ certificate_id: 2, image: certificate, name: "Certificado 2" },
		{ certificate_id: 3, image: certificate, name: "Certificado 3" },
		{ certificate_id: 4, image: certificate, name: "Certificado 4" },
		{ certificate_id: 5, image: certificate, name: "Certificado 5" },
	];

	const portfolio = [
		{ certificate_id: 1, image: portfolio_img, name: "Certificado 1" },
		{ certificate_id: 2, image: portfolio_img, name: "Certificado 2" },
		{ certificate_id: 3, image: portfolio_img, name: "Certificado 3" },
		{ certificate_id: 4, image: portfolio_img, name: "Certificado 4" },
		{ certificate_id: 5, image: portfolio_img, name: "Certificado 5" },
		{ certificate_id: 6, image: portfolio_img, name: "Certificado 6" },
		{ certificate_id: 7, image: portfolio_img, name: "Certificado 7" },
		{ certificate_id: 8, image: portfolio_img, name: "Certificado 8" },
		{ certificate_id: 9, image: portfolio_img, name: "Certificado 9" },
		{ certificate_id: 10, image: portfolio_img, name: "Certificado 10" },
	];

	return (
		<div className='home-container column-centered shadow-default'>

			<BannerComponent bannerImg={banner} />
			<DetailComponent userData={usuario} />

			<CustomCarousel title={"Portfólio"} items={portfolio}/>
			<CustomCarousel title={"Certificados"} items={certificates}/>
			
			{/* <Reviews /> */}
			{/* <Similar /> */}
			{/* <Comments/> */}

		</div>
	);
}

export default Profile;