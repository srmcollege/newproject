import React, { useState, useEffect } from 'react';
import { supabase, authHelpers } from './lib/supabase';
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
  const [loading, setLoading] = useState(true);

  // Listen for navigation events from dashboard quick actions
  useEffect(() => {
    const handleNavigate = (event: any) => {
      setActiveTab(event.detail);
      setSidebarOpen(false);
    };

    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, []);

  // Check for existing authentication on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (supabase) {
        // Check Supabase auth
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await authHelpers.getCurrentUser();
          if (profile) {
            setCurrentUser(profile);
            setIsAuthenticated(true);
          }
        }
      } else {
        // Check localStorage for demo mode
        const savedUser = localStorage.getItem('financebank_current_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user: any) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    // Save to localStorage for demo mode persistence
    localStorage.setItem('financebank_current_user', JSON.stringify(user));
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
        return <Analytics currentUser={currentUser} />;
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

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <Login onLogin={handleLogin} />;
}

export default App;