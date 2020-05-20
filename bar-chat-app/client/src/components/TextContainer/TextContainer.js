import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import firebase from '../../config/firebase';
import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './TextContainer.css';

const TextContainer = ({ name, isEntered, users, setRoom, newuser, setNewUser, updateUsers, removeUser, props }) => {

  return (
    <div className="textContainer">
      <h3 className="account">My Account: {name}</h3>
      <button className="logoutButton" onClick={logout}>Log Out</button>
      {
        isEntered
          ? (
            <div>
              <h2>Add Users</h2>
              <input
                className="inputName" type="text" placeholder="Type an email address..."
                value={newuser} onChange={({ target: { value } }) => setNewUser(value)}
                onKeyPress={event => event.key === 'Enter' ? updateUsers(event) : null}/>
              <button className="addButton" onClick={e => updateUsers(e)}>Add</button>

              <h2 id="userList">Select One Added Users To Start:</h2>
              <div className="activeContainer">
                <h2>
                  {users.map( ({name}) => (
                    <div key={name} className="activeItem" onClick={e => setRoom(name)} >
                      <img alt="Online Icon" src={onlineIcon}/>{name} </div>))}
                </h2>
              </div>
            </div>
          )
          :(
            <div>
            <h2>Add Users</h2>
            <input
              className="inputName" type="text" placeholder="Type an email address..."
              value={newuser} onChange={({ target: { value } }) => setNewUser(value)}
              onKeyPress={event => event.key === 'Enter' ? updateUsers(event) : null}/>
            <button className="addButton" onClick={e => updateUsers(e)}>Add</button>
                
    
              <h2 id="userList">Select One Added Users To Start:</h2>
              <div className="activeContainer">
                <h2>
                  {users.map( ({name}) => (
                    <div key={name} className="activeItem" onClick={e => setRoom(name)} >
                      <img alt="Online Icon" src={onlineIcon}/>{name} 
                      <img alt="Remove Icon" src={closeIcon} onClick={e => {
                            e.stopPropagation();
                            removeUser(name);
                          }}/>  
                    </div>))}

                </h2>
              </div>
            </div>
          )
      }
    </div>
    
  );

  async function logout() {
    await firebase.logout();
    props.history.push('/');
  }

}


export default withRouter(TextContainer);