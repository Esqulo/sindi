import React from 'react';
import "./styles.css";


import HomeBanner from '../../components/HomeBanner';
import bannerImage from '../../assets/images/banner-home.svg'

function Home(){
    return (
        <div className='home-container'>
            <HomeBanner image={bannerImage}/>
        </div>
    );
}

export default Home;