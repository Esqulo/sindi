import React, { useState, useEffect, useCallback, useRef } from "react";
import './styles.css';

import Stars from "../../Stars"
import noUserImage from '../../../assets/images/icons/no-image-profile.png';
import LoadingIcon from '../../LoadingIcon';

import Api from '../../../Api'

function Comments({userData}){

	const reachedEnd = useRef(false);
	const initialLoadDone = useRef(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [reviews, setReviews] = useState([]);
	const [userId, setUserId] = useState(userData.id);

	useEffect(() => {
        setUserId(userData.id);
    }, [userData]);

	const getComments = useCallback(async (currentPage) => {
        if (loading || reachedEnd.current) return;
    
        setLoading(true);

        const newComments = await Api.getComments({
			userId,
			page: currentPage
		});
    
        if (!newComments || newComments.length === 0 || newComments.length < 10 || newComments.error) {
            reachedEnd.current = true;
        }
		if(newComments.length) setReviews((prevComments) => [...prevComments, ...newComments]);

        setLoading(false);

    }, [userId,loading]);
    
	useEffect(() => {
		if (!userId) return;
	
		setReviews([]);
		setCurrentPage(1);
		reachedEnd.current = false;
		initialLoadDone.current = false;
	
		getComments(1);
	}, [userId]);

    useEffect(() => {
        if (currentPage <= 1) return;
        getComments(currentPage);
    }, [currentPage,getComments]);
	
	async function loadMoreReviews(){
		setCurrentPage(currentPage+1);
	}

	return (
		<div className="reviews-container column-centered">
			<span className="reviews-title">Comentários e avaliações</span>
			{/* <div className="reviews-header">
				<h2 className="rating-score">4.89 🏅</h2>
				<h3>Preferido dos condôminos</h3>
				<p>Um dos profissionais com maior número de avaliações positivas na sindi</p>
			</div> */}
			
			<div className="reviews-grid">
				{reviews.map((review, index) => (
					<div key={index} className="review-card">
						<img src={review.avatar || noUserImage} alt={review.from} className="review-image" />
						<div className="review-content">
							<h4>{review.from}</h4>
							{/* <p className="review-location">{review.location}</p> */}
							<div className="review-rating">
								<Stars stars={review.rating} size={20} color="#FF9900" />
								<span className="review-date">• {review.created_at}</span>
							</div>
							<p className="review-text">{review.message || ""}</p>
						</div>
					</div>
				))}
			</div>

			{loading && <LoadingIcon color="#000"/>}
			{!loading && 
				<button className="reviews-show-more-button" onClick={loadMoreReviews} disabled={reachedEnd.current}>
					{reachedEnd.current ? 'sem mais comentário' : 'Mostrar mais comentários'}
				</button>}
			
		</div>
	);
};

export default Comments;
