import React from "react";

import Banner from "../../components/Newsletter/LandingPageBanner"
import LandingPageContent from "../../components/Newsletter/LandingPageContent";
import SocialMediaIcons from "../../components/Newsletter/SocialMediaIcons"
import Sneek from "../../components/Newsletter/LandingPageSneek"

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