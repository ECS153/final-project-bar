import React, { Component } from 'react';
import Identicon from 'identicon.js';
import './App.css';
import Bar from '../abis/Bar.json'
import Web3 from 'web3';
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      bar: null,
      msgCount: 0,
      messages: [],
      loading: true
    }

    this.createMessage = this.createMessage.bind(this)
    this.loadBlockchainData = this.loadBlockchainData.bind(this)
    this.setState = this.setState.bind(this)
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
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
    const web3 = window.web3
    // load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // load contract
    const networkID = await web3.eth.net.getId()
    console.log(networkID)
    const networkData = Bar.networks[networkID]
    console.log(networkData)
    
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
      .once("confirmation",(confirmation, receipt) => {
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

export default App;
