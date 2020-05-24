import Web3 from 'web3';  
import TruffleContract from 'truffle-contract' ;
import BarData from '../build/contracts/Bar.json'

// let BarJSON = require(
// const fs = require('fs')
// let BarData = fs.readFileSync('./build/contracts/Bar.json')

class Blockchain {
    constructor() {
        this.loading = false;
        this.contracts = {};
        this.web3Provider = null;
        this.msgList = null;
        this.load = this.load.bind(this);
        this.loadWeb3 = this.loadWeb3.bind(this);
        this.loadAccount = this.loadAccount.bind(this);
        this.loadContract = this.loadContract.bind(this);
        this.renderMsgs = this.renderMsgs.bind(this);
        this.createMessage = this.createMessage.bind(this);
    }

    async load() {
        await this.loadWeb3();
        await this.loadAccount();
        await this.loadContract();
        //await this.render();
    }
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    // connect blockchain to browser
    async loadWeb3() {

        if (typeof window.web3 !== 'undefined') {
            this.web3Provider = window.web3.currentProvider
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }

        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            try { 
                window.ethereum.enable().then(function() {
                // User has allowed account access to DApp...
                console.log("account okay")
            });
            } catch(e) {
                // User has denied account access to DApp...
                console.log("account denied")
            }
        }
        // Legacy DApp Browsers
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        // Non-DApp Browsers
        else {
            alert('You have to install MetaMask !');
        }
    }

    async loadAccount() {
        window.web3.defaultAccount = window.web3.eth.accounts[0]
        this.account = window.web3.eth.accounts[0]
        console.log(this.account)
    }

    async loadContract() {
        const msgList = BarData;
        //console.log("Msg LIST")
        //console.log(msgList);
        // truffle contract - JS representation of a smart contract
        this.contracts.Bar = TruffleContract(msgList)
        this.contracts.Bar.setProvider(this.web3Provider)

        // get smart contract values from blockchain
        this.msgList = await this.contracts.Bar.deployed().catch((error) => console.log(error))
        console.log(this.msgList);
        console.log("done");
    }

    async renderMsgs() {
        // Load msg count from blockchain
        const msgCount = await this.msgList.msgCount()
        //const $msgTemplate = $('.msgTemplate')

        // Render each message with a new message template
        for (var i = 1; i <= msgCount; i++) {
            // truffle contracts return an array
            const msg = await this.msgList.messages(i)
            const msgID = msg[0].toNumber()
            const content = msg[1]
            console.log(msgID)
            console.log(content)
        }
    }

    async createMessage(content) {

        console.log(window.web3.currentProvider)
        console.log(this.web3Provider)
        await this.msgList.createMessage(content).catch((error) => console.log(error))
        this.renderMsgs();
        //window.location.reload()
    }

}

export default new Blockchain();