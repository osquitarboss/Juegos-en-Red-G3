import Phaser from "phaser";
import { clientDataManager } from "../services/clientDataManager";

export class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene')
    }

    preload() {
        this.load.html('login', 'assets/html/form.html');
    }

    create() {
        const text = this.add.text(400, 52, 'Login', { fontSize: '32px', fill: '#fff' });

        const element = this.add.dom(400, 300).createFromCache('login');

        element.setPerspective(800);

        element.addListener('click');

        const self = this;
        element.on('click', async (event) => {

            if (event.target.name === 'loginButton') {

                const inputUsername = element.getChildByName('username').value;

                //  Have they entered anything?
                if (inputUsername !== '') {
                   
                    console.log('Trying to log in');
                    //POST on /api/users
                    const loggedIn = await self.postLogin(inputUsername);
                    if (loggedIn) {
                        //  Turn off the click events
                        element.removeListener('click');
                        text.setText('Login successful');
                        this.scene.start('MenuScene');
                    }
                }
            }

        });

    }

    async postLogin(username) {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: username,
                    deaths: 0
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful');
                clientDataManager.setParams(data.id, data.name, data.deaths);
                console.log(clientDataManager.name);
                return true;
            } else if (response.status === 409) {
                return false;
            }
        } catch (error) {
            console.error('Error logging in:', error);
            return false;
        }
    }
}
