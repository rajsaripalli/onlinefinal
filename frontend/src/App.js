import React, { useState, useEffect } from 'react';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdminLogin from './components/Auth/AdminLogin';
import UserDashboard from './components/UserDashboard/UserDashboard';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('login');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // If user is logged in, show appropriate dashboard
  if (user) {
    if (user.role === 'admin') {
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    } else {
      return <UserDashboard user={user} onLogout={handleLogout} />;
    }
  }

  // Show login/signup page
  return (
    <div className="App">
      <div className="app-container">
        <div className="app-header">
          <h1 className="app-title">youGO</h1>
          <p className="app-subtitle">Your Flight Booking Platform</p>
        </div>
        
        <div className="auth-tabs">
          <button
            className={activeTab === 'login' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={activeTab === 'signup' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={activeTab === 'admin' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveTab('admin')}
          >
            Admin
          </button>
        </div>

        <div className="auth-content">
          {activeTab === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
          {activeTab === 'signup' && <Signup onSignupSuccess={handleSignupSuccess} />}
          {activeTab === 'admin' && <AdminLogin onLoginSuccess={handleLoginSuccess} />}
        </div>
      </div>
    </div>
  );
}

export default App;
