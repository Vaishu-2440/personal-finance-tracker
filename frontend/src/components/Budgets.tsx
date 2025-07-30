import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import AddBudgetModal from './AddBudgetModal';

interface Budget {
  id: number;
  category: string;
  amount: number;
  period: string;
  start_date: string;
}

interface BudgetStatus {
  category: string;
  budget_amount: number;
  spent_amount: number;
  remaining_amount: number;
  percentage_used: number;
  status: 'under' | 'warning' | 'over';
}

const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchBudgets();
    fetchBudgetStatus();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('/api/budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchBudgetStatus = async () => {
    try {
      const response = await axios.get('/api/analytics/budget-status');
      setBudgetStatus(response.data);
    } catch (error) {
      console.error('Error fetching budget status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetAdded = () => {
    fetchBudgets();
    fetchBudgetStatus();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'over':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600 mt-2">Set and track your spending limits</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Budget Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgetStatus.map((status) => (
          <div key={status.category} className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {status.category}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status.status)}`}>
                {status.status === 'under' && 'Under Budget'}
                {status.status === 'warning' && 'Warning'}
                {status.status === 'over' && 'Over Budget'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Budget</span>
                <span className="font-medium">{formatCurrency(status.budget_amount)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Spent</span>
                <span className="font-medium">{formatCurrency(status.spent_amount)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining</span>
                <span className={`font-medium ${
                  status.remaining_amount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(status.remaining_amount)}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(status.percentage_used)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(status.percentage_used)}`}
                    style={{ width: `${Math.min(status.percentage_used, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Budget List */}
      <div className="bg-white rounded-lg shadow-md border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Budgets</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {budgets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No budgets set</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-2 text-green-600 hover:text-green-700 font-medium"
              >
                Create your first budget
              </button>
            </div>
          ) : (
            budgets.map((budget) => (
              <div key={budget.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">{budget.category}</h3>
                    <p className="text-sm text-gray-600">
                      {budget.period} budget • Started {new Date(budget.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(budget.amount)}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Budgeting Tips</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• Set realistic budgets based on your actual spending patterns</p>
          <p>• Review your budgets monthly and adjust as needed</p>
          <p>• Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings</p>
          <p>• Track your progress regularly to stay motivated</p>
        </div>
      </div>

      {/* Add Budget Modal */}
      <AddBudgetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleBudgetAdded}
      />
    </div>
  );
};

export default Budgets; 