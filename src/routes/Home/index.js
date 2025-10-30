import React from 'react';
import "./styles.css";

import HomeBanner from '../../components/HomeBanner';
import NearbyUsers from '../../components/NearbyUsers';

import bannerImage from '../../assets/images/banner-home.jpg';

function Home(){
    return (
        <div className='home-container'>
            <HomeBanner image={bannerImage}/>
            <NearbyUsers/>
        </div>
    );
}

export default Home;