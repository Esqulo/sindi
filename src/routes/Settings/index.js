import React, {useState} from "react";
import { useSearchParams  } from 'react-router-dom';
import "./styles.css";

import MyCards from "../MyCards";
import EditProfile from "../../components/EditProfile";

function Settings(){

    const [searchParams] = useSearchParams();
    const menuParam = searchParams.get('menu');

    const menuItems = {
        "cards": {
            label: "Cartões",
            icon: "credit_card",
            component: MyCards
        },
        "profile": {
            label: "Perfil",
            icon: "person",
            component: EditProfile
        },
    };
    
    const [selectedMenu, setSelectedMenu] = useState(menuParam || "cards");
    const SelectedComponent = menuItems[selectedMenu]?.component;

    return (
        <div className="settings-container">
            <div className="settings-left-panel column-centered">
            {Object.entries(menuItems).map(([key, item]) => (
                <button key={key} onClick={() => setSelectedMenu(key)} className={`settings-menu-button ${selectedMenu === key ? 'selected' : ''}`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span>{item.label}</span>
                </button>
            ))}
            </div>
            <div className="settings-view">
                {SelectedComponent &&
                    <SelectedComponent />
                }
            </div>
        </div>
    );
}

export default Settings;