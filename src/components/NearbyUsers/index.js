import React, {useState,useEffect,useCallback,useRef} from 'react';
import "./styles.css";

// import PinpointIcon from "../../assets/images/icons/pinpoint.png";
// import FiltersIcon from "../../assets/images/icons/filters.png";

import UserComponent from "../UserComponent";
import LoadingIcon from '../LoadingIcon';

import Api from '../../Api';

function NearbyTrustee(){

    const [nearbyUsers, setNearbyUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keeploading, setKeepLoading] = useState(true);

    const pageRef = useRef(1);
    const initialFetched = useRef(false);

    const getNearbyUsers = useCallback(async () => {
        if(!keeploading || loading) return;
        setLoading(true);
        try {
            const apiResponse = await Api.getNearbyUsers(pageRef.current);
            if(!apiResponse.data.length){
                setKeepLoading(false);
                return;
            }
            pageRef.current += 1;
            setNearbyUsers(prev => [...prev, ...apiResponse.data]);
        } catch (err) {
            console.error("erro ao recuperar usuários", err);
        } finally {
            setLoading(false);
        }
    }, [keeploading, loading]);

    useEffect(() => {
        if (initialFetched.current) return;
        getNearbyUsers();
        initialFetched.current = true;
    }, [getNearbyUsers]);

    return (
        <div className="nt-container column-centered">
            {(nearbyUsers.length > 0) && <>
                {/* <div className="nt-search-container row-centered">
                    <div className="nt-search-component row-centered left-icon-full-text-input">
                        <img src={PinpointIcon} alt="pinpoint" className="nt-search-pinpoint"/>
                        <span>Sua localização</span>
                    </div>
                    <div className="nt-filters-component row-centered left-icon-full-text-input">
                        <img src={FiltersIcon} alt="filters" className="nt-search-filters"/>
                        <span>Filtros</span>
                    </div>
                </div> */}
                <div className="nt-list-container column-centered">
                    <span className="nt-list-title">Os mais próximos de você</span>
                    <div className="nt-list column-centered">
                        {nearbyUsers.map((nearbyUser, index) => (
                            <UserComponent key={nearbyUser.id} userData={nearbyUser}/>
                        ))}
                        {loading && <LoadingIcon color='#000'/>}
                        {keeploading &&
                            <button className='nt-list-see_more' onClick={getNearbyUsers}>Ver mais</button>
                        }
                    </div>
                </div>
            </>}
        </div>
    );
}

export default NearbyTrustee;