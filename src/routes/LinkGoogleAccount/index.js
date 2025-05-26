import React, {useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Api from "../../Api";
import LoadingIcon from "../../components/LoadingIcon";
import "./styles.css";

function LinkGoogleAccount(){

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const receivedCode = searchParams.get('code');

    const [isLinked,setIsLinked] = useState(false);
    const [isCheckingLink,setIsCheckingLink] = useState(false);

    function navigateToAccountLink(){
        window.open(process.env.REACT_APP_GOOGLE_LINK_ACCOUNT_URL, '_blank');
    }

    const sendCode = useCallback(async () => {
        try {
            setIsCheckingLink(true);
            let apiResponse = await Api.LinkGoogle(receivedCode);

            if(!apiResponse.success) throw new Error(apiResponse.message);
            
            setIsLinked(true);

            const menu = searchParams.get("menu");
            navigate(`/settings?menu=${menu}`, { replace: true });
            
        } catch (error) {
            console.error("Erro ao enviar o código para o backend:", error);
        }finally{
            setIsCheckingLink(false);
        }
    }, [receivedCode, navigate, searchParams]);

    async function checkGoogleIsLinked(){
        try{
            setIsCheckingLink(true);
            let apiResponse = await Api.checkGoogleIsLinked();
            if(apiResponse.isLinked) setIsLinked(true);
        }catch(err){
            console.log('error checking account');
        }finally{
            setIsCheckingLink(false);
        }
    }

    async function unlinkAccount(){
        try{
            setIsCheckingLink(true);
            let apiResponse = await Api.unlinkGoogleAccount();
            if(apiResponse.success) setIsLinked(false);
        }catch(err){
            console.log('error unlinking account');
        }finally{
            setIsCheckingLink(false);
        }
    }

    useEffect(() => {
        
        if(receivedCode) sendCode();
        checkGoogleIsLinked();

    }, [receivedCode,sendCode]);

    return (
        <div className="link_google-container">
            <h1 className="link_google-header">Vincular conta Google</h1>
            {!isCheckingLink ? <>
                <div className="link_google-account_status">
                    { isLinked ?
                        <span className="link_google-status-unlink">Sua conta já está vinculada.</span>
                        :
                        <span className="link_google-status-link">Sua conta ainda não está vinculada.</span>
                    }
                </div>
                <div className="link_google-actions row-centered">
                    { isLinked ?
                        <button className="link_google-unlink" onClick={unlinkAccount}>Desvincular Conta</button>
                        :
                        <button className="link_google-link" onClick={navigateToAccountLink}>Vincular Conta</button>
                    }
                </div></>
            :
                <div className="loading_container">
                    <LoadingIcon color="#000"/>
                </div>
                
            }
        </div>
    );
}

export default LinkGoogleAccount;