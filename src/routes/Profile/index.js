import React from 'react';
import "./styles.css";

import BannerComponent from '../../components/Profile/Banner';
import DetailComponent from '../../components/Profile/Detail';
// import CustomCarousel from '../../components/CustomCarousel';
import Reviews from '../../components/Profile/Reviews';
import Comments from '../../components/Profile/Comments';

import banner from '../../assets/images/profile/banner-profile.png';

function Profile() {

	const userData = {
		id: 1,
		name: "Usuário Teste",
		rating: 5.89,
		reviews: 128,
		avatar: 'https://picsum.photos/300/300',
		highlight: true,
		bio: "Os condomínios hoje em dia são como empresas, então ter um profissional competente cuidando do seu imóvel é essencial para o bom funcionamento deste. Sou um profissional competente, empenhado, sério e extremamente engajado com meus condomínios. Tenho certificação em diversas áreas como Economia, Direito, Administração e Contabilidade. Me sinto capaz de gerir diversos condomínios. Mande agora uma proposta e vamos conversar! Os condomínios hoje em dia são como empresas, então ter um profissional competente cuidando do seu imóvel é essencial para o bom funcionamento deste. Sou um profissional competente, empenhado, sério e extremamente engajado com meus condomínios. Tenho certificação em diversas áreas como Economia, Direito, Administração e Contabilidade. Me sinto capaz de gerir diversos condomínios. Mande agora uma proposta e vamos conversar! Os condomínios hoje em dia são como empresas, então ter um profissional competente cuidando do seu imóvel é essencial para o bom funcionamento deste. Sou um profissional competente, empenhado, sério e extremamente engajado com meus condomínios. Tenho certificação em diversas áreas como Economia, Direito, Administração e Contabilidade. Me sinto capaz de gerir diversos condomínios. Mande agora uma proposta e vamos conversar!"
	}

	return (
		<div className='home-container column-centered shadow-default'>

			<BannerComponent bannerImg={banner} />
			<DetailComponent userData={userData} />

			{/* future feature */}
			{/* <CustomCarousel title={"Portfólio"} items={portfolio}/> */}
			{/* <CustomCarousel title={"Certificados"} items={certificates}/> */}

			<Reviews />
			<Comments/>

		</div>
	);
}

export default Profile;