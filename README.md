# Bar
##### Blockhain Web-based Instant Messaging Application

## Running the Application
### 1. Install Ethereum Wallet  
Install Ganache (https://www.trufflesuite.com/ganache) and Metamask (https://metamask.io/)

### 2. Install Dependencies  
Navigate to `bar-chat-2.0` and run the command `npm i`.  

### 3. Launch Ganache
Launch Ganache so that the ethereum accounts are available to the Blockchain that you are about to deploy.  

### 4. Migrate the Smart Contract  
Launch the terminal and navigate to the directory <em>bar-chat-2.0 > client</em> and run the command `truffle migrate --reset` to deploy a new smart contract. The first Ganache account will be used as the deployer by default. You can verify this by check if the balance in your ganache account drops. You only have to deploy once.  
  
### 5. Specify your Blockchain Network on Metamask
For the purposes of this project, we have set our development network as 127.0.0.1:7545. This configuration is in <em>bar-chat-2.0 > client > truffle-config.js</em>  
The top dropdown in Metamask is where you will connect to a network. Select the dropdown and choose `Custom RPC`. Input the following:  
  
Network Name: HTTP.//127/0/0/1:7545  
New RPC URL: http://127.0.0.1  

This step creates the network our blockchain is running on. Select this newly create network.

### 6. Import Ganache Accounts into Metamask Ethereum Wallet
In Google Chrome, click on the Metamask extension icon (A Fox). You will have to make a new account if you are using Metamask the first time. Click `Restore your account using seed phrase`. Copy the Mnemonic phrase from Ganache (Above your first account) and paste it in the Wallet Seed field in Metamask and then create your password. This should bring all your Ethereum accounts into Metamask.  
  
If you have to manually add your accounts, click on the Icon at the top right corner of the extension. Then click on `Import Account` and use a Private Key to do so. You can obtain the account's private key in Ganache by clicking on the key icon at the rightmost end of an account entry. The private key is what you need to paste in Metamask to add your account.  
  
### 7. Run the server
Open a new terminal session and navigate to <em>bar-chat-2.0 > server</em> then run the command `npm run start`.

### 8. Run the client
With the terminal session running the server opened, launch a new terminal session and navigate to <em>bar-chat-2.0 > client</em> then run the command `npm run start`.

## Blockchain
### Smart Contract Definition
<em>File: bar-chat-2.0 > client > src > contracts > Bar.sol</em>  
In this file, we declare the properties of our data structure `Message` and define the `createMessage()` function which is called when a user sends a message.  
  
### Load Ethereum Wallet (Metamask)
<em>File: bar-chat-2.0 > client > src > components > Chat.js > loadWeb3()</em>    
We determine if the browser has an Ethereum Wallet. Establish a connection with the wallet if the wallet is present.  
  
### Retrieving Ethereum Accounts from Wallet
<em>File: bar-chat-2.0 > client > src > components > Chat.js > loadBlockhainData() > lines 140-143</em>    
Load the account associated with deploying the blockchain (the 0th account in our wallet).  
  
### Load Deployed Smart Contract
<em>File: bar-chat-2.0 > client > src > components > Chat.js > loadBlockhainData() > lines 146-155</em>    
Load the deployed smart contract to work with data in the blockchain.  
   
### Display the messages in the Blockchain
<em>File: bar-chat-2.0 > client > src > components > Chat.js > loadBlockhainData() > lines 158-163</em>    
Iterate through the messages within the blockchain and copy them into an array.  
  
### Write New Messages to the Blockchain  
<em>File: bar-chat-2.0 > client > src > components > Chat.js > createMessage()</em>    
Javascript wrapper function to call the `createMessage()` method define in Smart Contract.  

### Firebase  
<em>File: bar-chat-2.0 > client > src > components > config > firebase.js</em>  
This file contains a Firebase class which takes care of all the calls to firebase and all firebase related operations.  
The variable `firebaseConfig` contains the configuration needed to set-up firebase authentication on the system and make calls to firebase.  
The Firebase class contains:  
`constructor()` which initializes Firebase, and Firebase authentication  
`login(email, password)` which makes a call to Firebase to sign the user in with said password and email.  
`logout()` which makes a call to Firebase to sign the user out.  
`register(name, email, password)` which makes a call to Firebase to create an account with username: name, email: email and password: password.  
`isInitialized()` which makes a call to Firebase to check if the current user has been logged in.  
`getCurrentUsername()` which checks if the current user is logged in/exists and returns the username.  
`verifyEmail()` which makes a call to Firebase to send a verification link to the user's email.  
`getVerified()` which checks if the user has verified their email.  
   
### User Login Page  
<em>File: bar-chat-2.0 > client > src > components > Login > Login.js </em>  
This file contains the front-end code for the UI in JSX and for mananaging the login email and password state components.   
Clicking the login button will trigger the `login()` function. This function calls `firebase.login()` from firebase.js  
This function invokes the firebase login functionality, to process the user's login information.    

### User Register Page  
<em>File: bar-chat-2.0 > client > src > components > Register > Register.js </em>  
This file contains the front-end code for the UI in JSX and for managing the username, email and password state components.  
`onRegister` gets called when the user clicks the register button and this invokes the `firebase.register()` function from firebase.js. Thus registering an account with said email and password. It then calls `verifyEmail()` which handles email verification.  
`verifyEmail()` gets called in `onRegister()` after a user account with the email is created. It then calls `firebase.verifyEmail()` function from firebase.js which hanles email verification. This function also leads the user back to the login page to login after verification.  

### Chat Page  
<em>File: bar-chat-2.0 > client > src > components > Chat > Chat.js </em>  
This file contains the front-end code for the UI in JSX and for mananaging the message and user state components.   
Clicking the logout button will trigger the `firebase.logout()` function from firebase.js and redirect the Login page. 
The chat window will send and receive real-time messages to multiple users by keeping track of the `messages` state. To send message, `socket.emit('sendMessage',...)` will get called to update the `messages` state on the server. To receive message, `socket.on('message',...)` will keep listening on the socket and updating `messages` state.
Here the user also has the ability to add, remove, and select different users. Since we are fixing the room number for the purpose of this project, this functionality will be reserved for future work.  

### Checking if the user is logged in and verified on Chat page  
<em>File: bar-chat-2.0 > client > src > components > Chat > Chat.js > ComponentDidMount() > lines 83-87</em>  
This part of the code checks if the user is logged in and has verified their email by calling `firebase.getVerified()` and `firebase.getCurrentUsername()`from firebase.js.  
If the user has not verified their email, an alert telling them that will pop-up and they will be led back to the login page.  

### Implementing Server side  
<em>File: bar-chat-2.0 > server > index.js </em>  
To implement the server side chat functionality we used express middleware, http and socket.io to use sockets so we can send real-time messages to multiple users.  
Server currently runs on localhost and listens to port 5000.
`io.on()` initializes the connection.  
`socket.on('join', ...)`, receives messages from `socket.emit('join')` from the client side and gets the user info sent and put it in an array of users in users.js. Here the user which send the message will also be joined to `room=100` which is the room used for the live chat app.  
`socket.on('sendMessage',...)` receives the users' text messages, and broadcasts the text message and the user's name to the room.  
`socket.on('disconnect',...)` disconnects the user from the room and removes the user from the users array in users.js.  
<em>File: bar-chat-2.0 > server > users.js </em>   
This file users.js is used to manage users.  
`addUser({id,name})` adds a user object with id and name into the users array.  
`removeUser(id)` removes a user with socket id = id from the users array.   
`getUser(id)` gets a user object with socket id= id from the users array.  
`getUsersInRoom(room)` gets all the user objects in the room.  

### Joining the room  
<em>File: bar-chat-2.0 > client > src > components > Chat > Chat.js > ComponentDidMount() > lines 93-97</em>  
`socket.emit('join',...)` sends user info to the server and requests to join the room.  

### Receiving Messages from the server  
<em>File: bar-chat-2.0 > client > src > components > Chat > Chat.js > ComponentDidMount() > lines 98-101</em>  
`socket.on('message',...)` receives messages back from the server and adds it to the `messages` state.  

### Sending Messages from the client  
<em>File: bar-chat-2.0 > client > src > components > Chat > Chat.js > sendMessage()</em>  
`socket.emit('sendMessage',...)` sends message from the `message` state to the server and clears it after.  







