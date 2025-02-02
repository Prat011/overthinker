import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';  
// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);

const LoadingDots = () => (
  <div className="typing-indicator">
    <div className="typing-dot"></div>
    <div className="typing-dot"></div>
    <div className="typing-dot"></div>
  </div>
);

const ChatInterface = () => {
  const [query, setQuery] = useState('');
  const [searchMade, setSearchMade] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setSearchMade(true);
    setIsLoading(true);
    
    try {
      // Initialize the model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" , systemInstruction: `You are an overthinker ai, whatever the user asks, you will overthink it and give a response. The overthinking should be simple and funny, don't use too many complex words, make pop culture references if you can.`});
      
      // Generate content
      const result = await model.generateContent(query);
      const response = await result.response;
      const text = response.text();
      
      // Add new message pair to chat history
      setChatHistory([...chatHistory, {
        query: query,
        response: text
      }]);
      
      // Clear input after sending
      setQuery('');
    } catch (error) {
      console.error('Error:', error);
      setChatHistory([...chatHistory, {
        query: query,
        response: 'I apologize, but I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`search-container ${searchMade ? 'expanded' : ''}`}>
      <div className="search-header">
        <h1>Overthinker</h1>
        <p>Why overthink alone, when you can overthink with an AI.</p>
      </div>
      <div className="search-content">
        {!searchMade ? (
          <div className="initial-search">
            <form className="search-input-container" onSubmit={handleSearch}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="what do you want to know........."
                className="search-input"
              />
            </form>
          </div>
        ) : (
          <div className="search-results">
            <form className="search-input-container" onSubmit={handleSearch}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="what do you want to know........."
                className="search-input"
              />
            </form>
            <div className="chat-history-container">
              {[...chatHistory].map((chat, index) => (
                
                <div key={index}>
                  <div className="search-message user">{chat.query}</div>
                  <div className="search-message bot"><ReactMarkdown>{chat.response}</ReactMarkdown></div>
                </div>
              ))}
              {isLoading && (
                <div className="search-message bot">
                  <LoadingDots />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;