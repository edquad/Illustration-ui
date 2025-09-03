import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Paper, TextField, Typography, Button, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useApp } from '../AppProvider';
import contactListData from "../../config/contactListData.json";


const Chatbot = ({ onFormAutofill }) => {
    const { user } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Hello! I\'m your illustration assistant',
            sender: 'bot'
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };



    // const handleSendMessage = async (e) => {
    //     e.preventDefault();
    //     if (!inputValue.trim() || isLoading) return;

    //     const userMessage = { id: messages.length + 1, text: inputValue, sender: 'user' };
    //     const updatedMessages = [...messages, userMessage];
    //     setMessages(updatedMessages);
    //     setInputValue('');
    //     setIsLoading(true);

    //     try {
    //         setTimeout(() => {
    //             const lowerMsg = inputValue.toLowerCase();

    //             // Simple checks for details
    //             const hasName = /\b(my name is|i am|this is)\b/i.test(inputValue);
    //             const hasDOB = /\b\d{1,2}[\/\-\s]\d{1,2}[\/\-\s]\d{2,4}\b/.test(inputValue);
    //             const hasEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(inputValue);
    //             const hasPhone = /\b\d{10}\b/.test(inputValue);
    //             const hasAddress = /\b(st|street|road|rd|apt|avenue|city|state|zip)\b/i.test(inputValue);

    //             const infoProvided = hasName || hasDOB || hasEmail || hasPhone || hasAddress;

    //             let botResponse;
    //             if (infoProvided) {
    //                 botResponse = {
    //                     id: updatedMessages.length + 1,
    //                     text: 'Great! I detected some personal info. Would you like me to autofill the form with it?',
    //                     sender: 'bot',
    //                     showAutofill: true
    //                 };
    //             } else {
    //                 botResponse = {
    //                     id: updatedMessages.length + 1,
    //                     text: 'Got it 👍 Tell me your name, date of birth, email, phone, or address and I can help you fill the form.',
    //                     sender: 'bot'
    //                 };
    //             }

    //             setMessages(prev => [...prev, botResponse]);
    //             setIsLoading(false);
    //         }, 1000);
    //     } catch (error) {
    //         console.error('Error sending message:', error);
    //         setMessages(prev => [...prev, {
    //             id: updatedMessages.length + 1,
    //             text: 'Sorry, there was an error processing your message. Please try again.',
    //             sender: 'bot'
    //         }]);
    //         setIsLoading(false);
    //     }
    // };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = { id: messages.length + 1, text: inputValue, sender: 'user' };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            setTimeout(() => {
                const lowerMsg = inputValue.toLowerCase();

                // Simple checks for details
                const hasName = /\b(my name is|i am|this is)\b/i.test(inputValue);
                const hasDOB = /\b\d{1,2}[\/\-\s]\d{1,2}[\/\-\s]\d{2,4}\b/.test(inputValue);
                const hasEmail = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(inputValue);
                const hasPhone = /\b\d{10}\b/.test(inputValue);
                const hasAddress = /\b(st|street|road|rd|apt|avenue|city|state|zip)\b/i.test(inputValue);

                const infoProvided = hasName || hasDOB || hasEmail || hasPhone || hasAddress;

                let botResponse;

                // ✅ New condition for existing client / client detail
                if (/existing client|client detail/i.test(inputValue)) {
                    botResponse = {
                        id: updatedMessages.length + 1,
                        text: 'Sure! Fetching the client details for you...',
                        sender: 'bot',
                        showAutofill: true,
                        autofillType: 'client'
                    };
                } else if (infoProvided) {
                    botResponse = {
                        id: updatedMessages.length + 1,
                        text: 'Great! I detected some personal info. Would you like me to autofill the form with it?',
                        sender: 'bot',
                        showAutofill: true
                    };
                } else {
                    botResponse = {
                        id: updatedMessages.length + 1,
                        text: 'Got it 👍 Tell me your name, date of birth, email, phone, or address and I can help you fill the form.',
                        sender: 'bot'
                    };
                }

                setMessages(prev => [...prev, botResponse]);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                id: updatedMessages.length + 1,
                text: 'Sorry, there was an error processing your message. Please try again.',
                sender: 'bot'
            }]);
            setIsLoading(false);
        }
    };
    const handleAutofillForm = async () => {
        try {
            setIsLoading(true);
            const lastBotMsg = messages.filter(m => m.showAutofill).slice(-1)[0];

            if (lastBotMsg?.autofillType === "client") {
                const lastUserMsg = messages.filter(m => m.sender === "user").slice(-1)[0]?.text.toLowerCase() || "";
                const clientData = contactListData.find(client => {
                    const fullName = `${client.FirstName || ""} ${client.MiddleName || ""} ${client.LastName || ""}`.toLowerCase();
                    const shortName = (client.FullName || fullName).toLowerCase();

                    return (
                        lastUserMsg.includes((client.FirstName || "").toLowerCase()) ||
                        lastUserMsg.includes((client.LastName || "").toLowerCase()) ||
                        lastUserMsg.includes(shortName)
                    );
                });

                if (clientData) {
                    console.log("Fetched client data:", clientData);

                    if (onFormAutofill) {
                        onFormAutofill(clientData);
                    }

                    setMessages(prev => [
                        ...prev,
                        {
                            id: prev.length + 1,
                            text: `I’ve fetched ${clientData.FullName || clientData.FirstName}’s details. Please review!`,
                            sender: "bot"
                        }
                    ]);
                } else {
                    setMessages(prev => [
                        ...prev,
                        {
                            id: prev.length + 1,
                            text: "Sorry, I couldn’t find that client in the records.",
                            sender: "bot"
                        }
                    ]);
                }
            }
            else {
                const conversation = messages
                    .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
                    .join('\n');

                const response = await fetch('http://localhost:5000/api/form-autofill', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ conversation }),
                });

                const data = await response.json();
                console.log('Response from server:', data);

                if (data.status === 'success' && onFormAutofill) {
                    onFormAutofill(data.data);
                    setMessages(prev => [
                        ...prev,
                        { id: prev.length + 1, text: 'Please review and submit when ready!', sender: 'bot' }
                    ]);
                }
            }
        } catch (error) {
            console.error('Error in handleAutofillForm:', error);
        } finally {
            setIsLoading(false);
        }
    };



    if (!isOpen) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1000,
                }}
            >
                <IconButton
                    onClick={toggleChat}
                    sx={{
                        backgroundColor: '#129fd4',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#0d8ecf',
                        },
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        boxShadow: 3,
                    }}
                >
                    <ChatIcon fontSize="large" />
                </IconButton>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: 350,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                height: 500,
                transition: 'all 0.3s ease',
                boxShadow: 3,
                borderRadius: 2,
                overflow: 'hidden',
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    bgcolor: 'background.paper',
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        backgroundColor: '#129fd4',
                        color: 'white',
                        p: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h6">Illustration Assistant</Typography>
                    <IconButton
                        onClick={toggleChat}
                        size="small"
                        sx={{ color: 'white' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Messages */}
                <Box
                    sx={{
                        flex: 1,
                        p: 2,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        bgcolor: 'background.default',
                    }}
                >
                    {messages.map((message) => (
                        <Box key={message.id}>
                            <Box
                                sx={{
                                    alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                                    boxShadow: 1,
                                    ml: message.sender === 'user' ? 'auto' : 0,
                                }}
                            >
                                <Typography variant="body1">{message.text}</Typography>
                            </Box>
                            {message.showAutofill && (
                                <Box sx={{ mt: 1, textAlign: 'right' }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<AutoFixHighIcon />}
                                        onClick={handleAutofillForm}
                                        disabled={isLoading}
                                        sx={{
                                            backgroundColor: '#129fd4',
                                            '&:hover': {
                                                backgroundColor: '#0d8ecf',
                                            },
                                            textTransform: 'none',
                                            fontSize: '0.8rem',
                                            py: 0.5,
                                        }}
                                    >
                                        {isLoading ? 'Filling...' : 'Autofill Form'}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    ))}
                    {isLoading && !messages.some(m => m.showAutofill) && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                            <CircularProgress size={20} />
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Box>

                {/* Input */}
                <Box
                    component="form"
                    onSubmit={handleSendMessage}
                    sx={{
                        p: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            variant="outlined"
                            disabled={isLoading}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />
                        <IconButton
                            type="submit"
                            color="primary"
                            disabled={!inputValue.trim() || isLoading}
                            sx={{
                                backgroundColor: '#129fd4',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#0d8ecf',
                                },
                                '&:disabled': {
                                    backgroundColor: '#e0e0e0',
                                }
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Chatbot;
