import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Lightbulb, TrendingDown, TrendingUp } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  onClose: () => void;
  currentUser?: any;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ onClose, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: `Hi ${currentUser?.firstName || 'there'}! I'm your AI financial assistant. I can help you analyze your spending, suggest budgets, and answer money-related questions. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "Am I overspending this month?",
    "What's my biggest expense category?",
    "How can I save more money?",
    "Should I pay off my credit card?",
    "What's my spending trend?"
  ];

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('overspending') || message.includes('spending too much')) {
      return "Based on your current spending of ₹5,17,133 this month vs your average of ₹4,89,700, you're spending about 5.6% more than usual. Your biggest increases are in Food & Dining (+₹8,200) and Shopping (+₹3,500). Consider setting alerts for these categories!";
    }
    
    if (message.includes('biggest expense') || message.includes('most spending')) {
      return "Your biggest expense category this month is Food & Dining at ₹1,02,940 (35% of total spending). This includes ₹45,200 on restaurants and ₹57,740 on food delivery. Consider cooking more meals at home to reduce this by 20-30%.";
    }
    
    if (message.includes('save more') || message.includes('increase savings')) {
      return "Great question! Here are 3 personalized tips: 1) Reduce food delivery by ₹15,000/month (cook 2 more meals at home weekly), 2) Switch to a cheaper mobile plan (save ₹800/month), 3) Use your credit card rewards - you have ₹12,400 unused cashback! This could increase your savings by ₹28,200 monthly.";
    }
    
    if (message.includes('credit card') || message.includes('pay off')) {
      return "Your HDFC Platinum card has a balance of ₹1,03,750 (25% utilization). With the 18% APR, you're paying about ₹1,556/month in interest. I recommend paying ₹25,000 extra this month to reduce interest and improve your credit score by 15-20 points.";
    }
    
    if (message.includes('trend') || message.includes('pattern')) {
      return "Your spending trends show: 📈 Transportation costs increased 40% (₹52,400 → ₹73,870) due to fuel prices. 📉 Utilities decreased 15% thanks to solar installation. 📊 Overall, you're spending 8% more than last quarter but earning 12% more, so your savings rate improved!";
    }
    
    if (message.includes('budget') || message.includes('limit')) {
      return "Your current budget utilization: Food 70% (₹28,220/₹41,500), Transport 60% (₹14,940/₹24,900), Entertainment 48% (₹7,885/₹16,600). You're on track! Consider increasing your Food budget by ₹5,000 and reducing Entertainment by ₹3,000 for better balance.";
    }
    
    if (message.includes('investment') || message.includes('invest')) {
      return "With ₹1,84,216 monthly surplus, you could invest ₹1,20,000 and keep ₹64,216 for expenses. Based on your risk profile, I suggest: 60% Equity Mutual Funds (₹72,000), 30% Debt Funds (₹36,000), 10% Gold ETF (₹12,000). This could generate 12-15% annual returns!";
    }
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! I'm here to help you make smarter financial decisions. I can analyze your spending patterns, suggest savings opportunities, and answer questions about your money. What would you like to explore?";
    }
    
    return "I understand you're asking about your finances. Based on your account data, you're doing well with a positive savings rate of 26%. Your total balance is ₹1.13 crores across all accounts. Would you like me to analyze any specific aspect of your finances in detail?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Financial Assistant</h3>
              <p className="text-xs text-blue-100">Online • Ready to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`rounded-2xl px-4 py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.slice(0, 3).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about your finances..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;