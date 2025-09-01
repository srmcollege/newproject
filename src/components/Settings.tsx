import React, { useState } from 'react';
import { 
  Shield, 
  User, 
  Bell, 
  CreditCard, 
  BarChart3, 
  Globe, 
  Palette, 
  Settings as SettingsIcon,
  HelpCircle,
  FileText,
  Lock,
  Smartphone,
  Eye,
  Clock,
  Monitor,
  Activity,
  Edit,
  Building,
  Plus,
  Minus,
  Target,
  DollarSign,
  TrendingUp,
  Languages,
  Calendar,
  MapPin,
  Sun,
  Moon,
  Layout,
  Zap,
  Home,
  RefreshCw,
  Download,
  Upload,
  MessageCircle,
  Phone,
  Mail,
  Book,
  Info,
  Scale,
  Code
} from 'lucide-react';

interface SettingsProps {
  currentUser?: any;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, onClose }) => {
  const [activeSection, setActiveSection] = useState('security');
  const [settings, setSettings] = useState({
    // Security & Privacy
    twoFactorAuth: false,
    biometricLogin: true,
    appLock: false,
    sessionTimeout: '30',
    privacyMode: false,
    
    // Notifications
    pushNotifications: true,
    emailAlerts: true,
    smsAlerts: false,
    transactionAlerts: true,
    spendingAlerts: true,
    billReminders: true,
    
    // Transactions
    internationalTransactions: false,
    autoPay: true,
    defaultCurrency: 'INR',
    
    // Budget & Analytics
    savingsGoals: true,
    spendingReports: true,
    financialTips: true,
    
    // Language & Region
    appLanguage: 'English',
    currencyFormat: 'Indian',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Asia/Kolkata',
    
    // Personalization
    appTheme: 'Light',
    dashboardLayout: 'Standard',
    defaultHomeScreen: 'Dashboard'
  });

  const settingSections = [
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 'account',
      title: 'Account Management',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 'transactions',
      title: 'Transactions',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'budget',
      title: 'Budget & Analytics',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'language',
      title: 'Language & Region',
      icon: Globe,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      id: 'personalization',
      title: 'Personalization',
      icon: Palette,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      id: 'app',
      title: 'App Preferences',
      icon: SettingsIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      id: 'support',
      title: 'Support',
      icon: HelpCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 'legal',
      title: 'Legal & About',
      icon: FileText,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    }
  ];

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderToggle = (key: string, enabled: boolean) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={enabled}
        onChange={() => toggleSetting(key)}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-sm text-gray-500">Update your account password</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Change
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication (2FA)</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
          </div>
          {renderToggle('twoFactorAuth', settings.twoFactorAuth)}
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Enable Biometric Login</p>
              <p className="text-sm text-gray-500">Use fingerprint or face recognition</p>
            </div>
          </div>
          {renderToggle('biometricLogin', settings.biometricLogin)}
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">App Lock</p>
              <p className="text-sm text-gray-500">Require authentication to open app</p>
            </div>
          </div>
          {renderToggle('appLock', settings.appLock)}
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Session Timeout</p>
              <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
            </div>
          </div>
          <select 
            value={settings.sessionTimeout}
            onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Monitor className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Manage Trusted Devices</p>
              <p className="text-sm text-gray-500">View and manage trusted devices</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            Manage
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Privacy Settings</p>
              <p className="text-sm text-gray-500">Control data sharing and privacy</p>
            </div>
          </div>
          {renderToggle('privacyMode', settings.privacyMode)}
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Login Activity</p>
              <p className="text-sm text-gray-500">View recent login attempts</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            View
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Edit className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Edit Profile</p>
            <p className="text-sm text-gray-500">Update personal information</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Edit
        </button>
      </div>

      {currentUser?.authMethod === 'google' && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div>
              <p className="font-medium text-blue-900">Google Account</p>
              <p className="text-sm text-blue-700">Signed in with Google</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            Connected
          </span>
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Update KYC</p>
            <p className="text-sm text-gray-500">Update Know Your Customer documents</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          Update
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Building className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Link/Unlink Bank Accounts</p>
            <p className="text-sm text-gray-500">Manage connected bank accounts</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Manage
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Add/Remove Cards</p>
            <p className="text-sm text-gray-500">Manage your payment cards</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Manage
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Target className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Set Primary Account</p>
            <p className="text-sm text-gray-500">Choose your default account</p>
          </div>
        </div>
        <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Checking Account</option>
          <option>Savings Account</option>
          <option>Investment Account</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <Minus className="w-5 h-5 text-red-600" />
          <div>
            <p className="font-medium text-red-900">Deactivate Account</p>
            <p className="text-sm text-red-600">Permanently close your account</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Deactivate
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Push Notifications</p>
            <p className="text-sm text-gray-500">Receive app notifications</p>
          </div>
        </div>
        {renderToggle('pushNotifications', settings.pushNotifications)}
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Email Alerts</p>
            <p className="text-sm text-gray-500">Get notifications via email</p>
          </div>
        </div>
        {renderToggle('emailAlerts', settings.emailAlerts)}
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">SMS Alerts</p>
            <p className="text-sm text-gray-500">Receive text message alerts</p>
          </div>
        </div>
        {renderToggle('smsAlerts', settings.smsAlerts)}
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Transaction Alerts</p>
            <p className="text-sm text-gray-500">Notify on every transaction</p>
          </div>
        </div>
        {renderToggle('transactionAlerts', settings.transactionAlerts)}
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Spending Alerts</p>
            <p className="text-sm text-gray-500">Alert when approaching budget limits</p>
          </div>
        </div>
        {renderToggle('spendingAlerts', settings.spendingAlerts)}
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Bill Reminders</p>
            <p className="text-sm text-gray-500">Remind about upcoming bills</p>
          </div>
        </div>
        {renderToggle('billReminders', settings.billReminders)}
      </div>
    </div>
  );

  const renderTransactionSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Target className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Set Spending Limits</p>
            <p className="text-sm text-gray-500">Control daily/monthly spending</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Set Limits
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Enable International Transactions</p>
            <p className="text-sm text-gray-500">Allow overseas payments</p>
          </div>
        </div>
        {renderToggle('internationalTransactions', settings.internationalTransactions)}
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Manage Payees</p>
            <p className="text-sm text-gray-500">Add or remove payment recipients</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Manage
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Auto-Pay Settings</p>
            <p className="text-sm text-gray-500">Automatic bill payments</p>
          </div>
        </div>
        {renderToggle('autoPay', settings.autoPay)}
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Default Currency</p>
            <p className="text-sm text-gray-500">Primary currency for transactions</p>
          </div>
        </div>
        <select 
          value={settings.defaultCurrency}
          onChange={(e) => updateSetting('defaultCurrency', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="INR">Indian Rupee (₹)</option>
          <option value="USD">US Dollar ($)</option>
          <option value="EUR">Euro (€)</option>
          <option value="GBP">British Pound (£)</option>
        </select>
      </div>
    </div>
  );

  const renderBudgetSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Budget Categories</p>
            <p className="text-sm text-gray-500">Customize spending categories</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Customize
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Target className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Set Budget Limits</p>
            <p className="text-sm text-gray-500">Define monthly spending limits</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Set Limits
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Target className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Enable Savings Goals</p>
            <p className="text-sm text-gray-500">Track progress towards financial goals</p>
          </div>
        </div>
        {renderToggle('savingsGoals', settings.savingsGoals)}
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Spending Reports</p>
            <p className="text-sm text-gray-500">Generate detailed spending analysis</p>
          </div>
        </div>
        {renderToggle('spendingReports', settings.spendingReports)}
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Financial Tips</p>
            <p className="text-sm text-gray-500">Receive personalized financial advice</p>
          </div>
        </div>
        {renderToggle('financialTips', settings.financialTips)}
      </div>
    </div>
  );

  const renderLanguageSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Languages className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">App Language</p>
            <p className="text-sm text-gray-500">Choose your preferred language</p>
          </div>
        </div>
        <select 
          value={settings.appLanguage}
          onChange={(e) => updateSetting('appLanguage', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="English">English</option>
          <option value="Hindi">हिंदी (Hindi)</option>
          <option value="Tamil">தமிழ் (Tamil)</option>
          <option value="Telugu">తెలుగు (Telugu)</option>
          <option value="Bengali">বাংলা (Bengali)</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Currency Format</p>
            <p className="text-sm text-gray-500">How currencies are displayed</p>
          </div>
        </div>
        <select 
          value={settings.currencyFormat}
          onChange={(e) => updateSetting('currencyFormat', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Indian">Indian (₹1,00,000)</option>
          <option value="International">International ($1,000.00)</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Date Format</p>
            <p className="text-sm text-gray-500">How dates are displayed</p>
          </div>
        </div>
        <select 
          value={settings.dateFormat}
          onChange={(e) => updateSetting('dateFormat', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Timezone</p>
            <p className="text-sm text-gray-500">Your local timezone</p>
          </div>
        </div>
        <select 
          value={settings.timezone}
          onChange={(e) => updateSetting('timezone', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
          <option value="America/New_York">America/New_York (EST)</option>
          <option value="Europe/London">Europe/London (GMT)</option>
          <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
        </select>
      </div>
    </div>
  );

  const renderPersonalizationSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Sun className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">App Theme</p>
            <p className="text-sm text-gray-500">Choose light or dark mode</p>
          </div>
        </div>
        <select 
          value={settings.appTheme}
          onChange={(e) => updateSetting('appTheme', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Light">Light</option>
          <option value="Dark">Dark</option>
          <option value="Auto">Auto</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Layout className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Dashboard Layout</p>
            <p className="text-sm text-gray-500">Customize dashboard appearance</p>
          </div>
        </div>
        <select 
          value={settings.dashboardLayout}
          onChange={(e) => updateSetting('dashboardLayout', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Standard">Standard</option>
          <option value="Compact">Compact</option>
          <option value="Detailed">Detailed</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Quick Access Shortcuts</p>
            <p className="text-sm text-gray-500">Customize quick action buttons</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Customize
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Home className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Default Home Screen</p>
            <p className="text-sm text-gray-500">Screen to show when app opens</p>
          </div>
        </div>
        <select 
          value={settings.defaultHomeScreen}
          onChange={(e) => updateSetting('defaultHomeScreen', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Dashboard">Dashboard</option>
          <option value="Transactions">Transactions</option>
          <option value="Cards">Cards</option>
          <option value="Analytics">Analytics</option>
        </select>
      </div>
    </div>
  );

  const renderAppSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Info className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">App Version</p>
            <p className="text-sm text-gray-500">Current version: 2.1.0</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Check Updates
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Clear Cache</p>
            <p className="text-sm text-gray-500">Free up storage space</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          Clear
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Download className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Backup & Restore Data</p>
            <p className="text-sm text-gray-500">Backup your financial data</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Backup
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Upload className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Import/Export Data</p>
            <p className="text-sm text-gray-500">Import or export transaction data</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Import/Export
        </button>
      </div>
    </div>
  );

  const renderSupportSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Book className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Help Center</p>
            <p className="text-sm text-gray-500">Browse help articles and guides</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Open
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Contact Support</p>
            <p className="text-sm text-gray-500">Get help from our support team</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Contact
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Submit Feedback</p>
            <p className="text-sm text-gray-500">Share your thoughts and suggestions</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Feedback
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <HelpCircle className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">FAQs</p>
            <p className="text-sm text-gray-500">Frequently asked questions</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          View FAQs
        </button>
      </div>
    </div>
  );

  const renderLegalSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Scale className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Terms of Service</p>
            <p className="text-sm text-gray-500">Read our terms and conditions</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Read
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Privacy Policy</p>
            <p className="text-sm text-gray-500">How we handle your data</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Read
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Code className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Open Source Licenses</p>
            <p className="text-sm text-gray-500">Third-party software licenses</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          View
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Info className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">About Us</p>
            <p className="text-sm text-gray-500">Learn more about FinanceBank</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          About
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'security':
        return renderSecuritySettings();
      case 'account':
        return renderAccountSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'transactions':
        return renderTransactionSettings();
      case 'budget':
        return renderBudgetSettings();
      case 'language':
        return renderLanguageSettings();
      case 'personalization':
        return renderPersonalizationSettings();
      case 'app':
        return renderAppSettings();
      case 'support':
        return renderSupportSettings();
      case 'legal':
        return renderLegalSettings();
      default:
        return renderSecuritySettings();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account preferences
            </p>
          </div>
          
          <div className="p-4 space-y-2">
            {settingSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left ${
                    activeSection === section.id
                      ? `${section.bgColor} ${section.color} border-l-4 border-current`
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {settingSections.find(s => s.id === activeSection)?.title}
              </h3>
              <p className="text-gray-600 mt-1">
                Configure your {settingSections.find(s => s.id === activeSection)?.title.toLowerCase()} preferences
              </p>
            </div>
            
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;