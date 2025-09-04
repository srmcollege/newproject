import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownRight,
  Send,
  Plus,
  Minus,
  BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface DashboardProps {
  currentUser: User;
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
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [showQuickAction, setShowQuickAction] = useState<string | null>(null);
  const [quickAmount, setQuickAmount] = useState('');
  const [quickDescription, setQuickDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get current user from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no authenticated user, create demo data
        setAccounts([
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
        ]);
        
        setRecentTransactions([
          {
            id: '1',
            transaction_type: 'income',
            amount: 207500,
            description: 'Salary Deposit',
            category: 'Income',
            transaction_date: '2024-01-15',
            status: 'completed'
          },
          {
            id: '2',
            transaction_type: 'expense',
            amount: 3765,
            description: 'Swiggy Order',
            category: 'Food',
            transaction_date: '2024-01-14',
            status: 'completed'
          },
          {
            id: '3',
            transaction_type: 'expense',
            amount: 9960,
            description: 'Electric Bill',
            category: 'Utilities',
            transaction_date: '2024-01-13',
            status: 'completed'
          },
          {
            id: '4',
            transaction_type: 'income',
            amount: 99600,
            description: 'Freelance Payment',
            category: 'Income',
            transaction_date: '2024-01-12',
            status: 'completed'
          },
          {
            id: '5',
            transaction_type: 'expense',
            amount: 7465,
            description: 'Amazon Purchase',
            category: 'Shopping',
            transaction_date: '2024-01-11',
            status: 'completed'
          }
        ]);
        setLoading(false);
        return;
      }

      // Load user accounts
      const { data: accountsData, error: accountsError } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (accountsError) {
        console.error('Error loading accounts:', accountsError);
        setError('Failed to load accounts');
      } else {
        setAccounts(accountsData || []);
      }

      // Load recent transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (transactionsError) {
        console.error('Error loading transactions:', transactionsError);
        setError('Failed to load transactions');
      } else {
        setRecentTransactions(transactionsData || []);
      }
      
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTransaction = async (type: 'income' | 'expense') => {
    if (!quickAmount || !quickDescription) return;

    const amount = parseFloat(quickAmount);
    if (isNaN(amount) || amount <= 0) return;

    const primaryAccount = accounts.find(acc => acc.account_type === 'checking') || accounts[0];
    if (!primaryAccount) return;

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          account_id: primaryAccount.id,
          transaction_type: type,
          amount: type === 'income' ? amount : -amount,
          description: quickDescription,
          category: type === 'income' ? 'Income' : 'Other',
          reference_number: `REF_${Date.now()}`,
          status: 'completed'
        });

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        return;
      }

      // Update account balance
      const newBalance = type === 'income' 
        ? primaryAccount.balance + amount
        : primaryAccount.balance - amount;

      const { error: balanceError } = await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', primaryAccount.id);

      if (balanceError) {
        console.error('Error updating balance:', balanceError);
        return;
      }

      setQuickAmount('');
      setQuickDescription('');
      setShowQuickAction(null);
      await loadUserData();
    } catch (err) {
      console.error('Error handling quick transaction:', err);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleNavigate = (page: string) => {
    // Dispatch custom event for navigation
    window.dispatchEvent(new CustomEvent('navigate', { detail: page }));
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={loadUserData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {currentUser.firstName}! 👋
        </h1>
        <p className="text-blue-100">
          Here's your financial overview for today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalBalance)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(45000)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(32000)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <ArrowDownRight className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Savings Goal</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(100000)}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <PiggyBank className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleNavigate('transfer')}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Send className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-600">Send Money</span>
          </button>

          <button
            onClick={() => setShowQuickAction('income')}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Plus className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-600">Add Income</span>
          </button>

          <button
            onClick={() => setShowQuickAction('expense')}
            className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Minus className="w-8 h-8 text-red-600 mb-2" />
            <span className="text-sm font-medium text-red-600">Add Expense</span>
          </button>

          <button
            onClick={() => handleNavigate('analytics')}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-600">View Analytics</span>
          </button>
        </div>
      </div>

      {/* Quick Action Modal */}
      {showQuickAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Add {showQuickAction === 'income' ? 'Income' : 'Expense'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={quickDescription}
                  onChange={(e) => setQuickDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleQuickTransaction(showQuickAction as 'income' | 'expense')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                    showQuickAction === 'income'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  Add {showQuickAction === 'income' ? 'Income' : 'Expense'}
                </button>
                <button
                  onClick={() => setShowQuickAction(null)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accounts Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Your Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <div key={account.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{account.account_name}</h3>
                <CreditCard className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(account.balance)}
              </p>
              <p className="text-sm text-gray-600 capitalize">{account.account_type} Account</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <button
            onClick={() => handleNavigate('transactions')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.transaction_type === 'income' 
                      ? 'bg-green-100' 
                      : transaction.transaction_type === 'expense'
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                  }`}>
                    {transaction.transaction_type === 'income' ? (
                      <ArrowUpRight className={`w-4 h-4 ${
                        transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    ) : transaction.transaction_type === 'expense' ? (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    ) : (
                      <Send className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.transaction_type === 'income' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.transaction_type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No transactions yet</p>
              <p className="text-sm">Start by adding some income or expenses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;