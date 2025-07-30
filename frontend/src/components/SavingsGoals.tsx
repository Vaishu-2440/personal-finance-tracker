import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Target, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios';
import AddSavingsGoalModal from './AddSavingsGoalModal';

interface SavingsGoal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
}

const SavingsGoals: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get('/api/savings-goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching savings goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalAdded = () => {
    fetchGoals();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
          <h1 className="text-3xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-gray-600 mt-2">Track your progress towards financial goals</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-white p-8 rounded-lg shadow-md border text-center">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Savings Goals</h3>
              <p className="text-gray-600 mb-4">Start by creating your first savings goal</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Your First Goal
              </button>
            </div>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateProgress(goal.current_amount, goal.target_amount);
            const daysRemaining = goal.target_date ? getDaysRemaining(goal.target_date) : null;
            
            return (
              <div key={goal.id} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Amounts */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Current</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(goal.current_amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Target</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(goal.target_amount)}
                      </p>
                    </div>
                  </div>

                  {/* Remaining */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatCurrency(goal.target_amount - goal.current_amount)}
                    </p>
                  </div>

                  {/* Target Date */}
                  {goal.target_date && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Target: {new Date(goal.target_date).toLocaleDateString()}
                        {daysRemaining !== null && (
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            daysRemaining < 0 ? 'bg-red-100 text-red-600' :
                            daysRemaining < 30 ? 'bg-yellow-100 text-yellow-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {daysRemaining < 0 ? 'Overdue' : 
                             daysRemaining === 0 ? 'Today' :
                             `${daysRemaining} days left`}
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      {goals.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Saved</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(goals.reduce((sum, goal) => sum + goal.current_amount, 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Target</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(goals.reduce((sum, goal) => sum + goal.target_amount, 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Average Progress</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(
                  goals.reduce((sum, goal) => sum + calculateProgress(goal.current_amount, goal.target_amount), 0) / goals.length
                )}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">Savings Tips</h3>
        <div className="space-y-2 text-sm text-purple-800">
          <p>• Set specific, measurable goals with target dates</p>
          <p>• Automate your savings to make it effortless</p>
          <p>• Start small and increase your savings gradually</p>
          <p>• Celebrate milestones to stay motivated</p>
        </div>
      </div>

      {/* Add Savings Goal Modal */}
      <AddSavingsGoalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleGoalAdded}
      />
    </div>
  );
};

export default SavingsGoals; 