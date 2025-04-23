import React, { useState, useEffect } from "react";
import "./styles.css";
import { initMercadoPago } from '@mercadopago/sdk-react';
import { createCardToken } from '@mercadopago/sdk-react/esm/coreMethods';

import CardForm from "../../components/CardForm";

import Api from "../../Api";

import trashIcon from "../../assets/images/icons/red-trash.svg";
import LoadingIcon from "../../components/LoadingIcon";

function MyCards() {
    
    //to do: better error presentation
    // eslint-disable-next-line
    const [error, setError] = useState(null);
    const [myCards, setMyCards] = useState([]);
    const [cardsLoading, setCardsLoading] = useState(true);
    const [showCardForm, setShowCardForm] = useState(false);
    const [isDeletingCard, setIsDeletingCard] = useState(null);

    useEffect(() => {
        initMercadoPago(process.env.REACT_APP_MP_PUBLIC_TOKEN, {
            locale: "pt-BR"
        });

        getMyCards();
    }, []);

    async function getMyCards(){
        setCardsLoading(true);
        try{
            let apiResponse = await Api.getMyCards();
            if(apiResponse.success === false) throw new Error(apiResponse.message);
            setMyCards(apiResponse)
        }catch(err){
            alert('Ocorreu um erro ao buscar seus cartões salvos.');
            setMyCards([]);
        }
        setCardsLoading(false);
    }

    async function deleteCard(cardId){
        setIsDeletingCard(parseInt(cardId));
        try{
            let apiResponse = await Api.deleteCard(cardId);
            if(apiResponse.success === false) throw new Error(apiResponse.message);
        }catch(err){
            alert(err.message);
        }finally{
            getMyCards();
            setIsDeletingCard(null);
        }
    }

    async function handleSubmit(formData){

        let cardToken;

        setError(null);

        try {

            const [month, year] = formData.expiration_date.split('/');

            const docType = formData.doc_type.toUpperCase();

            const cardTokenResponse = await createCardToken({
                cardNumber: formData.card_number,
                cardholderName: formData.full_name,
                cardExpirationMonth: month,
                cardExpirationYear: year,
                securityCode: formData.security_code,
                identificationType: docType,
                identificationNumber: formData.doc_number
            });

            if (cardTokenResponse.error) throw new Error({
                message: "Erro ao gerar token do cartão."
            });

            cardToken = cardTokenResponse.id;

            const newCardResponse = await Api.newCard(cardToken);

            if(!newCardResponse.success) throw new Error(newCardResponse.message);

        } catch (err) {
            alert('Ocorreu um erro ao salvar o seu cartão, por favor, verifique os dados e tente novamente.');
        }finally{
            getMyCards();
            setShowCardForm(false);
        }
    };

    function openCardForm(){
        setShowCardForm(true);
    }

    return (
        <div className="my-cards-container">

            <h1>Seus cartões:</h1>
                
            <div className="cards-view">
                
                {!cardsLoading ? (
                    <div className="cards-list custom-scroll">
                        {myCards.length && myCards.map((card, index) => (
                            <div className="card-list-item" key={String(card.id)}>
                                
                                <div className="card-info">
                                    <span className="card-flag">{card.flag}</span>
                                    <span className="card-last-digits">Terminado em: {card.last_four_digits}</span>
                                </div>

                                <div className="card-options">
                                    <button className="card-option" onClick={() => deleteCard(String(card.id))}>
                                        {isDeletingCard === card.id ? (<LoadingIcon color="#000" size={20}/>) : (<img src={trashIcon} alt="Excluir" />)}
                                    </button>
                                </div>

                            </div>
                        ))}

                        <div className="card-list-item no-padding">
                            <button className="new-card-button" onClick={openCardForm}>
                                <span>Adicionar um cartão</span>
                            </button>
                        </div>

                    </div>
                ) : (
                    <div className="loading-container">
                        <LoadingIcon color="#000" size={40}/>
                    </div>
                )} 
                
                {showCardForm &&
                    <CardForm onSubmit={handleSubmit}/>
                }

            </div>
            
        </div>
    );
}

export default MyCards;
