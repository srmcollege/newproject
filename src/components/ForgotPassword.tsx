import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Key } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
}

interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const getUsers = (): User[] => {
    const users = localStorage.getItem('financebank_users');
    return users ? JSON.parse(users) : [];
  };

  const updateUser = (email: string, newPassword: string) => {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('financebank_users', JSON.stringify(users));
      return true;
    }
    return false;
  };

  const userExists = (email: string): boolean => {
    const users = getUsers();
    return users.some(user => user.email === email);
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (!email) {
        throw new Error('Please enter your email address');
      }

      if (!userExists(email)) {
        throw new Error('No account found with this email address');
      }

      // Generate a 6-digit reset code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);

      setSuccess(`Reset code sent to ${email}. For demo purposes, your code is: ${code}`);
      setStep('code');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset code');
    }

    setLoading(false);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (!resetCode) {
        throw new Error('Please enter the reset code');
      }

      if (resetCode !== generatedCode) {
        throw new Error('Invalid reset code. Please check and try again.');
      }

      setSuccess('Code verified successfully! Please set your new password.');
      setStep('reset');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Code verification failed');
    }

    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (!newPassword || !confirmPassword) {
        throw new Error('Please fill in all password fields');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const updated = updateUser(email, newPassword);
      if (!updated) {
        throw new Error('Failed to update password. Please try again.');
      }

      setSuccess('Password reset successfully! You can now sign in with your new password.');
      
      // Redirect back to login after 2 seconds
      setTimeout(() => {
        onBack();
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    }

    setLoading(false);
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate new code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setSuccess(`New reset code sent! For demo purposes, your code is: ${code}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Sign In</span>
            </button>
            
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {step === 'email' && <Mail className="w-8 h-8 text-blue-600" />}
              {step === 'code' && <Key className="w-8 h-8 text-blue-600" />}
              {step === 'reset' && <CheckCircle className="w-8 h-8 text-blue-600" />}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 'email' && 'Forgot Password?'}
              {step === 'code' && 'Enter Reset Code'}
              {step === 'reset' && 'Set New Password'}
            </h3>
            
            <p className="text-gray-600">
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'code' && 'We sent a 6-digit code to your email'}
              {step === 'reset' && 'Choose a strong password for your account'}
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 'email' && (
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Send Reset Code</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Code Verification */}
          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reset Code
                </label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Verify Code</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Password Reset */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter new password"
                  minLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm new password"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Demo Info */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Demo Mode:</strong> This is a demonstration. In a real application, 
              reset codes would be sent via email and passwords would be securely hashed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;