import React, { useState } from 'react';
import { LogOut, Plus } from 'lucide-react';
import { signOut } from '../lib/supabase';

interface DashboardProps {
  onLogout: () => void;
}

function Dashboard({ onLogout }: DashboardProps) {
  const [tasks, setTasks] = useState([
    'Finish homework',
    'Call John',
    'Buy groceries'
  ]);
  const [newTask, setNewTask] = useState('');

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
    } catch (error) {
      console.error('Error signing out:', error);
      onLogout(); // Still logout on error
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        {/* Dashboard Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-slide-up">
              Your Tasks
            </h1>
          </div>

          {/* Tasks List */}
          <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <ul className="space-y-4">
                {tasks.map((task, index) => (
                  <li key={index} className="flex items-center text-lg text-gray-700">
                    <span className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-semibold text-sm mr-4">
                      {index + 1}
                    </span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Add Task Section */}
          <form onSubmit={handleAddTask} className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="mb-4">
              <label htmlFor="newTask" className="block text-sm font-semibold text-gray-700 mb-2">
                New Task
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  id="newTask"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="flex-1 px-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-50 focus:border-sky-400 transition-all duration-300 text-gray-800 placeholder-gray-400"
                  placeholder="Enter a new task..."
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
                >
                  <Plus className="w-5 h-5" />
                  Add Task
                </button>
              </div>
            </div>
          </form>

          {/* Logout Button */}
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleLogout}
              className="px-8 py-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-16 h-16 bg-sky-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-12 h-12 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}

export default Dashboard;