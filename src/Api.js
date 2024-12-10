const BASE_URL = '/services/api';

const Api = {

    login: async ({username, password}) =>{
        try{
            const req = await fetch (`${BASE_URL}/auth/login`,{
                method: 'POST',
                headers:{ Accept: 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password
                })
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