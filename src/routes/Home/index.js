import React from 'react';
import "./styles.css";

import HomeBanner from '../../components/HomeBanner';
import NearbyTrustee from '../../components/NearbyTrustee';

import bannerImage from '../../assets/images/banner-home.svg';

function Home(){
    return (
        <div className='home-container'>
            <HomeBanner image={bannerImage}/>
            <NearbyTrustee/>
        </div>
    );
}

export default Home;