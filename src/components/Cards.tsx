import React, { useState } from 'react';
import { CreditCard, Eye, EyeOff, Lock, MoreHorizontal, Plus, Shield } from 'lucide-react';

const Cards: React.FC = () => {
  const [showCardNumbers, setShowCardNumbers] = useState<{[key: string]: boolean}>({});

  const cards = [
    {
      id: '1',
      type: 'credit',
      name: 'HDFC Platinum Rewards',
      number: '4532 1234 5678 9012',
      balance: 103750.32,
      limit: 415000,
      expiry: '12/26',
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: '2',
      type: 'debit',
      name: 'SBI Everyday Debit',
      number: '5432 9876 5432 1098',
      balance: 286289.45,
      limit: null,
      expiry: '08/27',
      color: 'from-green-600 to-teal-600'
    },
    {
      id: '3',
      type: 'credit',
      name: 'ICICI Travel Rewards',
      number: '3782 822463 12005',
      balance: 72662.45,
      limit: 830000,
      expiry: '03/28',
      color: 'from-purple-600 to-pink-600'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const toggleCardNumber = (cardId: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Cards</h1>
          <p className="text-gray-600">Manage your credit and debit cards</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add New Card</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="relative">
            {/* Card */}
            <div className={`relative bg-gradient-to-r ${card.color} rounded-2xl p-6 text-white shadow-lg h-48 overflow-hidden`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-full"></div>
              </div>
              
              {/* Card Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{card.name}</p>
                    <p className="text-xs opacity-75 capitalize">{card.type} Card</p>
                  </div>
                  <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono tracking-wider">
                      {showCardNumbers[card.id] 
                        ? card.number 
                        : `${card.number.slice(0, 4)} •••• •••• ${card.number.slice(-4)}`
                      }
                    </span>
                    <button
                      onClick={() => toggleCardNumber(card.id)}
                      className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                      {showCardNumbers[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-75">Valid Thru</p>
                      <p className="text-sm font-mono">{card.expiry}</p>
                    </div>
                    <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center">
                      <CreditCard className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Info */}
            <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  {card.type === 'credit' ? 'Balance' : 'Available'}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(card.balance)}
                </span>
              </div>
              
              {card.limit && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Credit Limit</span>
                    <span className="text-gray-900">{formatCurrency(card.limit)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(card.balance / card.limit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {((card.balance / card.limit) * 100).toFixed(1)}% utilized
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Card Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center space-y-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Lock className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Freeze Card</span>
            </button>
            <button className="flex flex-col items-center space-y-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium text-green-900">Report Issue</span>
            </button>
            <button className="flex flex-col items-center space-y-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <CreditCard className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Order Replacement</span>
            </button>
            <button className="flex flex-col items-center space-y-2 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <Plus className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Increase Limit</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Card Transactions</h3>
          <div className="space-y-4">
            {[
              { merchant: 'Amazon India', amount: -7465.92, date: '2024-01-15', card: 'HDFC Platinum Rewards' },
              { merchant: 'Starbucks', amount: -452.45, date: '2024-01-14', card: 'SBI Everyday Debit' },
              { merchant: 'Indian Oil Petrol Pump', amount: -3752.20, date: '2024-01-13', card: 'ICICI Travel Rewards' },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.merchant}</p>
                    <p className="text-sm text-gray-500">{transaction.card} • {transaction.date}</p>
                  </div>
                </div>
                <span className="font-semibold text-red-600">
                  {formatCurrency(Math.abs(transaction.amount))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;