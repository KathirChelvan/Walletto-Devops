import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    monthlySalary: '',
    passiveIncome: '',
    recurringExpenses: '',
    variableExpenses: '',
    oneTimeExpenses: '',
    bankBalance: '',
    country: '',
    financialGoal: '',
    currentSavings: '',
    emergencyFundStatus: '',
    investmentTypes: '',
    loans: '',
    creditCardDues: '',
    emiDetails: '',
    bankAccounts: '',
    propertyOwnership: '',
    carOwnership: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate signup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Signup successful! User data:", formData);
      navigate('/dashboard'); // Navigate to dashboard after successful signup
    } catch (error) {
      console.error("Error during signup:", error);
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Account Info", description: "Basic details" },
    { number: 2, title: "Financial Info", description: "Income & expenses" },
    { number: 3, title: "Investments", description: "Savings & goals" },
    { number: 4, title: "Assets", description: "Properties & debts" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-32 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl rotate-6 animate-pulse opacity-80"></div>
              <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl w-16 h-16 flex items-center justify-center shadow-2xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Join Walletto</h1>
            <p className="text-purple-200 text-lg">Let's set up your financial profile</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        currentStep >= step.number 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                          : 'bg-white/20 text-white/60'
                      }`}>
                        {currentStep > step.number ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        ) : (
                          step.number
                        )}
                      </div>
                      <div className="text-center mt-2">
                        <div className="text-white font-semibold text-sm">{step.title}</div>
                        <div className="text-white/60 text-xs">{step.description}</div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-4 rounded transition-all duration-300 ${
                        currentStep > step.number ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-white/20'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Information</h2>
                  <p className="text-gray-600">Let's start with the basics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      placeholder="min 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      placeholder="Your Age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      placeholder="Your Country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Financial Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Financial Information</h2>
                  <p className="text-gray-600">Tell us about your income and expenses</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Monthly Salary</label>
                    <input
                      type="number"
                      name="monthlySalary"
                      placeholder="e.g., 50000"
                      value={formData.monthlySalary}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Passive Income</label>
                    <input
                      type="number"
                      name="passiveIncome"
                      placeholder="e.g., 5000"
                      value={formData.passiveIncome}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Recurring Expenses</label>
                    <input
                      type="number"
                      name="recurringExpenses"
                      placeholder="rent, utilities, subscriptions"
                      value={formData.recurringExpenses}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Variable Expenses</label>
                    <input
                      type="number"
                      name="variableExpenses"
                      placeholder="food, entertainment, shopping"
                      value={formData.variableExpenses}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">One-time Expenses</label>
                    <input
                      type="number"
                      name="oneTimeExpenses"
                      placeholder="medical, travel, gadgets"
                      value={formData.oneTimeExpenses}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bank Balance</label>
                    <input
                      type="number"
                      name="bankBalance"
                      placeholder="Current Bank Balance"
                      value={formData.bankBalance}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Financial Goal</label>
                  <input
                    type="text"
                    name="financialGoal"
                    placeholder="e.g., Save for a house, Retirement planning"
                    value={formData.financialGoal}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Savings & Investments */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Savings & Investments</h2>
                  <p className="text-gray-600">Let's understand your investment profile</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Current Savings</label>
                    <input
                      type="number"
                      name="currentSavings"
                      placeholder="Current Savings Amount"
                      value={formData.currentSavings}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Emergency Fund Status</label>
                    <select
                      name="emergencyFundStatus"
                      value={formData.emergencyFundStatus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select Status</option>
                      <option value="fully-funded">Fully Funded (6+ months)</option>
                      <option value="partially-funded">Partially Funded (3-6 months)</option>
                      <option value="minimal">Minimal (1-3 months)</option>
                      <option value="not-started">Not Started</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Investment Types</label>
                  <input
                    type="text"
                    name="investmentTypes"
                    placeholder="e.g., Stocks, ETFs, Mutual Funds, Crypto, Real Estate"
                    value={formData.investmentTypes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Loans</label>
                    <input
                      type="text"
                      name="loans"
                      placeholder="e.g., Student: $10000, Car: $5000"
                      value={formData.loans}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Credit Card Dues</label>
                    <input
                      type="number"
                      name="creditCardDues"
                      placeholder="Total Credit Card Dues"
                      value={formData.creditCardDues}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">EMI Details</label>
                  <input
                    type="text"
                    name="emiDetails"
                    placeholder="e.g., Car EMI: $300/month, Home Loan: $1200/month"
                    value={formData.emiDetails}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Assets & Liabilities */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Assets & Liabilities</h2>
                  <p className="text-gray-600">Final step - tell us about your assets</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bank Accounts</label>
                    <input
                      type="text"
                      name="bankAccounts"
                      placeholder="e.g., Checking, Savings, Business"
                      value={formData.bankAccounts}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Property Ownership</label>
                    <select
                      name="propertyOwnership"
                      value={formData.propertyOwnership}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select Option</option>
                      <option value="own-house">Own House</option>
                      <option value="own-apartment">Own Apartment</option>
                      <option value="own-multiple">Own Multiple Properties</option>
                      <option value="renting">Renting</option>
                      <option value="living-with-family">Living with Family</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Car Ownership</label>
                  <input
                    type="text"
                    name="carOwnership"
                    placeholder="e.g., Toyota Camry 2020, No Car, Multiple Cars"
                    value={formData.carOwnership}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="px-6 py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-500">
                  Step {currentStep} of {steps.length}
                </span>
              </div>

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSignup}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center justify-center">
                    {loading && (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </div>
                </button>
              )}
            </div>

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors duration-200">
                  Login here
                </Link>
              </p>
            </div>
          </div>

          {/* Progress Indicator at Bottom */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <svg className="w-4 h-4 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-white text-sm">Secure & Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}