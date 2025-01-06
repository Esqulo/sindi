import React from 'react';
import "./styles.css";

import PinpointIcon from "../../assets/images/icons/pinpoint.png";
import FiltersIcon from "../../assets/images/icons/filters.png";

import TrusteeComponent from "../TrusteeComponent";

function NearbyTrustee(){
    return (
        <div className="nt-container column-centered">
            <div className="nt-search-container row-centered">
                <div className="nt-search-component row-centered left-icon-full-text-input">
                    <img src={PinpointIcon} alt="pinpoint" className="nt-search-pinpoint"/>
                    <span>Sua localização</span>
                </div>
                <div className="nt-filters-component row-centered left-icon-full-text-input">
                    <img src={FiltersIcon} alt="filters" className="nt-search-filters"/>
                    <span>Filtros</span>
                </div>
            </div>
            <div className="nt-list-container column-centered">
                <span className="nt-list-title">Os mais próximos de você</span>
                <div className="nt-list column-centered">
                    <TrusteeComponent 
                        trusteeData={{
                            img: "https://picsum.photos/300/300",
                            name:"Beltrano da Silva",
                            stars: "4.89",
                            starsCount: "267",
                            experienceYears: 8,
                            career: "Administração",
                            age: 47,
                            distance: 15,
                            price: 175,
                            sponsored: true
                        }}
                    />
                    <TrusteeComponent 
                        trusteeData={{
                            img: "https://picsum.photos/150/150",
                            name:"Juan Elias da Cunha",
                            stars: "0.50",
                            starsCount: "153",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default NearbyTrustee;