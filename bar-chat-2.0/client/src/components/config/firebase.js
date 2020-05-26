import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCkMURgNJA5szryot-Rp_NobFPZdPbJTzE",
    authDomain: "ecs153-bar.firebaseapp.com",
    databaseURL: "https://ecs153-bar.firebaseio.com",
    projectId: "ecs153-bar",
    storageBucket: "ecs153-bar.appspot.com",
    messagingSenderId: "77488178908",
    appId: "1:77488178908:web:32047eb6c1c91b039ed619",
    measurementId: "G-6XMS32HB29"
  };


class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.db = app.firestore();
    }

    login(email,password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    logout() {
        return this.auth.signOut();
    }

    async register(name, email, password) {
        await this.auth.createUserWithEmailAndPassword(email, password)
        return this.auth.currentUser.updateProfile({
            displayName: name
        })
    }

    isInitialized() {
        return new Promise(resolve => {
            this.auth.onAuthStateChanged(resolve);
        })
    }
    getCurrentUsername() {
        return this.auth.currentUser && this.auth.currentUser.displayName;
    }

    verifyEmail() {
        this.auth.currentUser.sendEmailVerification()
            .then(() => {
                //email sent
            })
            .catch((error) => {
                alert(error.message);
            })
    }

    getVerified() {
        return this.auth.currentUser.emailVerified;
    }


}

export default new Firebase();