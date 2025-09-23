import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onBack: () => void;
}

function LoginPage({ onBack }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Handle login logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Home
        </button>

        {/* Login Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 animate-slide-up">
              Login
            </h1>
            <p className="text-gray-600 font-light">
              Welcome back! Please sign in to your account.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-50 focus:border-sky-400 transition-all duration-300 text-gray-800 placeholder-gray-400"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Password Field */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-50 focus:border-sky-400 transition-all duration-300 text-gray-800 placeholder-gray-400"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Login Button */}
            <div className="pt-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <button
                type="submit"
                className="w-full px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-50"
              >
                Login
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <button className="text-sky-600 hover:text-sky-700 font-semibold hover:underline transition-colors duration-200">
                Sign up here
              </button>
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-16 h-16 bg-sky-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-12 h-12 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}

export default LoginPage;