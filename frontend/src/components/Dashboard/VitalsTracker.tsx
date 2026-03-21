
import { useState, useEffect } from 'react';
import { Activity, HeartPulse, Scale } from 'lucide-react';
import axios from 'axios';
import { cn } from '../../utils/tw';

interface VitalsLog {
  id: string;
  bloodPressure: string | null;
  weight: number | null;
  fetalMovement: number | null;
  loggedAt: string;
}

interface VitalsWidgetProps {
  title: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'alert';
  trend: string;
  icon: React.ElementType;
}

interface VitalsWidgetProps {
  title: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'alert';
  trend: string;
  icon: React.ElementType;
}

const statusColors = {
  normal: "bg-maternal-100 text-maternal-700",
  warning: "bg-yellow-100 text-yellow-700",
  alert: "bg-red-100 text-red-700"
};

const bgColors = {
  normal: "hover:bg-maternal-50/50",
  warning: "hover:bg-yellow-50/50",
  alert: "hover:bg-red-50/50"
};

function VitalsWidget({ title, value, unit, status, trend, icon: Icon }: VitalsWidgetProps) {
  return (
    <div className={cn(
      "p-5 rounded-2xl border bg-white transition-colors duration-200 cursor-default",
      status === 'normal' ? "border-maternal-100" : status === 'warning' ? "border-yellow-200" : "border-red-200",
      bgColors[status]
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-xl", statusColors[status])}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={cn(
          "text-xs font-semibold px-2 py-1 rounded-full",
          status === 'normal' ? "bg-maternal-50 text-maternal-600" :
          status === 'warning' ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
        )}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-maternal-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-maternal-900">{value}</span>
          <span className="text-sm font-medium text-maternal-500">{unit}</span>
        </div>
        <p className="text-sm text-maternal-400 mt-2">{trend}</p>
      </div>
    </div>
  );
}

export default function VitalsTracker() {
  const [vitals, setVitals] = useState<VitalsLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
        const response = await axios.get(`${baseUrl}/vitals`, {
          headers: { 'x-user-id': 'test-user-id' }
        });
        setVitals(response.data);
      } catch (error) {
        console.error('Failed to fetch vitals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVitals();
  }, []);

  const getLatestValue = (field: keyof VitalsLog) => {
    if (vitals.length === 0) return null;
    const latest = vitals[0];
    return latest[field];
  };

  const getStatus = (value: any, type: string) => {
    if (!value) return 'normal';
    
    switch (type) {
      case 'bloodPressure':
        const parts = value.split('/');
        if (parts.length === 2) {
          const systolic = parseInt(parts[0], 10);
          return systolic >= 140 ? 'alert' : systolic >= 130 ? 'warning' : 'normal';
        }
        return 'normal';
      case 'fetalMovement':
        return value < 3 ? 'alert' : value < 10 ? 'warning' : 'normal';
      default:
        return 'normal';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl border bg-white border-maternal-100 animate-pulse">
            <div className="h-20 bg-maternal-50 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <VitalsWidget 
        title="Blood Pressure" 
        value={getLatestValue('bloodPressure')?.toString() || 'Not logged'} 
        unit="mmHg" 
        status={getStatus(getLatestValue('bloodPressure'), 'bloodPressure')} 
        trend="Latest reading" 
        icon={HeartPulse} 
      />
      <VitalsWidget 
        title="Weight Logged" 
        value={getLatestValue('weight')?.toString() || 'Not logged'} 
        unit="lbs" 
        status="normal" 
        trend="Latest reading" 
        icon={Scale} 
      />
      <VitalsWidget 
        title="Fetal Movement" 
        value={getLatestValue('fetalMovement')?.toString() || 'Not logged'} 
        unit="kicks/hr" 
        status={getStatus(getLatestValue('fetalMovement'), 'fetalMovement')} 
        trend="Latest reading" 
        icon={Activity} 
      />
    </div>
  );
}
