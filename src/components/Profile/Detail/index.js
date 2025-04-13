import React from 'react';

import avatar from '../../../assets/images/profile/avatar.jpg';
import star from '../../../assets/images/profile/star.png';
import badge from '../../../assets/images/profile/badge.png';

import "./styles.css";

function DetailComponent({ userData }) {

	return (
		<div className='profile-detail-content'>

			<div className='avatar-content'>
				<div className='avatar-area'>
					<img className="avatar-img" src={avatar} alt="Avatar" />
					<img className="avatar-seal" src={badge} alt="Selo" />
				</div>
			</div>

			<div className='profile-detail'>
				<div className='title-container'>
					<div className='name'>
						<h1>{userData.name}</h1>
					</div>

					<div className='star'>
						<img src={star} alt="Estrela" /> {userData.stars} (267)
					</div>

					<div className='profile-info'>
						<ul>
							<li>8 anos como síndico profissional</li>
							<li>Formando em Administração</li>
							<li>47 anos • 15 km de você</li>
						</ul>
					</div>
				</div>

				<div className='biografia'>
					<p className="description">
						<b>
							{userData.bio}
						</b>
					</p>
				</div>

			</div>
		</div>
	);
}

export default DetailComponent;
