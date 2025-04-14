import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import "./styles.css";

import BannerComponent from '../../components/Profile/Banner';
import DetailComponent from '../../components/Profile/Detail';
import CustomCarouselServices from '../../components/CustomCarouselServices';
// import CustomCarousel from '../../components/CustomCarousel';
import Ratings from '../../components/Profile/Ratings';
import Comments from '../../components/Profile/Comments';

import banner from '../../assets/images/profile/banner-profile.png';

import Api from '../../Api';

function Profile() {

	const { user_id } = useParams();

	const [userData, setUserData] = useState({});

	useEffect(()=>{
		async function getUserData() {
			let apiResponse = await Api.getUserProfile(user_id);
			setUserData(apiResponse);
		}
		getUserData();
	},[user_id]);

	return (
		<div className='home-container column-centered shadow-default'>

			<BannerComponent bannerImg={banner} />
			<DetailComponent userData={userData} />

			<CustomCarouselServices title={"Serviços"} items={userData.services}/>
			{/* future feature */}
			{/* <CustomCarousel title={"Portfólio"} items={portfolio}/> */}
			{/* <CustomCarousel title={"Certificados"} items={certificates}/> */}
			{/* <Ratings /> */}

			<Comments/>

		</div>
	);
}

export default Profile;