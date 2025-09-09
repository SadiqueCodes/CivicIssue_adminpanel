'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  Typography,
  Chip,
  Avatar,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Send, SmartToy, Person, AutoAwesome } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIChat } from '@/lib/hooks/useAIChat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: any[];
}

interface AIAssistantProps {
  context: any;
  onActionSuggested: (action: any) => void;
}

export default function AIAssistant({ context, onActionSuggested }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { sendMessage, isLoading } = useAIChat();

  useEffect(() => {
    // Initial greeting
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant powered by Claude. I can help you manage issues, analyze patterns, and provide insights. What would you like to know?',
      timestamp: new Date(),
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    'Show critical issues',
    'Resource allocation',
    'Pattern analysis',
    'Performance metrics',
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendMessage({
        message: input,
        context: {
          ...context,
          recentMessages: messages.slice(-5),
        },
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        actions: response.suggested_actions,
      };

      setMessages(prev => [...prev, aiMessage]);

      if (response.suggested_actions?.length > 0) {
        response.suggested_actions.forEach((action: any) => {
          setTimeout(() => onActionSuggested(action), 500);
        });
      }
    } catch (error) {
      console.error('AI Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    setTimeout(handleSend, 100);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      {/* Header */}
      <Box sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToy sx={{ color: '#667eea' }} />
          AI Assistant
          <Chip 
            label="Claude" 
            size="small" 
            sx={{ 
              ml: 'auto',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }} 
          />
        </Typography>
      </Box>

      {/* Messages */}
      <List sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: message.role === 'user' ? '#e0e0e0' : '#667eea',
                    }}
                  >
                    {message.role === 'user' ? <Person /> : <SmartToy />}
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    {message.role === 'user' ? 'You' : 'AI Assistant'}
                  </Typography>
                </Box>
                
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '85%',
                    backgroundColor: message.role === 'user' ? '#f5f5f5' : '#f0f4ff',
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                  </Typography>
                  
                  {message.actions && message.actions.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {message.actions.map((action, idx) => (
                        <Button
                          key={idx}
                          size="small"
                          variant="outlined"
                          startIcon={<AutoAwesome />}
                          onClick={() => onActionSuggested(action)}
                          sx={{ textTransform: 'none' }}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </Box>
                  )}
                </Paper>
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <ListItem>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea' }}>
                <SmartToy />
              </Avatar>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <CircularProgress size={8} />
                <CircularProgress size={8} />
                <CircularProgress size={8} />
              </Box>
            </Box>
          </ListItem>
        )}
        
        <div ref={messagesEndRef} />
      </List>

      {/* Quick Actions */}
      <Box sx={{ py: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {quickActions.map((action) => (
          <Chip
            key={action}
            label={action}
            size="small"
            onClick={() => handleQuickAction(action)}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Box>

      {/* Input */}
      <Box sx={{ display: 'flex', gap: 1, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask AI anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={isLoading}
          size="small"
          multiline
          maxRows={3}
        />
        <IconButton
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b4299 100%)',
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : <Send />}
        </IconButton>
      </Box>
    </Box>
  );
}