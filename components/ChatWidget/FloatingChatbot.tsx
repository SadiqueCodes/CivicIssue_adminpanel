'use client'

import React, { useState } from 'react'
import { 
  SearchBar,
  type Suggestion
} from '../../packages/chatbot/src'
import { MessageArea } from './MessageArea'
import { CustomMainInterface } from './CustomMainInterface'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface FloatingChatbotProps {
  className?: string
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentView, setCurrentView] = useState<'welcome' | 'chat'>('welcome')
  const [inputValue, setInputValue] = useState('')

  // Admin panel specific suggestions
  const adminSuggestions: Suggestion[] = [
    { id: '1', text: 'Show recent civic issues' },
    { id: '2', text: 'Help with analytics dashboard' },
    { id: '3', text: 'Assist with user management' },
    { id: '4', text: 'Generate reports' }
  ]

  const handleToggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const handleMinimize = () => {
    setIsMinimized(true)
  }

  const handleMaximize = () => {
    setIsMinimized(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: suggestion.text,
      sender: 'user',
      timestamp: new Date()
    }

    // Add bot response (you can customize this based on your admin panel needs)
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: `I'll help you with "${suggestion.text}". Let me gather the relevant information from your admin panel.`,
      sender: 'bot',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage, botResponse])
    setCurrentView('chat')
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    // Simple bot response (customize based on your admin panel logic)
    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: `Thank you for your message: "${inputValue}". As your admin assistant, I'm here to help you manage civic issues and analyze your data.`,
      sender: 'bot',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage, botResponse])
    setInputValue('')
  }

  if (!isOpen && !isMinimized) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <button
          onClick={handleToggleChat}
          className="w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-105"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="#b0d1c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    )
  }

  if (isMinimized) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="relative">
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-30" 
               style={{ backgroundColor: '#b0d1c7', animationDuration: '2s' }}></div>
          <div className="absolute inset-0 rounded-full animate-pulse opacity-20" 
               style={{ backgroundColor: '#b0d1c7', animationDelay: '1s' }}></div>
          
          {/* Main button */}
          <button
            onClick={handleMaximize}
            className="relative w-20 h-20 rounded-full shadow-2xl border-2 flex flex-col items-center justify-center transition-all duration-500 hover:scale-110 hover:rotate-12 group"
            style={{ 
              background: `linear-gradient(135deg, #b0d1c7 0%, #96c5b5 50%, #7eb8a3 100%)`,
              borderColor: '#b0d1c7',
              boxShadow: '0 0 30px rgba(176, 209, 199, 0.4), 0 8px 25px rgba(0,0,0,0.15)'
            }}
          >
            {/* Sparkle effects */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full opacity-80 animate-bounce"
                 style={{ backgroundColor: '#fff', animationDelay: '0s', animationDuration: '1.5s' }}></div>
            <div className="absolute -bottom-2 -left-1 w-2 h-2 rounded-full opacity-60 animate-bounce"
                 style={{ backgroundColor: '#fff', animationDelay: '0.5s', animationDuration: '2s' }}></div>
            <div className="absolute top-2 -left-2 w-1.5 h-1.5 rounded-full opacity-70 animate-bounce"
                 style={{ backgroundColor: '#fff', animationDelay: '1s', animationDuration: '1.8s' }}></div>
            
            {/* Chat icon with subtle animation */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                 className="mb-1 group-hover:scale-110 transition-transform duration-300">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" 
                    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="12" r="1" fill="white"/>
              <circle cx="15" cy="12" r="1" fill="white"/>
              <circle cx="12" cy="12" r="1" fill="white"/>
            </svg>
            
            {/* Assistant text with glow */}
            <span className="text-xs font-semibold text-white drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300">
              AI
            </span>
            
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
        style={{ width: '400px', height: '600px', maxWidth: '400px' }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-3 flex justify-between items-center">
          <div>
            <h3 className="font-medium text-sm text-gray-900">Mitram</h3>
            <p className="text-xs text-gray-600">AI Helper</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleMinimize}
              className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <span className="text-xs text-gray-600">−</span>
            </button>
            <button
              onClick={handleClose}
              className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <span className="text-xs text-gray-600">×</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col" style={{ height: 'calc(600px - 60px)' }}>
          <div className="flex-1 overflow-hidden">
            {currentView === 'welcome' ? (
              <CustomMainInterface
                questionText="How can I help you manage your admin panel today?"
                suggestions={adminSuggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            ) : (
              <MessageArea messages={messages} />
            )}
          </div>

          {/* Search Bar - Always at bottom */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <SearchBar
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleSendMessage}
              placeholder="Ask about civic issues, analytics, or reports..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}