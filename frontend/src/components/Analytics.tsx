import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';
import axios from 'axios';

interface TrendData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

const Analytics: React.FC = () => {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await axios.get('/api/analytics/trends');
      setTrends(response.data);
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Deep insights into your financial patterns</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income (6 months)</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(trends.reduce((sum, trend) => sum + trend.income, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses (6 months)</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(trends.reduce((sum, trend) => sum + trend.expenses, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Savings (6 months)</p>
              <p className={`text-2xl font-bold ${
                trends.reduce((sum, trend) => sum + trend.net, 0) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(trends.reduce((sum, trend) => sum + trend.net, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Trends</h2>
        </div>
        <div className="p-6">
          {trends.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No trend data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trends.map((trend, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{formatMonth(trend.month)}</h3>
                    <div className="flex space-x-4 text-sm">
                      <span className="text-green-600">+{formatCurrency(trend.income)}</span>
                      <span className="text-red-600">-{formatCurrency(trend.expenses)}</span>
                      <span className={`font-semibold ${
                        trend.net >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trend.net >= 0 ? '+' : ''}{formatCurrency(trend.net)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Simple Bar Chart */}
                  <div className="flex items-end space-x-1 h-8">
                    <div className="flex-1 bg-green-200 rounded-t" style={{ height: `${Math.max((trend.income / Math.max(...trends.map(t => t.income))) * 100, 10)}%` }}>
                      <div className="bg-green-500 h-full rounded-t"></div>
                    </div>
                    <div className="flex-1 bg-red-200 rounded-t" style={{ height: `${Math.max((trend.expenses / Math.max(...trends.map(t => t.expenses))) * 100, 10)}%` }}>
                      <div className="bg-red-500 h-full rounded-t"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Patterns */}
        <div className="bg-white rounded-lg shadow-md border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Spending Patterns</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Monthly Income</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(trends.length > 0 ? trends.reduce((sum, t) => sum + t.income, 0) / trends.length : 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Monthly Expenses</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(trends.length > 0 ? trends.reduce((sum, t) => sum + t.expenses, 0) / trends.length : 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Savings Rate</span>
                <span className="font-semibold text-blue-600">
                  {trends.length > 0 ? 
                    Math.round((trends.reduce((sum, t) => sum + t.net, 0) / trends.reduce((sum, t) => sum + t.income, 0)) * 100) : 0
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Health */}
        <div className="bg-white rounded-lg shadow-md border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Financial Health</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {trends.length > 0 && (
                <>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      trends.every(t => t.net >= 0) ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm">
                      {trends.every(t => t.net >= 0) ? 'Positive cash flow' : 'Mixed cash flow'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      trends[trends.length - 1]?.net >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm">
                      Latest month: {trends[trends.length - 1]?.net >= 0 ? 'Positive' : 'Negative'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">
                      Best month: {formatMonth(trends.reduce((best, current) => 
                        current.net > best.net ? current : best
                      ).month)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Financial Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">Income Optimization</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Consider side hustles to increase income</li>
              <li>• Negotiate salary increases or promotions</li>
              <li>• Invest in skills that increase earning potential</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-blue-800">Expense Management</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Review recurring subscriptions regularly</li>
              <li>• Look for ways to reduce fixed costs</li>
              <li>• Use budgeting tools to track spending</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 