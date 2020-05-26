import React, { Component } from 'react';
import Identicon from 'identicon.js';
import './Chat.css';
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
import {useBeforeFirstRender} from '../componentWillUnmount/componentWillUnmount';

let socket;


class Chat extends React.Component {
  // const [name, setName] = useState('');
  //   const [room, setRoom] = useState('');
  //   const [newuser, setNewUser] = useState('');
  //   const [users, setUsers] = useState([]);
  //   const [message, setMessage] = useState('');
  //   const [messages, setMessages] = useState([]);
  //   const ENDPOINT = 'localhost:5000';
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
      room: '',
      users:[],
      message:'',
      messages:[],
      socket: '',
      ENDPOINT: 5000
    }
    if(!firebase.getCurrentUsername()) {
      alert('Please Login First');
      props.history.replace('/');
    }

    if(!firebase.getVerified()) {
      alert('Please verify your email first');
      props.history.replace('/');
    }
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
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  componentDidMount() {
    this.setState({name: firebase.getCurrentUsername()});
    const name = firebase.getCurrentUsername();
    this.setState({name});
    console.log(this.state.name);
    this.state.socket = io(this.state.ENDPOINT);

    // setName(name);
    // setRoom(/*room*/ '100');
    this.setState({room: '100'});
    //setUsers([{"name":"users1"},{"name":"user2"}]); //DEBUG
  
    const room = this.state.room;
    this.state.socket.emit('join', {name, room}, (error) => {
        if(error) {
          alert(error);
        }
    });
  }

  componentDidUpdate() {
    console.log("here")
    this.state.socket.on('message', message => {
      
      //console.log("incoming message")
      //console.log(message);
      this.setState( {messages: [ ...this.state.messages, message ]});
      console.log(this.state.messages);
      this.createMessage(message);

      //Blockchain.renderMsgs();
    });
  }

  componentWillUnmount(){
    this.state.socket.emit('disconnect');
    this.state.socket.off();
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
  componentDidMount() {
    this.setState({name: firebase.getCurrentUsername()});
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
          messages: [...this.state.messages, message] // Create a new array and appends new message
        })
      }
      this.setState({ loading: false})
      console.log({ messages: this.state.messages })
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
        window.location.reload(true);
      })

  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading 
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main 
              messages={this.state.messages}
              createMessage={this.createMessage} 
            />
        }
      </div>
    );
  }
}

export default Chat;
