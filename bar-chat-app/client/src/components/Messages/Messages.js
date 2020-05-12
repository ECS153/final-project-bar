import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import './Messages.css';

const Messages = () => (
  <ScrollToBottom className="messages">
    <div> <h3> Message 1 (by user 1)</h3> </div>
    <div> <h3> Message 2 (by user 2)</h3> </div>
    <div> <h3> Message 3 (by user 1)</h3> </div>
  </ScrollToBottom>
);

export default Messages;