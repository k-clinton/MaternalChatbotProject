
import PregnancyTracker from '../components/Dashboard/PregnancyTracker';
import VitalsTracker from '../components/Dashboard/VitalsTracker';
import RiskAlerts from '../components/Dashboard/RiskAlerts';
import { Stethoscope } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-maternal-900 tracking-tight">Good morning, Jane! 👋</h1>
          <p className="text-maternal-600 mt-2 text-lg">Here's your maternal health summary for today.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-maternal-600 hover:bg-maternal-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors shadow-sm">
          <Stethoscope className="w-4 h-4" />
          Log Symptom
        </button>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PregnancyTracker />
          <VitalsTracker />
        </div>
        
        <div className="space-y-8">
          <RiskAlerts />
          
          {/* Upcoming Appointments Mini Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-maternal-100">
            <h3 className="text-lg font-semibold text-maternal-800 mb-4">Upcoming Appointments</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-maternal-50 border border-maternal-100">
                <div className="bg-white p-3 rounded-xl shadow-sm text-center min-w-[3.5rem]">
                  <span className="block text-xs font-bold text-maternal-500 uppercase">Oct</span>
                  <span className="block text-xl font-bold text-maternal-900 leading-none">14</span>
                </div>
                <div>
                  <h4 className="font-semibold text-maternal-900">OB/GYN Checkup</h4>
                  <p className="text-sm text-maternal-500">Dr. Sarah Jenkins • 10:00 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
