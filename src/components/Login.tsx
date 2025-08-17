import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Shield, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import ForgotPassword from './ForgotPassword';

interface LoginProps {
  onLogin: () => void;
}

interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-existing demo accounts for immediate sign-in
  const demoAccounts: User[] = [
    {
      email: 'rajesh.kumar@email.com',
      password: 'demo123',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      phone: '+91 98765 43210'
    },
    {
      email: 'priya.sharma@email.com',
      password: 'demo123',
      firstName: 'Priya',
      lastName: 'Sharma',
      phone: '+91 87654 32109'
    },
    {
      email: 'amit.patel@email.com',
      password: 'demo123',
      firstName: 'Amit',
      lastName: 'Patel',
      phone: '+91 76543 21098'
    }
  ];

  // Initialize demo accounts in localStorage if not present
  const initializeDemoAccounts = () => {
    const existingUsers = localStorage.getItem('financebank_users');
    if (!existingUsers) {
      localStorage.setItem('financebank_users', JSON.stringify(demoAccounts));
    } else {
      const users = JSON.parse(existingUsers);
      // Add demo accounts if they don't exist
      demoAccounts.forEach(demoAccount => {
        if (!users.find((user: User) => user.email === demoAccount.email)) {
          users.push(demoAccount);
        }
      });
      localStorage.setItem('financebank_users', JSON.stringify(users));
    }
  };

  // Initialize demo accounts on component mount
  React.useEffect(() => {
    initializeDemoAccounts();
  }, []);

  const getUsers = (): User[] => {
    const users = localStorage.getItem('financebank_users');
    return users ? JSON.parse(users) : demoAccounts;
  };

  const saveUser = (user: User) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('financebank_users', JSON.stringify(users));
  };

  const findUser = (email: string, password: string): User | null => {
    const users = getUsers();
    return users.find(user => user.email === email && user.password === password) || null;
  };

  const userExists = (email: string): boolean => {
    const users = getUsers();
    return users.some(user => user.email === email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (isLogin) {
        // Sign In Logic
        if (!formData.email || !formData.password) {
          throw new Error('Please fill in all required fields');
        }

        const user = findUser(formData.email, formData.password);
        if (!user) {
          throw new Error('Invalid email or password. Try one of the demo accounts below.');
        }

        setSuccess(`Welcome back, ${user.firstName}! Redirecting to dashboard...`);
        setTimeout(() => {
          onLogin(user);
        }, 1000);

      } else {
        // Sign Up Logic
        if (!formData.email || !formData.password || !formData.confirmPassword || 
            !formData.firstName || !formData.lastName || !formData.phone) {
          throw new Error('Please fill in all required fields');
        }

        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        if (userExists(formData.email)) {
          throw new Error('An account with this email already exists. Please sign in instead.');
        }

        // Create new user
        const newUser: User = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        };

        saveUser(newUser);
        setSuccess('Account created successfully! You can now sign in.');
        
        // Switch to login mode and clear form
        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            email: formData.email, // Keep email for convenience
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            phone: ''
          });
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }

    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleModeSwitch = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setError('');
    setSuccess('');
    // Clear form when switching modes
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: ''
    });
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setFormData(prev => ({
      ...prev,
      email: demoEmail,
      password: demoPassword
    }));
    setError('');
    setSuccess('');
  };

  // Show forgot password component
  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  const features = [
    { icon: Shield, text: 'Bank-level security with 256-bit encryption' },
    { icon: CheckCircle, text: 'FDIC insured up to $250,000' },
    { icon: Lock, text: 'Two-factor authentication protection' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left Side - Branding & Features */}
        <div className="flex flex-col justify-center space-y-8 lg:pr-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">FB</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">FinanceBank</h1>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Your Financial
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Future Starts Here
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Experience next-generation banking with advanced security, 
              intelligent insights, and seamless money management.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-blue-600">2M+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-green-600">$50B+</div>
                <div className="text-sm text-gray-600">Assets Managed</div>
              </div>
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="text-2xl font-bold text-purple-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
              
              {/* Form Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h3>
                <p className="text-gray-600">
                  {isLogin 
                    ? 'Sign in to access your financial dashboard' 
                    : 'Join millions who trust FinanceBank'
                  }
                </p>
              </div>

              {/* Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => handleModeSwitch(true)}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                    isLogin 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleModeSwitch(false)}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                    !isLogin 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Demo Accounts (Sign In Only) */}
              {isLogin && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">Try Demo Accounts:</h4>
                  <div className="space-y-2">
                    {demoAccounts.map((account, index) => (
                      <button
                        key={index}
                        onClick={() => handleDemoLogin(account.email, 'demo123')}
                        className="w-full text-left p-2 bg-white/60 hover:bg-white/80 rounded-md transition-colors border border-blue-200/50"
                      >
                        <div className="text-xs font-medium text-blue-900">{account.firstName} {account.lastName}</div>
                        <div className="text-xs text-blue-700">{account.email}</div>
                        <div className="text-xs text-blue-600">Password: demo123</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-700 text-sm">{success}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name Fields (Sign Up Only) */}
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="John"
                        required={!isLogin}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Doe"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone (Sign Up Only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="+91 98765 43210"
                      required={!isLogin}
                    />
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password * {!isLogin && <span className="text-xs text-gray-500">(min. 6 characters)</span>}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="••••••••"
                      required
                      minLength={!isLogin ? 6 : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Sign Up Only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="••••••••"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me / Forgot Password */}
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Terms (Sign Up Only) */}
                {!isLogin && (
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                      required
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                        Terms of Service
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                        Privacy Policy
                      </button>
                    </span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">or continue with</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                <button className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-5 h-5 bg-gray-900 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Apple</span>
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Protected by 256-bit SSL encryption • Your data is secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;