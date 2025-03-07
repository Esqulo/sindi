import React, { useState, useEffect } from "react";
import "./styles.css";
import { initMercadoPago } from '@mercadopago/sdk-react';
import { createCardToken } from '@mercadopago/sdk-react/esm/coreMethods';

import CardForm from "../../components/CardForm";

import Api from "../../Api";

function MyCards() {
    // eslint-disable-next-line
    const [cardData, setCardData] = useState({
        cardNumber: "",
        cardholderName: "",
        expirationMonth: "",
        expirationYear: "",
        securityCode: "",
        identificationType: "",
        identificationNumber: "",
        payment_method_id: ""
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        initMercadoPago(process.env.REACT_APP_MP_PUBLIC_TOKEN, {
            locale: "pt-BR"
        });
    }, []);

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

            if(!newCardResponse.success) throw new Error({
                message: newCardResponse.message
            });

        } catch (err) {
            setError(err.message);
            console.log(err);
        }
    };

    return (
        <div className="my-cards-container">
            <h1>Cadastro de Cartão</h1>

			<CardForm onSubmit={handleSubmit}/>

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}
        </div>
    );
}

export default MyCards;
