import React, {useState} from 'react';
import "./styles.css";

import CustomImgComponent from "../CustomImgComponent";
import Chevron from '../Chevron';

import StarIcon from "../../assets/images/icons/star.png"

function TrusteeComponent({trusteeData}){
    const [chevronColor, setchevronColor] = useState("#555");
    return (
        <div className="tsc-container row-centered">
            <CustomImgComponent img={trusteeData.img} width={"180px"} height={"180px"} borderRadius={"50%"}/>
            <div className="tsc-content row-centered">
                <div className="tsc-left-content">
                    <div className="tsc-info">
                        <div className="tsc-topcontent">
                            {trusteeData.sponsored && <span className="tsc-sponsor">Anúncio</span>}
                            <div className="tsc-description row-centered">
                                <h1 className="tsc-name">{trusteeData.name}</h1>
                                <div className="tsc-stars-container row-centered">
                                    <CustomImgComponent img={StarIcon} width={"20px"} height={"20px"}/>
                                    <span className="tsc-stars-value">{trusteeData.stars}</span>
                                    <span className="tsc-stars-count">({trusteeData.starsCount})</span>
                                </div>
                            </div>
                            <div className="tsc-details">
                                {trusteeData.experienceYears && <span>{trusteeData.experienceYears} anos como síndico profissional</span>}
                                {trusteeData.career && <span>Formado em {trusteeData.career}</span>}
                                {(trusteeData.distance || trusteeData.age) &&
                                    <div className="tsc-details-row row-centered">
                                        {trusteeData.age && <span>{trusteeData.age} anos</span>}
                                        {(trusteeData.distance && trusteeData.age) && <span>•</span>}
                                        {trusteeData.distance && <span>{trusteeData.distance} km de você</span>}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="tsc-bottomcontent">
                            {trusteeData.price &&
                                <div className="tsc-price">
                                    <strong>R$ {trusteeData.price}</strong>
                                    <span>por unidade</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="tsc-right-content">
                    <div className="tsc-see-profile" onMouseEnter={()=>setchevronColor("#000")} onMouseLeave={()=>setchevronColor("#555")}>
                        <span>ver perfil</span>
                        <div className="tsc-chevron-container">
                            <Chevron color={chevronColor}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrusteeComponent;