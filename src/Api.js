// const BASE_URL = '/services/api';
// const BASE_URL = 'http://127.0.0.1:80/sindi/services/api';
const BASE_URL = 'https://127.0.0.1:443/sindi/services/api';

const Api = {
    login: async ({username, password}) => {
        try{
            const req = await fetch(`${BASE_URL}/auth/login`,{
                method: 'POST',
                headers:{ Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({username, password})
            });
            const json = await req.json();
            return {
                token: json?.token,
                success: json?.success,
                status: req.status
            };
        }
        catch(error){
            return {
                error: error
            };
        }
    },
    cep: async ({cep}) => {
        try{
            const req = await fetch(`https://viacep.com.br/ws/${cep}/json/`,{
                method: 'GET',
                headers:{ Accept: 'application/json', 'Content-Type': 'application/json' }
            });
            const json = await req.json();
            return json;
        }
        catch(error){
            return {
                error: error
            };
        }
    },
    newUser: async (userData) => {
        try{
            const req = await fetch(`${BASE_URL}/user`,{
                method: 'POST',
                headers:{ Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const json = await req.json();
            return {
                message: json?.message,
                success: json?.success,
                status: req.status,
                data: json?.data
            };
        }
        catch(error){
            return {
                error: error
            };
        }
    },
    newCard: async (cardToken) => {
        try{
            const req = await fetch(`${BASE_URL}/mp/card`,{
                method: 'POST',
                headers:{ 
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({card_token: cardToken})
            });
            const json = await req.json();
            return json;
        }
        catch(error){
            return {
                error: error
            };
        }
    },
    getMyCards: async () => {
        try{
            const req = await fetch(`${BASE_URL}/mp/card`,{
                method: 'GET',
                headers:{ 
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            const json = await req.json();
            return json;
        }
        catch(error){
            return {
                error: error
            };
        }
    },
    deleteCard: async (cardId) => {
        try{
            const req = await fetch(`${BASE_URL}/mp/card/${cardId}`,{
                method: 'DELETE',
                headers:{ 
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            const json = await req.json();
            return json;
        }
        catch(error){
            return {
                error: error
            };
        }
    },
    getMyChats: async (page = 1) => {
        try{
            const req = await fetch(`${BASE_URL}/chat?page=${page}`,{
                'method': 'GET',
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            const json = await req.json();
            return json;
        }
        catch(error){
            return {
                error: error
            };
        }
    },
    getChatMessages: async ({chat_id,page = 1,begin_date}) => {
        try{
            const req = await fetch(`${BASE_URL}/chat/${chat_id}?begin_date=${begin_date}`,{
                'method': 'GET',
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            const json = await req.json();
            return json;
        }
        catch(error){
            return {
                error: error
            };
        }
    },
    getCurrentUserId: async () => {
        try{
            const req = await fetch(`${BASE_URL}/auth/currentUserId`,{
                'method': 'GET',
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                }
            });
            const json = await req.json();
            return json;
        }
        catch(error){
            return {
                error: error
            };
        }
    },
    sendMessage: async ({message, to}) => {
        try{
            const req = await fetch(`${BASE_URL}/chat/message`,{
                method: 'POST',
                headers: { 
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({message,to})
            });
            const json = await req.json();
            return json;
        }
        catch(error){
            return {
                error: error
            };
        }
    }
}

export default Api;