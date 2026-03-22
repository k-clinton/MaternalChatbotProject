import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Bell, Shield, Save, Loader2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    weeksPregnant: user?.weeksPregnant?.toString() || '',
    dueDate: user?.dueDate || '',
    emergencyContact: user?.emergencyContact || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        weeksPregnant: user.weeksPregnant?.toString() || '',
        dueDate: user.dueDate ? new Date(user.dueDate).toISOString().split('T')[0] : '',
        emergencyContact: user.emergencyContact || ''
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const response = await axios.put(
        `${baseUrl}/users/profile`,
        {
          ...formData,
          weeksPregnant: formData.weeksPregnant ? parseInt(formData.weeksPregnant) : null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update local auth context with new user data
      // Note: Assuming login(data) updates the user object
      if (response.data) {
        // We don't have a direct 'updateUser' in AuthContext, 
        // so we'll just show success and rely on the next refresh or manual update if possible
        // Better: login(response.data.user, token) if the response has it
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-maternal-900 tracking-tight">Settings</h1>
        <p className="text-maternal-600 mt-2 text-lg">Manage your health profile and account preferences.</p>
      </header>
      
      <div className="space-y-8">
        {/* Profile Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-maternal-100 overflow-hidden">
          <div className="p-8 border-b border-maternal-50 bg-maternal-50/30 flex items-center gap-3">
            <div className="bg-maternal-100 p-2 rounded-xl text-maternal-600">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-maternal-900">Your Profile</h2>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-maternal-700 ml-1">Full Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-2xl border border-maternal-200 focus:ring-2 focus:ring-maternal-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-maternal-700 ml-1">Weeks Pregnant</label>
                <input 
                  type="number"
                  value={formData.weeksPregnant}
                  onChange={(e) => setFormData({...formData, weeksPregnant: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-2xl border border-maternal-200 focus:ring-2 focus:ring-maternal-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. 24"
                  min="0"
                  max="45"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-maternal-700 ml-1">Due Date</label>
                <input 
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-2xl border border-maternal-200 focus:ring-2 focus:ring-maternal-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-maternal-700 ml-1">Emergency Contact</label>
                <input 
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-2xl border border-maternal-200 focus:ring-2 focus:ring-maternal-500 focus:border-transparent outline-none transition-all"
                  placeholder="Name and Phone Number"
                />
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {message.text}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                disabled={isSaving}
                className="bg-maternal-600 hover:bg-maternal-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </form>
        </section>

        {/* Notifications Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-maternal-100 overflow-hidden">
          <div className="p-8 border-b border-maternal-50 bg-maternal-50/30 flex items-center gap-3">
            <div className="bg-maternal-100 p-2 rounded-xl text-maternal-600">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-maternal-900">Notifications</h2>
          </div>
          
          <div className="p-8 space-y-6">
             <div className="flex items-center justify-between group">
               <div>
                 <p className="font-bold text-maternal-800">Email Alerts</p>
                 <p className="text-sm text-maternal-500">Receive weekly pregnancy updates and checklists</p>
               </div>
               <div className="w-12 h-6 bg-maternal-600 rounded-full relative cursor-pointer shadow-inner">
                 <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-md"></div>
               </div>
             </div>
             <div className="flex items-center justify-between group">
               <div>
                 <p className="font-bold text-maternal-800">SMS Reminders</p>
                 <p className="text-sm text-maternal-500">Get text reminders 2 hours before appointments</p>
               </div>
               <div className="w-12 h-6 bg-maternal-200 rounded-full relative cursor-pointer shadow-inner">
                 <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-md transition-all group-active:scale-95"></div>
               </div>
             </div>
          </div>
        </section>

        {/* Account Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-maternal-100 overflow-hidden">
          <div className="p-8 border-b border-maternal-50 bg-maternal-50/30 flex items-center gap-3">
            <div className="bg-maternal-100 p-2 rounded-xl text-maternal-600">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-maternal-900">Account & Security</h2>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
             <button className="flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-maternal-50 text-maternal-700 font-bold transition-all border border-maternal-100 hover:border-maternal-200 group">
               <div className="bg-white p-2 rounded-lg shadow-xs group-hover:shadow-sm">
                 <Shield className="w-4 h-4" />
               </div>
               Change Password
             </button>
             <button 
               onClick={handleLogout}
               className="flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-red-50 text-red-600 font-bold transition-all border border-red-100 hover:border-red-200 group"
             >
               <div className="bg-white p-2 rounded-lg shadow-xs group-hover:shadow-sm">
                 <LogOut className="w-4 h-4" />
               </div>
               Sign Out
             </button>
          </div>
        </section>
      </div>
    </div>
  );
}
