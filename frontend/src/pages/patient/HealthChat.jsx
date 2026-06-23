import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { Avatar, Button, Card } from '../../components/ui/SharedUI';
import { Bot, Send, Sparkles, Activity, Loader, User, ShieldAlert } from 'lucide-react';

const HealthChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: "assistant", 
      text: `Hello ${user?.name?.split(' ')[0] || 'there'}! I'm your AI Health Assistant. I can help you understand symptoms, provide general health guidance, or explain medical reports. How can I assist you today?`, 
      time: new Date() 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { 
    bottomRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages, loading]);

  const quickPrompts = [
    { icon: <Activity className="w-4 h-4"/>, text: "What are common cold symptoms?" },
    { icon: <Sparkles className="w-4 h-4"/>, text: "Tips for better sleep" },
    { icon: <ShieldAlert className="w-4 h-4"/>, text: "Explain cholesterol results" }
  ];

  const sendMessage = async (text = input) => {
    if (!text.trim() || loading) return;
    setInput("");
    
    const userMsg = { id: Date.now(), role: "user", text, time: new Date() };
    setMessages(m => [...m, userMsg]);
    setLoading(true);
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const requestData = {
        message: text,
        chatHistory: messages.filter(m => m.id !== 1).map(m => ({ role: m.role, content: m.text }))
      };
      const { data } = await axios.post('http://localhost:5000/api/ai/chat', requestData, config);
      
      const responseText = data.data.message || "I couldn't process your request.";
      
      setMessages(m => [...m, { id: Date.now() + 1, role: "assistant", text: responseText, time: new Date() }]);
    } catch (error) {
      setMessages(m => [...m, { 
        id: Date.now() + 1, 
        role: "assistant", 
        text: "I am currently running in offline demonstration mode. I can analyze symptoms if you connect me to the backend API.", 
        time: new Date() 
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-t-2xl shadow-sm border border-gray-100 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              HealthAI Assistant <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Beta</span>
            </h1>
            <p className="text-gray-500 text-sm">Powered by Google Gemini • Fast & Secure</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-50/50 border-x border-gray-100 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Welcome / Quick Prompts (only show if few messages) */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-3 justify-center mt-4 mb-8">
            {quickPrompts.map((p, idx) => (
              <button 
                key={idx} 
                onClick={() => sendMessage(p.text)} 
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all"
              >
                {p.icon} {p.text}
              </button>
            ))}
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} w-full max-w-4xl mx-auto`}>
            {msg.role === "assistant" ? (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center shrink-0 shadow-sm mt-1">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center shrink-0 shadow-sm mt-1">
                <User className="w-5 h-5 text-teal-700" />
              </div>
            )}
            
            <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-semibold text-gray-500">
                  {msg.role === "assistant" ? "HealthAI" : "You"}
                </span>
                <span className="text-[10px] text-gray-400">
                  {msg.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              
              <div 
                className={`p-4 text-[15px] leading-relaxed shadow-sm ${
                  msg.role === "user" 
                    ? "bg-teal-600 text-white rounded-2xl rounded-tr-sm" 
                    : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
                }`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 flex-row w-full max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center shrink-0 shadow-sm mt-1">
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex flex-col gap-1 max-w-[80%] items-start">
              <div className="px-1"><span className="text-xs font-semibold text-gray-500">HealthAI</span></div>
              <div className="p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-12">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-b border-x border-gray-100 rounded-b-2xl shadow-sm shrink-0">
        <div className="max-w-4xl mx-auto relative flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
          <textarea 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => {
              if(e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Describe your symptoms or ask a medical question..." 
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-4 max-h-32 min-h-[52px] text-gray-800"
            rows="1"
          />
          <button 
            onClick={() => sendMessage()} 
            disabled={!input.trim() || loading} 
            className={`p-3 rounded-xl flex items-center justify-center shrink-0 mb-1 transition-all ${
              !input.trim() || loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">
          AI can make mistakes. Always verify critical medical information with a doctor.
        </p>
      </div>

    </div>
  );
};

export default HealthChat;
