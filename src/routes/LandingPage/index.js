import React from "react";

import Banner from "../../components/LandingPageBanner"
import LandingPageContent from "../../components/LandingPageContent";
import SocialMediaIcons from "../../components/SocialMediaIcons"
import Sneek from "../../components/LandingPageSneek"

function LandingPage(){
    return (
        <div className="lp-container">
            <Banner/>
            <LandingPageContent/>
            <Sneek/>
            <SocialMediaIcons/>
        </div>
    );
}

export default LandingPage;