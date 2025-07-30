# Personal Finance Tracker

A comprehensive personal finance management application built with React (frontend) and Flask (backend).

## Features

- **Dashboard**: Overview of income, expenses, and net savings
- **Transactions**: Track income and expenses with categories
- **Budgets**: Set spending limits and track budget status
- **Savings Goals**: Create and monitor progress towards financial goals
- **Analytics**: Detailed insights and trends analysis
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Flask**: Python web framework
- **SQLite**: Lightweight database
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Axios**: HTTP client for API calls

## Project Structure

```
personal-finance-tracker/
├── backend/
│   ├── app.py              # Flask application
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.tsx         # Main app component
│   │   ├── index.tsx       # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Node.js dependencies
│   ├── tailwind.config.js  # Tailwind configuration
│   └── postcss.config.js   # PostCSS configuration
└── README.md              # This file
```

## How to Run the App (Manual Instructions)

### Prerequisites
- Python 3.7+
- Node.js 14+
- npm or yarn

### 1. Start the Backend (Flask)

1. Open a terminal (Command Prompt or PowerShell).
2. Navigate to the backend folder:
   ```
   cd C:\Users\YOUR_USERNAME\Downloads\personal-finance-tracker\backend
   ```
3. (Optional but recommended) Create and activate a virtual environment:
   ```
   python -m venv venv
   venv\Scripts\activate
   ```
4. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```
5. Start the backend server:
   ```
   python app.py
   ```
   The backend will run at: `http://localhost:5000`

### 2. Start the Frontend (React)

1. Open a new terminal window.
2. Navigate to the frontend folder:
   ```
   cd C:\Users\YOUR_USERNAME\Downloads\personal-finance-tracker\frontend
   ```
3. Install Node.js dependencies (only needed the first time):
   ```
   npm install
   ```
4. Start the frontend server:
   ```
   npm start
   ```
   The frontend will run at: `http://localhost:3000`

### 3. Using the App

- Open your browser and go to `http://localhost:3000`
- You can now add transactions, set budgets, create savings goals, and view analytics.

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add new transaction
- `PUT /api/transactions/<id>` - Update transaction
- `DELETE /api/transactions/<id>` - Delete transaction

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Add new budget
- `PUT /api/budgets/<id>` - Update budget
- `DELETE /api/budgets/<id>` - Delete budget

### Savings Goals
- `GET /api/savings-goals` - Get all savings goals
- `POST /api/savings-goals` - Add new savings goal
- `PUT /api/savings-goals/<id>` - Update savings goal
- `DELETE /api/savings-goals/<id>` - Delete savings goal

### Analytics
- `GET /api/analytics/overview` - Get dashboard overview
- `GET /api/analytics/budget-status` - Get budget status
- `GET /api/analytics/trends` - Get monthly trends

## Usage

1. Start both the backend and frontend servers
2. Open your browser and navigate to `http://localhost:3000`
3. Begin by adding some transactions to see the dashboard populate
4. Set up budgets to track spending limits
5. Create savings goals to monitor progress
6. Use the analytics page to gain insights into your financial patterns

## Features in Detail

### Dashboard
- Overview cards showing total income, expenses, and net savings
- Category breakdown of expenses
- Recent transactions list
- Quick action buttons

### Transactions
- Add, edit, and delete transactions
- Filter by type (income/expense) and category
- Search functionality
- Summary statistics

### Budgets
- Set monthly budgets for different categories
- Visual progress bars showing budget usage
- Status indicators (under budget, warning, over budget)
- Budget management tools

### Savings Goals
- Create goals with target amounts and dates
- Track progress with visual indicators
- Calculate remaining amounts and days left
- Summary of all goals

### Analytics
- Monthly trends analysis
- Spending patterns insights
- Financial health indicators
- Personalized recommendations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License. 