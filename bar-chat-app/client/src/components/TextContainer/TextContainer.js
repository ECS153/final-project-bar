import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users }) => (
  <div className="textContainer">
    {
      users
        ? null // TODO
        : (
            <div>
            <h2>People in chat:</h2>
            <div className="activeContainer">
              <h2>
                  <div key="name1" className="activeItem">
                    "Name 1"
                    <img alt="Online Icon" src={onlineIcon}/>
                  </div>
                  <div key="name2" className="activeItem">
                    "Name 2"
                    <img alt="Online Icon" src={onlineIcon}/>
                  </div>
              </h2>
            </div>
          </div>
        ) // change to null
    }
  </div>
);

export default TextContainer;