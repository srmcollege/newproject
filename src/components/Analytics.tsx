import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Download } from 'lucide-react';

const Analytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState('month');

  const stats = [
    {
      title: 'Total Income',
      value: '₹7,01,350.00',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Total Expenses',
      value: '₹5,17,133.50',
      change: '+5.2%',
      trend: 'up',
      icon: TrendingDown,
      color: 'text-red-600'
    },
    {
      title: 'Net Savings',
      value: '₹1,84,216.50',
      change: '+22.8%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      title: 'Savings Goal',
      value: '74%',
      change: '+8.5%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600'
    }
  ];

  const categoryData = [
    { category: 'Food & Dining', amount: 102940, percentage: 35, color: 'bg-blue-500' },
    { category: 'Transportation', amount: 73870, percentage: 25, color: 'bg-green-500' },
    { category: 'Shopping', amount: 55615, percentage: 19, color: 'bg-purple-500' },
    { category: 'Utilities', amount: 37350, percentage: 13, color: 'bg-orange-500' },
    { category: 'Entertainment', amount: 23240, percentage: 8, color: 'bg-pink-500' },
  ];

  const monthlyData = [
    { month: 'Jan', income: 597600, expenses: 448200, savings: 149400 },
    { month: 'Feb', income: 622500, expenses: 481400, savings: 141100 },
    { month: 'Mar', income: 680600, expenses: 506300, savings: 174300 },
    { month: 'Apr', income: 647400, expenses: 489700, savings: 157700 },
    { month: 'May', income: 701350, expenses: 517133, savings: 184217 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your financial performance and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.color === 'text-green-600' ? 'bg-green-100' : stat.color === 'text-red-600' ? 'bg-red-100' : stat.color === 'text-blue-600' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h3>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900">{data.month}</span>
                  <span className="text-gray-600">{formatCurrency(data.income)}</span>
                </div>
                <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${(data.income / 747000) * 100}%` }}
                  ></div>
                  <div 
                    className="absolute top-0 left-0 h-full bg-red-400 rounded-full transition-all duration-300"
                    style={{ width: `${(data.expenses / 747000) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Expenses: {formatCurrency(data.expenses)}</span>
                  <span>Savings: {formatCurrency(data.savings)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Income</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span className="text-gray-600">Expenses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending by Category</h3>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-4 h-4 ${category.color} rounded-full`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{category.category}</span>
                      <span className="text-sm text-gray-600">{formatCurrency(category.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${category.color}`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 ml-4">{category.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Goals */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Emergency Fund', current: 1245000, target: 1660000, color: 'bg-blue-500' },
            { name: 'Vacation Fund', current: 265600, target: 415000, color: 'bg-green-500' },
            { name: 'New Car', current: 705500, target: 2075000, color: 'bg-purple-500' },
          ].map((goal, index) => {
            const percentage = (goal.current / goal.target) * 100;
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{goal.name}</h4>
                  <span className="text-sm font-medium text-gray-600">{percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${goal.color}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{formatCurrency(goal.current)}</span>
                  <span>{formatCurrency(goal.target)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;