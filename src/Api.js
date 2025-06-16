const BASE_URL = process.env.REACT_APP_BASE_API_URL;

const actions = {
    redirectToLogin: function (){
        localStorage.removeItem('token');
        window.location.href = "/login";
    },
    redirectToDeals: function (){
        alert("Você possui ofertas não respondidas a mais de 7 dias.");
        window.location.href = "/deals";
    },
    redirectToCards: function (){
        alert("para navegar é necessário cadastrar um cartão");
        window.location.href = "/settings?menu=cards";
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

        return json;
    } catch (error) {
        return { error };
    }
};

async function getAuthHeaders(){
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

    logout: async () =>
        apiFetch(`${BASE_URL}/auth/logout`, {
            method: 'GET',
            headers: await getAuthHeaders()
        }),

    cep: async ({ cep }) =>
        apiFetch(`https://viacep.com.br/ws/${cep}/json/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        }),

    newUser: async (userData) =>
        apiFetch(`${BASE_URL}/user`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(userData)
        }),

    newCard: async (cardToken) =>
        apiFetch(`${BASE_URL}/mp/card`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ card_token: cardToken })
        }),

    getMyCards: async () =>
        apiFetch(`${BASE_URL}/mp/card`, {
            method: 'GET',
            headers: await getAuthHeaders()
        }),

    deleteCard: async (cardId) =>
        apiFetch(`${BASE_URL}/mp/card/${cardId}`, {
            method: 'DELETE',
            headers: await getAuthHeaders()
        }),

    getMyChats: async (page = 1) =>
        apiFetch(`${BASE_URL}/chat?page=${page}`, {
            method: 'GET',
            headers: await getAuthHeaders()
        }),

    getChatMessages: async ({ chat_id, begin_date, end_date }) => {
        const params = new URLSearchParams();
        if (begin_date) params.append('begin_date', begin_date);
        if (end_date) params.append('end_date', end_date);

        const url = `${BASE_URL}/chat/${chat_id}${params.toString() ? `?${params.toString()}` : ''}`;

        return apiFetch(url, {
            method: 'GET',
            headers: await getAuthHeaders()
        })
    },

    getCurrentUserId: async () =>
        apiFetch(`${BASE_URL}/auth/currentUserId`, {
            method: 'GET',
            headers: await getAuthHeaders()
        }),

    sendMessage: async ({ message, to }) =>
        apiFetch(`${BASE_URL}/chat/message`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ message, to })
        }),

    getDeals: async (page = 1) => {
        const res = await apiFetch(`${BASE_URL}/deal?page=${page}`, {
            method: 'GET',
            headers: await getAuthHeaders()
        });
        return res.data ?? res;
    },

    getDealDetails: async (dealId) =>
        apiFetch(`${BASE_URL}/deal/${dealId}`, {
            method: 'GET',
            headers: await getAuthHeaders()
        }),

    answerDeal: async (dealId, dealData) =>
        apiFetch(`${BASE_URL}/deal/answer/${dealId}`, {
            method: 'PUT',
            headers: await getAuthHeaders(),
            body: JSON.stringify(dealData)
        }),

    createDeal: async (dealData) =>
        apiFetch(`${BASE_URL}/deal/create`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(dealData)
        }),

    getUserProfile: async (userId) =>
        apiFetch(`${BASE_URL}/user/${userId || 0}`, {
            method: 'GET',
            headers: await getAuthHeaders()
        }),

    getComments: async ({ userId, page = 1 }) =>
        apiFetch(`${BASE_URL}/avaliation/user/${userId}?page=${page}`, {
            method: 'GET',
            headers: await getAuthHeaders()
        }),

    createChat: async ({ users, message }) =>
        apiFetch(`${BASE_URL}/chat/new`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ users, message })
        }),

    avaliateUser: async ({ to, message, stars }) =>
        apiFetch(`${BASE_URL}/avaliation/new`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({ to, message, stars })
        }),

    newService: async ({ title, price, description }) =>
        apiFetch(`${BASE_URL}/offeredservices`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({
                name: title,
                description,
                price
            })
        }),

    LinkGoogle: async (code) =>
        apiFetch(`${BASE_URL}/auth/callback?code=${code}`, {
            method: 'GET',
            headers: await getAuthHeaders()
        }),

    checkGoogleIsLinked: async () =>
        apiFetch(`${BASE_URL}/google/accountIsLinked`, {
            method: 'GET',
            headers: await getAuthHeaders()
        }),

    unlinkGoogleAccount: async () =>
        apiFetch(`${BASE_URL}/google/unlinkAccount`, {
            method: 'GET',
            headers: await getAuthHeaders()
        }),

    createMeeting: async (meetingData) => 
        apiFetch(`${BASE_URL}/calendar/events/create`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify({
                address: meetingData.address,
                type: meetingData.type,
                time: meetingData.time,
                to: meetingData.to
            })
        }),

    forgotPassword: async (email) => 
        apiFetch(`${BASE_URL}/auth/forgotpassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        }),

    updatePassword: async (token, password) => 
        apiFetch(`${BASE_URL}/auth/updatepassword`, {
            method: 'POST',
            headers: { //this should not come from getAuthHeaders()
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify({
                newPassword: password
            })
        }),

    getNearbyTrustee: async (page) => 
        apiFetch(`${BASE_URL}/nearby/trustee?page=${page}`, {
            method: 'GET',
            headers: await getAuthHeaders()
        }),

    requestFullProfile: async() => 
        apiFetch(`${BASE_URL}/profile`, {
            method: 'GET',
            headers: await getAuthHeaders()
        }),

    updateProfile: async (userData) =>
        apiFetch(`${BASE_URL}/profile`, {
            method: 'POST',
            headers: await getAuthHeaders(),
            body: JSON.stringify(
                userData
            )
        }),

    updateAvatar: async (userData) => 
        apiFetch(`${BASE_URL}/profile/avatar`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: userData
        })
};

export default Api;