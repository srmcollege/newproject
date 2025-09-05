import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Send, 
  Receipt, 
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase, dbHelpers } from '../lib/supabase';

interface DashboardProps {
  currentUser?: any;
}

interface Account {
  id: string;
  account_name: string;
  account_type: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  category: string;
  transaction_date: string;
  status: string;
  accounts?: { account_name: string };
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [quickActionType, setQuickActionType] = useState<'income' | 'expense'>('income');
  const [quickActionData, setQuickActionData] = useState({
    amount: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (supabase && currentUser?.id) {
        // Load from Supabase
        const [accountsData, transactionsData] = await Promise.all([
          dbHelpers.getUserAccounts(currentUser.id),
          dbHelpers.getUserTransactions(currentUser.id, 10)
        ]);
        
        setAccounts(accountsData);
        setTransactions(transactionsData);
      } else {
        // Demo data fallback
        const demoAccounts = [
          {
            id: '1',
            account_name: 'Checking Account',
            account_type: 'checking',
            balance: 1032450.32,
            currency: 'INR'
          },
          {
            id: '2',
            account_name: 'Savings Account',
            account_type: 'savings',
            balance: 3752089.45,
            currency: 'INR'
          },
          {
            id: '3',
            account_name: 'Investment Account',
            account_type: 'investment',
            balance: 6548745.89,
            currency: 'INR'
          }
        ];

        const demoTransactions = [
          {
            id: '1',
            transaction_type: 'income',
            amount: 207500,
            description: 'Salary Deposit',
            category: 'Income',
            transaction_date: '2024-01-15',
            status: 'completed',
            accounts: { account_name: 'Checking Account' }
          },
          {
            id: '2',
            transaction_type: 'expense',
            amount: -3765,
            description: 'Swiggy Order',
            category: 'Food',
            transaction_date: '2024-01-14',
            status: 'completed',
            accounts: { account_name: 'Checking Account' }
          },
          {
            id: '3',
            transaction_type: 'expense',
            amount: -9960,
            description: 'Electric Bill',
            category: 'Utilities',
            transaction_date: '2024-01-13',
            status: 'completed',
            accounts: { account_name: 'Checking Account' }
          },
          {
            id: '4',
            transaction_type: 'income',
            amount: 99600,
            description: 'Freelance Payment',
            category: 'Income',
            transaction_date: '2024-01-12',
            status: 'completed',
            accounts: { account_name: 'Savings Account' }
          },
          {
            id: '5',
            transaction_type: 'expense',
            amount: -7465,
            description: 'Amazon Purchase',
            category: 'Shopping',
            transaction_date: '2024-01-11',
            status: 'completed',
            accounts: { account_name: 'Checking Account' }
          }
        ];

        setAccounts(demoAccounts);
        setTransactions(demoTransactions);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quickActionData.amount || !quickActionData.description || !quickActionData.category) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const amount = parseFloat(quickActionData.amount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      if (supabase && currentUser?.id && accounts.length > 0) {
        // Create transaction in database
        const primaryAccount = accounts.find(acc => acc.account_type === 'checking') || accounts[0];
        
        const transactionData = {
          user_id: currentUser.id,
          account_id: primaryAccount.id,
          transaction_type: quickActionType,
          amount: quickActionType === 'income' ? amount : -amount,
          description: quickActionData.description,
          category: quickActionData.category,
          status: 'completed' as const
        };

        const newTransaction = await dbHelpers.createTransaction(transactionData);
        
        // Update account balance
        const newBalance = quickActionType === 'income' 
          ? primaryAccount.balance + amount 
          : primaryAccount.balance - amount;
        
        await dbHelpers.updateAccountBalance(primaryAccount.id, newBalance);
        
        // Refresh data
        await loadDashboardData();
        
        alert(`${quickActionType === 'income' ? 'Income' : 'Expense'} added successfully!`);
      } else {
        // Demo mode - just show success message
        alert(`${quickActionType === 'income' ? 'Income' : 'Expense'} would be added to database!`);
      }

      // Reset form
      setQuickActionData({ amount: '', description: '', category: '' });
      setShowQuickAction(false);
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlyIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const monthlyExpenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const quickActions = [
    {
      title: 'Send Money',
      icon: Send,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      action: () => {
        const event = new CustomEvent('navigate', { detail: 'transfer' });
        window.dispatchEvent(event);
      }
    },
    {
      title: 'Request Money',
      icon: ArrowDownLeft,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      action: () => alert('Request money feature coming soon!')
    },
    {
      title: 'Pay Bills',
      icon: Receipt,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      action: () => {
        const event = new CustomEvent('navigate', { detail: 'bills' });
        window.dispatchEvent(event);
      }
    },
    {
      title: 'Add Transaction',
      icon: Plus,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      action: () => setShowQuickAction(true)
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {currentUser?.first_name || currentUser?.firstName || 'User'}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your money today</p>
        </div>
        <button
          onClick={() => setShowBalances(!showBalances)}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showBalances ? 'Hide' : 'Show'} Balances</span>
        </button>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-300" />
          </div>
          <div>
            <p className="text-blue-100 text-sm">Total Balance</p>
            <p className="text-2xl font-bold">
              {showBalances ? formatCurrency(totalBalance) : '••••••••'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <ArrowDownLeft className="w-6 h-6" />
            </div>
            <span className="text-sm text-green-600 font-medium">+12.5%</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Monthly Income</p>
            <p className="text-2xl font-bold text-gray-900">
              {showBalances ? formatCurrency(monthlyIncome) : '••••••••'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <span className="text-sm text-red-600 font-medium">+5.2%</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Monthly Expenses</p>
            <p className="text-2xl font-bold text-gray-900">
              {showBalances ? formatCurrency(monthlyExpenses) : '••••••••'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-sm text-green-600 font-medium">+22.8%</span>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Net Savings</p>
            <p className="text-2xl font-bold text-gray-900">
              {showBalances ? formatCurrency(monthlyIncome - monthlyExpenses) : '••••••••'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`flex flex-col items-center space-y-3 p-4 rounded-lg border-2 border-transparent hover:border-gray-200 hover:shadow-md transition-all ${action.bgColor}`}
              >
                <div className={`p-3 rounded-full ${action.bgColor}`}>
                  <Icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <span className="text-sm font-medium text-gray-900">{action.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Accounts</h3>
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    account.account_type === 'checking' ? 'bg-blue-100 text-blue-600' :
                    account.account_type === 'savings' ? 'bg-green-100 text-green-600' :
                    account.account_type === 'investment' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{account.account_name}</p>
                    <p className="text-sm text-gray-500 capitalize">{account.account_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {showBalances ? formatCurrency(account.balance) : '••••••••'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button 
              onClick={() => {
                const event = new CustomEvent('navigate', { detail: 'transactions' });
                window.dispatchEvent(event);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.transaction_type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.transaction_type === 'income' ? 
                      <ArrowDownLeft className="w-4 h-4" /> : 
                      <ArrowUpRight className="w-4 h-4" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.accounts?.account_name || 'Account'} • {new Date(transaction.transaction_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.transaction_type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                </span>
              </div>
            ))}
            
            {transactions.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-sm text-gray-400">Start by adding income or making a transfer</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Modal */}
      {showQuickAction && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Transaction</h3>
            
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setQuickActionType('income')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  quickActionType === 'income' 
                    ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setQuickActionType('expense')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  quickActionType === 'expense' 
                    ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Expense
              </button>
            </div>

            <form onSubmit={handleQuickAction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={quickActionData.amount}
                    onChange={(e) => setQuickActionData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={quickActionData.description}
                  onChange={(e) => setQuickActionData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What's this for?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={quickActionData.category}
                  onChange={(e) => setQuickActionData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {quickActionType === 'income' ? (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investment">Investment</option>
                      <option value="Other Income">Other Income</option>
                    </>
                  ) : (
                    <>
                      <option value="Food">Food & Dining</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Health">Health</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowQuickAction(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2 px-4 text-white rounded-lg transition-colors ${
                    quickActionType === 'income' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Add {quickActionType === 'income' ? 'Income' : 'Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;