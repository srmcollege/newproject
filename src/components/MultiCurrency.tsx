import React, { useState } from 'react';
import { ArrowUpDown, TrendingUp, TrendingDown, RefreshCw, Globe } from 'lucide-react';

const MultiCurrency: React.FC = () => {
  const [selectedFromCurrency, setSelectedFromCurrency] = useState('INR');
  const [selectedToCurrency, setSelectedToCurrency] = useState('USD');
  const [amount, setAmount] = useState('100000');

  const currencies = [
    {
      code: 'INR',
      name: 'Indian Rupee',
      symbol: '₹',
      balance: 11332285.66,
      rate: 1,
      change: 0,
      flag: '🇮🇳'
    },
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      balance: 15420.50,
      rate: 83.25,
      change: -0.15,
      flag: '🇺🇸'
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      balance: 8750.25,
      rate: 90.45,
      change: 0.25,
      flag: '🇪🇺'
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      balance: 6200.75,
      rate: 105.80,
      change: 0.45,
      flag: '🇬🇧'
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      balance: 1250000,
      rate: 0.56,
      change: -0.08,
      flag: '🇯🇵'
    },
    {
      code: 'AUD',
      name: 'Australian Dollar',
      symbol: 'A$',
      balance: 12500.00,
      rate: 55.20,
      change: 0.12,
      flag: '🇦🇺'
    }
  ];

  const formatCurrency = (amount: number, currency: string) => {
    const currencyData = currencies.find(c => c.code === currency);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency === 'JPY' ? 0 : 2
    }).format(amount);
  };

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1;
    
    // Convert to INR first, then to target currency
    const inrAmount = fromCurrency === 'INR' ? amount : amount * fromRate;
    const convertedAmount = toCurrency === 'INR' ? inrAmount : inrAmount / toRate;
    
    return convertedAmount;
  };

  const swapCurrencies = () => {
    const temp = selectedFromCurrency;
    setSelectedFromCurrency(selectedToCurrency);
    setSelectedToCurrency(temp);
  };

  const totalBalanceInINR = currencies.reduce((total, currency) => {
    if (currency.code === 'INR') {
      return total + currency.balance;
    }
    return total + (currency.balance * currency.rate);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Multi-Currency Wallet</h1>
          <p className="text-gray-600">Manage your global finances across multiple currencies</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Rates</span>
        </button>
      </div>

      {/* Total Portfolio Value */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-2">Total Portfolio Value</p>
            <p className="text-3xl font-bold">{formatCurrency(totalBalanceInINR, 'INR')}</p>
            <p className="text-blue-100 text-sm mt-1">Across {currencies.length} currencies</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Currency Converter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Currency Converter</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div className="space-y-2">
              <select
                value={selectedFromCurrency}
                onChange={(e) => setSelectedFromCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div className="space-y-2">
              <select
                value={selectedToCurrency}
                onChange={(e) => setSelectedToCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
                {formatCurrency(
                  convertCurrency(parseFloat(amount) || 0, selectedFromCurrency, selectedToCurrency),
                  selectedToCurrency
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Exchange Rate: 1 {selectedFromCurrency} = {
              (convertCurrency(1, selectedFromCurrency, selectedToCurrency)).toFixed(4)
            } {selectedToCurrency}
          </p>
        </div>
      </div>

      {/* Currency Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currencies.map((currency) => (
          <div key={currency.code} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{currency.flag}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{currency.code}</h3>
                  <p className="text-sm text-gray-500">{currency.name}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 ${
                currency.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {currency.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(currency.change)}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(currency.balance, currency.code)}
              </div>
              <div className="text-sm text-gray-500">
                ≈ {formatCurrency(
                  currency.code === 'INR' ? currency.balance : currency.balance * currency.rate,
                  'INR'
                )}
              </div>
              {currency.code !== 'INR' && (
                <div className="text-xs text-gray-400">
                  Rate: 1 {currency.code} = ₹{currency.rate.toFixed(2)}
                </div>
              )}
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                Send
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                Receive
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Exchange Rate Trends */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Exchange Rate Trends (vs INR)</h3>
        
        <div className="space-y-4">
          {currencies.filter(c => c.code !== 'INR').map((currency) => (
            <div key={currency.code} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{currency.flag}</span>
                <div>
                  <p className="font-medium text-gray-900">{currency.code}/INR</p>
                  <p className="text-sm text-gray-500">{currency.name}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">₹{currency.rate.toFixed(2)}</p>
                <div className={`flex items-center space-x-1 ${
                  currency.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {currency.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span className="text-sm">{currency.change >= 0 ? '+' : ''}{currency.change}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiCurrency;