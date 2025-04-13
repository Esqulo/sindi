import React from 'react';
import "./styles.css";

function BannerComponent({bannerImg}) {
  return (
      <div className="homebanner-container" style={{backgroundImage: `url(${bannerImg})`}}>
      </div>
  );
}

export default BannerComponent;