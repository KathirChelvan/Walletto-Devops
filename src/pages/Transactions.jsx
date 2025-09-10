import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    category: '',
    method: '',
    description: ''
  });
  const [editTransactionId, setEditTransactionId] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: 'This Month',
    minAmount: '',
    maxAmount: '',
    category: '',
    paymentMethod: '',
    search: ''
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      window.location.href = '/login';
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'users', user.uid, 'transactions'), (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(transactionsData);
      applyFilters(transactionsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const applyFilters = (data) => {
    let filtered = [...data];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filters.dateRange === 'Today') {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        transactionDate.setHours(0, 0, 0, 0);
        return transactionDate.toDateString() === today.toDateString();
      });
    } else if (filters.dateRange === 'This Month') {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === today.getMonth() && transactionDate.getFullYear() === today.getFullYear();
      });
    }
    if (filters.minAmount) filtered = filtered.filter(t => t.amount >= parseFloat(filters.minAmount));
    if (filters.maxAmount) filtered = filtered.filter(t => t.amount <= parseFloat(filters.maxAmount));
    if (filters.category) filtered = filtered.filter(t => t.category === filters.category);
    if (filters.paymentMethod) filtered = filtered.filter(t => t.method === filters.paymentMethod);
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchLower) || t.category.toLowerCase().includes(searchLower)
      );
    }
    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      applyFilters(transactions);
      return newFilters;
    });
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev, search: value };
      applyFilters(transactions);
      return newFilters;
    });
  };

  const handleAddOrUpdateTransaction = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const transactionData = { 
        ...formData, 
        amount: parseFloat(formData.amount) || 0, 
        date: formData.date || new Date().toISOString().split('T')[0] 
      };
      if (editTransactionId) {
        await updateDoc(doc(db, 'users', user.uid, 'transactions', editTransactionId), transactionData);
        setTransactions(transactions.map(t => t.id === editTransactionId ? { ...t, ...transactionData } : t));
      } else {
        const docRef = await addDoc(collection(db, 'users', user.uid, 'transactions'), transactionData);
        setTransactions([...transactions, { id: docRef.id, ...transactionData }]);
      }
      setShowModal(false);
      setFormData({ amount: '', date: '', category: '', method: '', description: '' });
      setEditTransactionId(null);
      applyFilters(transactions); // Reapply filters after update
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditTransactionId(transaction.id);
    setFormData({ ...transaction });
    setShowModal(true);
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const user = auth.currentUser;
      await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
      setTransactions(transactions.filter(t => t.id !== id));
      applyFilters(transactions.filter(t => t.id !== id)); // Reapply filters after deletion
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date,Amount,Category,Method,Description\n'];
    const rows = filteredTransactions.map(t => 
      `${new Date(t.date).toLocaleDateString()},${t.amount},${t.category},${t.method},${t.description}\n`
    ).join('');
    const csv = headers + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netBalance = totalIncome - totalExpenses;
  const avgSpend = totalExpenses / (new Date().getDate() || 1); // Avoid division by zero

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
          <div className="flex space-x-4">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search by description or category..."
              className="p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Export to CSV
            </button>
            <button
              onClick={() => { setEditTransactionId(null); setShowModal(true); setFormData({ amount: '', date: '', category: '', method: '', description: '' }); }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Add Transaction
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              <div className="space-y-4">
                <select
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Today">Today</option>
                  <option value="This Month">This Month</option>
                  <option value="Custom">Custom</option>
                </select>
                <input
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  placeholder="Min Amount"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  placeholder="Max Amount"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Categories</option>
                  <option value="Food & Groceries">Food & Groceries 🍕</option>
                  <option value="Entertainment">Entertainment 🎬</option>
                  <option value="Rent">Rent 🏠</option>
                  <option value="Transport">Transport 🚗</option>
                </select>
                <select
                  name="paymentMethod"
                  value={filters.paymentMethod}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Methods</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit">Debit</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transaction List and Summary */}
          <div className="lg:col-span-3 space-y-6">
            {/* Summary Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">Total Income</p>
                  <p className="text-xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">Total Expenses</p>
                  <p className="text-xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">Net Balance</p>
                  <p className={`text-xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{netBalance.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">Avg Spend/Day</p>
                  <p className="text-xl font-bold text-gray-900">₹{avgSpend.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Transaction List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No transactions found.
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupByDate(filteredTransactions)).map(([date, txns]) => (
                    <div key={date}>
                      <h4 className="text-md font-medium text-gray-700 mb-2">{new Date(date).toLocaleDateString()}</h4>
                      {txns.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-md mb-2 hover:bg-gray-100 transition-colors"
                          title={t.description}
                        >
                          <div className="flex items-center space-x-3">
                            <span className={`w-3 h-3 rounded-full ${t.amount > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <div>
                              <p className="text-sm font-medium">
                                {getCategoryIcon(t.category)} {t.category}
                              </p>
                              <p className="text-xs text-gray-500">{t.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ₹{Math.abs(t.amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">{t.method}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditTransaction(t)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(t.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{editTransactionId ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <form onSubmit={handleAddOrUpdateTransaction} className="space-y-4">
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Amount"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Food & Groceries">Food & Groceries 🍕</option>
                  <option value="Entertainment">Entertainment 🎬</option>
                  <option value="Rent">Rent 🏠</option>
                  <option value="Transport">Transport 🚗</option>
                </select>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Method</option>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit">Debit</option>
                </select>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setEditTransactionId(null); setFormData({ amount: '', date: '', category: '', method: '', description: '' }); }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    {editTransactionId ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Helper function to group transactions by date
const groupByDate = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(transaction);
    return acc;
  }, {});
};

// Helper function to get category icon
const getCategoryIcon = (category) => {
  const icons = {
    'Food & Groceries': '🍕',
    'Entertainment': '🎬',
    'Rent': '🏠',
    'Transport': '🚗'
  };
  return icons[category] || '';
};

export default Transactions;