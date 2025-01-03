import React from 'react';
import "./styles.css";

import CustomImgComponent from "../CustomImgComponent";
import Chevron from '../Chevron';

import StarIcon from "../../assets/images/icons/star.png"

function TrusteeComponent({trusteeData}){
    return (
        <div className="tsc-container row-centered">
            <CustomImgComponent img={trusteeData.img} width={"100px"} height={"100px"} borderRadius={"50%"}/>
            <div className="tsc-info">
                <span className="tsc-sponsor">Anúncio</span>
                <div className="tsc-description row-centered">
                    <h1 className="tsc-name">{trusteeData.name}</h1>
                    <div className="tsc-stars-container row-centered">
                        <CustomImgComponent img={StarIcon} width={"20px"} height={"20px"}/>
                        <span className="tsc-stars-value">{trusteeData.stars}</span>
                        <span className="tsc-stars-count">({trusteeData.starsCount})</span>
                    </div>
                </div>
            </div>
            <div className="tsc-see-profile row-centered">
                <span>ver perfil</span>
                <Chevron/>
            </div>
        </div>
    )
}

export default TrusteeComponent 