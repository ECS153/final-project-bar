# Bar
##### Blockhain Web-based Instant Messaging Application

### Blockchain
#### Smart Contract Definition
File: bar-chat-2.0 > client > src > contracts > Bar.sol  
In this file, we declare the properties of our data structure `Message` and define the `createMessage()` function which is called when a user sends a message.  
  
#### Load Ethereum Wallet (Metamask)
File: bar-chat-2.0 > client > src > components > Chat.js > loadWeb3()  
We determine if the browser has an Ethereum Wallet. Establish a connection with the wallet if the wallet is present.  
  
#### Retrieving Ethereum Accounts from Wallet
File: bar-chat-2.0 > client > src > components > Chat.js > loadBlockhainData() > lines 140-143  
Load the account associated with deploying the blockchain (the 0th account in our wallet).  
  
#### Load Deployed Smart Contract
File: bar-chat-2.0 > client > src > components > Chat.js > loadBlockhainData() > lines 146-155  
Load the deployed smart contract to work with data in the blockchain.  
   
#### Display the messages in the Blockchain
File: bar-chat-2.0 > client > src > components > Chat.js > loadBlockhainData() > lines 158-163  
Iterate through the messages within the blockchain and copy them into an array.  
  
#### Write New Messages to the Blockchain  
File: bar-chat-2.0 > client > src > components > Chat.js > createMessage()  
Javascript wrapper function to call the `createMessage()` method define in Smart Contract.  
