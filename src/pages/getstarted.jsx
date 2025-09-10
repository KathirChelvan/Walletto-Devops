import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import * as THREE from "three"
import {
  Wallet,
  TrendingUp,
  Bot,
  Shield,
  Target,
  Heart,
  ArrowRight,
  DollarSign,
  PieChart,
  Sparkles,
  Menu,
  X,
  Star,
  Users,
  Award,
  Zap,
  BarChart3,
  Globe,
  Lock,
  Smartphone,
  Brain,
  CheckCircle
} from "lucide-react"

const GetStarted = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const navigate = useNavigate()
  const mountRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!mountRef.current) return

    // Three.js Scene Setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Create floating geometric shapes
    const geometries = [
      new THREE.OctahedronGeometry(0.8),
      new THREE.TetrahedronGeometry(0.9),
      new THREE.IcosahedronGeometry(0.7),
    ]

    const materials = [
      new THREE.MeshPhongMaterial({ 
        color: 0x00d4aa, 
        transparent: true, 
        opacity: 0.7,
        wireframe: true 
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0x00b4d8, 
        transparent: true, 
        opacity: 0.6,
        wireframe: true 
      }),
      new THREE.MeshPhongMaterial({ 
        color: 0x48cc6c, 
        transparent: true, 
        opacity: 0.5,
        wireframe: true 
      }),
    ]

    const meshes = []
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)]
      const material = materials[Math.floor(Math.random() * materials.length)]
      const mesh = new THREE.Mesh(geometry, material)
      
      mesh.position.x = (Math.random() - 0.5) * 20
      mesh.position.y = (Math.random() - 0.5) * 20
      mesh.position.z = (Math.random() - 0.5) * 20
      
      mesh.rotation.x = Math.random() * Math.PI
      mesh.rotation.y = Math.random() * Math.PI
      
      scene.add(mesh)
      meshes.push(mesh)
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0x00d4aa, 0.8)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x00b4d8, 0.6)
    pointLight.position.set(-5, -5, 5)
    scene.add(pointLight)

    camera.position.z = 10

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.005 + index * 0.001
        mesh.rotation.y += 0.003 + index * 0.001
        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002
      })
      
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    sceneRef.current = { scene, camera, renderer, meshes }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      meshes.forEach(mesh => mesh.geometry.dispose())
      materials.forEach(material => material.dispose())
    }
  }, [])

  const handleGetStarted = () => {
    navigate('/signup')
  }

  const handleSignIn = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Three.js Background */}
      <div 
        ref={mountRef} 
        className="fixed inset-0 z-0"
        style={{ 
          transform: `translateY(${scrollY * 0.5}px)`,
          opacity: Math.max(0.3, 1 - scrollY / 1000)
        }}
      />

      {/* Header */}
      <header className="relative z-50 p-6 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Walletto</span>
              <div className="text-xs text-emerald-400 font-medium">Smart Finance</div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleSignIn}
              className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white hover:bg-white/10 transition-all duration-300"
            >
              Sign In
            </button>
            <button 
              onClick={handleGetStarted}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-semibold hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10">
            <div className="p-6 space-y-4">
              <button 
                onClick={handleSignIn}
                className="w-full px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white hover:bg-white/10 transition-all"
              >
                Sign In
              </button>
              <button 
                onClick={handleGetStarted}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-semibold hover:shadow-lg transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-500/20">
                <Brain className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-medium">AI-Powered Finance Platform</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold text-white leading-tight">
                Master Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  Financial Future
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Experience the next generation of personal finance management. Walletto combines cutting-edge AI with intuitive design to help you achieve your financial goals.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Bot, title: "AI Assistant", desc: "Smart financial guidance" },
                { icon: Shield, title: "Bank-Level Security", desc: "Your data protected" },
                { icon: BarChart3, title: "Advanced Analytics", desc: "Deep insights & trends" },
                { icon: Globe, title: "Multi-Currency", desc: "Global finance support" }
              ].map((feature, index) => (
                <div key={index} className="group p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-white text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="space-y-6">
              <button
                onClick={handleGetStarted}
                className={`group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-semibold text-lg shadow-2xl transform transition-all duration-300 ${
                  isHovered ? "scale-105 shadow-emerald-500/30" : ""
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Start Your Journey</span>
                  <ArrowRight className={`w-5 h-5 transition-transform ${isHovered ? "translate-x-1" : ""}`} />
                </span>
              </button>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-8 pt-8 border-t border-white/10">
              {[
                { icon: Users, value: "50K+", label: "Active Users" },
                { icon: DollarSign, value: "₹10Cr+", label: "Managed" },
                { icon: Star, value: "4.9★", label: "App Rating" }
              ].map((stat, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <stat.icon className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Enhanced Phone Mockup */}
          <div className="relative flex justify-center" style={{ transform: `translateY(${scrollY * -0.1}px)` }}>
            <div className="relative">
              {/* Main Phone */}
              <div className="relative w-80 h-[640px] bg-black rounded-[3rem] p-2 shadow-2xl shadow-emerald-500/20">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                  {/* Screen Content */}
                  <div className="h-full bg-gradient-to-b from-gray-50 to-white">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-4 text-sm font-medium">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-emerald-500 rounded-sm"></div>
                        <div className="w-4 h-2 bg-emerald-500 rounded-sm"></div>
                        <div className="w-4 h-2 bg-emerald-500 rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-bold">Good Morning</h2>
                          <p className="text-emerald-100 text-sm">Ready to manage your finances?</p>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Balance Card */}
                    <div className="px-6 py-4">
                      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="relative">
                          <p className="text-gray-400 text-sm">Total Balance</p>
                          <h3 className="text-3xl font-bold">₹1,24,580</h3>
                          <div className="flex items-center space-x-2 mt-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 text-sm">+18.5% this month</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="px-6 py-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 rounded-xl p-4 text-center">
                          <DollarSign className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                          <p className="font-semibold text-gray-900 text-sm">Add Income</p>
                        </div>
                        <div className="bg-teal-50 rounded-xl p-4 text-center">
                          <PieChart className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                          <p className="font-semibold text-gray-900 text-sm">Analytics</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="px-6 py-4 space-y-3">
                      <h4 className="font-semibold text-gray-900">Recent Activity</h4>
                      <div className="space-y-2">
                        {[
                          { emoji: "🛒", title: "Grocery Shopping", amount: "-₹2,340", color: "text-red-600" },
                          { emoji: "💼", title: "Freelance Payment", amount: "+₹15,000", color: "text-emerald-600" },
                          { emoji: "☕", title: "Coffee & Snacks", amount: "-₹280", color: "text-red-600" }
                        ].map((transaction, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg">
                                {transaction.emoji}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{transaction.title}</p>
                                <p className="text-xs text-gray-500">Today</p>
                              </div>
                            </div>
                            <span className={`font-semibold text-sm ${transaction.color}`}>
                              {transaction.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              {[
                { icon: "🎯", position: "-top-4 -right-4", color: "bg-yellow-400", animation: "animate-bounce" },
                { icon: "💡", position: "-bottom-4 -left-4", color: "bg-emerald-400", animation: "animate-pulse" },
                { icon: "⚡", position: "top-1/2 -left-6", color: "bg-orange-400", animation: "animate-ping" }
              ].map((element, index) => (
                <div key={index} className={`absolute ${element.position} w-12 h-12 ${element.color} rounded-full flex items-center justify-center ${element.animation} shadow-lg`}>
                  <span className="text-xl">{element.icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Interaction Demo */}
        <div className="mt-32 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">AI That Understands You</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience personalized financial guidance with emotional intelligence
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-left">
              <div className="inline-flex items-center space-x-3 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 max-w-md">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">👤</span>
                </div>
                <span className="text-white">"I'm worried about my spending this month"</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="inline-block max-w-2xl">
                <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-2xl border border-emerald-500/20 text-left">
                  <div className="flex items-start space-x-3 mb-4">
                    <Bot className="w-6 h-6 text-emerald-400 mt-1" />
                    <div>
                      <p className="text-white font-medium">Walletto AI</p>
                      <p className="text-gray-300 text-sm mt-2">
                        I understand your concern. Looking at your patterns, you're actually doing better than last month. 
                        You've reduced dining out by 23% and increased savings by ₹3,200. Let me show you a personalized plan 
                        to feel more confident about your finances.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-emerald-300 font-medium">Smart Suggestion</span>
                    </div>
                    <p className="text-white text-sm">
                      Try the "52-week challenge" - save just ₹50 extra per week to build a ₹2,600 emergency fund by year-end.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-white">Built for the Modern World</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced features that adapt to your lifestyle and financial goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Intelligent Insights",
                description: "AI analyzes your spending patterns and provides personalized recommendations to optimize your financial health.",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                icon: Heart,
                title: "Emotional Wellness",
                description: "Understanding that money decisions are emotional, we provide supportive guidance during financial stress.",
                gradient: "from-pink-500 to-rose-500"
              },
              {
                icon: Target,
                title: "Goal Achievement",
                description: "Set meaningful financial goals and get step-by-step guidance with smart milestones and progress tracking.",
                gradient: "from-blue-500 to-cyan-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group text-center space-y-6 p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-32 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white">Walletto</span>
                  <div className="text-xs text-emerald-400">Smart Finance</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering your financial journey with intelligent insights and emotional support.
              </p>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Features", "AI Assistant", "Security", "Pricing", "Mobile App"]
              },
              {
                title: "Company", 
                links: ["About Us", "Careers", "Blog", "Press", "Contact"]
              },
              {
                title: "Support",
                links: ["Help Center", "Privacy Policy", "Terms of Service", "API Docs", "Status"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <div className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
                      {link}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 Walletto. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Lock className="w-4 h-4" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Smartphone className="w-4 h-4" />
                <span>Mobile optimized</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default GetStarted