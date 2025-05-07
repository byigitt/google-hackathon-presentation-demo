'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ThemeToggleButton } from './components/ThemeToggleButton';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const MODEL_NAME = 'gemini-2.0-flash';
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn(
    "Gemini API key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file."
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// System instruction for the chatbot
const systemInstruction = {
  role: "system",
  parts: [{ text: "You are a friendly chatbot. Respond with short, informal messages, but maintain formal writing style (e.g., correct punctuation, grammar). Keep your responses concise. Be polite, do not forget to ask the other person." }],
};

// Google brand logo component
const GoogleLogo = () => (
  <div className="flex items-center gap-1">
    <span className="text-2xl font-medium">
      <span className="google-blue">G</span>
      <span className="google-red">e</span>
      <span className="google-yellow">m</span>
      <span className="google-blue">i</span>
      <span className="google-green">n</span>
      <span className="google-red">i</span>
    </span>
    <span className="text-2xl font-normal text-gray-700 dark:text-gray-300">AI</span>
  </div>
);

export default function ChatPage() {
  const [userInput, setUserInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: userInput }] };
    setChatHistory(prev => [...prev, userMessage]);
    setUserInput('');

    try {
      if (!API_KEY) {
        throw new Error("Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.");
      }
      const chat = model.startChat({
        generationConfig,
        safetySettings,
        systemInstruction: systemInstruction,
        history: chatHistory,
      });

      const result = await chat.sendMessage(userInput);
      const response = result.response;
      const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response.text() }] };
      setChatHistory(prev => [...prev, modelMessage]);

    } catch (err: any) {
      console.error("Error sending message:", err);
      let errorMessage = "Failed to get a response from the chatbot.";
      if (err.message) {
        errorMessage += ` Details: ${err.message}`;
      }
      if (err.response && err.response.promptFeedback && err.response.promptFeedback.blockReason) {
        errorMessage += ` Blocked due to: ${err.response.promptFeedback.blockReason}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="w-full max-w-2xl bg-white elevation-2 rounded-lg flex flex-col h-[80vh] sm:h-[85vh] md:h-[calc(100vh-100px)]" style={{ backgroundColor: 'var(--chat-container-bg)' }}>
        <header className="p-4 border-b flex items-center justify-between" style={{ 
          backgroundColor: 'var(--chat-header-bg)', 
          borderColor: 'var(--chat-header-border)', 
          color: 'var(--chat-header-text)'
        }}>
          <div className="flex flex-col items-start">
            <GoogleLogo />
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Your friendly, formal chat companion!</p>
          </div>
          <ThemeToggleButton />
        </header>

        <div className="google-gradient h-[3px]"></div>

        <div className="flex-grow p-6 space-y-4 overflow-y-auto" style={{ backgroundColor: 'var(--chat-bg)' }}>
          {chatHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-xs">
                Hi there! I'm your Gemini AI assistant. How can I help you today?
              </p>
            </div>
          )}

          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'rounded-br-none border' 
                    : 'rounded-bl-none border' 
                }`}
                style={{
                  backgroundColor: msg.role === 'user' ? 'var(--user-bubble-bg)' : 'var(--model-bubble-bg)',
                  color: msg.role === 'user' ? 'var(--user-bubble-text)' : 'var(--model-bubble-text)',
                  borderColor: msg.role === 'user' ? 'var(--user-bubble-border)' : 'var(--model-bubble-border)',
                }}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div 
                className="max-w-[70%] p-3 rounded-lg rounded-bl-none border animate-pulse"
                style={{ 
                  backgroundColor: 'var(--model-bubble-bg)', 
                  color: 'var(--model-bubble-text)',
                  borderColor: 'var(--model-bubble-border)'
                }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
             <div className="flex justify-center">
                <div 
                  className="p-3 rounded-lg max-w-[90%] text-center border"
                  style={{ 
                    backgroundColor: 'var(--error-bg)', 
                    color: 'var(--error-text)',
                    borderColor: 'var(--google-red)'
                  }}
                >
                    <p className="text-sm font-semibold">Error:</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t" style={{ borderColor: 'var(--chat-header-border)' }}>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Message Gemini AI..."
              className="google-input flex-grow"
              style={{ 
                backgroundColor: 'var(--input-bg)',
                color: 'var(--input-text)',
                borderColor: 'var(--input-border)',
              }}
              disabled={isLoading || !API_KEY}
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim() || !API_KEY}
              className="google-button google-button-filled"
              style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)'}}
            >
              Send
            </button>
          </div>
          {!API_KEY && (
            <p className="text-xs mt-2 text-center" style={{ color: 'var(--error-text)' }}>
              API Key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local and restart the server.
            </p>
          )}
        </form>
      </div>
      
      <footer className="text-center mt-4 text-xs" style={{ color: 'var(--google-grey-700)' }}>
        <p className="mb-1">Gemini AI Hackathon Demo</p>
        <div className="text-[10px] flex justify-center items-center gap-2">
          <span>Built with</span>
          <div className="flex">
            <span className="google-blue">G</span>
            <span className="google-red">o</span>
            <span className="google-yellow">o</span>
            <span className="google-blue">g</span>
            <span className="google-green">l</span>
            <span className="google-red">e</span>
          </div>
          <span>Gemini API</span>
        </div>
      </footer>
    </div>
  );
}
