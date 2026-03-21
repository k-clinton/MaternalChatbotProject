import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Appointment {
  id: string;
  title: string;
  doctor: string;
  date: string;
  notes?: string;
}

export default function AppointmentsWidget() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
        const response = await axios.get(`${baseUrl}/appointments`, {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        setAppointments(response.data.slice(0, 3)); // Show only next 3
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAppointments();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-maternal-100">
        <h3 className="text-lg font-semibold text-maternal-800 mb-4">Upcoming Appointments</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-maternal-50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-maternal-100">
        <h3 className="text-lg font-semibold text-maternal-800 mb-4">Upcoming Appointments</h3>
        <p className="text-maternal-500 text-sm">No upcoming appointments</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-maternal-100">
      <h3 className="text-lg font-semibold text-maternal-800 mb-4">Upcoming Appointments</h3>
      <div className="space-y-4">
        {appointments.map((appointment) => {
          const date = new Date(appointment.date);
          return (
            <div key={appointment.id} className="flex items-center gap-4 p-4 rounded-2xl bg-maternal-50 border border-maternal-100">
              <div className="bg-white p-3 rounded-xl shadow-sm text-center min-w-[3.5rem]">
                <span className="block text-xs font-bold text-maternal-500 uppercase">
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="block text-xl font-bold text-maternal-900 leading-none">
                  {date.getDate()}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-maternal-900">{appointment.title}</h4>
                <p className="text-sm text-maternal-500">
                  {appointment.doctor} • {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
                {appointment.notes && (
                  <p className="text-xs text-maternal-400 mt-1">{appointment.notes}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}