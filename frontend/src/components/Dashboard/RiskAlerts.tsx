import { useState, useEffect } from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Alert {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
}

export default function RiskAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
        const response = await axios.get(`${baseUrl}/vitals/alerts`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        setAlerts(response.data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAlerts();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-maternal-100">
        <h3 className="text-lg font-semibold text-maternal-800 mb-4">Recent Insights</h3>
        <div className="animate-pulse">
          <div className="h-20 bg-maternal-50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

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
