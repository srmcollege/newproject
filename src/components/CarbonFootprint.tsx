import React, { useState } from 'react';
import { Leaf, Car, Zap, Home, Plane, ShoppingBag, TrendingDown, Award } from 'lucide-react';

const CarbonFootprint: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const carbonData = [
    {
      category: 'Transportation',
      emissions: 245.8,
      spending: 73870,
      icon: Car,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      percentage: 42,
      trend: 'up',
      details: [
        { item: 'Petrol/Diesel', emissions: 180.5, spending: 52400 },
        { item: 'Uber/Ola rides', emissions: 45.2, spending: 15600 },
        { item: 'Flight booking', emissions: 20.1, spending: 5870 }
      ]
    },
    {
      category: 'Utilities',
      emissions: 156.4,
      spending: 23240,
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      percentage: 27,
      trend: 'down',
      details: [
        { item: 'Electricity bill', emissions: 98.6, spending: 9960 },
        { item: 'Gas connection', emissions: 35.8, spending: 8450 },
        { item: 'Water bill', emissions: 22.0, spending: 4830 }
      ]
    },
    {
      category: 'Food & Dining',
      emissions: 89.2,
      spending: 102940,
      icon: ShoppingBag,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      percentage: 15,
      trend: 'up',
      details: [
        { item: 'Restaurant dining', emissions: 45.6, spending: 45200 },
        { item: 'Food delivery', emissions: 28.4, spending: 37740 },
        { item: 'Grocery shopping', emissions: 15.2, spending: 20000 }
      ]
    },
    {
      category: 'Shopping',
      emissions: 67.3,
      spending: 55615,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      percentage: 12,
      trend: 'stable',
      details: [
        { item: 'Online shopping', emissions: 35.8, spending: 32400 },
        { item: 'Clothing', emissions: 18.5, spending: 15600 },
        { item: 'Electronics', emissions: 13.0, spending: 7615 }
      ]
    },
    {
      category: 'Entertainment',
      emissions: 25.1,
      spending: 23240,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      percentage: 4,
      trend: 'down',
      details: [
        { item: 'Movie tickets', emissions: 12.5, spending: 8320 },
        { item: 'Streaming services', emissions: 8.2, spending: 2649 },
        { item: 'Gaming', emissions: 4.4, spending: 12271 }
      ]
    }
  ];

  const totalEmissions = carbonData.reduce((sum, item) => sum + item.emissions, 0);
  const totalSpending = carbonData.reduce((sum, item) => sum + item.spending, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getEmissionLevel = (emissions: number) => {
    if (emissions < 400) return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (emissions < 700) return { level: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'High', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const emissionLevel = getEmissionLevel(totalEmissions);

  const suggestions = [
    {
      title: 'Switch to Public Transport',
      impact: '-45 kg CO₂/month',
      savings: '₹15,000/month',
      icon: Car,
      difficulty: 'Easy'
    },
    {
      title: 'Use Solar Power',
      impact: '-35 kg CO₂/month',
      savings: '₹3,500/month',
      icon: Zap,
      difficulty: 'Medium'
    },
    {
      title: 'Reduce Food Delivery',
      impact: '-15 kg CO₂/month',
      savings: '₹8,000/month',
      icon: ShoppingBag,
      difficulty: 'Easy'
    },
    {
      title: 'Buy Local Products',
      impact: '-20 kg CO₂/month',
      savings: '₹5,000/month',
      icon: Leaf,
      difficulty: 'Easy'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Carbon Footprint Tracker</h1>
          <p className="text-gray-600">Monitor your environmental impact based on spending patterns</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Carbon Overview */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 mb-2">Total Carbon Footprint</p>
            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-bold">{totalEmissions.toFixed(1)}</span>
              <span className="text-xl">kg CO₂</span>
            </div>
            <div className="mt-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${emissionLevel.bgColor} ${emissionLevel.color}`}>
                {emissionLevel.level} Impact
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Leaf className="w-10 h-10" />
            </div>
            <p className="text-green-100 text-sm mt-2">
              From {formatCurrency(totalSpending)} spending
            </p>
          </div>
        </div>
      </div>

      {/* Emission Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Emissions by Category</h3>
          
          <div className="space-y-4">
            {carbonData.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${category.bgColor}`}>
                        <Icon className={`w-5 h-5 ${category.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{category.category}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(category.spending)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{category.emissions.toFixed(1)} kg</p>
                      <div className={`flex items-center space-x-1 ${
                        category.trend === 'up' ? 'text-red-600' : 
                        category.trend === 'down' ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {category.trend === 'up' && <span className="text-xs">↗</span>}
                        {category.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                        <span className="text-xs">{category.percentage}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        category.color === 'text-red-600' ? 'bg-red-500' :
                        category.color === 'text-orange-600' ? 'bg-orange-500' :
                        category.color === 'text-green-600' ? 'bg-green-500' :
                        category.color === 'text-purple-600' ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pie Chart Representation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Carbon Distribution</h3>
          
          <div className="relative w-48 h-48 mx-auto mb-6">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-red-400 via-orange-400 via-yellow-400 via-green-400 to-blue-400 flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalEmissions.toFixed(0)}</div>
                  <div className="text-sm text-gray-600">kg CO₂</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {carbonData.slice(0, 3).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-red-500' :
                    index === 1 ? 'bg-orange-500' :
                    'bg-green-500'
                  }`}></div>
                  <span className="text-sm text-gray-700">{category.category}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {category.emissions.toFixed(1)} kg
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Emission Sources</h3>
        
        <div className="space-y-6">
          {carbonData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{category.category}</h4>
                  <p className="text-sm text-gray-500">
                    {category.emissions.toFixed(1)} kg CO₂ from {formatCurrency(category.spending)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {category.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{detail.item}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {detail.emissions.toFixed(1)} kg CO₂
                      </span>
                      <p className="text-xs text-gray-500">{formatCurrency(detail.spending)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reduction Suggestions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Reduction Suggestions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{suggestion.title}</h4>
                    <div className="space-y-1">
                      <p className="text-sm text-green-600 font-medium">{suggestion.impact}</p>
                      <p className="text-sm text-blue-600">{suggestion.savings}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        suggestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        suggestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {suggestion.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Environmental Impact Comparison</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-blue-900">{(totalEmissions / 12).toFixed(1)}</p>
            <p className="text-sm text-blue-700">Trees needed per month</p>
            <p className="text-xs text-blue-600 mt-1">to offset your emissions</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Car className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-green-900">{(totalEmissions * 2.3).toFixed(0)}</p>
            <p className="text-sm text-green-700">km of car driving</p>
            <p className="text-xs text-green-600 mt-1">equivalent emissions</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-purple-900">B+</p>
            <p className="text-sm text-purple-700">Environmental Grade</p>
            <p className="text-xs text-purple-600 mt-1">Better than 65% of users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprint;