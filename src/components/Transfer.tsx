import React, { useState } from 'react';
import { ArrowRight, Check, Clock, User, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TransferProps {
  currentUser?: any;
}

interface Account {
  id: string;
  account_name: string;
  account_type: string;
  balance: number;
  currency: string;
}

const Transfer: React.FC<TransferProps> = ({ currentUser }) => {
  const [transferType, setTransferType] = useState('internal');
  const [fromAccount, setFromAccount] = useState('checking');
  const [toAccount, setToAccount] = useState('savings');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [memo, setMemo] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    loadAccounts();
  }, [currentUser]);

  const loadAccounts = async () => {
    try {
      // Get current user from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Demo accounts for non-authenticated users
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
          }
        ];
        setAccounts(demoAccounts);
        if (demoAccounts.length > 0) {
          setFromAccount(demoAccounts[0].account_name);
          if (demoAccounts.length > 1) {
            setToAccount(demoAccounts[1].account_name);
          }
        }
        return;
      }

      // Load accounts from database
      const { data: accountsData, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading accounts:', error);
      } else {
        setAccounts(accountsData || []);
        if (accountsData && accountsData.length > 0) {
          setFromAccount(accountsData[0].account_name);
          if (accountsData.length > 1) {
            setToAccount(accountsData[1].account_name);
          }
        }
      }
      
    } catch (err) {
      console.error('Error loading accounts:', err);
    }
  };

  const recentRecipients = [
    { name: 'Priya Sharma', email: 'priya.sharma@email.com', avatar: 'PS' },
    { name: 'Amit Kumar', email: 'amit.kumar@email.com', avatar: 'AK' },
    { name: 'Sneha Patel', email: 'sneha.patel@email.com', avatar: 'SP' },
  ];

  const recentTransfers = [
    { id: 1, type: 'internal', from: 'Checking Account', to: 'Savings Account', amount: 83000, date: '2024-01-14' },
    { id: 2, type: 'external', to: 'Priya Sharma', amount: 20750, date: '2024-01-13' },
    { id: 3, type: 'internal', from: 'Investment Account', to: 'Checking Account', amount: 41500, date: '2024-01-12' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const transferAmount = parseFloat(amount);
      
      if (!transferAmount || transferAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      if (transferType === 'internal') {
        if (fromAccount === toAccount) {
          throw new Error('Cannot transfer to the same account');
        }

        const fromAccountData = accounts.find(acc => acc.account_name === fromAccount);
        if (!fromAccountData || fromAccountData.balance < transferAmount) {
          throw new Error('Insufficient balance in source account');
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const toAccountData = accounts.find(acc => acc.account_name === toAccount);
          
          // Create transfer transaction
          const { error: transactionError } = await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              account_id: fromAccountData.id,
              to_account_id: toAccountData?.id,
              transaction_type: 'transfer',
              amount: -transferAmount,
              description: memo || `Transfer from ${fromAccount} to ${toAccount}`,
              category: 'Transfer',
              reference_number: `TXN_${Date.now()}`,
              status: 'completed'
            });

          if (transactionError) {
            throw new Error('Failed to create transaction');
          }

          // Update account balances
          await supabase
            .from('accounts')
            .update({ balance: fromAccountData.balance - transferAmount })
            .eq('id', fromAccountData.id);

          if (toAccountData) {
            await supabase
              .from('accounts')
              .update({ balance: toAccountData.balance + transferAmount })
              .eq('id', toAccountData.id);
          }
        }

        setSuccess(`Successfully transferred ${formatCurrency(transferAmount)} from ${fromAccount} to ${toAccount}`);
        
        // Reset form
        setAmount('');
        setMemo('');
        
        // Reload accounts
        await loadAccounts();

      } else {
        // External transfer
        if (!recipient) {
          throw new Error('Please enter recipient details');
        }

        const fromAccountData = accounts.find(acc => acc.account_name === fromAccount);
        if (!fromAccountData || fromAccountData.balance < transferAmount) {
          throw new Error('Insufficient balance in source account');
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Create expense transaction for external transfer
          const { error: transactionError } = await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              account_id: fromAccountData.id,
              transaction_type: 'expense',
              amount: -transferAmount,
              description: `Transfer to ${recipient}${memo ? ` - ${memo}` : ''}`,
              category: 'Transfer',
              reference_number: `EXT_${Date.now()}`,
              status: 'completed'
            });

          if (transactionError) {
            throw new Error('Failed to create transaction');
          }

          // Update account balance
          await supabase
            .from('accounts')
            .update({ balance: fromAccountData.balance - transferAmount })
            .eq('id', fromAccountData.id);
        }

        setSuccess(`Successfully sent ${formatCurrency(transferAmount)} to ${recipient}`);
        
        // Reset form
        setAmount('');
        setRecipient('');
        setMemo('');
        
        // Reload accounts
        await loadAccounts();
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transfer Money</h1>
        <p className="text-gray-600">Send money between accounts or to other people</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transfer Form */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setTransferType('internal')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  transferType === 'internal' 
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Between My Accounts
              </button>
              <button
                onClick={() => setTransferType('external')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  transferType === 'external' 
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                To Someone Else
              </button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleTransfer} className="space-y-6">
            {/* From Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Account</label>
              <select
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {accounts.map(account => (
                  <option key={account.id} value={account.account_name}>
                    {account.account_name} - {formatCurrency(account.balance)}
                  </option>
                ))}
              </select>
            </div>

            {/* To Account/Recipient */}
            <div>
              {transferType === 'internal' ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Account</label>
                  <select
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {accounts.filter(account => account.account_name !== fromAccount).map(account => (
                      <option key={account.id} value={account.account_name}>
                        {account.account_name} - {formatCurrency(account.balance)}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter email or phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Memo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Memo (Optional)</label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="What's this for?"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Transfer Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Transfer Money</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Recipients */}
          {transferType === 'external' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Recipients</h3>
              <div className="space-y-3">
                {recentRecipients.map((recipient, index) => (
                  <button
                    key={index}
                    onClick={() => setRecipient(recipient.email)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                      {recipient.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{recipient.name}</p>
                      <p className="text-sm text-gray-500 truncate">{recipient.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Transfers */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transfers</h3>
            <div className="space-y-4">
              {recentTransfers.map((transfer) => (
                <div key={transfer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                      {transfer.type === 'internal' ? <ArrowRight className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {transfer.type === 'internal' 
                          ? `${transfer.from} → ${transfer.to}`
                          : `To ${transfer.to}`
                        }
                      </p>
                      <p className="text-xs text-gray-500">{transfer.date}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">{formatCurrency(transfer.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;