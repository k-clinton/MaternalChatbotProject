import { useState } from 'react';
import { X, Activity, HeartPulse, Scale } from 'lucide-react';
import axios from 'axios';

interface VitalsLogFormProps {
  isOpen: boolean;
  onClose: () => void;
  onLogSuccess: () => void;
}

export default function VitalsLogForm({ isOpen, onClose, onLogSuccess }: VitalsLogFormProps) {
  const [formData, setFormData] = useState({
    bloodPressure: '',
    weight: '',
    fetalMovement: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ isRisk: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const response = await axios.post(`${baseUrl}/vitals/log`, {
        bloodPressure: formData.bloodPressure || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        fetalMovement: formData.fetalMovement ? parseInt(formData.fetalMovement) : null
      }, {
        headers: { 'x-user-id': 'test-user-id' }
      });

      if (response.data.alert) {
        setAlert(response.data.alert);
      }

      // Reset form
      setFormData({ bloodPressure: '', weight: '', fetalMovement: '' });
      onLogSuccess();
    } catch (error) {
      console.error('Failed to log vitals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-maternal-900">Log Vitals</h2>
          <button onClick={onClose} className="p-2 hover:bg-maternal-50 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {alert && (
          <div className={`p-4 rounded-2xl mb-4 ${alert.isRisk ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-sm ${alert.isRisk ? 'text-red-800' : 'text-green-800'}`}>
              {alert.message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-maternal-700 mb-2">
              <HeartPulse className="w-4 h-4" />
              Blood Pressure (optional)
            </label>
            <input
              type="text"
              placeholder="120/80"
              value={formData.bloodPressure}
              onChange={(e) => setFormData(prev => ({ ...prev, bloodPressure: e.target.value }))}
              className="w-full p-3 border border-maternal-200 rounded-xl focus:ring-2 focus:ring-maternal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-maternal-700 mb-2">
              <Scale className="w-4 h-4" />
              Weight in lbs (optional)
            </label>
            <input
              type="number"
              placeholder="150"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              className="w-full p-3 border border-maternal-200 rounded-xl focus:ring-2 focus:ring-maternal-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-maternal-700 mb-2">
              <Activity className="w-4 h-4" />
              Fetal Movement (kicks in 2 hours, optional)
            </label>
            <input
              type="number"
              placeholder="10"
              value={formData.fetalMovement}
              onChange={(e) => setFormData(prev => ({ ...prev, fetalMovement: e.target.value }))}
              className="w-full p-3 border border-maternal-200 rounded-xl focus:ring-2 focus:ring-maternal-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maternal-600 hover:bg-maternal-700 disabled:bg-maternal-400 text-white py-3 rounded-xl font-medium transition-colors"
          >
            {loading ? 'Logging...' : 'Log Vitals'}
          </button>
        </form>
      </div>
    </div>
  );
}