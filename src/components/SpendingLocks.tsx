import React, { useState } from 'react';
import { Lock, Unlock, AlertTriangle, Shield, Plus, Settings } from 'lucide-react';

const SpendingLocks: React.FC = () => {
  const [locks, setLocks] = useState([
    {
      id: 1,
      category: 'Food & Dining',
      limit: 41500,
      spent: 28220,
      isActive: true,
      period: 'monthly',
      icon: '🍽️',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 2,
      category: 'Entertainment',
      limit: 16600,
      spent: 7885,
      isActive: true,
      period: 'monthly',
      icon: '🎬',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 3,
      category: 'Shopping',
      limit: 33200,
      spent: 31750,
      isActive: true,
      period: 'monthly',
      icon: '🛍️',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      id: 4,
      category: 'Transportation',
      limit: 24900,
      spent: 14940,
      isActive: false,
      period: 'monthly',
      icon: '🚗',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 5,
      category: 'Online Subscriptions',
      limit: 5000,
      spent: 4850,
      isActive: true,
      period: 'monthly',
      icon: '📱',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const toggleLock = (lockId: number) => {
    setLocks(locks.map(lock => 
      lock.id === lockId ? { ...lock, isActive: !lock.isActive } : lock
    ));
  };

  const getUtilizationPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getStatusColor = (spent: number, limit: number) => {
    const percentage = getUtilizationPercentage(spent, limit);
    if (percentage >= 95) return 'text-red-600';
    if (percentage >= 80) return 'text-orange-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusBgColor = (spent: number, limit: number) => {
    const percentage = getUtilizationPercentage(spent, limit);
    if (percentage >= 95) return 'bg-red-100';
    if (percentage >= 80) return 'bg-orange-100';
    if (percentage >= 60) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const activeLocks = locks.filter(lock => lock.isActive).length;
  const nearLimitLocks = locks.filter(lock => 
    lock.isActive && getUtilizationPercentage(lock.spent, lock.limit) >= 80
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Spending Locks</h1>
          <p className="text-gray-600">Set limits and control your spending across different categories</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add New Lock</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeLocks}</p>
              <p className="text-sm text-gray-600">Active Locks</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{nearLimitLocks}</p>
              <p className="text-sm text-gray-600">Near Limit</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(locks.reduce((sum, lock) => sum + (lock.limit - lock.spent), 0))}
              </p>
              <p className="text-sm text-gray-600">Total Remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Spending Locks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Category Limits</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {locks.map((lock) => {
            const utilizationPercentage = getUtilizationPercentage(lock.spent, lock.limit);
            const remaining = lock.limit - lock.spent;
            const isNearLimit = utilizationPercentage >= 80;
            const isOverLimit = utilizationPercentage >= 95;

            return (
              <div key={lock.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{lock.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{lock.category}</h4>
                      <p className="text-sm text-gray-500 capitalize">{lock.period} limit</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(lock.spent)} / {formatCurrency(lock.limit)}
                      </p>
                      <p className={`text-sm font-medium ${getStatusColor(lock.spent, lock.limit)}`}>
                        {remaining > 0 ? `${formatCurrency(remaining)} remaining` : 'Limit exceeded'}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleLock(lock.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        lock.isActive
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {lock.isActive ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                    </button>

                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        isOverLimit ? 'bg-red-500' :
                        isNearLimit ? 'bg-orange-500' :
                        utilizationPercentage >= 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹0</span>
                    <span>{utilizationPercentage.toFixed(1)}% used</span>
                    <span>{formatCurrency(lock.limit)}</span>
                  </div>
                </div>

                {/* Status Messages */}
                {lock.isActive && (
                  <>
                    {isOverLimit && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <p className="text-sm text-red-800 font-medium">
                            ⚠️ Spending limit exceeded! Further transactions in this category will be blocked.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {isNearLimit && !isOverLimit && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <p className="text-sm text-orange-800 font-medium">
                            🚨 You're approaching your spending limit for this category.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!lock.isActive && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Unlock className="w-4 h-4 text-gray-600" />
                      <p className="text-sm text-gray-700">
                        Spending lock is disabled. Click the lock icon to enable protection.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lock Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lock Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto-Lock on Limit</p>
                <p className="text-sm text-gray-500">Automatically block transactions when limit is reached</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Warning Notifications</p>
                <p className="text-sm text-gray-500">Get notified when approaching limits (80%)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Emergency Override</p>
                <p className="text-sm text-gray-500">Allow emergency transactions even when locked</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Lock Period
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="weekly">Weekly</option>
                <option value="monthly" selected>Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warning Threshold
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="70">70% of limit</option>
                <option value="80" selected>80% of limit</option>
                <option value="90">90% of limit</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingLocks;