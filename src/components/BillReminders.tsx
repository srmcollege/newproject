import React, { useState } from 'react';
import { Bell, Calendar, CreditCard, Zap, Wifi, Car, Plus, Check, AlertTriangle } from 'lucide-react';

const BillReminders: React.FC = () => {
  const [bills, setBills] = useState([
    {
      id: 1,
      name: 'BSES Electricity Bill',
      amount: 9960,
      dueDate: '2024-01-18',
      category: 'Utilities',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      status: 'due',
      autopay: false
    },
    {
      id: 2,
      name: 'Airtel Mobile Bill',
      amount: 1299,
      dueDate: '2024-01-20',
      category: 'Telecom',
      icon: Wifi,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      status: 'upcoming',
      autopay: true
    },
    {
      id: 3,
      name: 'HDFC Credit Card',
      amount: 45670,
      dueDate: '2024-01-22',
      category: 'Credit Card',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      status: 'upcoming',
      autopay: false
    },
    {
      id: 4,
      name: 'Car Insurance Premium',
      amount: 28500,
      dueDate: '2024-01-25',
      category: 'Insurance',
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      status: 'upcoming',
      autopay: false
    },
    {
      id: 5,
      name: 'Netflix Subscription',
      amount: 649,
      dueDate: '2024-01-12',
      category: 'Entertainment',
      icon: Bell,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      status: 'paid',
      autopay: true
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

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusInfo = (status: string, daysUntilDue: number) => {
    switch (status) {
      case 'due':
        return {
          text: daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `Due in ${daysUntilDue} days`,
          color: daysUntilDue < 0 ? 'text-red-600' : daysUntilDue <= 3 ? 'text-orange-600' : 'text-yellow-600',
          bgColor: daysUntilDue < 0 ? 'bg-red-100' : daysUntilDue <= 3 ? 'bg-orange-100' : 'bg-yellow-100'
        };
      case 'upcoming':
        return {
          text: `Due in ${daysUntilDue} days`,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        };
      case 'paid':
        return {
          text: 'Paid',
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      default:
        return {
          text: 'Unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
    }
  };

  const toggleAutopay = (billId: number) => {
    setBills(bills.map(bill => 
      bill.id === billId ? { ...bill, autopay: !bill.autopay } : bill
    ));
  };

  const markAsPaid = (billId: number) => {
    setBills(bills.map(bill => 
      bill.id === billId ? { ...bill, status: 'paid' } : bill
    ));
  };

  const totalUpcoming = bills
    .filter(bill => bill.status !== 'paid')
    .reduce((sum, bill) => sum + bill.amount, 0);

  const dueSoon = bills.filter(bill => {
    const daysUntil = getDaysUntilDue(bill.dueDate);
    return bill.status !== 'paid' && daysUntil <= 7;
  }).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bill Reminders</h1>
          <p className="text-gray-600">Stay on top of your upcoming payments</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Bill</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{dueSoon}</p>
              <p className="text-sm text-gray-600">Due This Week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalUpcoming)}</p>
              <p className="text-sm text-gray-600">Total Upcoming</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {bills.filter(b => b.autopay).length}
              </p>
              <p className="text-sm text-gray-600">Auto-Pay Enabled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bills List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Bills</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {bills
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .map((bill) => {
              const Icon = bill.icon;
              const daysUntilDue = getDaysUntilDue(bill.dueDate);
              const statusInfo = getStatusInfo(bill.status, daysUntilDue);

              return (
                <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 ${bill.bgColor} ${bill.color} rounded-lg`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{bill.name}</h4>
                        <p className="text-sm text-gray-500">{bill.category}</p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(bill.dueDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(bill.amount)}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {bill.status !== 'paid' && (
                          <>
                            <button
                              onClick={() => markAsPaid(bill.id)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Pay Now
                            </button>
                            <button
                              onClick={() => toggleAutopay(bill.id)}
                              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                bill.autopay
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {bill.autopay ? 'Auto-Pay ON' : 'Auto-Pay OFF'}
                            </button>
                          </>
                        )}
                        {bill.status === 'paid' && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg">
                            ✓ Paid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {bill.autopay && bill.status !== 'paid' && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        🤖 Auto-Pay is enabled. This bill will be automatically paid from your checking account on the due date.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Reminders</p>
              <p className="text-sm text-gray-500">Get notified 7 days before due date</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">SMS Alerts</p>
              <p className="text-sm text-gray-500">Get SMS alerts 3 days before due date</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Push Notifications</p>
              <p className="text-sm text-gray-500">Get app notifications for overdue bills</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillReminders;