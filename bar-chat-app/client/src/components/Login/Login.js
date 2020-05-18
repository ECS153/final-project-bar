import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import './Login.css';
import { firstOfType } from 'glamor';
import firebase from '../../config/firebase';

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="loginBoxContainer">
            <div className="loginBox" >
                <h1 className="loginTitle">Log In</h1>
                <div>
                    <input name="email" placeholder="Enter Email Address" className="loginInput" type="email" onChange={e => setEmail(e.target.value)} value={email}/>
                </div>
                <div >
                    <input name="password" placeholder="Enter Password" className="loginInput mt-20" type="password" onChange={e => setPassword(e.target.value)} value={password}/>
                </div>
                <button className="loginButton mt-20" type="submit" onClick={login}>Log In</button>
                <Link to={'/register'} >
                    <button className="loginButton mt-20" type="submit" >Register</button>
                </Link>
            </div>
        </div>
    );
    async function login() {
        try {
            await firebase.login(email, password);
            props.history.push('/chat');
        } catch(error) {
            alert(error.message);
        }
    }
}

export default withRouter(Login);