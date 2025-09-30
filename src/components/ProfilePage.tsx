import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, User, Camera } from 'lucide-react';
import { getProfile, updateProfile, uploadProfilePicture, Profile } from '../lib/supabase';

interface ProfilePageProps {
  onBack: () => void;
}

function ProfilePage({ onBack }: ProfilePageProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data, error } = await getProfile();
      if (error && error.message !== 'User not authenticated') {
        setError(error.message);
      } else if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await uploadProfilePicture(file);
      if (error) {
        setError(error.message);
      } else if (data) {
        // Update profile with new avatar URL
        const { error: updateError } = await updateProfile({
          avatar_url: data.publicUrl
        });
        
        if (updateError) {
          setError(updateError.message);
        } else {
          setSuccess('Profile picture updated successfully!');
          // Reload profile to get updated data
          loadProfile();
        }
      }
    } catch (err) {
      setError('Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const { error } = await updateProfile({
        full_name: fullName.trim() || null
      });
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Profile updated successfully!');
        loadProfile();
      }
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Dashboard
        </button>

        {/* Profile Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-slide-up">
              Your Profile
            </h1>
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

          {/* Profile Picture Section */}
          <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Profile Picture</h2>
              
              {/* Profile Picture Display */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-6">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-lg border-4 border-white">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center shadow-lg">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    id="profile-picture-upload"
                  />
                  <label
                    htmlFor="profile-picture-upload"
                    className={`flex items-center gap-3 px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer ${
                      uploading ? 'opacity-50 cursor-not-allowed transform-none' : ''
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    {uploading ? 'Uploading...' : 'Upload Profile Picture'}
                  </label>
                </div>

                <p className="text-sm text-gray-500 mt-3 text-center">
                  Supported formats: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Information</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-300 focus:ring-opacity-50 focus:border-sky-400 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-16 h-16 bg-sky-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-12 h-12 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}

export default ProfilePage;