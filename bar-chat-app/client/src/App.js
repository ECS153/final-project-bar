import React , { useState, useEffect, Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Chat from './components/Chat/Chat';
import firebase from './config/firebase';
import Bar_app from './eth-bar/src/app';


const App = () => {
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);

    useEffect(() => {
        firebase.isInitialized().then( val => {
            setFirebaseInitialized(val);
        })
        //Bar_app.load();
    });
    return firebaseInitialized !== false ? (
        <Router>
            <Route exact path="/" component={Login} /> 
            <Route exact path="/register" component={Register} /> 
            <Route path="/chat" component={Chat} />
        </Router>
    ) : <div id="loader">Loading ... </div>
}
export default App;