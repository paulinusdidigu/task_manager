import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Trash2, Sparkles, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  signOut, 
  getTasks, 
  createTask, 
  updateTaskStatus, 
  updateTaskPriority, 
  deleteTask, 
  Task,
  getSubtasks,
  createSubtask,
  updateSubtaskStatus,
  deleteSubtask,
  generateSubtasks,
  Subtask
} from '../lib/supabase';

interface DashboardProps {
  onLogout: () => void;
}

function Dashboard({ onLogout }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Record<string, Subtask[]>>({});
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [generatingSubtasks, setGeneratingSubtasks] = useState<Record<string, boolean>>({});
  const [suggestedSubtasks, setSuggestedSubtasks] = useState<Record<string, string[]>>({});
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data, error } = await getTasks();
      if (error) {
        setError(error.message);
      } else {
        setTasks(data || []);
        // Load subtasks for each task
        if (data) {
          const subtaskPromises = data.map(task => loadSubtasks(task.id));
          await Promise.all(subtaskPromises);
        }
      }
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadSubtasks = async (taskId: string) => {
    try {
      const { data, error } = await getSubtasks(taskId);
      if (error) {
        console.error('Failed to load subtasks:', error);
      } else {
        setSubtasks(prev => ({ ...prev, [taskId]: data || [] }));
      }
    } catch (err) {
      console.error('Failed to load subtasks:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
    } catch (error) {
      console.error('Error signing out:', error);
      onLogout(); // Still logout on error
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const { data, error } = await createTask(newTask.trim(), newTaskPriority);
      if (error) {
        setError(error.message);
      } else if (data) {
        setTasks([data[0], ...tasks]);
        setSubtasks(prev => ({ ...prev, [data[0].id]: [] }));
        setNewTask('');
        setNewTaskPriority('medium');
      }
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: 'pending' | 'in-progress' | 'done') => {
    try {
      const { error } = await updateTaskStatus(taskId, newStatus);
      if (error) {
        setError(error.message);
      } else {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        ));
      }
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const handlePriorityChange = async (taskId: string, newPriority: 'low' | 'medium' | 'high') => {
    try {
      const { error } = await updateTaskPriority(taskId, newPriority);
      if (error) {
        setError(error.message);
      } else {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, priority: newPriority } : task
        ));
      }
    } catch (err) {
      setError('Failed to update task priority');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await deleteTask(taskId);
      if (error) {
        setError(error.message);
      } else {
        setTasks(tasks.filter(task => task.id !== taskId));
        setSubtasks(prev => {
          const newSubtasks = { ...prev };
          delete newSubtasks[taskId];
          return newSubtasks;
        });
        setSuggestedSubtasks(prev => {
          const newSuggested = { ...prev };
          delete newSuggested[taskId];
          return newSuggested;
        });
      }
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleGenerateSubtasks = async (taskId: string, taskTitle: string) => {
    setGeneratingSubtasks(prev => ({ ...prev, [taskId]: true }));
    setError('');
    
    try {
      const { data, error } = await generateSubtasks(taskTitle);
      if (error) {
        setError(error.message);
      } else if (data) {
        setSuggestedSubtasks(prev => ({ ...prev, [taskId]: data }));
        setExpandedTasks(prev => new Set([...prev, taskId]));
      }
    } catch (err) {
      setError('Failed to generate subtasks');
    } finally {
      setGeneratingSubtasks(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const handleSaveSubtask = async (taskId: string, subtaskTitle: string) => {
    try {
      const { data, error } = await createSubtask(subtaskTitle, taskId);
      if (error) {
        setError(error.message);
      } else if (data) {
        setSubtasks(prev => ({
          ...prev,
          [taskId]: [...(prev[taskId] || []), data[0]]
        }));
        // Remove from suggestions
        setSuggestedSubtasks(prev => ({
          ...prev,
          [taskId]: prev[taskId]?.filter(title => title !== subtaskTitle) || []
        }));
      }
    } catch (err) {
      setError('Failed to save subtask');
    }
  };

  const handleSubtaskStatusChange = async (subtaskId: string, newStatus: 'pending' | 'in-progress' | 'done', taskId: string) => {
    try {
      const { error } = await updateSubtaskStatus(subtaskId, newStatus);
      if (error) {
        setError(error.message);
      } else {
        setSubtasks(prev => ({
          ...prev,
          [taskId]: prev[taskId]?.map(subtask =>
            subtask.id === subtaskId ? { ...subtask, status: newStatus } : subtask
          ) || []
        }));
      }
    } catch (err) {
      setError('Failed to update subtask status');
    }
  };

  const handleDeleteSubtask = async (subtaskId: string, taskId: string) => {
    try {
      const { error } = await deleteSubtask(subtaskId);
      if (error) {
        setError(error.message);
      } else {
        setSubtasks(prev => ({
          ...prev,
          [taskId]: prev[taskId]?.filter(subtask => subtask.id !== subtaskId) || []
        }));
      }
    } catch (err) {
      setError('Failed to delete subtask');
    }
  };

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading tasks...</div>
      </div>
    );
  }

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
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Tasks List */}
          <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {tasks.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tasks yet. Add your first task below!</p>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <div key={task.id} className="bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center flex-1">
                          <button
                            onClick={() => toggleTaskExpansion(task.id)}
                            className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-semibold text-sm mr-4 flex-shrink-0 hover:bg-sky-200 transition-colors duration-200"
                          >
                            {expandedTasks.has(task.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <div className="flex-1">
                            <h3 className="text-lg text-gray-800 font-medium mb-2">{task.title}</h3>
                            <div className="flex flex-wrap gap-2">
                              <select
                                value={task.priority}
                                onChange={(e) => handlePriorityChange(task.id, e.target.value as 'low' | 'medium' | 'high')}
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)} focus:outline-none focus:ring-2 focus:ring-sky-300`}
                              >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                              </select>
                              <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value as 'pending' | 'in-progress' | 'done')}
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)} focus:outline-none focus:ring-2 focus:ring-sky-300`}
                              >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* AI Subtask Generation Button */}
                      <div className="px-4 pb-4">
                        <button
                          onClick={() => handleGenerateSubtasks(task.id, task.title)}
                          disabled={generatingSubtasks[task.id]}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white text-sm font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                        >
                          <Sparkles className="w-4 h-4" />
                          {generatingSubtasks[task.id] ? 'Generating...' : 'Generate Subtasks with AI'}
                        </button>
                      </div>

                      {/* Expanded Content */}
                      {expandedTasks.has(task.id) && (
                        <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                          {/* Suggested Subtasks */}
                          {suggestedSubtasks[task.id] && suggestedSubtasks[task.id].length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">AI Suggestions:</h4>
                              <div className="space-y-2">
                                {suggestedSubtasks[task.id].map((suggestion, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg border border-purple-100">
                                    <span className="text-sm text-gray-700 flex-1">{suggestion}</span>
                                    <button
                                      onClick={() => handleSaveSubtask(task.id, suggestion)}
                                      className="ml-2 flex items-center gap-1 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded transition-colors duration-200"
                                    >
                                      <Save className="w-3 h-3" />
                                      Save
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Existing Subtasks */}
                          {subtasks[task.id] && subtasks[task.id].length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">Subtasks:</h4>
                              <div className="space-y-2">
                                {subtasks[task.id].map((subtask) => (
                                  <div key={subtask.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                                    <div className="flex items-center flex-1">
                                      <span className="text-sm text-gray-700 flex-1">{subtask.title}</span>
                                      <select
                                        value={subtask.status}
                                        onChange={(e) => handleSubtaskStatusChange(subtask.id, e.target.value as 'pending' | 'in-progress' | 'done', task.id)}
                                        className={`ml-2 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(subtask.status)} focus:outline-none focus:ring-1 focus:ring-sky-300`}
                                      >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="done">Done</option>
                                      </select>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteSubtask(subtask.id, task.id)}
                                      className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                                      title="Delete subtask"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                  required
                />
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="px-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-50 focus:border-sky-400 transition-all duration-300 text-gray-800 min-w-[160px]"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
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