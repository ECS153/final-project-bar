import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Link, withRouter } from 'react-router-dom';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';

import Blockchain from '../../eth-bar/src/blockchain';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import firebase from '../../config/firebase';
import './Chat.css';
import { checkPropTypes } from 'prop-types';
import BarData from '../../eth-bar/build/contracts/Bar.json'; 

let socket;

const Chat = ( /*{location}*/ props ) => {
    
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [newuser, setNewUser] = useState('');
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [mmAccount, setmmAccount] = useState('0x0');
    const ENDPOINT = 'localhost:5000';
    let web3Provider = null;
    let web3 = null
    let msgList = null;

    if(!firebase.getCurrentUsername()) {
        alert('Please Login First');
        props.history.replace('/');
    }

    if(!firebase.getVerified()) {
        alert('Please verify your email first');
        props.history.replace('/');
    }

    if (web3 !== null) {
      web3Provider = web3.currentProvider;
      console.log('web3Provider if');
      console.log(web3Provider);
    } else {
      web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');  
      console.log("web3Provider else");
      console.log(web3Provider) 
    }

    web3 = new Web3(web3Provider);
    msgList = TruffleContract(BarData);
    msgList.setProvider(web3Provider);
    console.log(msgList);
    let msgListInstance = null;

    useEffect( () => {
        //const {name} = queryString.parse(location.search);
        
        const name = firebase.getCurrentUsername();
        console.log(name);
        socket = io(ENDPOINT);

        setName(name);
        setRoom(/*room*/ '100');
        //setUsers([{"name":"users1"},{"name":"user2"}]); //DEBUG

        socket.emit('join', {name, room}, (error) => {
            if(error) {
              alert(error);
            }
        });

        return () => {
          socket.emit('disconnect');
          socket.off();
        }

    }, [ENDPOINT, /*location.search*/]);
    
    useEffect(() => {
        console.log("here")
        socket.on('message', message => {
          
          //console.log("incoming message")
          //console.log(message);
          setMessages(messages => [ ...messages, message ]);
          //Blockchain.createMessage(message.text);
          //Blockchain.renderMsgs();
        });
        //console.log(messages);
        /*socket.on("roomData", ({ users }) => {
          setUsers(users);
        });*/
        //console.log('outta');

    },[]);

    const sendMessage = (event) => {
        event.preventDefault();
        //console.log(message);
        if(message) {
          web3.eth.getCoinbase((err,account) => {
            setmmAccount(account);
            console.log(account)
            console.log(msgList);
            msgList.deployed().then((instance) => {
              msgListInstance = instance;
              console.log(instance);
              console.log("before create message");
              msgListInstance.createMessage(message);
              console.log("after create message");
            })
          })
          socket.emit('sendMessage', message, () => setMessage(''));
          //console.log(messages);
          
        }
      }

    const updateUsers = (event) => {
        event.preventDefault();
        
        if(newuser) {
          setUsers(users => [ ...users, {"name":newuser} ]);
        }
    }

    const removeUser = (usr) => {
      
      if(usr) {
        //setRoom('');
        setUsers(users => users.filter(item => item.name !== usr));
      }
  }
    
    let isEntered = true;
    // if(room === ''){
    //   isEntered = false;
    // }

    return (
        isEntered ? 
        (
            <div className="outerContainer">
            <div className="container">
                <InfoBar  user2={room} setRoom={setRoom}/>
                <Messages messages={messages} name={name}/>
                <Input  message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
              <TextContainer name={name} isEntered={isEntered} users={users} setRoom = {setRoom} 
                newuser={newuser} setNewUser={setNewUser} props={props}
                updateUsers={updateUsers} removeUser={removeUser}/>
            </div>
        ) 
        :
        (
          <div className="outerContainer">
              <TextContainer name={name} isEntered={isEntered} users={users} setRoom = {setRoom} 
                newuser={newuser} setNewUser={setNewUser} props={props}
                updateUsers={updateUsers} removeUser={removeUser}/>
          </div>
        )
    );
}

export default withRouter(Chat);