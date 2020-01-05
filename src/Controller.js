class Controller {
    constructor(model, view) {
        const firebase = require("firebase");
        
        var firebaseConfig = {
            apiKey: "AIzaSyAWidlIhzJjNTMmdipX30ay5I5DVnjPcQQ",
            authDomain: "todo-c7601.firebaseapp.com",
            databaseURL: "https://todo-c7601.firebaseio.com",
            projectId: "todo-c7601",
            storageBucket: "todo-c7601.appspot.com",
            messagingSenderId: "74452236174",
            appId: "1:74452236174:web:3d4ab4f471f16be58916df",
            measurementId: "G-BLK0YRJ5VD"
        };

        
        firebase.initializeApp(firebaseConfig);
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        recaptchaVerifier.render().then(function(widgetId) {
            window.recaptchaWidgetId = widgetId;
        });

          

        this.firebase = firebase;
        this.model = model;
        this.view = view;
        this.user = 'roma';
        this.db = firebase.firestore();
        this.render();


        view.on('add', this.addTodo.bind(this));
        view.on('toggle', this.toggleTodo.bind(this));
        view.on('edit', this.editTodo.bind(this));
        view.on('remove', this.removeTodo.bind(this));
        view.on('number-submit', this.auth.bind(this));

    }

    auth() {
        const phone = this.view.getPhoneNumber();
        const appVerifier = window.recaptchaVerifier;

        this.firebase.auth().signInWithPhoneNumber(phone, appVerifier).then((confirmationResult) => {
            
            document.getElementById('verification-submit').addEventListener('click', () => {
                const code = document.getElementById('login-code').value;
                confirmationResult.confirm(code);
                this.user = phone;
                this.view.hideCodeForm();
                this.view.showMain();
                this.render();
            })
            
        });
        
        this.view.hideLoginForm();
        this.view.showCodeForm();
    }

    render() {
        this.db.collection(this.user).get().then((docs) => {
            docs.forEach(element => {
                this.view.addItem(element.data());
            });
        })
    }

    addTodo(title) {
        const item = this.model.addItem({
            id: Date.now(),
            title,
            completed: false
        });

        this.view.addItem(item);
        
        this.db.collection(this.user).doc(`${item.id}`).set(item);
    }

    toggleTodo({ id, completed }) {
        const item = this.model.updateItem(id, { completed });
        this.view.toggleItem(item);

        this.db.collection(this.user).doc(`${id}`).update({
            completed
        });
    }

    editTodo({ id, title }) {
        const item = this.model.updateItem(id, { title });
        this.view.editItem(item);

        this.db.collection(this.user).doc(`${id}`).update({
            title
        });
    }

    removeTodo(id) {
        this.model.removeItem(id);
        this.view.removeItem(id);

        this.db.collection(this.user).doc(`${id}`).delete();
    }
}

export default Controller;