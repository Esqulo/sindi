import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./styles.css";

import CustomImgComponent from "../CustomImgComponent";
import Chevron from '../Chevron';

import noUserImage from "../../assets/images/icons/no-image-profile.png";

import StarIcon from "../../assets/images/icons/star.png"

function UserComponent({userData}){
    const [chevronColor, setchevronColor] = useState("#555");
    const navigate = useNavigate();
    return (
        <>
        { (userData.user_type === 0) && 
            <div className="tsc-container row-centered">
                <CustomImgComponent img={userData.img || noUserImage} width={"180px"} height={"180px"} borderRadius={"50%"}/>
                <div className="tsc-content row-centered">
                    <div className="tsc-left-content">
                        <div className="tsc-info">
                            <div className="tsc-topcontent">
                                <div className="tsc-description row-centered">
                                    <h1 className="tsc-name" onClick={()=>{navigate(`/profile/${userData.id}`)}}>{userData.name}</h1>
                                </div>
                                <div className="tsc-details">
                                    {(userData.distance) &&
                                        <div className="tsc-details-row row-centered">
                                            {userData.distance && <span>{userData.distance} km de você</span>}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="tsc-bottomcontent">
                                {userData.price &&
                                    <div className="tsc-price">
                                        <strong>R$ {userData.price}</strong>
                                        <span>por unidade</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="tsc-right-content">
                        <Link to={`/profile/${userData.id}`} state={{ id_user: userData.name }}>
                            <div className="tsc-see-profile" onMouseEnter={()=>setchevronColor("#000")} onMouseLeave={()=>setchevronColor("#555")}>
                                <span>ver perfil</span>
                                <div className="tsc-chevron-container">
                                    <Chevron color={chevronColor}/>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        }
        { (userData.user_type === 1) && 
            <div className="tsc-container row-centered">
                <CustomImgComponent img={userData.img || noUserImage} width={"180px"} height={"180px"} borderRadius={"50%"}/>
                <div className="tsc-content row-centered">
                    <div className="tsc-left-content">
                        <div className="tsc-info">
                            <div className="tsc-topcontent">
                                {userData.sponsored && <span className="tsc-sponsor">Anúncio</span>}
                                <div className="tsc-description row-centered">
                                    <h1 className="tsc-name" onClick={()=>{navigate(`/profile/${userData.id}`)}}>{userData.name}</h1>
                                    <div className="tsc-stars-container row-centered">
                                        <CustomImgComponent img={StarIcon} width={"20px"} height={"20px"}/>
                                        <span className="tsc-stars-value">{userData.stars}</span>
                                        <span className="tsc-stars-count">({userData.starsCount})</span>
                                    </div>
                                </div>
                                <div className="tsc-details">
                                    {userData.experienceYears && <span>{userData.experienceYears} ano{userData.experienceYears > 1 ? 's' : ''} como síndico profissional</span>}
                                    {userData.career && <span>Formado em {userData.career}</span>}
                                    {(userData.distance || userData.age) &&
                                        <div className="tsc-details-row row-centered">
                                            {userData.age && <span>{userData.age} anos</span>}
                                            {(userData.distance && userData.age) && <span>•</span>}
                                            {userData.distance && <span>{userData.distance} km de você</span>}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="tsc-bottomcontent">
                                {userData.price &&
                                    <div className="tsc-price">
                                        <strong>R$ {userData.price}</strong>
                                        <span>por unidade</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="tsc-right-content">
                        <Link to={`/profile/${userData.id}`} state={{ id_user: userData.name }}>
                            <div className="tsc-see-profile" onMouseEnter={()=>setchevronColor("#000")} onMouseLeave={()=>setchevronColor("#555")}>
                                <span>ver perfil</span>
                                <div className="tsc-chevron-container">
                                    <Chevron color={chevronColor}/>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        }
        </>
    )
}

export default UserComponent;