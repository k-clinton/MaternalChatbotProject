
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Baby, CalendarDays } from 'lucide-react';
import axios from 'axios';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  weeksPregnant: number;
}

export default function PregnancyTracker() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
        const response = await axios.get(`${baseUrl}/users/profile`, {
          headers: { 'x-user-id': 'test-user-id' }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading || !user) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-maternal-100 flex flex-col md:flex-row items-center gap-8">
        <div className="w-40 h-40 bg-maternal-50 rounded-full animate-pulse"></div>
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-maternal-50 rounded animate-pulse"></div>
          <div className="h-4 bg-maternal-50 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const currentWeek = user.weeksPregnant || 24;
  const daysRemaining = (40 - currentWeek) * 7;
  const progress = (currentWeek / 40) * 100;
  const circleCircumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circleCircumference - (progress / 100) * circleCircumference;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-maternal-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-maternal-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      {/* Visual Ring Tracker */}
      <div className="relative w-40 h-40 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle 
            className="text-maternal-100" 
            strokeWidth="8" 
            stroke="currentColor" 
            fill="transparent" 
            r="45" 
            cx="50" 
            cy="50" 
          />
          <motion.circle 
            className="text-maternal-500 drop-shadow-sm" 
            strokeWidth="8" 
            strokeDasharray={circleCircumference}
            initial={{ strokeDashoffset: circleCircumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            stroke="currentColor" 
            fill="transparent" 
            r="45" 
            cx="50" 
            cy="50" 
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-maternal-800">{currentWeek}</span>
          <span className="text-xs font-medium uppercase tracking-widest text-maternal-500">Weeks</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 text-center md:text-left z-10">
        <h3 className="text-xl font-semibold text-maternal-900 mb-2">Second Trimester</h3>
        <p className="text-maternal-600 mb-6 text-sm leading-relaxed">
          Your baby is about the size of an ear of corn. They are steadily putting on baby fat to stay warm after birth.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <div className="flex items-center gap-2 bg-maternal-50 px-4 py-2 rounded-xl border border-maternal-100">
             <CalendarDays className="w-4 h-4 text-maternal-500" />
             <span className="text-sm font-medium text-maternal-800">{daysRemaining} days strictly left</span>
          </div>
          <div className="flex items-center gap-2 bg-accent-light/10 px-4 py-2 rounded-xl border border-accent-light/20">
             <Baby className="w-4 h-4 text-accent-dark" />
             <span className="text-sm font-medium text-accent-dark">~1.3 lbs estimated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
