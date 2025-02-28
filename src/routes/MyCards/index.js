import React, { useState, useEffect } from "react";
import "./styles.css";
import { initMercadoPago, getPaymentMethods  } from '@mercadopago/sdk-react';
import { createCardToken } from '@mercadopago/sdk-react/esm/coreMethods';

import CardForm from "../../components/CardForm";

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

    const [cardToken, setCardToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        initMercadoPago(process.env.REACT_APP_MP_PUBLIC_TOKEN, {
            locale: "pt-BR"
        });
    }, []);

    async function handleSubmit(formData){

        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 100));

            const bin = formData.card_number.replace(/\D/g, "").slice(0, 6);
            
            const cardBinData = await getPaymentMethods({ bin });
            const payment_method = cardBinData.results[0].id;

            console.log(cardBinData);
           
            const [month, year] = formData.expiration_date.split('/');

            const docType = formData.doc_type.toUpperCase();

            // setCardData({
            //     cardNumber: formData.card_number,
            //     cardholderName: formData.full_name,
            //     expirationMonth: month,
            //     expirationYear: year,
            //     securityCode: formData.security_code,
            //     identificationType: docType,
            //     identificationNumber: formData.doc_number
            // });

            console.log({
                cardNumber: formData.card_number,
                cardholderName: formData.full_name,
                expirationMonth: month,
                expirationYear: year,
                securityCode: formData.security_code,
                identificationType: docType,
                identificationNumber: formData.doc_number
            });

            const response = await createCardToken({
                cardNumber: formData.card_number,
                cardholderName: formData.full_name,
                expirationMonth: month,
                expirationYear: year,
                securityCode: formData.security_code,
                identificationType: docType,
                identificationNumber: formData.doc_number
            });

            if (response.error) {
                setError(response.error.message);
            } else {
                setCardToken(response.id);
                console.log("Token gerado:", response.id);
            }
        } catch (err) {
            setError("Erro ao gerar token do cartão.");
            console.error(err);
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
