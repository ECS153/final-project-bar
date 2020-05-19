import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import firebase from '../../config/firebase';
import closeIcon from '../../icons/closeIcon.png'
import onlineIcon from '../../icons/onlineIcon.png'

import './InfoBar.css';
import { checkPropTypes } from 'prop-types';

const InfoBar = (props) => {
  return (
    <div className="infoBar">
      <div className="leftInnerContainer">
        <img className="onlineIcon" src={onlineIcon} alt="online icon" />
        <h3>User2</h3>
      </div>
      <div className="rightInnerContainer">
        {/* <a href="/"><img src={closeIcon} alt="close icon" /></a> */}
        <div onClick={logout}><img src={closeIcon} alt="close icon" /></div>
      </div>
    </div>
  );

  async function logout() {
    await firebase.logout();
    props.history.push('/');
  }
}
  


export default withRouter(InfoBar);