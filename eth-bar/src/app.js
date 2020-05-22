App = {
    loading: false,
    contracts: {},

    load: async () => {
        await App.loadWeb3() // load library to connect to blockchain
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    // connect blockchain to browser
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                // Acccounts now exposed
                web3.eth.sendTransaction({/* ... */})
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
            // Acccounts always exposed
            web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },
    // end https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8

    loadAccount: async () => {
        App.account = web3.eth.accounts[0]
        console.log(App.account)
    },

    loadContract: async () => {
        const msgList = await $.getJSON('Bar.json')
        // truffle contract - JS representation of a smart contract
        App.contracts.Bar = TruffleContract(msgList)
        App.contracts.Bar.setProvider(App.web3Provider)

        // get smart contract values from blockchain
        App.msgList = await App.contracts.Bar.deployed()
    },

    renderMsgs: async () => {
        // Load msg count from blockchain
        const msgCount = await App.msgList.msgCount()
        const $msgTemplate = $('.msgTemplate')

        // Render each message with a new message template
        for (var i = 1; i <= msgCount; i++) {
            // truffle contracts return an array
            const msg = await App.msgList.messages(i)
            const msgID = msg[0].toNumber()
            const content = msg[1]
            console.log(msgID)
            console.log(content)

            // Create the html for the task
            const $newMsgTemplate = $msgTemplate.clone()
            $newMsgTemplate.find('.content').html(content)
            $newMsgTemplate.find('input')
                            .prop('name', msgID)
                            //.prop('checked', taskCompleted)
                            //.on('click', App.toggleCompleted)

            $('msgList').append($newMsgTemplate)

            // Show the message
            $newMsgTemplate.show()
        }

        
    },

    render: async () => {
        if (App.loading) {
            return
        }
        App.setLoading(true)

        $('#account').html(App.account)
        await App.renderMsgs()

        App.setLoading(false)
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})