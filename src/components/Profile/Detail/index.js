import React from 'react';

import noUserImage from "../../../assets/images/icons/no-image-profile.png";
import star from '../../../assets/images/profile/star.png';
import badge from '../../../assets/images/profile/badge.png';

import "./styles.css";

function DetailComponent({ userData }) {

	return (
		<div className='profile-detail-container'>

			<div className='profile-detail-avatar'>
				<img className='profile-details-avatar-image' src={userData.avatar || noUserImage} alt="user-picture" />
				{userData.highlight && 
					<img className="profile-detail-avatar-highlight" src={badge} alt="selo" />
				}
			</div>

			<div className='profile-detail-userdata'>
				<span className='profile-detail-userdata-name'>
					{userData.name}
				</span>

				<div className='profile-detail-userdata-rating row-centered'>
					<img src={star} alt="Estrela" /> {userData.rating} ({userData.reviews})
				</div>
				
				{/* future feature
					<div className='profile-detail-userdata-skills'>
						<ul>
							<li>8 anos como síndico profissional</li>
							<li>Formando em Administração</li>
							<li>47 anos • 15 km de você</li>
						</ul>
					</div> 
				*/}

				<span className='profile-detail-bio'>
					{userData.bio}
				</span>

			</div>
		</div>
	);
}

export default DetailComponent;
