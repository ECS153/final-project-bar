import React from 'react';
import closeIcon from '../../icons/closeIcon.png'
import onlineIcon from '../../icons/onlineIcon.png'

import './InfoBar.css';

const InfoBar = ({user2, props, setRoom}) => {
  return (
    <div className="infoBar">
      <div className="leftInnerContainer">
        <img className="onlineIcon" src={onlineIcon} alt="online icon" />
        <h3>{user2}</h3>
      </div>
      <div className="rightInnerContainer" onClick={e => setRoom('')}>
        <img src={closeIcon} alt="close icon" />
      </div>
    </div>
  );

}
  


export default InfoBar;