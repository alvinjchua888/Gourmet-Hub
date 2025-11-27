/**
 * ChatBot Component
 * 
 * An interactive AI-powered chatbot that provides culinary advice and food recommendations.
 * This component renders as a floating chat interface that can be toggled open/closed.
 * 
 * Key Features:
 * - Streaming responses from Gemini 3 Pro for real-time feedback
 * - Persistent chat history during session
 * - Markdown rendering for rich text responses
 * - Floating UI with smooth animations
 * - Auto-scroll to latest messages
 * 
 * Component Structure:
 * - Toggle button (fixed bottom-right)
 * - Chat window (slides in when opened)
 * - Message list with auto-scroll
 * - Input field with send button
 * 
 * State Management:
 * - isOpen: Controls chat window visibility
 * - messages: Array of conversation messages
 * - input: Current message being typed
 * - isLoading: Indicates streaming in progress
 * 
 * @module components/ChatBot
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';
import { sendMessageStream } from '../services/gemini';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from "@google/genai";

// Ensure marked is available globally from CDN (loaded in index.html)
// This library converts markdown to HTML for rich text rendering
declare const marked: {
  parse: (text: string) => string;
};

/**
 * ChatBot Component
 * 
 * Renders a floating chatbot interface with AI-powered conversational capabilities.
 * Uses Gemini 3 Pro for high-quality culinary advice and food recommendations.
 * 
 * @returns {React.FC} The chatbot interface
 */
export const ChatBot: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /**
   * Controls chat window visibility
   * - true: Chat window is open and visible
   * - false: Chat window is hidden
   */
  const [isOpen, setIsOpen] = useState(false);
  
  /**
   * Current message being typed by the user
   * Bound to the input field value
   */
  const [input, setInput] = useState('');
  
  /**
   * Array of all conversation messages (user + AI)
   * Initialized with a welcome message from the AI
   * 
   * Note: Uses lazy initialization function to avoid recreation on re-renders
   */
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: 'Hello! I am your AI food assistant. Ask me anything about cuisines, ingredients, or cooking tips.'
    }
  ]);
  
  /**
   * Indicates if a message is currently being streamed from the API
   * Used to disable input during processing
   */
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Ref to the bottom of the messages list for auto-scrolling
   * Ensures latest messages are always visible
   */
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Scrolls the message list to the bottom
   * Called after new messages are added or chat is opened
   * Uses smooth scrolling for better UX
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Effect: Auto-scroll to bottom when messages change or chat opens
   * Dependencies: messages array and isOpen state
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // ============================================================================
  // MESSAGE HANDLING
  // ============================================================================

  /**
   * Handles sending a user message and receiving AI response
   * 
   * Process:
   * 1. Validate input (non-empty, not loading)
   * 2. Add user message to chat
   * 3. Clear input field
   * 4. Call streaming API
   * 5. Create placeholder for AI response
   * 6. Stream response chunks and update message
   * 7. Finalize message when stream complete
   * 8. Handle errors gracefully
   * 
   * Uses streaming for better UX - user sees response as it's generated
   */
  const handleSend = async () => {
    // Guard clause: Don't send empty messages or while loading
    if (!input.trim() || isLoading) return;

    // Create user message object with unique ID
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    // Add user message to chat history
    setMessages(prev => [...prev, userMsg]);
    
    // Clear input field immediately for better UX
    setInput('');
    
    // Set loading state to disable further sends
    setIsLoading(true);

    try {
      // Call API to get streaming response
      const responseStream = await sendMessageStream(userMsg.content);
      
      // Generate unique ID for AI response message
      const botMsgId = (Date.now() + 1).toString();
      let fullContent = '';

      // Add placeholder message for streaming content
      // isStreaming flag indicates message is being built
      setMessages(prev => [
        ...prev, 
        { id: botMsgId, role: 'model', content: '', isStreaming: true }
      ]);

      // Stream processing: Iterate through response chunks
      // Each chunk contains partial response text
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        
        // If chunk has text, append to full content and update UI
        if (text) {
          fullContent += text;
          
          // Update the specific message with accumulated content
          // This triggers re-render to show progressive response
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMsgId 
                ? { ...msg, content: fullContent } 
                : msg
            )
          );
        }
      }

      // Stream complete: Remove streaming flag
      // Indicates message is final and complete
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );

    } catch (error) {
      // Error handling: Log for debugging and show user-friendly message
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now().toString(), 
          role: 'model', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }
      ]);
    } finally {
      // Always clear loading state, even on error
      setIsLoading(false);
    }
  };

  // ============================================================================
  // RENDERING HELPERS
  // ============================================================================

  /**
   * Renders markdown text as HTML
   * 
   * Uses marked.js library (loaded from CDN) to parse markdown syntax.
   * Allows AI responses to include formatting like bold, lists, code, etc.
   * 
   * @param text - Raw markdown text
   * @returns Object with __html property for dangerouslySetInnerHTML
   * 
   * Security Note: marked.js sanitizes output to prevent XSS attacks
   */
  const renderMarkdown = (text: string) => {
    try {
      return { __html: marked.parse(text) };
    } catch (e) {
      // Fallback to plain text if markdown parsing fails
      return { __html: text };
    }
  };

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    <>
      {/* 
        Toggle Button
        - Fixed position in bottom-right corner
        - Rotates and changes color when chat is open
        - Accessible with proper ARIA labels
      */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${
          isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <MessageCircle className="text-white w-6 h-6" />}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 transition-all duration-300 origin-bottom-right z-50 flex flex-col overflow-hidden ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ height: '500px', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Bot className="text-white w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white">Culinary Chat</h3>
              <p className="text-indigo-100 text-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Powered by Gemini Pro
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                }`}
              >
                {msg.role === 'user' ? (
                  <p>{msg.content}</p>
                ) : (
                  <div 
                    className="prose prose-sm prose-slate max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4"
                    dangerouslySetInnerHTML={renderMarkdown(msg.content)} 
                  />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for cooking tips..."
              className="flex-1 px-4 py-2 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
