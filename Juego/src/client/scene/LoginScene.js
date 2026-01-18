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
        const text = this.add.text(400, 52, 'Login', { fontSize: '32px', fontFamily: 'LinLibertine', color: '#ffffffff' }).setOrigin(0.5);

        const element = this.add.dom(400, 300).createFromCache('login');

        element.setPerspective(800);

        element.addListener('click');

        const self = this;
        element.on('click', async (event) => {
            event.preventDefault();

            if (event.target.name === 'loginButton') {

                const inputUsername = element.getChildByName('username').value;
                console.log(inputUsername);

                //  Have they entered anything?
                if (inputUsername !== '') {

                    console.log('Trying to log in');
                    //POST on /api/users
                    clientDataManager.name = inputUsername;
                    const loggedIn = await clientDataManager.postLogin();
                    if (loggedIn === 201) {
                        //  Turn off the click events
                        element.removeListener('click');
                        text.setText('Login successful');
                        this.scene.start('MenuScene');
                    } else {
                        text.setText('Login failed');
                    }
                }
            }

        });

    }

}
