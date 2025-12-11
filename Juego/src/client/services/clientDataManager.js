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
}

//Singleton
export let clientDataManager = new ClientDataManager();