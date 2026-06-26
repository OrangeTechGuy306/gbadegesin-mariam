'use client';

import * as React from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const botReplies: Record<string, string> = {
  skills: "Mariam's core skills cover SQL (PostgreSQL, BigQuery), Python (Pandas, NumPy, Scikit-Learn), Power BI, Tableau, ETL (Airflow, dbt), A/B testing, and machine learning models.",
  experience: "Mariam is currently a Senior Data Analyst at Stripe (managing BigQuery pipelines & transactional models) and formerly at Vercel (developing conversion tracking and infrastructure dashboards).",
  projects: "Mariam's featured projects include an E-Commerce Interactive Revenue Dashboard, a Customer Churn Predictor utilizing XGBoost, and cohort analysis pipelines. See the 'Projects' section for details!",
  contact: "You can reach Mariam directly by completing the Contact Form below, or by email at mariamgbadegesin15@gmail.com. She is active on LinkedIn and GitHub as well.",
  education: "Mariam holds a Master of Science in Data Analytics and certifications including Google Data Analytics Professional, Microsoft Certified Power BI Associate, and Tableau Desktop Specialist.",
  default: "I'm Mariam's AI Assistant. Ask me about her 'skills', 'experience', 'projects', 'education', or how to 'contact' her!"
};

export function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    { sender: 'bot', text: "Hello! I'm Mariam's AI Assistant. Ask me anything about her credentials, portfolio, or career history!" }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate natural typing delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsTyping(false);

    const query = userText.toLowerCase();
    let reply = botReplies.default;

    if (query.includes('skill') || query.includes('technolog')) {
      reply = botReplies.skills;
    } else if (query.includes('experience') || query.includes('work') || query.includes('company') || query.includes('stripe') || query.includes('vercel')) {
      reply = botReplies.experience;
    } else if (query.includes('project') || query.includes('portfolio') || query.includes('code')) {
      reply = botReplies.projects;
    } else if (query.includes('contact') || query.includes('email') || query.includes('reach')) {
      reply = botReplies.contact;
    } else if (query.includes('education') || query.includes('degree') || query.includes('certific')) {
      reply = botReplies.education;
    }

    setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 h-[450px] rounded-2xl glass-card border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <div>
                  <h4 className="text-sm font-semibold leading-none flex items-center space-x-1">
                    <span>Mariam Assistant</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  </h4>
                  <span className="text-[10px] opacity-75">Online • AI Bot</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="opacity-80 hover:opacity-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-secondary/10">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%]`}>
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-0.5 flex-shrink-0">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`px-3 py-2 rounded-2xl text-xs ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-card border border-border/40 text-foreground rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="px-3 py-2 rounded-2xl bg-card border border-border/40 rounded-tl-none flex space-x-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-border/40 bg-card flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about skills, experience..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-3 py-2 rounded-lg border border-border/60 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-secondary/20"
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors"
                aria-label="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
