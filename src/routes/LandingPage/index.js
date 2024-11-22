import React from "react";

import Banner from "../../components/LandingPageBanner"
import LandingPageContent from "../../components/LandingPageContent";

function LandingPage(){
    return (
        <div className="lp-container">
            <Banner/>
            <LandingPageContent/>
        </div>
    );
}

export default LandingPage;