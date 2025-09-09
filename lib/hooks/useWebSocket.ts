import { useEffect, useState, useCallback, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  type: string;
  data: any;
  timestamp: Date;
}

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('message', (message: Message) => {
      setMessages(prev => [...prev, { ...message, timestamp: new Date() }]);
    });

    socketRef.current.on('new_issue', (data: any) => {
      setMessages(prev => [...prev, {
        type: 'new_issue',
        data,
        timestamp: new Date(),
      }]);
    });

    socketRef.current.on('issue_updated', (data: any) => {
      setMessages(prev => [...prev, {
        type: 'issue_updated',
        data,
        timestamp: new Date(),
      }]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url]);

  const sendMessage = useCallback((message: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('message', message);
    }
  }, [isConnected]);

  return {
    isConnected,
    messages,
    sendMessage,
  };
}