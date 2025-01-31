import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Avatar, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const handleSend = () => {
    if (input.trim()) {
      // Add user message to chat
      setMessages([...messages, { text: input, sender: 'user' }]);

      // Mock AI response (replace with API call later)
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `You said: "${input}"`, sender: 'ai' },
        ]);
      }, 500);

      // Clear input
      setInput('');
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '95vh',
        maxWidth: '600px',
        margin: '5px auto',
        padding: '20px',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Chat Header with Image */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <Avatar
          alt="AI Avatar"
          src="https://via.placeholder.com/150" // Replace with your image URL
          sx={{ width: 56, height: 56 }}
        />
        <Typography variant="h5">AI Chatbot</Typography>
      </Box>

      {/* Chatbox */}
      <Paper
        elevation={3}
        ref={chatContainerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px',
          backgroundColor: 'white',
        }}
      >
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <ListItemText
                primary={message.text}
                sx={{
                  backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                  padding: '10px',
                  borderRadius: '10px',
                  maxWidth: '70%',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Input Box */}
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default App;
