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
import { transactionService, Account, Transaction } from '../services/transactionService';

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface DashboardProps {
  currentUser: User;
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onNavigate }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [showQuickAction, setShowQuickAction] = useState<string | null>(null);
  const [quickAmount, setQuickAmount] = useState('');
  const [quickDescription, setQuickDescription] = useState('');

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  const loadUserData = () => {
    const userAccounts = transactionService.getUserAccounts(currentUser.email);
    const userTransactions = transactionService.getUserTransactions(currentUser.email);
    
    setAccounts(userAccounts);
    setRecentTransactions(userTransactions.slice(0, 5));
  };

  const handleQuickTransaction = (type: 'income' | 'expense') => {
    if (!quickAmount || !quickDescription) return;

    const amount = parseFloat(quickAmount);
    if (isNaN(amount) || amount <= 0) return;

    const primaryAccount = accounts.find(acc => acc.type === 'checking') || accounts[0];
    if (!primaryAccount) return;

    const success = transactionService.addTransaction(
      currentUser.email,
      {
        type,
        amount,
        description: quickDescription,
        fromAccount: primaryAccount.id,
        category: type === 'income' ? 'salary' : 'other'
      }
    );

    if (success) {
      setQuickAmount('');
      setQuickDescription('');
      setShowQuickAction(null);
      loadUserData();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

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
            onClick={() => onNavigate('transfer')}
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
            onClick={() => onNavigate('analytics')}
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
                <h3 className="font-medium text-gray-900">{account.name}</h3>
                <CreditCard className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(account.balance)}
              </p>
              <p className="text-sm text-gray-600 capitalize">{account.type} Account</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <button
            onClick={() => onNavigate('transactions')}
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
                    transaction.type === 'income' 
                      ? 'bg-green-100' 
                      : transaction.type === 'expense'
                      ? 'bg-red-100'
                      : 'bg-blue-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className={`w-4 h-4 ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`} />
                    ) : transaction.type === 'expense' ? (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    ) : (
                      <Send className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
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