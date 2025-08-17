import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Transfer from './components/Transfer';
import Cards from './components/Cards';
import Analytics from './components/Analytics';
import Calendar from './components/Calendar';
import BillReminders from './components/BillReminders';
import MultiCurrency from './components/MultiCurrency';
import CreditScore from './components/CreditScore';
import FamilyView from './components/FamilyView';
import SpendingLocks from './components/SpendingLocks';
import CarbonFootprint from './components/CarbonFootprint';
import AIChatbot from './components/AIChatbot';
import Login from './components/Login';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Listen for navigation events from dashboard quick actions
  useEffect(() => {
    const handleNavigate = (event: any) => {
      setActiveTab(event.detail);
      setSidebarOpen(false);
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);
  const handleLogin = (user: any) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} />;
      case 'transactions':
        return <Transactions />;
      case 'transfer':
        return <Transfer />;
      case 'cards':
        return <Cards />;
      case 'analytics':
        return <Analytics />;
      case 'calendar':
        return <Calendar />;
      case 'bills':
        return <BillReminders />;
      case 'multicurrency':
        return <MultiCurrency />;
      case 'creditscore':
        return <CreditScore />;
      case 'family':
        return <FamilyView currentUser={currentUser} />;
      case 'locks':
        return <SpendingLocks />;
      case 'carbon':
        return <CarbonFootprint />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        setShowChatbot={setShowChatbot}
        currentUser={currentUser}
      />
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
      
      {showChatbot && (
        <AIChatbot onClose={() => setShowChatbot(false)} currentUser={currentUser} />
      )}
    </div>
  );
}

export default App;