const BASE_URL = process.env.REACT_APP_BASE_API_URL;

const actions = {
    redirectToLogin: function (){
        console.log('#redirectToLogin')
    },
    redirectToDeals: function (){
        console.log('#redirectToDeals')
    },
    redirectToCards: function (){
        alert("para navegar é necessário cadastrar um cartão");
        window.location.href = "#/settings?menu=cards";
    }
}

function handleAction(json){
    if (!json.action) return;

    try{
        actions[json.action]();
    }catch(err){
        console.error('error:', err);
    }

};

async function apiFetch(url, options = {}){
    try {
        const response = await fetch(url, options);
        const json = await response.json();

        handleAction(json);

        return { ...json, status: response.status };
    } catch (error) {
        return { error };
    }
};

function getAuthHeaders(){
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
};

const Api = {
    login: async ({ username, password }) =>
        apiFetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        }),

    cep: async ({ cep }) =>
        apiFetch(`https://viacep.com.br/ws/${cep}/json/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        }),

    newUser: async (userData) =>
        apiFetch(`${BASE_URL}/user`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        }),

    newCard: async (cardToken) =>
        apiFetch(`${BASE_URL}/mp/card`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ card_token: cardToken })
        }),

    getMyCards: async () =>
        apiFetch(`${BASE_URL}/mp/card`, {
            method: 'GET',
            headers: getAuthHeaders()
        }),

    deleteCard: async (cardId) =>
        apiFetch(`${BASE_URL}/mp/card/${cardId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }),

    getMyChats: async (page = 1) =>
        apiFetch(`${BASE_URL}/chat?page=${page}`, {
            method: 'GET',
            headers: getAuthHeaders()
        }),

    getChatMessages: async ({ chat_id, begin_date }) =>
        apiFetch(`${BASE_URL}/chat/${chat_id}?begin_date=${begin_date}`, {
            method: 'GET',
            headers: getAuthHeaders()
        }),

    getCurrentUserId: async () =>
        apiFetch(`${BASE_URL}/auth/currentUserId`, {
            method: 'GET',
            headers: getAuthHeaders()
        }),

    sendMessage: async ({ message, to }) =>
        apiFetch(`${BASE_URL}/chat/message`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ message, to })
        }),

    getDeals: async (page = 1) => {
        const res = await apiFetch(`${BASE_URL}/deal?page=${page}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return res.data ?? res;
    },

    getDealDetails: async (dealId) =>
        apiFetch(`${BASE_URL}/deal/${dealId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        }),

    answerDeal: async (dealId, dealData) =>
        apiFetch(`${BASE_URL}/deal/answer/${dealId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(dealData)
        }),

    createDeal: async (dealData) =>
        apiFetch(`${BASE_URL}/deal/create`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(dealData)
        }),

    getUserProfile: async (userId) =>
        apiFetch(`${BASE_URL}/user/${userId || 0}`, {
            method: 'GET',
            headers: getAuthHeaders()
        }),

    getComments: async ({ userId, page = 1 }) =>
        apiFetch(`${BASE_URL}/avaliation/user/${userId}?page=${page}`, {
            method: 'GET',
            headers: getAuthHeaders()
        }),

    createChat: async ({ users, message }) =>
        apiFetch(`${BASE_URL}/chat/new`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ users, message })
        }),

    avaliateUser: async ({ to, message, stars }) =>
        apiFetch(`${BASE_URL}/avaliation/new`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ to, message, stars })
        }),

    newService: async ({ title, price, description }) =>
        apiFetch(`${BASE_URL}/offeredservices`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                name: title,
                description,
                price
            })
        })
};

export default Api;