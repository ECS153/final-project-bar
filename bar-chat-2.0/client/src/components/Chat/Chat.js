import React, { Component } from 'react';
import Identicon from 'identicon.js';
import './Chat.css';
import io from 'socket.io-client';
import { Link, withRouter } from 'react-router-dom';
//import './App.css';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
//import './App.css';
import Bar from '../../abis/Bar.json';
import Web3 from 'web3';
import Navbar from '../Navbar';
import firebase from '../config/firebase';
import Main from '../Main';

let socket;
class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      bar: null,
      msgCount: 0,
      messages: [],
      loading: true,
      name: '',
      newuser: '',
      room: '100',
      users:[],
      messagesBC:[],
      message:'',
      messages:[],
      socket: ''
    }
    if(!firebase.getCurrentUsername()) {
      alert('Please Login First');
      props.history.replace('/');
    }

    if(!firebase.getVerified()) {
      alert('Please verify your email first');
      props.history.replace('/');
    }
    socket  = io('localhost:5000');
    this.createMessage = this.createMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this)
    this.loadBlockchainData = this.loadBlockchainData.bind(this)
    this.setMessage = this.setMessage.bind(this);
    this.setNewUser = this.setNewUser.bind(this);
    this.setRoom = this.setRoom.bind(this);
    this.updateUsers = this.updateUsers.bind(this);
    this.removeUser = this.removeUser.bind(this);
  }

  async componentWillMount() { 
    
    
  }


  componentWillUnmount(){
    // /*this.state.*/this.socket.emit('disconnect');
    /*this.state.*/socket.off();
  }


  updateUsers(event){
    event.preventDefault();
    
    if(this.newuser) {
      this.setState({users: [...this.state.users, {"name": this.newuser}]});
      //setUsers(users => [ ...users, {"name":newuser} ]);
    }
  }

  removeUser(usr){
      
    if(usr) {
      //setRoom('');
      this.setState({users: this.state.users.filter(item => item.name !== usr)});
      //setUsers(users => users.filter(item => item.name !== usr));
    }
  }
  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
    const name = firebase.getCurrentUsername();
    console.log(this.state.name);
    // setName(name);
    // setRoom(/*room*/ '100');
    this.setState({name});
    this.setState({room: '100'});
    //setUsers([{"name":"users1"},{"name":"user2"}]); //DEBUG
    console.log("socket");
    console.log(socket);
    const room = this.state.room;
    socket.emit('join', {name, room}, (error) => {
        if(error) {
          alert(error);
        }
    });
    socket.on('message', message => {
      
      //console.log("incoming message")
      //console.log(message);
      this.setState( {messages: [ ...this.state.messages, message ]});
      console.log(this.state.messages);
      this.createMessage(message.text);

    //Blockchain.renderMsgs();
    });
  }

  setMessage(message) {
    this.setState({message});
  }
  setNewUser(user) {
    this.setState({newuser: user});
  }
  setRoom(room) {
    this.setState({room});
  }

  async loadWeb3() {
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

  async loadBlockchainData() {
    
    const web3 = window.web3;
    // load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0]});

    // load contract
    const networkID = await web3.eth.net.getId();
    console.log(networkID);
    const networkData = Bar.networks[networkID];
    console.log(networkData);
    
    if(networkData) {
      const bar = new web3.eth.Contract(Bar.abi, networkData.address)
      this.setState({ bar })
      const msgCount = await bar.methods.messageCount().call() // doesn't cost gas; .send() costs gas
      this.setState({ msgCount })
      
      // Load messages
      for (var i = 1; i <= msgCount; i++) {
        const message = await bar.methods.messages(i).call()
        this.setState({
          messagesBC: [...this.state.messagesBC, message] // Create a new array and appends new message
        })
      }
      this.setState({ loading: false})
      console.log({ messagesBC: this.state.messagesBC })
    } else {
      window.alert('Bar contract not deployed to the detected network.')
    }
  }
  
  createMessage(content) {
    this.setState({ loading: true })
    this.state.bar.methods.createMessage(content).send({ from: this.state.account })
      .once("receipt",(receipt) => {
        console.log("loading");
        this.setState({ loading: false })
        //window.location.reload(true);
      })
  }
  sendMessage(event) {
    event.preventDefault();
    if(this.state.message) {
      /*this.state.*/socket.emit('sendMessage', this.state.message, () => this.setMessage(''));
      //console.log(messages);
    }
  }

  render() {
    let isEntered = true;
    // if(room === ''){
    //   isEntered = false;
    // }
    return (
      isEntered ? 
      (
          <div className="outerContainer">
          <div className="container">
              <InfoBar  user2={this.state.room} setRoom={this.setRoom}/>
              <Messages messages={this.state.messages} name={this.state.name}/>
              <Input  message={this.state.message} setMessage={this.setMessage} sendMessage={this.sendMessage}/>
          </div>
            <TextContainer name={this.state.name} isEntered={isEntered} users={this.state.users} setRoom = {this.setRoom} 
              newuser={this.state.newuser} setNewUser={this.setNewUser} props={this.props}
              updateUsers={this.updateUsers} removeUser={this.removeUser}/>
          </div>
      ) 
      :
      (
        <div className="outerContainer">
            <TextContainer name={this.state.name} isEntered={isEntered} users={this.state.users} setRoom = {this.setRoom} 
              newuser={this.state.newuser} setNewUser={this.setNewUser} props={this.props}
              updateUsers={this.updateUsers} removeUser={this.removeUser}/>
        </div>
      )
  );
  }
}

export default withRouter(Chat);




