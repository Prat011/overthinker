import React from 'react';

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.type}`}>
      <div className="message-content">
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;