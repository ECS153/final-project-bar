import Web3 from 'web3';  
import TruffleContract from 'truffle-contract' ;
import BarData from '../build/contracts/Bar.json'

// let BarJSON = require(
// const fs = require('fs')
// let BarData = fs.readFileSync('./build/contracts/Bar.json')

const Bar_app = {
    loading: false,
    contracts: {},

    load: async () => {
        await Bar_app.loadWeb3() // load library to connect to blockchain
        await Bar_app.loadAccount()
        await Bar_app.loadContract()
        await Bar_app.render()
    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    // connect blockchain to browser
    loadWeb3: async () => {
        if (typeof window.web3 !== 'undefined') {
            Bar_app.web3Provider = window.web3.currentProvider
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            try {
                // Request account access if needed
                await window.ethereum.enable()
                // Acccounts now exposed
                window.web3.eth.sendTransaction({/* ... */})
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            Bar_app.web3Provider = window.web3.currentProvider
            window.web3 = new Web3(window.web3.currentProvider)
            // Acccounts always exposed
            window.web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },
    // end https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8

    loadAccount: async () => {
        Bar_app.account = window.web3.eth.accounts[0]
        console.log(Bar_app.account)
    },

    loadContract: async () => {
        const msgList = BarData;
        console.log("Msg LIST")
        console.log(msgList);
        // truffle contract - JS representation of a smart contract
        Bar_app.contracts.Bar = TruffleContract(msgList)
        Bar_app.contracts.Bar.setProvider(Bar_app.web3Provider)

        // get smart contract values from blockchain
        Bar_app.msgList = await Bar_app.contracts.Bar.deployed()
    },

    renderMsgs: async () => {
        // Load msg count from blockchain
        const msgCount = await Bar_app.msgList.msgCount()
        //const $msgTemplate = $('.msgTemplate')

        // Render each message with a new message template
        for (var i = 1; i <= msgCount; i++) {
            // truffle contracts return an array
            const msg = await Bar_app.msgList.messages(i)
            const msgID = msg[0].toNumber()
            const content = msg[1]
            console.log(msgID)
            console.log(content)

            // Create the html for the task
            //const $newMsgTemplate = $msgTemplate.clone()
            //$newMsgTemplate.find('.content').html(content)
            //$newMsgTemplate.find('input')
                            //.prop('name', msgID)
                            //.prop('checked', taskCompleted)
                            //.on('click', Bar_app.toggleCompleted)

            //$('msgList').append($newMsgTemplate)

            // Show the message
            //$newMsgTemplate.show()
        }

        
    },

    render: async () => {
        if (Bar_app.loading) {
            return
        }
        Bar_app.setLoading(true)

       // $('#account').html(Bar_app.account)
        await Bar_app.renderMsgs()

        Bar_app.setLoading(false)
    },

    createMessage: async (content) => {
        Bar_app.setLoading(true)
        console.log(content);
        //const content = $('#newMsg').val()
        await Bar_app.msgList.createMessage(content)
        Bar_app.renderMsgs();
        window.location.reload()
    },

    setLoading: (boolean) => {
        Bar_app.loading = boolean
        //const loader = $('#loader')
        //const content = $('#content')
        // if (boolean) {
        //     loader.show()
        //     content.hide()
        // } else {
        //     loader.hide()
        //     content.show()
        // }
    }
}

// $(() => {
//     $(window).load(() => {
//         bar_app.load()
//     })
// })
Bar_app.load();

export default Bar_app;