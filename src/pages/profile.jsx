import React, { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Profile = ({ user, userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (userData) {
      setEditedData(userData);
    }
  }, [userData]);

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...editedData,
        updatedAt: new Date()
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const ProfileSection = ({ title, children, icon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="bg-indigo-100 rounded-lg p-2 mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const ProfileField = ({ label, value, field, type = 'text', isEditable = true, prefix = '', suffix = '' }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {isEditing && isEditable ? (
        <div className="relative">
          {prefix && <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{prefix}</span>}
          <input
            type={type}
            value={editedData[field] || ''}
            onChange={(e) => handleInputChange(field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}`}
          />
          {suffix && <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">{suffix}</span>}
        </div>
      ) : (
        <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
          {prefix}{type === 'number' && typeof value === 'number' ? formatCurrency(value) : value || 'Not specified'}{suffix}
        </div>
      )}
    </div>
  );

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="text-indigo-100">{userData.email}</p>
              <p className="text-indigo-200 text-sm">
                Member since {userData.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-white text-indigo-600 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white text-indigo-600 hover:bg-gray-100 rounded-lg font-medium transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d={message.type === 'success' ? "M5 13l4 4L19 7" : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
          </svg>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <ProfileSection 
          title="Personal Information"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileField label="Full Name" value={userData.name} field="name" />
            <ProfileField label="Age" value={userData.age} field="age" type="number" />
          </div>
          <ProfileField label="Country" value={userData.country} field="country" />
          <ProfileField label="Email Address" value={userData.email} field="email" type="email" isEditable={false} />
        </ProfileSection>

        {/* Financial Goals */}
        <ProfileSection 
          title="Financial Goals"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        >
          <ProfileField label="Primary Financial Goal" value={userData.financialGoal} field="financialGoal" />
          <ProfileField label="Emergency Fund Status" value={userData.emergencyFundStatus} field="emergencyFundStatus" />
        </ProfileSection>

        {/* Income Sources */}
        <ProfileSection 
          title="Income Sources"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
        >
          <ProfileField label="Monthly Salary" value={userData.monthlySalary} field="monthlySalary" type="number" />
          <ProfileField label="Passive Income" value={userData.passiveIncome} field="passiveIncome" type="number" />
        </ProfileSection>

        {/* Expenses */}
        <ProfileSection 
          title="Monthly Expenses"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        >
          <ProfileField label="Recurring Expenses" value={userData.recurringExpenses} field="recurringExpenses" type="number" />
          <ProfileField label="Variable Expenses" value={userData.variableExpenses} field="variableExpenses" type="number" />
          <ProfileField label="One-time Expenses" value={userData.oneTimeExpenses} field="oneTimeExpenses" type="number" />
        </ProfileSection>

        {/* Assets & Savings */}
        <ProfileSection 
          title="Assets & Savings"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          }
        >
          <ProfileField label="Current Bank Balance" value={userData.bankBalance} field="bankBalance" type="number" />
          <ProfileField label="Current Savings" value={userData.currentSavings} field="currentSavings" type="number" />
          <ProfileField label="Bank Accounts" value={userData.bankAccounts} field="bankAccounts" />
        </ProfileSection>

        {/* Investments */}
        <ProfileSection 
          title="Investments"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        >
          <ProfileField label="Investment Types" value={userData.investmentTypes} field="investmentTypes" />
        </ProfileSection>

        {/* Debts & Liabilities */}
        <ProfileSection 
          title="Debts & Liabilities"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        >
          <ProfileField label="Loans" value={userData.loans} field="loans" />
          <ProfileField label="Credit Card Dues" value={userData.creditCardDues} field="creditCardDues" type="number" />
          <ProfileField label="EMI Details" value={userData.emiDetails} field="emiDetails" />
        </ProfileSection>

        {/* Property & Assets */}
        <ProfileSection 
          title="Property & Major Assets"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
        >
          <ProfileField label="Property Ownership" value={userData.propertyOwnership} field="propertyOwnership" />
          <ProfileField label="Vehicle Ownership" value={userData.carOwnership} field="carOwnership" />
        </ProfileSection>
      </div>

      {/* Financial Summary */}
      <div className="mt-8">
        <ProfileSection 
          title="Financial Summary"
          icon={
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <h4 className="text-sm font-medium text-green-700 mb-2">Total Monthly Income</h4>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency((userData.monthlySalary || 0) + (userData.passiveIncome || 0))}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <h4 className="text-sm font-medium text-red-700 mb-2">Total Monthly Expenses</h4>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency((userData.recurringExpenses || 0) + (userData.variableExpenses || 0) + (userData.oneTimeExpenses || 0))}
              </p>
            </div>
            <div className={`rounded-lg p-4 text-center ${
              ((userData.monthlySalary || 0) + (userData.passiveIncome || 0)) - 
              ((userData.recurringExpenses || 0) + (userData.variableExpenses || 0) + (userData.oneTimeExpenses || 0)) >= 0
                ? 'bg-blue-50' : 'bg-orange-50'
            }`}>
              <h4 className={`text-sm font-medium mb-2 ${
                ((userData.monthlySalary || 0) + (userData.passiveIncome || 0)) - 
                ((userData.recurringExpenses || 0) + (userData.variableExpenses || 0) + (userData.oneTimeExpenses || 0)) >= 0
                  ? 'text-blue-700' : 'text-orange-700'
              }`}>Net Monthly Income</h4>
              <p className={`text-2xl font-bold ${
                ((userData.monthlySalary || 0) + (userData.passiveIncome || 0)) - 
                ((userData.recurringExpenses || 0) + (userData.variableExpenses || 0) + (userData.oneTimeExpenses || 0)) >= 0
                  ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {formatCurrency(
                  ((userData.monthlySalary || 0) + (userData.passiveIncome || 0)) - 
                  ((userData.recurringExpenses || 0) + (userData.variableExpenses || 0) + (userData.oneTimeExpenses || 0))
                )}
              </p>
            </div>
          </div>
        </ProfileSection>
      </div>
    </div>
  );
};

export default Profile;