import { useState } from 'react';
import PregnancyTracker from '../components/Dashboard/PregnancyTracker';
import VitalsTracker from '../components/Dashboard/VitalsTracker';
import RiskAlerts from '../components/Dashboard/RiskAlerts';
import AppointmentsWidget from '../components/Dashboard/AppointmentsWidget';
import VitalsLogForm from '../components/Dashboard/VitalsLogForm';
import { Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useAuth();

  const handleLogSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setShowVitalsForm(false), 2000); // Close after 2 seconds
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-maternal-900 tracking-tight">
            Good morning, {user?.name.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-maternal-600 mt-2 text-lg">Here's your maternal health summary for today.</p>
        </div>
        <button 
          onClick={() => setShowVitalsForm(true)}
          className="inline-flex items-center justify-center gap-2 bg-maternal-600 hover:bg-maternal-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-sm"
        >
          <Stethoscope className="w-4 h-4" />
          Log Symptom
        </button>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PregnancyTracker key={`pregnancy-${refreshKey}`} />
          <VitalsTracker key={`vitals-${refreshKey}`} />
        </div>
        
        <div className="space-y-8">
          <RiskAlerts key={`alerts-${refreshKey}`} />
          
          <AppointmentsWidget key={`appointments-${refreshKey}`} />
        </div>
      </div>

      <VitalsLogForm 
        isOpen={showVitalsForm} 
        onClose={() => setShowVitalsForm(false)}
        onLogSuccess={handleLogSuccess}
      />
    </div>
  );
}
