// src/pages/Teaching.jsx
import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Lottie from 'lottie-react';

// Lottie placeholders (replace with real files later)
import thinkingAnim from '../assets/lottie/man-thinking-about-payment-method.json';
import investAnim from '../assets/lottie/investing.json';
import growMoneyAnim from '../assets/lottie/compound-growth.json';
import saveMoneyAnim from '../assets/lottie/saving-money.json';
import goalAnim from '../assets/lottie/goal-target.json';

const Teaching = () => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [animation, setAnimation] = useState(thinkingAnim);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [showOptions, setShowOptions] = useState(true);
  const [conversationDepth, setConversationDepth] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [quizState, setQuizState] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Define topic options with enhanced styling
  const mainTopics = [
    {
      id: 'invest',
      title: '💹 Start Investing',
      description: 'Learn about SIPs, mutual funds, and compound growth',
      gradient: 'from-emerald-400 via-green-500 to-teal-600',
      icon: '📈'
    },
    {
      id: 'save',
      title: '💰 Smart Saving',
      description: 'Optimize your expenses and build an emergency fund',
      gradient: 'from-blue-400 via-cyan-500 to-blue-600',
      icon: '🏦'
    },
    {
      id: 'grow',
      title: '📈 Grow Wealth',
      description: 'Understand compound interest and wealth building',
      gradient: 'from-purple-400 via-pink-500 to-red-500',
      icon: '💎'
    },
    {
      id: 'goals',
      title: '🎯 Plan Goals',
      description: 'Create actionable plans for your financial goals',
      gradient: 'from-orange-400 via-red-500 to-pink-600',
      icon: '🚀'
    },
    {
      id: 'budget',
      title: '📊 Smart Budgeting',
      description: 'Learn the 50-30-20 rule and budget optimization',
      gradient: 'from-indigo-400 via-purple-500 to-pink-500',
      icon: '💳'
    },
    {
      id: 'quiz',
      title: '🧠 Test Knowledge',
      description: 'Take an interactive financial literacy quiz',
      gradient: 'from-pink-400 via-rose-500 to-red-500',
      icon: '🎓'
    },
    {
      id: 'ai_recommendations',
      title: '🤖 AI Recommendations',
      description: 'Get personalized advice based on your financial profile',
      gradient: 'from-violet-500 via-purple-600 to-indigo-700',
      icon: '🎯'
    }
  ];

  // AI Recommendation Engine
  const generatePersonalizedRecommendations = (userData) => {
    const recommendations = [];
    const savings = userData.savings || 0;
    const income = userData.income || 0;
    const foodExp = userData.expense_food || 0;
    const travelExp = userData.expense_travel || 0;
    const entExp = userData.expense_entertainment || 0;
    const totalExpenses = foodExp + travelExp + entExp;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const emergencyFund = income * 6;
    
    // Priority recommendations based on financial health
    if (savingsRate < 10) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Savings',
        title: '🚨 Critical: Boost Your Savings Rate',
        problem: `Your current savings rate is ${savingsRate.toFixed(1)}%, which is below the recommended 20%.`,
        solution: `Start by saving ₹${Math.max(Math.round(income * 0.1), 1000)} monthly (10% of income). This alone could give you ₹${Math.round(Math.max(Math.round(income * 0.1), 1000) * 12).toLocaleString()} annually.`,
        actionSteps: [
          'Set up automatic transfer to savings account',
          'Use the envelope budgeting method',
          'Track expenses for one month to identify leaks'
        ],
        impact: 'HIGH',
        timeline: '1-2 months'
      });
    }
    
    if (totalExpenses > savings * 2 && totalExpenses > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Expense Optimization',
        title: '💸 Optimize Discretionary Spending',
        problem: `You spend ₹${totalExpenses} on food, travel & entertainment - that's ${((totalExpenses/income)*100).toFixed(1)}% of your income.`,
        solution: `Reducing this by just 25% could free up ₹${Math.round(totalExpenses * 0.25)} monthly for investments.`,
        actionSteps: [
          'Cook at home 3 more days per week',
          'Use public transport twice a week',
          'Set entertainment budget of ₹' + Math.round(entExp * 0.7)
        ],
        impact: 'MEDIUM',
        timeline: '2-4 weeks'
      });
    }
    
    if (savings >= income * 0.15 && savingsRate >= 15) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Investment',
        title: '📈 Start Your Investment Journey',
        problem: `Great savings rate! But keeping ₹${savings} in savings account means losing to inflation.`,
        solution: `Start SIP of ₹${Math.round(savings * 0.7)} in equity mutual funds. This could grow to ₹${calculateSIP(Math.round(savings * 0.7), 0.12, 10).toLocaleString()} in 10 years!`,
        actionSteps: [
          'Open demat account with low-cost broker',
          'Start with large-cap mutual fund SIP',
          'Gradually increase SIP by 10% annually'
        ],
        impact: 'HIGH',
        timeline: '1 week'
      });
    }
    
    if (savings < emergencyFund) {
      const monthsNeeded = Math.ceil((emergencyFund - (savings * 6)) / savings);
      recommendations.push({
        priority: 'HIGH',
        category: 'Emergency Fund',
        title: '🛡️ Build Emergency Safety Net',
        problem: `You need ₹${emergencyFund.toLocaleString()} for emergencies (6 months of income).`,
        solution: `At current savings rate, you'll have this in ${monthsNeeded} months. Consider keeping this in liquid funds earning 6-7%.`,
        actionSteps: [
          'Open liquid mutual fund account',
          'Set up separate emergency fund account',
          'Automate monthly transfer of ₹' + Math.round(emergencyFund/12)
        ],
        impact: 'HIGH',
        timeline: `${monthsNeeded} months`
      });
    }
    
    if (userData.goal_shortTerm && savings > 0) {
      const goalAmount = 60000; // Assuming laptop/short-term goal
      const monthsToGoal = Math.ceil(goalAmount / savings);
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Goal Planning',
        title: '🎯 Accelerate Goal Achievement',
        problem: `Your goal "${userData.goal_shortTerm}" will take ${monthsToGoal} months at current savings rate.`,
        solution: `Increase savings by ₹${Math.round(goalAmount / Math.max(monthsToGoal - 6, 6))} monthly to achieve it 6 months faster.`,
        actionSteps: [
          'Open separate goal-based savings account',
          'Use recurring deposit for this specific goal',
          'Track progress monthly'
        ],
        impact: 'MEDIUM',
        timeline: `${Math.max(monthsToGoal - 6, 6)} months`
      });
    }
    
    // Advanced recommendations for good savers
    if (savingsRate >= 25) {
      recommendations.push({
        priority: 'LOW',
        category: 'Tax Optimization',
        title: '💰 Optimize Tax Savings',
        problem: `With ${savingsRate.toFixed(1)}% savings rate, you're likely paying unnecessary taxes.`,
        solution: `Invest ₹1.5L in ELSS funds for 80C deduction. This saves ₹46,800 in tax (31% bracket) plus grows your wealth!`,
        actionSteps: [
          'Calculate total 80C eligible investments',
          'Invest in ELSS mutual funds',
          'Consider NPS for additional 80CCD benefits'
        ],
        impact: 'MEDIUM',
        timeline: 'Before March 31st'
      });
    }
    
    // Debt recommendations
    if (userData.debt && userData.debt > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Debt Management',
        title: '⚡ Accelerate Debt Payoff',
        problem: `Debt is costing you compound interest. Every month of delay increases total cost.`,
        solution: `Use debt avalanche method: pay minimums on all debts, then attack highest interest rate debt first.`,
        actionSteps: [
          'List all debts with interest rates',
          'Pay minimum on all, extra on highest rate',
          'Consider debt consolidation if beneficial'
        ],
        impact: 'HIGH',
        timeline: 'Immediate'
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };
  const quizQuestions = [
    {
      question: "What is the Rule of 72?",
      options: [
        "A way to calculate compound interest",
        "A method to find how long it takes to double your money",
        "A budgeting technique",
        "A tax calculation method"
      ],
      correct: 1,
      explanation: "The Rule of 72 helps you estimate how long it will take to double your money by dividing 72 by your interest rate."
    },
    {
      question: "What percentage should you ideally save according to financial experts?",
      options: ["10%", "15%", "20%", "25%"],
      correct: 2,
      explanation: "Financial experts recommend saving at least 20% of your income for a healthy financial future."
    },
    {
      question: "What is SIP in investing?",
      options: [
        "Single Investment Plan",
        "Systematic Investment Plan",
        "Secure Investment Program",
        "Simple Interest Plan"
      ],
      correct: 1,
      explanation: "SIP stands for Systematic Investment Plan - a disciplined way to invest fixed amounts regularly."
    }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userData) return;

    try {
      const hour = new Date().getHours();
      let greeting = 'Hello';
      let timeEmoji = '👋';
      
      if (hour < 12) {
        greeting = 'Good morning';
        timeEmoji = '🌅';
      } else if (hour < 17) {
        greeting = 'Good afternoon';
        timeEmoji = '☀️';
      } else {
        greeting = 'Good evening';
        timeEmoji = '🌆';
      }

      setMessages([
        {
          sender: 'walleto',
          text: `${timeEmoji} ${greeting}, ${userData.name || 'friend'}! I'm Walleto, your AI financial mentor.`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'greeting'
        },
        {
          sender: 'walleto',
          text: `🎓 I'm here to make finance fun and easy to understand. Ready to boost your financial IQ?`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'intro'
        }
      ]);
      setShowOptions(true);
      setCurrentTopic(null);
      setConversationDepth(0);
      setQuizState(null);
    } catch (error) {
      console.error('Error setting initial messages:', error);
    }
  }, [userData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const typeMessage = async (sender, text, options = null, delay = 1000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const newMessage = {
      sender,
      text,
      timestamp: new Date().toLocaleTimeString(),
      options,
      type: 'normal'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(false);
  };

  const addMessage = (sender, text, options = null) => {
    try {
      const newMessage = {
        sender,
        text,
        timestamp: new Date().toLocaleTimeString(),
        options,
        type: 'normal'
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const handleTopicSelect = (topicId) => {
    try {
      setCurrentTopic(topicId);
      setShowOptions(false);
      setConversationDepth(1);
      
      addMessage('user', getTopicTitle(topicId));
      
      setTimeout(() => {
        handleTopicContent(topicId);
      }, 800);
    } catch (error) {
      console.error('Error handling topic select:', error);
    }
  };

  const getTopicTitle = (topicId) => {
    const topic = mainTopics.find(t => t.id === topicId);
    return topic ? topic.title : 'Selected topic';
  };

  const calculateSIP = (monthlyAmount, annualRate, years) => {
    try {
      if (!monthlyAmount || monthlyAmount <= 0) return 0;
      const monthlyRate = annualRate / 12;
      const months = years * 12;
      const futureValue = monthlyAmount * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
      return Math.round(futureValue);
    } catch (error) {
      console.error('Error calculating SIP:', error);
      return 0;
    }
  };

  const handleTopicContent = async (topicId) => {
    try {
      if (!userData) return;
      
      const savings = userData.savings || 0;
      const income = userData.income || 0;
      const expenses = {
        food: userData.expense_food || 0,
        travel: userData.expense_travel || 0,
        entertainment: userData.expense_entertainment || 0
      };
      const totalExpenses = expenses.food + expenses.travel + expenses.entertainment;

      switch (topicId) {
        case 'invest':
          setAnimation(investAnim);
          await typeMessage('walleto', `💹 Excellent choice! Investing is the key to building long-term wealth.`);
          
          const sipValue5 = calculateSIP(savings, 0.08, 5);
          const sipValue10 = calculateSIP(savings, 0.08, 10);
          
          await typeMessage('walleto', `📊 Here's what your ₹${savings}/month could become:\n\n🎯 5 years: ₹${sipValue5.toLocaleString()}\n🚀 10 years: ₹${sipValue10.toLocaleString()}\n\n*Assuming 8% annual returns`);
          
          await typeMessage('walleto', `💡 The magic ingredient? Time + Compound Interest = Wealth!`);
          
          addMessage('walleto', `What aspect of investing interests you most?`, [
            { id: 'sip_details', text: '📈 How SIPs work', description: 'Learn the systematic approach', icon: '🔄' },
            { id: 'mutual_funds', text: '🏢 Mutual Fund basics', description: 'Professional money management', icon: '👨‍💼' },
            { id: 'risk_profile', text: '⚖️ Risk vs Return', description: 'Find your comfort zone', icon: '🎯' },
            { id: 'investment_mistakes', text: '⚠️ Common Mistakes', description: 'Avoid these pitfalls', icon: '🚨' },
            { id: 'back_to_main', text: '🔙 Main Menu', description: 'Explore other topics', icon: '🏠' }
          ]);
          break;

        case 'save':
          setAnimation(saveMoneyAnim);
          const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;
          const emergencyFund = income * 6;
          
          await typeMessage('walleto', `💰 Smart saving is your financial foundation! Let's analyze your current situation.`);
          
          await typeMessage('walleto', `📊 Your Savings Analysis:\n\n💵 Monthly Savings: ₹${savings}\n📈 Savings Rate: ${savingsRate}%\n🎯 Target Rate: 20%\n\n${savingsRate >= 20 ? '🎉 Excellent! You\'re on track!' : '💪 Room for improvement!'}`);
          
          await typeMessage('walleto', `🆘 Emergency Fund Target: ₹${emergencyFund.toLocaleString()}\n(6 months of income for financial security)`);
          
          if (totalExpenses > 0) {
            await typeMessage('walleto', `💡 Quick Win: You spend ₹${totalExpenses} on food, travel & entertainment. Saving just 15% of this (₹${Math.round(totalExpenses * 0.15)}) could boost your monthly savings significantly!`);
          }
          
          addMessage('walleto', `Choose your savings strategy:`, [
            { id: 'emergency_fund', text: '🆘 Emergency Fund', description: 'Build your safety net', icon: '🛡️' },
            { id: 'expense_optimization', text: '✂️ Cut Expenses', description: 'Smart money-saving tips', icon: '💡' },
            { id: 'savings_automation', text: '🤖 Automate Savings', description: 'Save without thinking', icon: '⚙️' },
            { id: 'savings_challenge', text: '🏆 52-Week Challenge', description: 'Gamify your savings', icon: '🎮' },
            { id: 'back_to_main', text: '🔙 Main Menu', description: 'Explore other topics', icon: '🏠' }
          ]);
          break;

        case 'grow':
          setAnimation(growMoneyAnim);
          await typeMessage('walleto', `📈 Let's unlock the most powerful force in finance - Compound Interest!`);
          
          const doubleTime = 72 / 8;
          await typeMessage('walleto', `🔢 Rule of 72 Magic:\nAt 8% return, your money doubles every ${doubleTime} years!\n\n💰 ₹${savings} → ₹${(savings * 2).toLocaleString()} → ₹${(savings * 4).toLocaleString()} → ₹${(savings * 8).toLocaleString()}`);
          
          await typeMessage('walleto', `🚀 Einstein called compound interest "the 8th wonder of the world." Those who understand it, earn it. Those who don't, pay it!`);
          
          const growth20 = calculateSIP(savings, 0.08, 20);
          const growth30 = calculateSIP(savings, 0.08, 30);
          
          await typeMessage('walleto', `⏰ Time is your biggest asset:\n\n📊 Start now: ₹${growth30.toLocaleString()} in 30 years\n📊 Wait 10 years: ₹${growth20.toLocaleString()} in 20 years\n\nCost of waiting: ₹${(growth30 - growth20).toLocaleString()}!`);
          
          addMessage('walleto', `How do you want to grow your wealth?`, [
            { id: 'compound_calculator', text: '🧮 Wealth Calculator', description: 'See your money multiply', icon: '📊' },
            { id: 'diversification', text: '🎯 Diversification', description: 'Don\'t put all eggs in one basket', icon: '🥚' },
            { id: 'growth_strategies', text: '🚀 Advanced Strategies', description: 'Next-level wealth building', icon: '🎖️' },
            { id: 'inflation_impact', text: '📉 Beat Inflation', description: 'Protect your purchasing power', icon: '🛡️' },
            { id: 'back_to_main', text: '🔙 Main Menu', description: 'Explore other topics', icon: '🏠' }
          ]);
          break;

        case 'goals':
          setAnimation(goalAnim);
          const shortGoal = userData.goal_shortTerm || 'your short-term goal';
          const longGoal = userData.goal_longTerm || 'your long-term goal';
          
          await typeMessage('walleto', `🎯 Goal-based planning turns dreams into reality! Let's create your financial roadmap.`);
          
          await typeMessage('walleto', `📋 Your Current Goals:\n\n🎯 Short-term: ${shortGoal}\n🚀 Long-term: ${longGoal}`);
          
          const monthsTo60k = savings > 0 ? Math.ceil(60000 / savings) : 'N/A';
          const monthsTo500k = savings > 0 ? Math.ceil(500000 / savings) : 'N/A';
          const yearsTo500k = savings > 0 ? (monthsTo500k / 12).toFixed(1) : 'N/A';
          
          await typeMessage('walleto', `⏰ Timeline Analysis (at ₹${savings}/month):\n\n💻 ₹60,000 (Laptop): ${monthsTo60k} months\n🏠 ₹5,00,000 (Major goal): ${yearsTo500k} years\n\n💡 Tip: Increase savings by just ₹1,000/month to cut timeline by ${savings > 0 ? Math.ceil((60000 / savings) - (60000 / (savings + 1000))) : 0} months!`);
          
          addMessage('walleto', `Let's supercharge your goal planning:`, [
            { id: 'goal_breakdown', text: '📋 SMART Goals', description: 'Make goals specific & achievable', icon: '🎯' },
            { id: 'goal_prioritization', text: '⭐ Priority Matrix', description: 'What to focus on first', icon: '🥇' },
            { id: 'goal_tracking', text: '📊 Progress Tracker', description: 'Monitor your journey', icon: '📈' },
            { id: 'goal_motivation', text: '💪 Stay Motivated', description: 'Tips to stick to your plan', icon: '🔥' },
            { id: 'back_to_main', text: '🔙 Main Menu', description: 'Explore other topics', icon: '🏠' }
          ]);
          break;

        case 'budget':
          setAnimation(thinkingAnim);
          const recommended50 = Math.round(income * 0.5);
          const recommended30 = Math.round(income * 0.3);
          const recommended20 = Math.round(income * 0.2);
          const currentSavingsPercent = income > 0 ? ((savings/income)*100).toFixed(1) : 0;
          
          await typeMessage('walleto', `📊 Let's master the art of budgeting with the proven 50-30-20 rule!`);
          
          await typeMessage('walleto', `💡 Your ₹${income} Budget Breakdown:\n\n🏠 50% Needs: ₹${recommended50}\n(Rent, food, utilities, EMIs)\n\n🎉 30% Wants: ₹${recommended30}\n(Entertainment, dining out, hobbies)\n\n💰 20% Savings: ₹${recommended20}\n(Emergency fund, investments)`);
          
          const budgetGap = recommended20 - savings;
          await typeMessage('walleto', `📈 Your Current Status:\n\nSaving: ₹${savings} (${currentSavingsPercent}%)\nTarget: ₹${recommended20} (20%)\n\n${budgetGap > 0 ? `🎯 Gap to close: ₹${budgetGap}` : '🎉 You\'re exceeding the target!'}`);
          
          if (totalExpenses > 0) {
            const wastePercentage = ((totalExpenses / income) * 100).toFixed(1);
            await typeMessage('walleto', `🔍 Expense Analysis:\nDiscretionary spending: ₹${totalExpenses} (${wastePercentage}% of income)\n\n💡 Optimizing this could easily bridge your savings gap!`);
          }
          
          addMessage('walleto', `Choose your budgeting focus:`, [
            { id: 'budget_analysis', text: '🔍 Deep Dive Analysis', description: 'Detailed expense breakdown', icon: '🔬' },
            { id: 'budget_hacks', text: '💡 Money-Saving Hacks', description: 'Practical cost-cutting tips', icon: '✂️' },
            { id: 'envelope_method', text: '📮 Envelope Budgeting', description: 'Simple allocation system', icon: '💌' },
            { id: 'budget_apps', text: '📱 Digital Tools', description: 'Apps to track spending', icon: '📲' },
            { id: 'back_to_main', text: '🔙 Main Menu', description: 'Explore other topics', icon: '🏠' }
          ]);
          break;

        case 'ai_recommendations':
          setAnimation(thinkingAnim);
          await typeMessage('walleto', `🤖 Analyzing your financial profile... Let me crunch the numbers!`);
          
          const recommendations = generatePersonalizedRecommendations(userData);
          
          await typeMessage('walleto', `📊 Based on your financial data, I've identified ${recommendations.length} key areas for improvement. Let me walk you through them:`);
          
          // Present top 3 most important recommendations
          const topRecommendations = recommendations.slice(0, 3);
          
          for (let i = 0; i < topRecommendations.length; i++) {
            const rec = topRecommendations[i];
            const priorityEmoji = rec.priority === 'HIGH' ? '🔴' : rec.priority === 'MEDIUM' ? '🟡' : '🟢';
            
            await typeMessage('walleto', `${priorityEmoji} **${rec.category.toUpperCase()}** - Priority: ${rec.priority}\n\n🎯 ${rec.title}\n\n❌ Problem: ${rec.problem}\n\n✅ Solution: ${rec.solution}\n\n⏰ Timeline: ${rec.timeline}`, null, 1500);
            
            if (i < topRecommendations.length - 1) {
              await typeMessage('walleto', `📋 Action Steps:\n${rec.actionSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}\n\n💪 Expected Impact: ${rec.impact}`);
            }
          }
          
          addMessage('walleto', `What would you like to focus on first?`, [
            { id: 'detailed_analysis', text: '🔍 Detailed Analysis', description: 'See all recommendations with action plans', icon: '📊' },
            { id: 'priority_action', text: '⚡ Priority Action', description: 'Focus on the most critical item', icon: '🎯' },
            { id: 'custom_plan', text: '📝 Custom Plan', description: 'Create personalized 90-day plan', icon: '📅' },
            { id: 'progress_tracking', text: '📈 Track Progress', description: 'Set up monitoring system', icon: '📱' },
            { id: 'back_to_main', text: '🔙 Main Menu', description: 'Explore other topics', icon: '🏠' }
          ]);
          break;
          setAnimation(thinkingAnim);
          await typeMessage('walleto', `🧠 Time for a fun financial literacy challenge!`);
          
          await typeMessage('walleto', `📚 This interactive quiz will test your knowledge and teach you new concepts. Ready to level up your financial IQ?`);
          
          addMessage('walleto', `Choose your quiz adventure:`, [
            { id: 'start_quiz', text: '🚀 Start Quiz', description: '5 engaging questions', icon: '🎯' },
            { id: 'quiz_topics', text: '📖 Preview Topics', description: 'See what we\'ll cover', icon: '👀' },
            { id: 'financial_facts', text: '🤓 Fun Facts', description: 'Interesting money trivia', icon: '💡' },
            { id: 'back_to_main', text: '🔙 Main Menu', description: 'Explore other topics', icon: '🏠' }
          ]);
          break;

        default:
          await typeMessage('walleto', `🤔 Hmm, I'm not sure about that topic yet. Let's explore something from the main menu!`);
          setShowOptions(true);
          setCurrentTopic(null);
      }
    } catch (error) {
      console.error('Error handling topic content:', error);
      addMessage('walleto', `😅 Oops! Something went wrong. Let's try again!`);
    }
  };

  const handleOptionClick = async (optionId) => {
    try {
      setConversationDepth(prev => prev + 1);
      
      if (optionId === 'back_to_main') {
        setShowOptions(true);
        setCurrentTopic(null);
        setConversationDepth(0);
        setQuizState(null);
        await typeMessage('walleto', `🔄 What would you like to explore next?`);
        return;
      }

      if (optionId === 'ask_question') {
        addMessage('walleto', `💭 Feel free to type any financial question! I'll do my best to help.`);
        return;
      }

      handleSubTopic(optionId);
    } catch (error) {
      console.error('Error handling option click:', error);
    }
  };

  const handleSubTopic = async (subTopicId) => {
    try {
      addMessage('user', getSubTopicTitle(subTopicId));
      
      switch (subTopicId) {
        case 'sip_details':
          await typeMessage('walleto', `📈 SIP (Systematic Investment Plan) - Your Path to Disciplined Investing!`);
          await typeMessage('walleto', `🔄 How SIPs Work:\n\n1️⃣ Fixed amount invested regularly\n2️⃣ Automatic deduction from bank\n3️⃣ Rupee Cost Averaging benefit\n4️⃣ Power of compounding kicks in\n\n💡 Start with ₹500/month, increase by 10% yearly!`);
          await typeMessage('walleto', `🎯 SIP Benefits:\n• No market timing stress\n• Disciplined investing habit\n• Lower average cost per unit\n• Flexibility to pause/modify`);
          break;
        
        case 'emergency_fund':
          const emergencyAmount = (userData?.income || 0) * 6;
          await typeMessage('walleto', `🆘 Emergency Fund - Your Financial Safety Net!`);
          await typeMessage('walleto', `🎯 Your Target: ₹${emergencyAmount.toLocaleString()}\n(6 months of income)\n\n🏦 Where to keep it:\n• Savings account (instant access)\n• Liquid mutual funds\n• Fixed deposits (3-6 months)\n\n⚠️ Not for investments - for emergencies only!`);
          break;
        
        case 'compound_calculator':
          const savings = userData?.savings || 0;
          const years10 = calculateSIP(savings, 0.08, 10);
          const years20 = calculateSIP(savings, 0.08, 20);
          const years30 = calculateSIP(savings, 0.08, 30);
          
          await typeMessage('walleto', `🧮 Your Personal Wealth Projection:`);
          await typeMessage('walleto', `💰 Monthly Investment: ₹${savings}\n📊 Expected Return: 8% annually\n\n🚀 Future Value:\n⏰ 10 years: ₹${years10.toLocaleString()}\n⏰ 20 years: ₹${years20.toLocaleString()}\n⏰ 30 years: ₹${years30.toLocaleString()}\n\n🎉 Total invested in 30 years: ₹${(savings * 12 * 30).toLocaleString()}\n💎 Compound interest earned: ₹${(years30 - (savings * 12 * 30)).toLocaleString()}`);
          break;

        case 'start_quiz':
          setQuizState({ currentQuestion: 0, score: 0, answers: [] });
          startQuiz();
          return;

        case 'budget_analysis':
          const income = userData?.income || 0;
          const currentSavings = userData?.savings || 0;
          const foodExp = userData?.expense_food || 0;
          const travelExp = userData?.expense_travel || 0;
          const entExp = userData?.expense_entertainment || 0;
          
          await typeMessage('walleto', `🔍 Deep Budget Analysis:`);
          await typeMessage('walleto', `📊 Income Distribution:\n💰 Total Income: ₹${income}\n💵 Current Savings: ₹${currentSavings} (${((currentSavings/income)*100).toFixed(1)}%)\n\n📈 Expense Breakdown:\n🍽️ Food: ₹${foodExp}\n🚗 Travel: ₹${travelExp}\n🎬 Entertainment: ₹${entExp}\n📱 Other: ₹${income - currentSavings - foodExp - travelExp - entExp}\n\n💡 Recommendation: ${currentSavings/income >= 0.2 ? 'Great savings rate!' : 'Aim for 20% savings rate'}`);
          break;

        case 'detailed_analysis':
          const allRecommendations = generatePersonalizedRecommendations(userData);
          await typeMessage('walleto', `📋 Complete Financial Health Report:`);
          
          const groupedRecs = allRecommendations.reduce((acc, rec) => {
            if (!acc[rec.category]) acc[rec.category] = [];
            acc[rec.category].push(rec);
            return acc;
          }, {});
          
          for (const [category, recs] of Object.entries(groupedRecs)) {
            const categoryEmoji = {
              'Savings': '💰',
              'Investment': '📈',
              'Emergency Fund': '🛡️',
              'Expense Optimization': '✂️',
              'Goal Planning': '🎯',
              'Tax Optimization': '💼',
              'Debt Management': '⚡'
            };
            
            await typeMessage('walleto', `${categoryEmoji[category] || '📌'} **${category.toUpperCase()}**\n\n${recs.map((rec, idx) => `${idx + 1}. ${rec.title}\n   Impact: ${rec.impact} | Timeline: ${rec.timeline}`).join('\n\n')}`);
          }
          break;
          
        case 'priority_action':
          const topRec = generatePersonalizedRecommendations(userData)[0];
          if (topRec) {
            await typeMessage('walleto', `🎯 Let's focus on your #1 priority: **${topRec.title}**`);
            await typeMessage('walleto', `📋 Your 7-Day Action Plan:\n\n${topRec.actionSteps.map((step, idx) => `Day ${idx + 1}-${idx + 2}: ${step}`).join('\n\n')}\n\n🎉 Expected Result: ${topRec.solution}`);
            await typeMessage('walleto', `💡 Pro Tip: Start with the easiest step to build momentum! Which step feels most doable for you right now?`);
          }
          break;
          
        case 'custom_plan':
          await typeMessage('walleto', `📅 Creating Your Personalized 90-Day Financial Transformation Plan...`);
          
          const plan = generatePersonalizedRecommendations(userData).slice(0, 3);
          const months = ['Month 1: Foundation', 'Month 2: Growth', 'Month 3: Optimization'];
          
          plan.forEach((rec, idx) => {
            setTimeout(async () => {
              await typeMessage('walleto', `🗓️ **${months[idx]}**\n\nFocus: ${rec.category}\nGoal: ${rec.title}\n\nWeek-by-week breakdown:\n${rec.actionSteps.map((step, i) => `Week ${i + 1}: ${step}`).join('\n')}\n\n📊 Success Metric: ${rec.impact} impact expected`);
            }, (idx + 1) * 2000);
          });
          
          setTimeout(async () => {
            await typeMessage('walleto', `🎯 By Day 90, you'll have:\n• Improved savings rate\n• Started investing journey\n• Built emergency cushion\n• Optimized expenses\n\n💪 Ready to commit to this plan?`);
          }, 8000);
          break;
          await typeMessage('walleto', `🤓 Fun Financial Facts:`);
          await typeMessage('walleto', `💡 Did you know?\n\n• If you save ₹5,000/month from age 25, you'll have ₹2.8 crores by retirement!\n\n• A 1% fee difference can cost you ₹5+ lakhs over 20 years\n\n• 78% of Indians don't invest in equity markets\n\n• Inflation averages 6% - your money loses half its value every 12 years if not invested!`);
          break;

        default:
          await typeMessage('walleto', `🔍 This is a fascinating topic! I'm constantly learning to provide better insights. Let me know what else you'd like to explore!`);
      }
      
      // Always offer to continue or go back
      addMessage('walleto', `What would you like to do next?`, [
        { id: 'back_to_main', text: '🔙 Main Menu', description: 'Explore other topics', icon: '🏠' },
        { id: 'ask_question', text: '❓ Ask Question', description: 'Type your own question', icon: '💭' }
      ]);
    } catch (error) {
      console.error('Error handling sub-topic:', error);
    }
  };

  const startQuiz = async () => {
    const question = quizQuestions[0];
    await typeMessage('walleto', `🎯 Question 1 of ${quizQuestions.length}:`);
    await typeMessage('walleto', question.question, 
      question.options.map((option, index) => ({
        id: `quiz_answer_${index}`,
        text: `${String.fromCharCode(65 + index)}) ${option}`,
        description: '',
        icon: '🤔'
      }))
    );
  };

  const handleQuizAnswer = async (answerIndex) => {
    const currentQ = quizState.currentQuestion;
    const question = quizQuestions[currentQ];
    const isCorrect = answerIndex === question.correct;
    
    const newScore = isCorrect ? quizState.score + 1 : quizState.score;
    const newAnswers = [...quizState.answers, { questionIndex: currentQ, selected: answerIndex, correct: isCorrect }];
    
    addMessage('user', `${String.fromCharCode(65 + answerIndex)}) ${question.options[answerIndex]}`);
    
    if (isCorrect) {
      await typeMessage('walleto', `🎉 Correct! ${question.explanation}`);
    } else {
      await typeMessage('walleto', `❌ Not quite. ${question.explanation}`);
    }
    
    if (currentQ < quizQuestions.length - 1) {
      setQuizState({ currentQuestion: currentQ + 1, score: newScore, answers: newAnswers });
      const nextQuestion = quizQuestions[currentQ + 1];
      
      await typeMessage('walleto', `🎯 Question ${currentQ + 2} of ${quizQuestions.length}:`);
      await typeMessage('walleto', nextQuestion.question,
        nextQuestion.options.map((option, index) => ({
          id: `quiz_answer_${index}`,
          text: `${String.fromCharCode(65 + index)}) ${option}`,
          description: '',
          icon: '🤔'
        }))
      );
    } else {
      // Quiz completed
      const finalScore = newScore;
      const percentage = Math.round((finalScore / quizQuestions.length) * 100);
      
      await typeMessage('walleto', `🏁 Quiz Complete!`);
      await typeMessage('walleto', `📊 Your Score: ${finalScore}/${quizQuestions.length} (${percentage}%)\n\n${percentage >= 80 ? '🏆 Excellent! You\'re a financial rockstar!' : percentage >= 60 ? '👍 Good job! Keep learning!' : '💪 Great start! Practice makes perfect!'}`);
      
      setQuizState(null);
    }
  };

  const getSubTopicTitle = (subTopicId) => {
    const titles = {
      'sip_details': '📈 How SIPs work',
      'emergency_fund': '🆘 Emergency Fund',
      'compound_calculator': '🧮 Wealth Calculator',
      'budget_analysis': '🔍 Budget Analysis',
      'start_quiz': '🚀 Start Quiz',
      'financial_facts': '🤓 Fun Facts',
      'mutual_funds': '🏢 Mutual Fund basics',
      'risk_profile': '⚖️ Risk vs Return',
      'expense_optimization': '✂️ Cut Expenses',
      'savings_automation': '🤖 Automate Savings',
      'goal_breakdown': '📋 SMART Goals',
      'budget_hacks': '💡 Money-Saving Hacks',
      'detailed_analysis': '🔍 Detailed Analysis',
      'priority_action': '⚡ Priority Action',
      'custom_plan': '📝 Custom Plan',
      'progress_tracking': '📈 Track Progress'
    };
    return titles[subTopicId] || 'Selected option';
  };

  const handleUserInput = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    try {
      addMessage('user', userInput);
      const input = userInput.toLowerCase();
      setUserInput('');
      
      // Handle quiz answers
      if (quizState && input.match(/^[a-d]$/)) {
        const answerIndex = input.charCodeAt(0) - 97; // Convert a,b,c,d to 0,1,2,3
        handleQuizAnswer(answerIndex);
        return;
      }
      
      // Smart responses based on keywords
      let response = "🤔 That's an interesting question! Let me think about that...";
      let followUp = null;
      
      if (input.includes('thank')) {
        response = "😊 You're absolutely welcome! I'm thrilled to help you on your financial journey. Remember, every expert was once a beginner!";
      } else if (input.includes('help') || input.includes('confused')) {
        response = "💪 Don't worry, finance can seem overwhelming at first! That's exactly why I'm here. Let's break it down into simple, actionable steps.";
        followUp = [
          { id: 'back_to_main', text: '🎓 Start Learning', description: 'Choose a topic to explore', icon: '📚' }
        ];
      } else if (input.includes('invest') || input.includes('sip') || input.includes('mutual fund')) {
        response = "💹 Great question about investing! The key is to start early and stay consistent. Even ₹500/month can grow to lakhs over time through the power of compounding.";
        followUp = [
          { id: 'invest', text: '📈 Learn Investing', description: 'Deep dive into investments', icon: '💰' }
        ];
      } else if (input.includes('recommend') || input.includes('advice') || input.includes('what should i do')) {
        response = "🤖 Let me analyze your financial profile and give you personalized recommendations based on your data!";
        followUp = [
          { id: 'ai_recommendations', text: '🎯 Get AI Recommendations', description: 'Personalized advice for you', icon: '🤖' }
        ];
      } else if (input.includes('save') || input.includes('money') || input.includes('budget')) {
        response = "💰 Smart saving is the foundation of wealth! The 50-30-20 rule is a great starting point: 50% needs, 30% wants, 20% savings.";
        followUp = [
          { id: 'save', text: '🏦 Learn Saving', description: 'Master the art of saving', icon: '💵' }
        ];
      } else if (input.includes('goal') || input.includes('plan')) {
        response = "🎯 Goal-based planning is the secret sauce! When you have clear financial goals, every rupee you save has a purpose. SMART goals work best!";
        followUp = [
          { id: 'goals', text: '🎯 Plan Goals', description: 'Create your financial roadmap', icon: '🗺️' }
        ];
      } else if (input.includes('compound') || input.includes('interest')) {
        response = "🚀 Compound interest is indeed the 8th wonder of the world! It's not just about the money you invest, but the money your money makes, and then the money that money makes!";
      } else if (input.includes('risk')) {
        response = "⚖️ Great question about risk! Remember: No risk, no reward. But smart diversification can help manage risk while still growing your wealth.";
      } else if (input.includes('emergency')) {
        response = "🆘 Emergency funds are crucial! Aim for 6 months of expenses. It's not about returns - it's about sleeping peacefully at night knowing you're prepared.";
      }
      
      await typeMessage('walleto', response, followUp);
      
      if (!followUp) {
        addMessage('walleto', `Want to explore this topic further?`, [
          { id: 'back_to_main', text: '🎓 Explore Topics', description: 'Choose from main menu', icon: '📚' },
          { id: 'ask_question', text: '❓ Ask Another', description: 'Keep the conversation going', icon: '💭' }
        ]);
      }
    } catch (error) {
      console.error('Error handling user input:', error);
    }
  };

  // Handle quiz answer clicks
  const handleQuizAnswerClick = (optionId) => {
    if (optionId.startsWith('quiz_answer_')) {
      const answerIndex = parseInt(optionId.split('_')[2]);
      handleQuizAnswer(answerIndex);
    } else {
      handleOptionClick(optionId);
    }
  };

if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Walleto...</h3>
          <p className="text-gray-600">Preparing your personalized financial mentor</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your personalized financial learning experience.</p>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">💡 Your learning progress and recommendations are tailored to your financial profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col xl:flex-row h-full w-full p-4 gap-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        {/* Enhanced Animation Panel */}
        <div className="w-full xl:w-1/3 flex flex-col">
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-4 border border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <Lottie animationData={animation} loop className="w-full h-auto max-w-xs" />
            </div>
            
            {currentTopic && (
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl mr-2">{mainTopics.find(t => t.id === currentTopic)?.icon}</span>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {getTopicTitle(currentTopic).replace(/^[^\s]+ /, '')}
                  </h3>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min((conversationDepth / 4) * 100, 100)}%` }}
                  ></div>
                </div>
                
                <p className="text-xs text-gray-600 font-medium">
                  Learning Progress: {Math.min(Math.round((conversationDepth / 4) * 100), 100)}%
                </p>
              </div>
            )}
          </div>
          
          {/* Quick Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <span className="text-lg mr-2">📊</span>
              Your Financial Snapshot
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Income:</span>
                <span className="font-semibold text-green-600">₹{userData.income?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Savings:</span>
                <span className="font-semibold text-blue-600">₹{userData.savings?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Savings Rate:</span>
                <span className="font-semibold text-purple-600">
                  {userData.income ? ((userData.savings / userData.income) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Chat Panel */}
        <div className="w-full xl:w-2/3 flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Walleto AI</h3>
                  <p className="text-xs opacity-90">Your Personal Financial Mentor</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-90">Learning Session</div>
                <div className="text-sm font-semibold">{messages.length} messages</div>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[60vh] bg-gradient-to-b from-gray-50 to-white custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] ${
                  msg.sender === 'walleto'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl rounded-bl-lg shadow-lg'
                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-3xl rounded-br-lg shadow-lg'
                }`}>
                  <div className="p-4">
                    <div className="whitespace-pre-line text-sm leading-relaxed font-medium">
                      {msg.text}
                    </div>
                    <div className="text-xs opacity-80 mt-2 flex items-center">
                      <span className="mr-1">🕐</span>
                      {msg.timestamp}
                    </div>
                  </div>
                  
                  {/* Enhanced Options */}
                  {msg.options && (
                    <div className="p-4 pt-0">
                      <div className="grid grid-cols-1 gap-2">
                        {msg.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => quizState ? handleQuizAnswerClick(option.id) : handleOptionClick(option.id)}
                            className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm rounded-2xl p-3 text-left transition-all duration-300 border border-white border-opacity-20 hover:scale-[1.02] hover:shadow-lg group"
                          >
                            <div className="flex items-center">
                              <span className="text-lg mr-3 group-hover:scale-110 transition-transform">
                                {option.icon || '▶️'}
                              </span>
                              <div className="flex-1">
                                <div className="font-semibold text-sm">{option.text}</div>
                                <div className="text-xs opacity-90 mt-1">{option.description}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gray-200 rounded-3xl rounded-bl-lg p-4 shadow">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-gray-600 ml-2">Walleto is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Main Topic Options */}
          {showOptions && (
            <div className="p-6 bg-gradient-to-t from-gray-50 to-white border-t">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
                  <span className="mr-2">🎓</span>
                  Choose Your Learning Adventure
                </h3>
                <p className="text-gray-600">Select a topic and let's make finance fun and easy!</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mainTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicSelect(topic.id)}
                    className={`bg-gradient-to-br ${topic.gradient} text-white p-6 rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300 text-left group relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 text-6xl opacity-10 transform translate-x-4 -translate-y-2">
                      {topic.icon}
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                          {topic.icon}
                        </span>
                        <div className="font-bold text-lg">{topic.title.replace(/^[^\s]+ /, '')}</div>
                      </div>
                      <div className="text-sm opacity-90 leading-relaxed">{topic.description}</div>
                      <div className="mt-3 text-xs opacity-80 flex items-center">
                        <span className="mr-1">⚡</span>
                        Interactive Learning
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Input Form */}
          {!showOptions && (
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleUserInput} className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask me anything about finance... 💬"
                  className="flex-1 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-4 rounded-2xl transition-all duration-200 outline-none text-sm bg-gray-50 focus:bg-white"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={isTyping || !userInput.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  {isTyping ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Thinking...</span>
                    </div>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-2">🚀</span>
                      Send
                    </span>
                  )}
                </button>
              </form>
              
              {quizState && (
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-600">
                    💡 Tip: You can type A, B, C, or D to answer quiz questions quickly!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Teaching;