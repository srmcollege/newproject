import React from 'react';
import { 
  LayoutDashboard, 
  ArrowUpDown, 
  CreditCard, 
  BarChart3, 
  Receipt, 
  Calendar as CalendarIcon,
  Bell,
  Globe,
  TrendingUp,
  Users,
  Lock,
  Leaf,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'transfer', label: 'Transfer', icon: ArrowUpDown },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'bills', label: 'Bill Reminders', icon: Bell },
    { id: 'multicurrency', label: 'Multi-Currency', icon: Globe },
    { id: 'creditscore', label: 'Credit Score', icon: TrendingUp },
    { id: 'family', label: 'Family View', icon: Users },
    { id: 'locks', label: 'Spending Locks', icon: Lock },
    { id: 'carbon', label: 'Carbon Footprint', icon: Leaf },
  ];

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 z-50 w-64 h-full bg-white/90 backdrop-blur-md border-r border-gray-200/50 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-4 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm
                  ${activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;