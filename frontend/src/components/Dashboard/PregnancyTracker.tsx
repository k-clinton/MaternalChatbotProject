import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Baby, CalendarDays } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  weeksPregnant: number;
  dueDate: string;
}

const getTrimesterInfo = (weeks: number) => {
  if (weeks <= 12) return { text: "First Trimester", size: "the size of an olive" };
  if (weeks <= 26) return { text: "Second Trimester", size: "the size of an ear of corn" };
  return { text: "Third Trimester", size: "the size of a pineapple" };
};

export default function PregnancyTracker() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
        const response = await axios.get(`${baseUrl}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUser();
  }, [token]);

  if (loading || (!profile && !user)) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-maternal-100 h-48 animate-pulse"></div>
    );
  }

  const currentWeek = profile?.weeksPregnant || user?.weeksPregnant || 0;
  const dueDate = profile?.dueDate || user?.dueDate;
  
  // Calculate days remaining using due date if available
  let daysRemaining = (40 - currentWeek) * 7;
  if (dueDate) {
    const diffTime = new Date(dueDate).getTime() - new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const { text: trimester, size } = getTrimesterInfo(currentWeek);
  const progress = Math.min(100, (currentWeek / 40) * 100);
  const circleCircumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circleCircumference - (progress / 100) * circleCircumference;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-maternal-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-maternal-500 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <div className="relative w-40 h-40 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle className="text-maternal-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
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

      <div className="flex-1 text-center md:text-left z-10">
        <h3 className="text-xl font-bold text-maternal-900 mb-2">{trimester}</h3>
        <p className="text-maternal-600 mb-6 text-sm leading-relaxed">
          Your baby is about {size}. They are developing rapidly and hitting critical milestones every day.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <div className="flex items-center gap-2 bg-maternal-50 px-4 py-2 rounded-xl border border-maternal-100">
             <CalendarDays className="w-4 h-4 text-maternal-500" />
             <span className="text-sm font-medium text-maternal-800">{daysRemaining} days remaining</span>
          </div>
          <div className="flex items-center gap-2 bg-accent-light/10 px-4 py-2 rounded-xl border border-accent-light/20">
             <Baby className="w-4 h-4 text-accent-dark" />
             <span className="text-sm font-medium text-accent-dark">Week {currentWeek} Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
}
