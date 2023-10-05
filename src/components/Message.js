import React from 'react';

const Message = ({ text, sender }) => {
  const isUser = sender === 'user';

  const bubbleStyle = {
    backgroundColor: isUser ? '#007bff' : '#e5e5ea',
    color: isUser ? 'white' : 'black',
    borderRadius: isUser ? '20px 20px 20px 0' : '20px 20px 0 20px',
    padding: '10px 15px',
    display: 'inline-block', // Allow bubbles to adjust width based on content
    wordWrap: 'break-word',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    marginBottom: '10px', // Adjust the spacing between message bubbles
  };

  return (
    <div style={bubbleStyle}>
      {text}
    </div>
  );
};

export default Message;
