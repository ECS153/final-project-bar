import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Join.css';
const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    return (
       <div className="logInBox" >
            <h1 className="logInTitle">Log In</h1>
            <div><input placeholder="" className="logInInput" type="text" onChange={(event) => setName(event.target.value)}/></div>
            <div><input placeholder="" className="logInInput" type="text" onChange={(event) => setPassword(event.target.value)}/></div>
            <Link onClick={event => (!name || !room) ? event.preventDefault() : null} >
                <button className="logInButton" type="submit">Log In</button>
            </Link>
       </div>
    );
}

export default Login;