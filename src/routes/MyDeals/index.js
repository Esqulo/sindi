import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";

import CustomImageComponent from "../../components/CustomImgComponent";
import DealDetailsItem from "../../components/DealDetailsItem";
import LoadingIcon from "../../components/LoadingIcon";
import noUserImage from "../../assets/images/icons/no-image-profile.png";

import Api from '../../Api';

function MyDeals() {
    const dealsListContainerRef = useRef(null);
    const reachedEndOfDeals = useRef(false);

    const [dealsList, setDealsList] = useState([]);
    const [selectedDeal, setSelectedDeal] = useState({});
    const [selectedDealDetails, setSelectedDealDetails] = useState({});
    const [loadingDeals, setLoadingDeals] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [currentDealsPage, setCurrentDealsPage] = useState(1);

    const getDeals = useCallback(async (page) => {
        if (loadingDeals || reachedEndOfDeals.current) return;
    
        setLoadingDeals(true);

        const newDeals = await Api.getDeals(page);
    
        if (!newDeals || newDeals.length === 0 || newDeals.error) {
            reachedEndOfDeals.current = true;
            setLoadingDeals(false);
            return;
        }
    
        setDealsList((prevDeals) => [...prevDeals, ...newDeals]);
        setLoadingDeals(false);
    }, [loadingDeals]);
    
    const initialLoadDone = useRef(false);
    useEffect(() => {
        if (!initialLoadDone.current) {
            initialLoadDone.current = true;
            getDeals(1);
        }
    }, [getDeals]);

    useEffect(() => {
        if (currentDealsPage <= 1) return;
        getDeals(currentDealsPage);
    }, [currentDealsPage,getDeals]);

    function handledealsListScroll() {
        if (!dealsListContainerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = dealsListContainerRef.current;
        const scrollPosition = scrollTop + clientHeight;
        const triggerPoint = scrollHeight * 0.9;

        if (scrollPosition >= triggerPoint && !loadingDeals && !reachedEndOfDeals.current) {
            setCurrentDealsPage((prevPage) => prevPage + 1);
        }
    }

    const getDealDetails = useCallback(async (dealId) => {
        setLoadingDetails(true);
        
        const details = await Api.getDealDetails(dealId);
        setSelectedDealDetails(details);

        setLoadingDetails(false);
    }, []);

    useEffect(() => {
        if (!selectedDeal.id) return;
        getDealDetails(selectedDeal.id);
    }, [selectedDeal, getDealDetails]);

    function refresh(answeredDealId){
        setDealsList([]);
        getDeals(1);
        getDealDetails(answeredDealId);
    }

    return (
        <div className="deals-container column-centered">
            <h1 className="title">Propostas</h1>
            <div className="deals-content row-centered">
                <div className="deals-list column-centered shadow-default custom-scroll" ref={dealsListContainerRef} onScroll={handledealsListScroll}>
                    {dealsList.map((deal) => (
                        <div className={`deal-item row-centered prevent-select ${deal.status} ${deal.id === selectedDeal.id ? 'selected' : ''}`} key={String(deal.id)} onClick={() => setSelectedDeal(deal)}>
                            <CustomImageComponent img={deal.image || noUserImage} width={"80px"} borderRadius={"50%"} style={{ border: '2px solid #FFF', backgroundSize: '120%' }} />
                            <div className="deal-item-info">
                                <span className="deal-item-name">{deal.title}</span>
                                <span className={`deal-item-status ${deal.status}`}>{deal.status}</span>
                                <div className="row-centered"><span className="deal-item-status">atualizado em:  {deal.last_update}</span></div>
                            </div>
                        </div>
                    ))}
                    {loadingDeals && <LoadingIcon color="#000" />}
                </div>
                <div className="deals-details-container shadow-default">
                    {selectedDeal.id && (<>
                        <div className="deals-details-header row-centered">
                            <CustomImageComponent
                                img={selectedDeal.image || noUserImage}
                                width={"60px"}
                                height={"60px"}
                                borderRadius={"50%"}
                                style={{ maxHeight: "100%" }}
                            />
                            <span className="deals-details-header-title">{selectedDeal.title}</span>
                        </div>
                        <div className="deals-details-content column-centered">
                        
                            {Array.isArray(selectedDealDetails?.deals) && selectedDealDetails.deals.map((item, idx) => (
                                <DealDetailsItem key={idx} details={item} onAnswer={() => {refresh(item.id)}}/>
                            ))}

                            {loadingDetails && <LoadingIcon color="#000"/>}

                        </div>
                    </>)}
                </div>
            </div>
        </div>
    );
}

export default MyDeals;