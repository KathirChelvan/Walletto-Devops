import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <aside className="w-64 bg-white shadow-md border-r border-gray-200 min-h-screen flex flex-col justify-between">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg w-8 h-8 flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Walletto</h1>
        </div>
        <nav className="space-y-2">
          <button onClick={() => navigate('/dashboard')} className="flex items-center p-2 w-full text-gray-700 hover:bg-gray-100 rounded-lg">
            <span className="mr-3">🏠</span> Dashboard
          </button>
          <button onClick={() => navigate('/transactions')} className="flex items-center p-2 w-full text-gray-700 hover:bg-gray-100 rounded-lg">
            <span className="mr-3">💳</span> Transactions
          </button>
          <button onClick={() => navigate('/teaching')} className="flex items-center p-2 w-full text-gray-700 hover:bg-gray-100 rounded-lg">
            <span className="mr-3">📚</span> Teaching
          </button>
        </nav>
      </div>
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
