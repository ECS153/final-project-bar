import React, { useState } from 'react';
import firebase from '../config/firebase';
import {Link, withRouter} from 'react-router-dom';

function Register(props) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="loginBoxContainer">
            <div className="loginBox" >
                <h1 className="loginTitle">Register</h1>
                <div>
                    <input name="username" placeholder="Enter username" className="loginInput" type="text" onChange={e => setUsername(e.target.value)} value={username}/>
                </div>
                <div>
                    <input name="email" placeholder="Enter Email Address" className="loginInput mt-20" type="email" onChange={e => setEmail(e.target.value)} value={email}/>
                </div>
                <div>
                    <input name="password" placeholder="Enter Password" className="loginInput mt-20" type="password" onChange={e => setPassword(e.target.value)} value={password}/>
                </div>
                <button className="loginButton mt-20" type="submit" onClick={onRegister}>Register</button>
            </div>
        </div>
    );
    async function onRegister() {
        try {
            await firebase.register(username, email, password);
            
            //props.history.replace('/chat');
        } catch(error) {
            alert(error.message);
        }

        try {
            await verify();
        } catch(error) {
            alert(error.message);
        }
    }

    async function verify() {
        try {
            await firebase.verifyEmail();
            props.history.replace('/');
        } catch(error) {
            alert(error.message);
        }
    }
}

export default withRouter(Register);