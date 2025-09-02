import React, { useState } from 'react';
import { Menu, Bell, Settings as SettingsIcon, User, LogOut } from 'lucide-react';
import Settings from './Settings';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setShowChatbot: (show: boolean) => void;
  currentUser?: any;
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  setShowChatbot,
  currentUser 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = () => {
    // Clear user session
    localStorage.removeItem('financebank_current_user');
    // Reload the page to reset the app state
    window.location.reload();
  };

  const getUserInitials = () => {
    if (!currentUser) return 'U';
    const firstName = currentUser.firstName || '';
    const lastName = currentUser.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FB</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">FinanceBank</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowChatbot(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <span className="text-xl">🤖</span>
            </button>
            
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  {getUserInitials()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {currentUser?.firstName || 'User'}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowSettings(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showSettings && (
        <Settings 
          currentUser={currentUser} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </>
  );
};

export default Header;