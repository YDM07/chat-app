import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const socket = io('http://localhost:5000'); // your backend server

function Chat({ user }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receive-message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off('receive-message');
  }, []);

  const sendMessage = () => {
    if (message.trim() === '') return;

    const messageData = {
      content: message,
      sender: user.email,
    };

    socket.emit('send-message', messageData);
    setMessages((prev) => [...prev, messageData]);
    setMessage('');
  };

  return (
    <div style={styles.container}>
      <h2>Welcome, {user.email}</h2>
      <button onClick={() => signOut(auth)} style={styles.logout}>Logout</button>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div style={styles.inputRow}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    fontFamily: 'Arial',
  },
  chatBox: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '10px',
    height: '300px',
    overflowY: 'auto',
    marginBottom: '10px',
  },
  message: {
    marginBottom: '8px',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
  },
  sendButton: {
    padding: '10px 16px',
    backgroundColor: '#2c7be5',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  logout: {
    background: '#eee',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '10px',
    border: '1px solid #999',
  },
};

export default Chat;
