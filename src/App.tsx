import React from 'react';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

function App() {
  const [currentPage, setCurrentPage] = React.useState<'home' | 'login' | 'signup' | 'dashboard'>('home');

  const handleLogin = () => {
    setCurrentPage('login');
  };

  const handleSignup = () => {
    setCurrentPage('signup');
  };

  const handleDashboard = () => {
    console.log('Navigate to dashboard');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'login') {
    return <LoginPage onBack={handleBack} />;
  }

  if (currentPage === 'signup') {
    return <SignupPage onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        {/* Main Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 animate-fade-in">
          {/* Header Section */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight animate-slide-up">
              Welcome to My Task Manager
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              Organize your life, boost your productivity, and achieve your goals with our intuitive task management solution.
            </p>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center items-center max-w-3xl mx-auto">
            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-50 min-w-[180px] animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              Login
            </button>

            {/* Signup Button */}
            <button
              onClick={handleSignup}
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 min-w-[180px] animate-slide-up"
              style={{ animationDelay: '0.4s' }}
            >
              Signup
            </button>

            {/* Dashboard Button */}
            <button
              onClick={handleDashboard}
              className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50 min-w-[180px] animate-slide-up"
              style={{ animationDelay: '0.6s' }}
            >
              Go to Dashboard
            </button>
          </div>

          {/* Footer Section */}
          <div className="text-center mt-12 md:mt-16">
            <p className="text-gray-500 text-sm md:text-base font-light">
              Start your journey to better productivity today
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-sky-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-cyan-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
}

export default App;