
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RiskAlerts() {
  // Mock data representing a potentially flagged symptom
  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Slightly elevated blood pressure",
      message: "Your recent logs show an upward trend. Discuss this at your next appointment.",
      time: "2 hours ago"
    }
  ];

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-maternal-800">Recent Insights</h3>
      {alerts.map((alert) => (
        <div key={alert.id} className="bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="mt-1 bg-orange-100 p-2 rounded-full text-orange-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-semibold text-orange-900">{alert.title}</h4>
              <span className="text-xs font-medium text-orange-500">{alert.time}</span>
            </div>
            <p className="text-sm text-orange-800 leading-relaxed mb-3">
              {alert.message}
            </p>
            <Link to="/chat" className="inline-flex items-center text-sm font-semibold text-orange-700 hover:text-orange-800 transition-colors">
              Chat with Assistant to analyze <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
