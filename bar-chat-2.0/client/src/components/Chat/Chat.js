import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Link, withRouter } from 'react-router-dom';
import Identicon from 'identicon.js';
import './Chat.css';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Bar from '../../abis/Bar.json';
import Web3 from 'web3';
import Navbar from '../Navbar';
import firebase from '../config/firebase';
import Main from '../Main';
import {useBeforeFirstRender} from '../componentWillUnmount/componentWillUnmount';

let socket;
const Chat = (props) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [newuser, setNewUser] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [account, setAccount] = useState('');
  const [bar, setBar] = useState(null);
  const [msgCount, setMsgCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const ENDPOINT = 'localhost:5000';
  if(!firebase.getCurrentUsername()) {
    alert('Please Login First');
    props.history.replace('/');
  }

  if(!firebase.getVerified()) {
    alert('Please verify your email first');
    props.history.replace('/');
  }

  useBeforeFirstRender(async () => {
    await loadWeb3()
    await loadBlockchainData()
  })




  useEffect( () => {
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
  }, [ENDPOINT, /*location.search*/]);

  useEffect(() =>  {
    
    console.log("here")
    socket.on('message', message => {
      
      //console.log("incoming message")
      //console.log(message);
      //setMessages(messages => [ ...messages, message ]);
      console.log(messages);
      createMessage(message);

      //Blockchain.renderMsgs();
    });
    //componentWillMount();
    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, []);

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


  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  const loadBlockchainData = async () => {
    
    const web3 = window.web3;
    // load account
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setAccount(account);

    // load contract
    const networkID = await web3.eth.net.getId();
    console.log(networkID);
    const networkData = Bar.networks[networkID];
    console.log(networkData);
    
    if(networkData) {
      const bar = new web3.eth.Contract(Bar.abi, networkData.address)
      setBar(bar);
      const msgCount = await bar.methods.messageCount().call() // doesn't cost gas; .send() costs gas
      setMsgCount(msgCount)
      
      // Load messages
      for (var i = 1; i <= msgCount; i++) {
        const message = await bar.methods.messages(i).call()
        setMessages([...messages, message]) // Create a new array and appends new message 
      }
      setLoading(false)
      console.log({ messages})
    } else {
      window.alert('Bar contract not deployed to the detected network.')
    }
  }
  
  const createMessage = (content) => {
    setLoading(true);
    bar.methods.createMessage(content).send({ from: account })
      .once("receipt",(receipt) => {
        console.log("loading");
        setLoading(false)
        window.location.reload(true);
      })
  }
  const sendMessage = (event) => {
    event.preventDefault();
    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
      //console.log(messages);
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




