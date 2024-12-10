import React from "react";

import Banner from "../../Screens/Newsletter/LandingPageBanner"
import LandingPageContent from "../../Screens/Newsletter/LandingPageContent";
import SocialMediaIcons from "../../Screens/Newsletter/SocialMediaIcons"
import Sneek from "../../Screens/Newsletter/LandingPageSneek"

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