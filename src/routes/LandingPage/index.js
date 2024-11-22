import React from "react";

import Banner from "../../components/LandingPageBanner"
import LandingPageContent from "../../components/LandingPageContent";
import SocialMediaIcons from "../../components/SocialMediaIcons"

function LandingPage(){
    return (
        <div className="lp-container">
            <Banner/>
            <LandingPageContent/>
            <SocialMediaIcons/>
        </div>
    );
}

export default LandingPage;