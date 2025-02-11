import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, TextField, Button, Avatar, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatPage = () => {
  const location = useLocation();
  const characterName = location.state?.characterName || 'AI';
  const characterSetUp = `You are an AI assistant designed to have a natural and engaging conversation with the user. You will Use ${characterName}'s history, characteristics, and preferences to provide accurate and personalized responses and act as ${characterName}. Ask follow-up questions to the user to keep the conversation flowing and show genuine interest in the user's thoughts and experiences.`
  const [initialPrompt, setInitialPrompt] = useState(characterSetUp);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const initialPromptRun = useRef(false);
  const [loading, setLoading] = useState(false);

  const initialPromptSend = useCallback(async () => {
    if (initialPrompt) {
      try {
        const response = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: [{ role: "user", content: initialPrompt }]}),
        });

        const data = await response.json();
        if (data.reply) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.reply, sender: 'ai' },
          ]);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, something went wrong.', sender: 'ai' },
        ]);
      }

      setLoading(false);
      setInput('');
    }
  }, [initialPrompt]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setLoading(true);
  
      try {
        const conversationHistory = messages.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        }));
  
        conversationHistory.push({ role: 'user', content: input });
  
        console.log('Request Payload:', JSON.stringify({ messages: conversationHistory }));
  
        const response = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: conversationHistory }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        if (data.reply) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.reply, sender: 'ai' },
          ]);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, something went wrong.', sender: 'ai' },
        ]);
      }
  
      setLoading(false);
      setInput('');
    }
  };

  // send character and prompt to API
  // start conversation with character speaking first
  useEffect(() => {
    if (!initialPromptRun.current){
      initialPromptSend();
      setInitialPrompt("");
      initialPromptRun.current = true;
    }
  }, [initialPromptSend]);

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
          src="" // Replace image URL
          sx={{ width: 56, height: 56 }}
        />
        <Typography variant="h5">{characterName}</Typography>
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
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Send'}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatPage;
