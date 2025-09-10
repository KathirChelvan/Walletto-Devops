import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Target,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const Analytics = ({ user, userData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [hideAmounts, setHideAmounts] = useState(false);

  // Calculate values from userData
  const totalIncome = userData.monthlySalary + userData.passiveIncome;
  const totalExpenses = userData.recurringExpenses + userData.variableExpenses + userData.oneTimeExpenses;
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0;

  // Sample data for charts (in real app, this would come from your database)
  const monthlyData = [
    { month: 'Jan', income: totalIncome * 0.95, expenses: totalExpenses * 1.1, savings: netIncome * 0.8 },
    { month: 'Feb', income: totalIncome * 1.02, expenses: totalExpenses * 0.95, savings: netIncome * 1.2 },
    { month: 'Mar', income: totalIncome * 0.88, expenses: totalExpenses * 1.05, savings: netIncome * 0.7 },
    { month: 'Apr', income: totalIncome * 1.1, expenses: totalExpenses * 0.9, savings: netIncome * 1.4 },
    { month: 'May', income: totalIncome * 1.03, expenses: totalExpenses * 1.02, savings: netIncome * 1.1 },
    { month: 'Jun', income: totalIncome, expenses: totalExpenses, savings: netIncome }
  ];

  const expenseCategories = [
    { name: 'Recurring', value: userData.recurringExpenses, color: '#ef4444' },
    { name: 'Variable', value: userData.variableExpenses, color: '#f59e0b' },
    { name: 'One-time', value: userData.oneTimeExpenses, color: '#8b5cf6' },
    { name: 'Credit Card', value: userData.creditCardDues * 0.1, color: '#06b6d4' },
  ];

  const savingsProjection = [
    { month: 'Jul', projected: netIncome * 7, actual: netIncome * 6.5 },
    { month: 'Aug', projected: netIncome * 8, actual: null },
    { month: 'Sep', projected: netIncome * 9, actual: null },
    { month: 'Oct', projected: netIncome * 10, actual: null },
    { month: 'Nov', projected: netIncome * 11, actual: null },
    { month: 'Dec', projected: netIncome * 12, actual: null }
  ];

  const formatCurrency = (amount) => {
    if (hideAmounts) return '***';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="dashboard-main">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Financial Analytics 📊
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Detailed insights into your financial performance
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setHideAmounts(!hideAmounts)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              border: '2px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--white)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {hideAmounts ? <EyeOff size={16} /> : <Eye size={16} />}
            {hideAmounts ? 'Show' : 'Hide'} Amounts
          </button>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{
              padding: '0.75rem 1rem',
              border: '2px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--white)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        <nav style={{ display: 'flex', gap: '2rem' }}>
          {[
            { id: 'overview', name: 'Overview', icon: '📈' },
            { id: 'expenses', name: 'Expense Analysis', icon: '🥧' },
            { id: 'projections', name: 'Projections', icon: '🎯' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1rem',
                marginBottom: '0',
                border: 'none',
                background: 'none',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: activeTab === tab.id ? 'var(--white)' : 'var(--text-secondary)',
                background: activeTab === tab.id ? 'linear-gradient(135deg, var(--primary), #8b5cf6)' : 'none'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Key Metrics */}
          <div className="overview-cards">
            <div className="overview-card income">
              <div className="card-icon">📈</div>
              <div className="card-content">
                <h3>Total Income</h3>
                <p className="amount">{formatCurrency(totalIncome)}</p>
                <span className="change positive">+8.2% this month</span>
              </div>
            </div>
            
            <div className="overview-card expenses">
              <div className="card-icon">💸</div>
              <div className="card-content">
                <h3>Total Expenses</h3>  
                <p className="amount">{formatCurrency(totalExpenses)}</p>
                <span className="change positive">-3.1% this month</span>
              </div>
            </div>
            
            <div className="overview-card savings">
              <div className="card-icon">🎯</div>
              <div className="card-content">
                <h3>Net Savings</h3>
                <p className="amount">{formatCurrency(netIncome)}</p>
                <span className="change positive">+15.7% this month</span>
              </div>
            </div>
            
            <div className="overview-card portfolio">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <h3>Savings Rate</h3>
                <p className="amount">{savingsRate}%</p>
                <span className="change positive">+4.2% this month</span>
              </div>
            </div>
          </div>

          {/* Income vs Expenses Chart */}
          <div className="chart-card" style={{ marginTop: '2rem' }}>
            <div className="card-header">
              <h3>Income vs Expenses Trend</h3>
              <div className="chart-legend">
                <span className="legend-item income">Income</span>
                <span className="legend-item expenses">Expenses</span>
              </div>
            </div>
            <div style={{ height: '320px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), '']}
                    contentStyle={{ 
                      backgroundColor: 'var(--white)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="var(--success)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--success)', strokeWidth: 2, r: 4 }}
                    name="Income"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="var(--error)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--error)', strokeWidth: 2, r: 4 }}
                    name="Expenses"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="var(--primary)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
                    name="Savings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Expense Analysis Tab */}
      {activeTab === 'expenses' && (
        <div className="main-grid">
          {/* Pie Chart */}
          <div className="chart-card">
            <div className="card-header">
              <h3>Expense Breakdown</h3>
            </div>
            <div style={{ height: '320px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), '']}
                    contentStyle={{ 
                      backgroundColor: 'var(--white)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px' 
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Details */}
          <div className="budget-card">
            <div className="card-header">
              <h3>Category Details</h3>
            </div>
            <div className="budget-items">
              {expenseCategories.map((category, index) => (
                <div key={index} className="budget-item">
                  <div className="budget-info">
                    <span className="budget-category">{category.name}</span>
                    <span className="budget-amount">{formatCurrency(category.value)}</span>
                  </div>
                  <div className="budget-bar">
                    <div 
                      className="budget-fill recurring"
                      style={{
                        width: `${(category.value / expenseCategories.reduce((sum, cat) => sum + cat.value, 0)) * 100}%`,
                        background: category.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Expense Trend */}
          <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header">
              <h3>Monthly Expense Trend</h3>
            </div>
            <div style={{ height: '320px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), '']}
                    contentStyle={{ 
                      backgroundColor: 'var(--white)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Bar dataKey="expenses" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Projections Tab */}
      {activeTab === 'projections' && (
        <div>
          {/* Savings Projection */}
          <div className="chart-card" style={{ marginBottom: '2rem' }}>
            <div className="card-header">
              <h3>Savings Projection</h3>
              <div className="chart-legend">
                <span className="legend-item income">Projected</span>
                <span className="legend-item expenses">Actual</span>
              </div>
            </div>
            <div style={{ height: '320px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={savingsProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), '']}
                    contentStyle={{ 
                      backgroundColor: 'var(--white)', 
                      border: '1px solid var(--border)', 
                      borderRadius: '8px' 
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projected" 
                    stroke="var(--primary)" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }}
                    name="Projected"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="var(--success)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--success)', strokeWidth: 2, r: 4 }}
                    connectNulls={false}
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Financial Goals and Insights */}
          <div className="main-grid">
            <div className="goals-card">
              <div className="card-header">
                <h3>Financial Goals</h3>
              </div>
              <div className="goals-list">
                <div className="goal-item">
                  <div className="goal-info">
                    <span className="goal-name">Emergency Fund</span>
                    <span className="goal-progress">75%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="goal-item">
                  <div className="goal-info">
                    <span className="goal-name">{userData.financialGoal}</span>
                    <span className="goal-progress">45%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="assets-card">
              <div className="card-header">
                <h3>Key Insights</h3>
              </div>
              <div className="assets-grid" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div className="asset-item">
                  <span className="asset-label">📊 Savings Rate</span>
                  <span className="asset-value">{savingsRate}% {parseFloat(savingsRate) > 20 ? '✅' : '⚠️'}</span>
                </div>
                <div className="asset-item">
                  <span className="asset-label">🛡️ Emergency Fund</span>
                  <span className="asset-value">{userData.emergencyFundStatus}</span>
                </div>
                <div className="asset-item">
                  <span className="asset-label">💼 Investments</span>
                  <span className="asset-value">{userData.investmentTypes}</span>
                </div>
                {userData.creditCardDues > 0 && (
                  <div className="asset-item liability">
                    <span className="asset-label">💳 Credit Card Debt</span>
                    <span className="asset-value">${userData.creditCardDues.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;