import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { signUp } from '../lib/supabase';

interface SignupPageProps {
  onBack: () => void;
  onSignupSuccess: () => void;
}

function SignupPage({ onBack, onSignupSuccess }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await signUp(email, password, name);
      
      if (error) {
        setError(error.message);
      } else if (data.user) {
        setSuccess('Account created successfully! You can now login.');
        // Clear form
        setName('');
        setEmail('');
        setPassword('');
        // Redirect to login after a short delay
        setTimeout(() => {
          onSignupSuccess();
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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

        {/* Signup Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 animate-slide-up">
              Create Account
            </h1>
            <p className="text-gray-600 font-light">
              Join us today! Please fill in your details to get started.
            </p>
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-50 focus:border-sky-400 transition-all duration-300 text-gray-800 placeholder-gray-400"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Field */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
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
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-50 focus:border-sky-400 transition-all duration-300 text-gray-800 placeholder-gray-400"
                placeholder="Create a secure password"
                required
              />
            </div>

            {/* Signup Button */}
            <div className="pt-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
              >
                {loading ? 'Creating account...' : 'Signup'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <button className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200">
                Login here
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

export default SignupPage;