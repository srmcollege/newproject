import React, { useState } from 'react';
import { TrendingUp, TrendingDown, CreditCard, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

const CreditScore: React.FC = () => {
  const [currentScore, setCurrentScore] = useState(742);
  const [selectedAction, setSelectedAction] = useState('');
  const [simulatedScore, setSimulatedScore] = useState(742);

  const scoreRanges = [
    { min: 300, max: 549, label: 'Poor', color: 'text-red-600', bgColor: 'bg-red-100' },
    { min: 550, max: 649, label: 'Fair', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { min: 650, max: 749, label: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { min: 750, max: 850, label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' }
  ];

  const actions = [
    {
      id: 'pay_debt',
      title: 'Pay Off Credit Card Debt',
      description: 'Pay ₹50,000 towards credit card balance',
      impact: +25,
      timeframe: '1-2 months'
    },
    {
      id: 'increase_limit',
      title: 'Request Credit Limit Increase',
      description: 'Increase total credit limit by ₹2,00,000',
      impact: +15,
      timeframe: '2-3 months'
    },
    {
      id: 'new_card',
      title: 'Apply for New Credit Card',
      description: 'Add a new credit card to your portfolio',
      impact: -10,
      timeframe: '3-6 months'
    },
    {
      id: 'close_card',
      title: 'Close Old Credit Card',
      description: 'Close your oldest credit card account',
      impact: -20,
      timeframe: '1-3 months'
    },
    {
      id: 'miss_payment',
      title: 'Miss a Payment',
      description: 'Late payment on credit card or loan',
      impact: -35,
      timeframe: 'Immediate'
    },
    {
      id: 'pay_on_time',
      title: 'Pay All Bills On Time',
      description: 'Maintain perfect payment history for 6 months',
      impact: +20,
      timeframe: '6 months'
    }
  ];

  const creditHistory = [
    { month: 'Jul 2023', score: 698 },
    { month: 'Aug 2023', score: 705 },
    { month: 'Sep 2023', score: 712 },
    { month: 'Oct 2023', score: 718 },
    { month: 'Nov 2023', score: 725 },
    { month: 'Dec 2023', score: 735 },
    { month: 'Jan 2024', score: 742 }
  ];

  const factors = [
    {
      factor: 'Payment History',
      impact: 'Excellent',
      percentage: 35,
      score: 95,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      factor: 'Credit Utilization',
      impact: 'Good',
      percentage: 30,
      score: 78,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      factor: 'Length of Credit History',
      impact: 'Good',
      percentage: 15,
      score: 82,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      factor: 'Credit Mix',
      impact: 'Fair',
      percentage: 10,
      score: 65,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      factor: 'New Credit',
      impact: 'Good',
      percentage: 10,
      score: 85,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  const getCurrentScoreRange = (score: number) => {
    return scoreRanges.find(range => score >= range.min && score <= range.max) || scoreRanges[0];
  };

  const simulateAction = (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (action) {
      const newScore = Math.max(300, Math.min(850, currentScore + action.impact));
      setSimulatedScore(newScore);
      setSelectedAction(actionId);
    }
  };

  const resetSimulation = () => {
    setSimulatedScore(currentScore);
    setSelectedAction('');
  };

  const currentRange = getCurrentScoreRange(currentScore);
  const simulatedRange = getCurrentScoreRange(simulatedScore);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Credit Score Simulator</h1>
        <p className="text-gray-600">Monitor your credit score and simulate the impact of financial decisions</p>
      </div>

      {/* Current Score Display */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-2">Your Credit Score</p>
            <div className="flex items-baseline space-x-4">
              <span className="text-5xl font-bold">{currentScore}</span>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-300" />
                <span className="text-green-300">+17 this month</span>
              </div>
            </div>
            <div className="mt-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${currentRange.bgColor} ${currentRange.color}`}>
                {currentRange.label}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round((currentScore - 300) / 550 * 100)}%</div>
                <div className="text-xs text-blue-100">of max</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Simulator</h3>
          
          <div className="space-y-4">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => simulateAction(action.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAction === action.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Impact in {action.timeframe}</p>
                  </div>
                  <div className={`text-right ml-4 ${
                    action.impact > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className="flex items-center space-x-1">
                      {action.impact > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-semibold">{action.impact > 0 ? '+' : ''}{action.impact}</span>
                    </div>
                    <p className="text-xs">points</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedAction && (
            <div className="mt-4 flex space-x-2">
              <button
                onClick={resetSimulation}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulation Result</h3>
          
          {selectedAction ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">{simulatedScore}</div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${simulatedRange.bgColor} ${simulatedRange.color}`}>
                  {simulatedRange.label}
                </span>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-500">{currentScore}</div>
                  <div className="text-xs text-gray-400">Current</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  {simulatedScore > currentScore ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{simulatedScore}</div>
                  <div className="text-xs text-gray-400">Projected</div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                simulatedScore > currentScore ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {simulatedScore > currentScore ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className={`text-sm font-medium ${
                    simulatedScore > currentScore ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {simulatedScore > currentScore 
                      ? `Your score could increase by ${simulatedScore - currentScore} points`
                      : `Your score could decrease by ${currentScore - simulatedScore} points`
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Select an action to see its impact on your credit score</p>
            </div>
          )}
        </div>
      </div>

      {/* Credit Score Factors */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Credit Score Factors</h3>
        
        <div className="space-y-4">
          {factors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{factor.factor}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${factor.color}`}>{factor.impact}</span>
                    <span className="text-sm text-gray-500">{factor.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      factor.impact === 'Excellent' ? 'bg-green-500' :
                      factor.impact === 'Good' ? 'bg-yellow-500' :
                      factor.impact === 'Fair' ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${factor.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit History Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Credit Score History</h3>
        
        <div className="space-y-4">
          {creditHistory.map((entry, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{entry.month}</span>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(entry.score - 300) / 550 * 100}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-gray-900 w-12 text-right">{entry.score}</span>
                {index > 0 && (
                  <div className={`flex items-center space-x-1 w-12 ${
                    entry.score > creditHistory[index - 1].score ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {entry.score > creditHistory[index - 1].score ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-xs">
                      {entry.score > creditHistory[index - 1].score ? '+' : ''}
                      {entry.score - creditHistory[index - 1].score}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreditScore;