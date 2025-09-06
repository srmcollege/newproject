import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';
import { supabase, dbHelpers } from '../lib/supabase';

interface TransactionsProps {
  currentUser?: any;
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

const Transactions: React.FC<TransactionsProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [currentUser]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      
      if (!supabase || !currentUser?.id) {
        // If no authenticated user, show demo data
        setTransactions([
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
        ]);
        setLoading(false);
        return;
      }

      // Load transactions from database
      const transactionsData = await dbHelpers.getUserTransactions(currentUser.id, 100);
      setTransactions(transactionsData);
      
    } catch (err) {
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Income', 'Food', 'Utilities', 'Shopping', 'Transportation', 'Investment', 'Health'];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Track and manage your financial transactions</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
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
                        <p className="text-sm text-gray-500">Transaction ID: {transaction.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.category === 'Income' ? 'bg-green-100 text-green-800' :
                      transaction.category === 'Food' ? 'bg-blue-100 text-blue-800' :
                      transaction.category === 'Utilities' ? 'bg-yellow-100 text-yellow-800' :
                      transaction.category === 'Shopping' ? 'bg-purple-100 text-purple-800' :
                      transaction.category === 'Transportation' ? 'bg-indigo-100 text-indigo-800' :
                      transaction.category === 'Investment' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.accounts?.account_name || 'Account'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-semibold ${
                      transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowUpRight className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by making a transfer or adding income'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTransactions.length}</span> of{' '}
          <span className="font-medium">{transactions.length}</span> results
        </p>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            1
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;