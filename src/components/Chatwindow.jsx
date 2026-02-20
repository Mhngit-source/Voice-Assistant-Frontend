import React, { useState, useRef, useEffect } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ user, onMessageSent, onImageGenerated }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      { 
        id: 1, 
        role: 'assistant', 
        content: 'Hello! I\'m MAN-I, your AI assistant. How can I help you today?', 
        citations: [],
        source: 'gemini',
        timestamp: new Date() 
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ============ DETECT IMAGE GENERATION COMMANDS ============
  const isImageGenerationCommand = (message) => {
    const lowerMsg = message.toLowerCase();
    const imageKeywords = [
      'generate image', 'create image', 'make image', 'draw',
      'generate a picture', 'create a picture',
      'generate picture', 'create picture',
      'generate an image of', 'generate image of', 'image of',
      'create an image', 'make a picture', 'draw a picture'
    ];
    return imageKeywords.some(keyword => lowerMsg.includes(keyword));
  };

  // ============ MARKDOWN RENDERER ============
  const renderMarkdown = (content) => {
    if (!content) return null;

    const segments = content.split(/(```[\s\S]*?```)/g);
    
    return segments.map((segment, index) => {
      if (segment.startsWith('```') && segment.endsWith('```')) {
        return renderCodeBlock(segment, index);
      } else {
        return renderTextBlock(segment, index);
      }
    });
  };

  // ============ CODE BLOCK RENDERER ============
  const renderCodeBlock = (block, key) => {
    const content = block.slice(3, -3).trim();
    const firstLine = content.split('\n')[0];
    let language = '';
    let code = content;
    
    if (firstLine && !firstLine.includes(' ') && firstLine.length < 30) {
      language = firstLine;
      code = content.substring(firstLine.length).trim();
    }

    if (!language) {
      if (code.includes('def ') || code.includes('import ')) language = 'python';
      else if (code.includes('function ') || code.includes('const ')) language = 'javascript';
      else language = 'text';
    }

    return (
      <div key={key} className="deepseek-code-block">
        <div className="deepseek-code-header">
          <span className="deepseek-code-language">{language}</span>
          <button 
            className="deepseek-copy-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(code);
              const btn = e.currentTarget;
              btn.innerHTML = '✅ Copied!';
              setTimeout(() => {
                btn.innerHTML = '📋 Copy';
              }, 2000);
            }}
          >
            📋 Copy
          </button>
        </div>
        <pre className="deepseek-code-pre">
          <code>{code}</code>
        </pre>
      </div>
    );
  };

  // ============ TEXT RENDERER ============
  const renderTextBlock = (text, key) => {
    if (!text.trim()) return null;

    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((para, pIndex) => {
      if (para.startsWith('# ')) {
        return <h1 key={`${key}-${pIndex}`} className="deepseek-h1">{para.slice(2)}</h1>;
      }
      if (para.startsWith('## ')) {
        return <h2 key={`${key}-${pIndex}`} className="deepseek-h2">{para.slice(3)}</h2>;
      }
      if (para.startsWith('### ')) {
        return <h3 key={`${key}-${pIndex}`} className="deepseek-h3">{para.slice(4)}</h3>;
      }
      
      if (para.includes('\n- ') || para.includes('\n* ')) {
        const lines = para.split('\n').filter(line => line.trim());
        return (
          <ul key={`${key}-${pIndex}`} className="deepseek-ul">
            {lines.map((line, i) => (
              <li key={i}>{line.replace(/^[-*]\s/, '')}</li>
            ))}
          </ul>
        );
      }

      return <p key={`${key}-${pIndex}`} className="deepseek-p">{para}</p>;
    });
  };

  // ============ HANDLE DOWNLOAD ============
  const handleDownload = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `man-i-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback: open in new tab
      window.open(imageUrl, '_blank');
    }
  };

  // ============ RENDER IMAGE IN CHAT ============
  const renderImageMessage = (msg) => {
    const imageUrl = msg.imageUrl || msg.dataUrl;
    const filename = `man-i-${msg.imageId || Date.now()}.png`;

    return (
      <div className="chat-image-container">
        <p>{msg.content}</p>
        <div className="generated-image-wrapper">
          <img 
            src={imageUrl} 
            alt="Generated" 
            className="chat-generated-image"
            onClick={() => window.open(imageUrl, '_blank')}
            onError={(e) => {
              console.error('Image failed to load:', imageUrl);
              e.target.src = 'https://via.placeholder.com/512x512/2563eb/ffffff?text=Image+Error';
            }}
          />
          <div className="chat-image-actions">
            <button 
              className="chat-image-btn download-btn"
              onClick={() => handleDownload(imageUrl, filename)}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============ SEND MESSAGE FUNCTION ============
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading || generatingImage) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    const messageToSend = inputMessage;
    setInputMessage('');
    setLoading(true);

    try {
      // Check if this is an image generation request
      if (isImageGenerationCommand(messageToSend)) {
        setGeneratingImage(true);
        
        // Extract prompt
        let prompt = messageToSend
          .replace(/generate image|create image|make image|draw|generate a picture|create a picture|generate picture|create picture|generate an image of|generate image of|image of|create an image|make a picture|draw a picture/gi, '')
          .trim();
        
        if (!prompt) {
          prompt = messageToSend;
        }

        // Show generating message
        const generatingMsg = {
          id: Date.now() + 0.5,
          role: 'assistant',
          content: `🎨 Generating image: "${prompt}"...`,
          isGenerating: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, generatingMsg]);

        const response = await fetch('http://localhost:5000/api/ai/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt,
            userId: user?.id || 'anonymous'
          })
        });

        const data = await response.json();

        // Remove generating message
        setMessages(prev => prev.filter(msg => !msg.isGenerating));

        if (data.success) {
          const imageMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            content: `🎨 **Generated Image: "${prompt}"**`,
            imageUrl: data.imageUrl,
            imageId: data.imageId,
            dataUrl: data.dataUrl,
            isImage: true,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, imageMessage]);
          
          // Notify parent to add to gallery
          if (onImageGenerated) {
            onImageGenerated({
              id: data.imageId || imageMessage.id,
              prompt: prompt,
              imageUrl: data.imageUrl,
              dataUrl: data.dataUrl,
              timestamp: new Date().toISOString(),
              filename: data.filename || `image-${Date.now()}.png`
            });
          }
          
          if (onMessageSent) {
            onMessageSent();
          }
        } else {
          throw new Error(data.error || 'Image generation failed');
        }
        
        setGeneratingImage(false);
      } else {
        // Regular chat message
        const response = await fetch('http://localhost:5000/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageToSend,
            userId: user?.id || 'anonymous'
          })
        });

        const data = await response.json();

        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.response || "I'm here to help!",
          citations: data.citations || [],
          source: data.source || 'gemini',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }
      
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setGeneratingImage(false);
    }
  };

  const handleQuickAction = (action) => {
    const quickMessages = {
      weather: "What's the weather like today?",
      joke: "Tell me a joke",
      news: "What's the latest news?",
      recipe: "Suggest a recipe for dinner",
      python: "Write a Python function to calculate factorial",
      javascript: "Write a JavaScript function to reverse a string",
      image: "Generate image of a beautiful sunset"
    };
    setInputMessage(quickMessages[action] || quickMessages.weather);
  };

  return (
    <div className="deepseek-chat-container">
      {/* Messages Area */}
      <div className="deepseek-messages">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`deepseek-message-wrapper ${msg.role === 'user' ? 'user-message-wrapper' : 'assistant-message-wrapper'}`}
          >
            <div className={`deepseek-message ${msg.role}`}>
              {/* Avatar */}
              {msg.role === 'assistant' && (
                <div className="deepseek-avatar">
                  <div className="deepseek-ai-avatar">🤖</div>
                </div>
              )}
              
              <div className="deepseek-message-content">
                {/* Sender Name */}
                <div className="deepseek-sender">
                  {msg.role === 'assistant' ? 'MAN-I' : 'You'}
                </div>
                
                {/* Message Body */}
                <div className="deepseek-body">
                  {msg.isImage ? (
                    renderImageMessage(msg)
                  ) : msg.isGenerating ? (
                    <div className="generating-indicator">
                      <span className="generating-spinner"></span>
                      <span>{msg.content}</span>
                    </div>
                  ) : (
                    renderMarkdown(msg.content)
                  )}
                </div>
                
                {/* Timestamp */}
                <div className="deepseek-timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>

              {/* User Avatar */}
              {msg.role === 'user' && (
                <div className="deepseek-avatar">
                  <div className="deepseek-user-avatar">👤</div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {(loading || generatingImage) && !messages.some(m => m.isGenerating) && (
          <div className="deepseek-message-wrapper assistant-message-wrapper">
            <div className="deepseek-message assistant">
              <div className="deepseek-avatar">
                <div className="deepseek-ai-avatar">🤖</div>
              </div>
              <div className="deepseek-message-content">
                <div className="deepseek-sender">MAN-I</div>
                <div className="deepseek-typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="deepseek-quick-actions">
        <button onClick={() => handleQuickAction('weather')} title="Weather">🌤️</button>
        <button onClick={() => handleQuickAction('joke')} title="Joke">😂</button>
        <button onClick={() => handleQuickAction('news')} title="News">📰</button>
        <button onClick={() => handleQuickAction('recipe')} title="Recipe">🍽️</button>
        <button onClick={() => handleQuickAction('python')} title="Python">🐍</button>
        <button onClick={() => handleQuickAction('javascript')} title="JavaScript">📜</button>
        <button onClick={() => handleQuickAction('image')} title="Generate Image">🎨</button>
      </div>

      {/* Input Area */}
      <div className="deepseek-input-area">
        <form onSubmit={handleSendMessage}>
          <div className="deepseek-input-wrapper">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Message Man-I"
              disabled={loading || generatingImage}
            />
            <button 
              type="submit" 
              className="deepseek-send-btn"
              disabled={loading || generatingImage || !inputMessage.trim()}
            >
              {loading || generatingImage ? '...' : 'Send'}
            </button>
          </div>
          <div className="deepseek-input-hints">
            <span>Press Enter to send</span>
            <span className="hint-separator">•</span>
            <span>Type "generate image of ..."</span>
            <span className="hint-separator">•</span>
            <span>Code blocks with copy</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;