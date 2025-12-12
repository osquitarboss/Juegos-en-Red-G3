class ClientDataManager {
    
    constructor() {
        this.id = null;
        this.name = null;
        this.deaths = null;
    }
    
    setParams(id, name, deaths) {
        this.id = id;
        this.name = name;
        this.deaths = deaths;
    }

    async updateClientData(id, updates) {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        return await response.json();
    }
}

//Singleton
export let clientDataManager = new ClientDataManager();