class ClientDataManager {
    
    constructor() {
        this.id = undefined;
        this.name = undefined;
        this.deaths = 0;
    }

    async updateClientData(updates) {
        const response = await fetch(`/api/users/${this.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        return await response.json();
    }

    async getClientDeaths() {
        try {
            const response = await fetch(`/api/users/${this.id}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.deaths;
        } catch (error) {
            console.error('ClientDataManager error:', error);
            throw error;
        }
    }

    async updateClientDeaths(deaths) {
        this.deaths = deaths;
    }

    async postLogin() {
        const response = await fetch(`/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.id,
                name: this.name,
                deaths: this.deaths
            })
        });
        if (response.ok) {
            const data = await response.json();
            this.id = data.id; 
            this.deaths = data.deaths;
        }
        return response.status;
    }

}

//Singleton
export let clientDataManager = new ClientDataManager();