import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Link, withRouter } from 'react-router-dom';


import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import firebase from '../../config/firebase';
import './Chat.css';
import { checkPropTypes } from 'prop-types';

let socket;



const Chat = ( /*{location}*/ props ) => {
    
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const ENDPOINT = 'localhost:5000';

    if(!firebase.getCurrentUsername()) {
        alert('Please Login First');
        props.history.replace('/');
    }

    if(!firebase.getVerified()) {
        alert('Please verify your email first');
        props.history.replace('/');
    }
    useEffect( () => {
        //const {name} = queryString.parse(location.search);
       
        
        const name = firebase.getCurrentUsername();
        console.log(name);
        socket = io(ENDPOINT);

        setName(name);

        socket.emit('join', {name} );

    }, [ENDPOINT, /*location.search*/]);
    
    return (
        <div className="outerContainer">
        <div className="container">
            <InfoBar  />
            <Messages />
            <Input  />
        </div>
        <TextContainer />
      </div>
    );
}

export default withRouter(Chat);