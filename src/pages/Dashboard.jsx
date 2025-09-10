import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Transactions from './Transactions';
import Analytics from './Analytics';
import Profile from './profile';
import Teaching from './Teaching'; // Added Teaching import
import '../style.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.warn("User data not found in Firestore for UID:", currentUser.uid);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        window.location.href = '/login';
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading your financial data...</p>
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  const totalIncome = userData.monthlySalary + userData.passiveIncome;
  const totalExpenses = userData.recurringExpenses + userData.variableExpenses + userData.oneTimeExpenses;
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-main">
            {/* Financial Overview Cards */}
            <div className="overview-cards">
              <div className="overview-card income">
                <div className="card-icon">💰</div>
                <div className="card-content">
                  <h3>Total Income</h3>
                  <p className="amount">${totalIncome.toLocaleString()}</p>
                  <span className="change positive">+12.5% this month</span>
                </div>
              </div>
              
              <div className="overview-card expenses">
                <div className="card-icon">💸</div>
                <div className="card-content">
                  <h3>Total Expenses</h3>
                  <p className="amount">${totalExpenses.toLocaleString()}</p>
                  <span className="change negative">+5.2% this month</span>
                </div>
              </div>
              
              <div className="overview-card savings">
                <div className="card-icon">🎯</div>
                <div className="card-content">
                  <h3>Net Savings</h3>
                  <p className="amount">${netIncome.toLocaleString()}</p>
                  <span className="change positive">Savings Rate: {savingsRate}%</span>
                </div>
              </div>
              
              <div className="overview-card portfolio">
                <div className="card-icon">📈</div>
                <div className="card-content">
                  <h3>Portfolio</h3>
                  <p className="amount">{userData.investmentTypes}</p>
                  <span className="change positive">+8.3% this quarter</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="main-grid">
              {/* Income vs Expenses Chart */}
              <div className="chart-card">
                <div className="card-header">
                  <h3>Income vs Expenses</h3>
                  <div className="chart-legend">
                    <span className="legend-item income">Income</span>
                    <span className="legend-item expenses">Expenses</span>
                  </div>
                </div>
                <div className="chart-container">
                  <div className="bar-chart">
                    <div className="bar income-bar" style={{height: `${(totalIncome / Math.max(totalIncome, totalExpenses)) * 100}%`}}>
                      <span className="bar-label">${totalIncome.toLocaleString()}</span>
                    </div>
                    <div className="bar expenses-bar" style={{height: `${(totalExpenses / Math.max(totalIncome, totalExpenses)) * 100}%`}}>
                      <span className="bar-label">${totalExpenses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="budget-card">
                <div className="card-header">
                  <h3>Budget Breakdown</h3>
                </div>
                <div className="budget-items">
                  <div className="budget-item">
                    <div className="budget-info">
                      <span className="budget-category">Recurring Expenses</span>
                      <span className="budget-amount">${userData.recurringExpenses.toLocaleString()}</span>
                    </div>
                    <div className="budget-bar">
                      <div className="budget-fill recurring" style={{width: `${(userData.recurringExpenses / totalExpenses) * 100}%`}}></div>
                    </div>
                  </div>
                  
                  <div className="budget-item">
                    <div className="budget-info">
                      <span className="budget-category">Variable Expenses</span>
                      <span className="budget-amount">${userData.variableExpenses.toLocaleString()}</span>
                    </div>
                    <div className="budget-bar">
                      <div className="budget-fill variable" style={{width: `${(userData.variableExpenses / totalExpenses) * 100}%`}}></div>
                    </div>
                  </div>
                  
                  <div className="budget-item">
                    <div className="budget-info">
                      <span className="budget-category">One-time Expenses</span>
                      <span className="budget-amount">${userData.oneTimeExpenses.toLocaleString()}</span>
                    </div>
                    <div className="budget-bar">
                      <div className="budget-fill onetime" style={{width: `${(userData.oneTimeExpenses / totalExpenses) * 100}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goals Progress */}
              <div className="goals-card">
                <div className="card-header">
                  <h3>Financial Goals</h3>
                </div>
                <div className="goals-list">
                  <div className="goal-item">
                    <div className="goal-info">
                      <span className="goal-name">Emergency Fund</span>
                      <span className="goal-progress">85%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  
                  <div className="goal-item">
                    <div className="goal-info">
                      <span className="goal-name">Vacation Fund</span>
                      <span className="goal-progress">45%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '45%'}}></div>
                    </div>
                  </div>
                  
                  <div className="goal-item">
                    <div className="goal-info">
                      <span className="goal-name">New House</span>
                      <span className="goal-progress">12%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '12%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assets & Liabilities */}
              <div className="assets-card">
                <div className="card-header">
                  <h3>Assets & Liabilities</h3>
                </div>
                <div className="assets-grid">
                  <div className="asset-item">
                    <span className="asset-label">Property</span>
                    <span className="asset-value">{userData.propertyOwnership}</span>
                  </div>
                  <div className="asset-item">
                    <span className="asset-label">Vehicle</span>
                    <span className="asset-value">{userData.carOwnership}</span>
                  </div>
                  <div className="asset-item liability">
                    <span className="asset-label">Credit Card Dues</span>
                    <span className="asset-value">${userData.creditCardDues.toLocaleString()}</span>
                  </div>
                  <div className="asset-item">
                    <span className="asset-label">Loans</span>
                    <span className="asset-value">{userData.loans}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return <Transactions user={user} userData={userData} />;
      case 'analytics':
        return <Analytics user={user} userData={userData} />;
      case 'profile':
        return <Profile user={user} userData={userData} />;
      case 'teaching': // Modified Teaching tab content - render without SidebarLayout
        return (
          <div className="teaching-content">
            <Teaching user={user} userData={userData} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">💰</div>
            <h1>Walletto</h1>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">🏠</span>
            Dashboard
          </button>
          
          <button
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <span className="nav-icon">💳</span>
            Transactions
          </button>
          
          <button
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className="nav-icon">📊</span>
            Analytics
          </button>
          
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="nav-icon">👤</span>
            Profile
          </button>
          
          <button
            className={`nav-item ${activeTab === 'teaching' ? 'active' : ''}`} // Added Teaching button
            onClick={() => setActiveTab('teaching')}
          >
            <span className="nav-icon">🎓</span>
            Teaching
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{userData.name?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <span className="user-name">{userData.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-content">
            <h2>Welcome back, {userData.name}! 👋</h2>
            <p className="header-subtitle">Here's your financial overview for today</p>
          </div>
        </header>
        
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;