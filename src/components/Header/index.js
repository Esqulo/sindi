import "./styles.css";
import Logo from "../../assets/logo-with-name.png";

function Banner(){
    return(
        <div className="mainbanner-container">
            <div className="mainbanner-contents">
                <img src={Logo} className="mainbanner-logo" alt="Logo"/>
            </div>
        </div>
    )
}

export default Banner;