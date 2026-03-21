import { Phone, Calendar, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function HealthSummary() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-maternal-100 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-maternal-50">
        <div className="bg-maternal-50 p-2 rounded-xl text-maternal-600">
          <Shield className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-maternal-900">Health Summary</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3 group">
            <div className="bg-slate-50 p-2 rounded-lg text-slate-400 group-hover:text-maternal-500 transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-maternal-400 uppercase tracking-widest">Expected Due Date</p>
              <p className="text-sm font-bold text-maternal-800">
                {user.dueDate ? new Date(user.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 group">
            <div className="bg-slate-50 p-2 rounded-lg text-slate-400 group-hover:text-maternal-500 transition-colors">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-maternal-400 uppercase tracking-widest">Current Status</p>
              <p className="text-sm font-bold text-maternal-800 capitalize">{user.role || 'Pregnant'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 group">
            <div className="bg-red-50 p-2 rounded-lg text-red-400 group-hover:text-red-500 transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Emergency Contact</p>
              <p className="text-sm font-bold text-maternal-800 truncate">
                {user.emergencyContact || 'Not provided'}
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-[10px] font-bold text-maternal-400 uppercase tracking-widest mb-1">Clinic Reference</p>
            <div className="bg-maternal-50/50 p-3 rounded-xl border border-maternal-100 inline-block">
               <p className="text-xs font-medium text-maternal-600 italic leading-tight">Patient ID: {user.id.substring(0, 8)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
