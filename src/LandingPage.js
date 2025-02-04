import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';

const LandingPage = () => {
  const [characterName, setCharacterName] = useState('');
  const navigate = useNavigate();

  const handleStartChat = () => {
    if (characterName.trim()) {
      navigate('/chat', { state: { characterName } });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleStartChat();
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to the Chatbot!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter a character name to start chatting.
      </Typography>
      <TextField
        label="Character Name"
        variant="outlined"
        value={characterName}
        onChange={(e) => setCharacterName(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{ marginBottom: '20px', width: '300px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleStartChat}
        disabled={!characterName.trim()}
      >
        Start Chat
      </Button>
    </Box>
  );
};

export default LandingPage;
