
import { Activity, HeartPulse, Scale } from 'lucide-react';
import { cn } from '../../utils/tw';

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <VitalsWidget 
        title="Blood Pressure" 
        value="118/75" 
        unit="mmHg" 
        status="normal" 
        trend="Stable since last week" 
        icon={HeartPulse} 
      />
      <VitalsWidget 
        title="Weight Logged" 
        value="152" 
        unit="lbs" 
        status="normal" 
        trend="+1.2 lbs this week" 
        icon={Scale} 
      />
      <VitalsWidget 
        title="Fetal Movement" 
        value="14" 
        unit="kicks/hr" 
        status="normal" 
        trend="Active in evening" 
        icon={Activity} 
      />
    </div>
  );
}
