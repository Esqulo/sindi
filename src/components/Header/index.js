import "./styles.css";
import Logo from "../../assets/logo-with-name.png";

function Banner(){
    return(
        <div className="mainheader-container">
            <div className="mainheader-contents">
                <img src={Logo} className="mainheader-logo" alt="Logo"/>
            </div>
        </div>
    )
}

export default Banner;