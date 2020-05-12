import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;


const Chat = ( {location} ) => {
    
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const ENDPOINT = 'localhost:5000';

    useEffect( () => {
        const {name} = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);

        socket.emit('join', {name} );

    }, [ENDPOINT, location.search]);
    
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

export default Chat;