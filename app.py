from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import sqlite3
import os

app = Flask(__name__)
CORS(app)

# Database initialization
def init_db():
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    # Create transactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            type TEXT NOT NULL,
            date TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create budgets table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            period TEXT NOT NULL,
            start_date TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create savings_goals table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS savings_goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            target_amount REAL NOT NULL,
            current_amount REAL DEFAULT 0,
            target_date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    # Get query parameters
    category = request.args.get('category')
    type_filter = request.args.get('type')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = 'SELECT * FROM transactions WHERE 1=1'
    params = []
    
    if category:
        query += ' AND category = ?'
        params.append(category)
    
    if type_filter:
        query += ' AND type = ?'
        params.append(type_filter)
    
    if start_date:
        query += ' AND date >= ?'
        params.append(start_date)
    
    if end_date:
        query += ' AND date <= ?'
        params.append(end_date)
    
    query += ' ORDER BY date DESC'
    
    cursor.execute(query, params)
    transactions = cursor.fetchall()
    
    conn.close()
    
    # Convert to list of dictionaries
    result = []
    for transaction in transactions:
        result.append({
            'id': transaction[0],
            'description': transaction[1],
            'amount': transaction[2],
            'category': transaction[3],
            'type': transaction[4],
            'date': transaction[5],
            'created_at': transaction[6]
        })
    
    return jsonify(result)

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO transactions (description, amount, category, type, date)
        VALUES (?, ?, ?, ?, ?)
    ''', (data['description'], data['amount'], data['category'], data['type'], data['date']))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Transaction added successfully'}), 201

@app.route('/api/transactions/<int:transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    data = request.json
    
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE transactions 
        SET description = ?, amount = ?, category = ?, type = ?, date = ?
        WHERE id = ?
    ''', (data['description'], data['amount'], data['category'], data['type'], data['date'], transaction_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Transaction updated successfully'})

@app.route('/api/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM transactions WHERE id = ?', (transaction_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Transaction deleted successfully'})

@app.route('/api/budgets', methods=['GET'])
def get_budgets():
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM budgets ORDER BY created_at DESC')
    budgets = cursor.fetchall()
    
    conn.close()
    
    result = []
    for budget in budgets:
        result.append({
            'id': budget[0],
            'category': budget[1],
            'amount': budget[2],
            'period': budget[3],
            'start_date': budget[4],
            'created_at': budget[5]
        })
    
    return jsonify(result)

@app.route('/api/budgets', methods=['POST'])
def add_budget():
    data = request.json
    
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO budgets (category, amount, period, start_date)
        VALUES (?, ?, ?, ?)
    ''', (data['category'], data['amount'], data['period'], data['start_date']))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Budget added successfully'}), 201

@app.route('/api/budgets/<int:budget_id>', methods=['PUT'])
def update_budget(budget_id):
    data = request.json
    
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE budgets 
        SET category = ?, amount = ?, period = ?, start_date = ?
        WHERE id = ?
    ''', (data['category'], data['amount'], data['period'], data['start_date'], budget_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Budget updated successfully'})

@app.route('/api/budgets/<int:budget_id>', methods=['DELETE'])
def delete_budget(budget_id):
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM budgets WHERE id = ?', (budget_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Budget deleted successfully'})

@app.route('/api/savings-goals', methods=['GET'])
def get_savings_goals():
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM savings_goals ORDER BY created_at DESC')
    goals = cursor.fetchall()
    
    conn.close()
    
    result = []
    for goal in goals:
        result.append({
            'id': goal[0],
            'name': goal[1],
            'target_amount': goal[2],
            'current_amount': goal[3],
            'target_date': goal[4],
            'created_at': goal[5]
        })
    
    return jsonify(result)

@app.route('/api/savings-goals', methods=['POST'])
def add_savings_goal():
    data = request.json
    
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO savings_goals (name, target_amount, current_amount, target_date)
        VALUES (?, ?, ?, ?)
    ''', (data['name'], data['target_amount'], data.get('current_amount', 0), data.get('target_date')))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Savings goal added successfully'}), 201

@app.route('/api/savings-goals/<int:goal_id>', methods=['PUT'])
def update_savings_goal(goal_id):
    data = request.json
    
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE savings_goals 
        SET name = ?, target_amount = ?, current_amount = ?, target_date = ?
        WHERE id = ?
    ''', (data['name'], data['target_amount'], data['current_amount'], data.get('target_date'), goal_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Savings goal updated successfully'})

@app.route('/api/savings-goals/<int:goal_id>', methods=['DELETE'])
def delete_savings_goal(goal_id):
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM savings_goals WHERE id = ?', (goal_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Savings goal deleted successfully'})

@app.route('/api/analytics/overview', methods=['GET'])
def get_overview():
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    # Get current month's data
    current_month = datetime.now().strftime('%Y-%m')
    
    # Total income and expenses for current month
    cursor.execute('''
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expenses
        FROM transactions 
        WHERE date LIKE ?
    ''', (f'{current_month}%',))
    
    overview = cursor.fetchone()
    total_income = overview[0] or 0
    total_expenses = overview[1] or 0
    net_income = total_income - total_expenses
    
    # Category breakdown for current month
    cursor.execute('''
        SELECT category, SUM(amount) as total
        FROM transactions 
        WHERE type = 'expense' AND date LIKE ?
        GROUP BY category
        ORDER BY total DESC
    ''', (f'{current_month}%',))
    
    category_breakdown = cursor.fetchall()
    
    # Recent transactions
    cursor.execute('''
        SELECT * FROM transactions 
        ORDER BY date DESC 
        LIMIT 5
    ''')
    
    recent_transactions = cursor.fetchall()
    
    conn.close()
    
    return jsonify({
        'overview': {
            'total_income': total_income,
            'total_expenses': total_expenses,
            'net_income': net_income,
            'current_month': current_month
        },
        'category_breakdown': [
            {'category': cat[0], 'amount': cat[1]} for cat in category_breakdown
        ],
        'recent_transactions': [
            {
                'id': t[0],
                'description': t[1],
                'amount': t[2],
                'category': t[3],
                'type': t[4],
                'date': t[5]
            } for t in recent_transactions
        ]
    })

@app.route('/api/analytics/budget-status', methods=['GET'])
def get_budget_status():
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    # Get current month's data
    current_month = datetime.now().strftime('%Y-%m')
    
    # Get all budgets
    cursor.execute('SELECT * FROM budgets')
    budgets = cursor.fetchall()
    
    budget_status = []
    
    for budget in budgets:
        category = budget[1]
        budget_amount = budget[2]
        
        # Get spent amount for this category in current month
        cursor.execute('''
            SELECT SUM(amount) 
            FROM transactions 
            WHERE category = ? AND type = 'expense' AND date LIKE ?
        ''', (category, f'{current_month}%'))
        
        spent_amount = cursor.fetchone()[0] or 0
        remaining_amount = budget_amount - spent_amount
        percentage_used = (spent_amount / budget_amount * 100) if budget_amount > 0 else 0
        
        # Determine status
        if percentage_used >= 100:
            status = 'over'
        elif percentage_used >= 80:
            status = 'warning'
        else:
            status = 'under'
        
        budget_status.append({
            'category': category,
            'budget_amount': budget_amount,
            'spent_amount': spent_amount,
            'remaining_amount': remaining_amount,
            'percentage_used': percentage_used,
            'status': status
        })
    
    conn.close()
    
    return jsonify(budget_status)

@app.route('/api/analytics/trends', methods=['GET'])
def get_trends():
    conn = sqlite3.connect('finance_tracker.db')
    cursor = conn.cursor()
    
    # Get last 6 months of data
    months = []
    for i in range(6):
        date = datetime.now() - timedelta(days=30*i)
        months.append(date.strftime('%Y-%m'))
    
    trends_data = []
    
    for month in months:
        cursor.execute('''
            SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
            FROM transactions 
            WHERE date LIKE ?
        ''', (f'{month}%',))
        
        result = cursor.fetchone()
        income = result[0] or 0
        expenses = result[1] or 0
        
        trends_data.append({
            'month': month,
            'income': income,
            'expenses': expenses,
            'net': income - expenses
        })
    
    conn.close()
    
    return jsonify(trends_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000) 