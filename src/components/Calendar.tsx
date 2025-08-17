import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const transactions = [
    { id: 1, date: '2024-01-15', type: 'income', amount: 207500, description: 'Salary Deposit' },
    { id: 2, date: '2024-01-14', type: 'expense', amount: -3765, description: 'Swiggy Order' },
    { id: 3, date: '2024-01-13', type: 'expense', amount: -9960, description: 'Electric Bill' },
    { id: 4, date: '2024-01-12', type: 'income', amount: 99600, description: 'Freelance Payment' },
    { id: 5, date: '2024-01-11', type: 'expense', amount: -7465, description: 'Amazon Purchase' },
    { id: 6, date: '2024-01-10', type: 'expense', amount: -2946, description: 'Petrol' },
    { id: 7, date: '2024-01-09', type: 'income', amount: 41500, description: 'Dividend' },
    { id: 8, date: '2024-01-08', type: 'expense', amount: -20750, description: 'Gym Membership' },
    { id: 9, date: '2024-01-05', type: 'expense', amount: -15600, description: 'Grocery Shopping' },
    { id: 10, date: '2024-01-03', type: 'expense', amount: -8320, description: 'Movie Tickets' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTransactionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return transactions.filter(t => t.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayTransactions = getTransactionsForDate(date);
      const totalAmount = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      const isSelected = selectedDate && 
        date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 p-2 border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors ${
            isSelected ? 'bg-blue-100 border-blue-300' : ''
          } ${isToday ? 'bg-yellow-50 border-yellow-300' : ''}`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${
              isToday ? 'text-yellow-700' : 'text-gray-900'
            }`}>
              {day}
            </span>
            {dayTransactions.length > 0 && (
              <span className="text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {dayTransactions.length}
              </span>
            )}
          </div>
          {dayTransactions.length > 0 && (
            <div className="space-y-1">
              <div className={`text-xs font-medium ${
                totalAmount >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(Math.abs(totalAmount))}
              </div>
              {dayTransactions.slice(0, 2).map(transaction => (
                <div key={transaction.id} className="text-xs text-gray-600 truncate">
                  {transaction.description}
                </div>
              ))}
              {dayTransactions.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{dayTransactions.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction Calendar</h1>
        <p className="text-gray-600">View your transactions in calendar format</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                {day}
              </div>
            ))}
            {/* Calendar days */}
            {renderCalendarDays()}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedDate ? selectedDate.toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Select a date'}
          </h3>

          {selectedDate ? (
            <div className="space-y-4">
              {getTransactionsForDate(selectedDate).length > 0 ? (
                <>
                  <div className="space-y-3">
                    {getTransactionsForDate(selectedDate).map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.type === 'income' ? 
                              <ArrowDownLeft className="w-4 h-4" /> : 
                              <ArrowUpRight className="w-4 h-4" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500">
                              {transaction.type === 'income' ? 'Income' : 'Expense'}
                            </p>
                          </div>
                        </div>
                        <span className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Net Amount:</span>
                      <span className={`font-bold text-lg ${
                        getTransactionsForDate(selectedDate).reduce((sum, t) => sum + t.amount, 0) >= 0 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(getTransactionsForDate(selectedDate).reduce((sum, t) => sum + t.amount, 0))}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📅</span>
                  </div>
                  <p className="text-gray-500">No transactions on this date</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👆</span>
              </div>
              <p className="text-gray-500">Click on a date to view transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;