import React , { useState, useEffect, Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Chat from './components/Chat/Chat';
import firebase from './config/firebase';


// class App extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             name: '',
//             user: {}
//         }
//     }
//     componentDidMount() {
//         fire.auth().onAuthStateChanged((user) => {
//             if (user) {
//                 this.setState({user});
//             } else {
//                 this.setState({user: null});
//             }
//         });
//     }
//     render() {
//         return (
//             <div className="App">
//                 {this.state.user ? (<Chat />) : ( <Login />)}
//             </div>
//         // <Router>
//         //     <Route path="/" component={Login} /> ): (<Route path="/" component={Chat} />)}
            
//         //     <Route path="/chat" component={Chat} />
//         // </Router>
//         );
//     }   
// }
const App = () => {
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);

    useEffect(() => {
        firebase.isInitialized().then( val => {
            setFirebaseInitialized(val);
        })
    });
    return firebaseInitialized !== false ? (
        <Router>
            <Route exact path="/" component={Login} /> 
            <Route exact path="/register" component={Register} /> 
            <Route path="/chat" component={Chat} />
        </Router>
    ) : <div id="loader">Loading ... </div>
}
export default App;