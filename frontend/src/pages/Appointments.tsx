import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Plus, X, Trash2, Loader2, CheckCircle2, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Appointment {
  id: string;
  title: string;
  doctor: string;
  date: string;
  notes?: string;
}

const DOCTORS = [
  {
    id: 'dr-sarah-chen',
    name: 'Dr. Sarah Chen',
    specialty: 'OB/GYN Specialist',
    description: 'Expert in high-risk pregnancy and prenatal care.',
    phone: '(555) 123-4567',
    email: 's.chen@maternalcare.com',
    image: '/doctors/dr_sarah_chen_1774124103759.png'
  },
  {
    id: 'dr-marcus-johnson',
    name: 'Dr. Marcus Johnson',
    specialty: 'Senior Obstetrician',
    description: '15+ years experience in personalized delivery plans.',
    phone: '(555) 234-5678',
    email: 'm.johnson@maternalcare.com',
    image: '/doctors/dr_marcus_johnson_1774124132950.png'
  },
  {
    id: 'dr-elena-rodriguez',
    name: 'Dr. Elena Rodriguez',
    specialty: 'Maternal-Fetal Medicine',
    description: 'Specializing in genetic counseling and fetal wellness.',
    phone: '(555) 345-6789',
    email: 'e.rodriguez@maternalcare.com',
    image: '/doctors/dr_elena_rodriguez_portrait_1774124178479.png'
  },
  {
    id: 'dr-aisha-taylor',
    name: 'Dr. Aisha Taylor',
    specialty: 'Obstetrics & Gynecology',
    description: 'Compassionate care for first-time mothers.',
    phone: '(555) 456-7890',
    email: 'a.taylor@maternalcare.com',
    image: '/doctors/dr_aisha_taylor_1774124248626.png'
  }
];

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    doctor: '',
    date: '',
    time: '',
    notes: ''
  });
  const { token } = useAuth();

  const fetchAppointments = useCallback(async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const response = await axios.get(`${baseUrl}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token, fetchAppointments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctor) {
      alert('Please select a doctor');
      return;
    }
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const dateTime = `${formData.date}T${formData.time}`;
      await axios.post(`${baseUrl}/appointments`, 
        { ...formData, date: dateTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowForm(false);
      setFormData({ title: '', doctor: '', date: '', time: '', notes: '' });
      fetchAppointments();
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    setIsDeleting(id);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      await axios.delete(`${baseUrl}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maternal-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-maternal-900 tracking-tight">Your Appointments</h1>
          <p className="text-maternal-600 mt-1">Manage your upcoming prenatal checkups and consultations.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 bg-maternal-600 hover:bg-maternal-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-md active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Schedule New
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-maternal-200">
            <Calendar className="w-16 h-16 text-maternal-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-maternal-800">No appointments yet</h3>
            <p className="text-maternal-500 mt-2 max-w-xs mx-auto">
              Your scheduled medical visits will appear here. Click the button above to add one.
            </p>
          </div>
        ) : (
          appointments.map((apt) => {
            const date = new Date(apt.date);
            return (
              <div key={apt.id} className="group bg-white rounded-3xl p-6 shadow-sm border border-maternal-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(apt.id)}
                    disabled={isDeleting === apt.id}
                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
                    title="Cancel Appointment"
                  >
                    {isDeleting === apt.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>

                <div className="bg-maternal-50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px] border border-maternal-100">
                  <span className="text-xs font-bold text-maternal-500 uppercase tracking-widest">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-3xl font-black text-maternal-800 leading-tight">
                    {date.getDate()}
                  </span>
                  <span className="text-sm font-medium text-maternal-600">
                    {date.toLocaleDateString('en-US', { year: 'numeric' })}
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-maternal-100 text-maternal-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                      Confirmed
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-maternal-900 mb-2">{apt.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                    <div className="flex items-center text-maternal-600">
                      <User className="w-4 h-4 mr-2 text-maternal-400" />
                      <span className="font-medium">{apt.doctor}</span>
                    </div>
                    <div className="flex items-center text-maternal-600">
                      <Clock className="w-4 h-4 mr-2 text-maternal-400" />
                      <span className="font-medium">
                        {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  {apt.notes && (
                    <div className="mt-4 p-3 bg-maternal-50/50 rounded-xl border-l-4 border-maternal-200">
                      <p className="text-xs text-maternal-500 italic">"{apt.notes}"</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative my-8">
            <button 
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-2 hover:bg-maternal-50 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-maternal-400" />
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-maternal-900">Schedule Appointment</h2>
              <p className="text-maternal-500 text-sm">Fill in the details for your next visit.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-maternal-700 mb-2">Appointment Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Routine Ultrasound"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3.5 border border-maternal-200 rounded-2xl focus:ring-2 focus:ring-maternal-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-maternal-700 mb-3">Preferred Doctor</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DOCTORS.map((doc) => (
                    <div 
                      key={doc.id}
                      onClick={() => setFormData({ ...formData, doctor: doc.name })}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 ${formData.doctor === doc.name ? 'border-maternal-500 bg-maternal-50/50 shadow-sm' : 'border-maternal-100 hover:border-maternal-200 bg-white'}`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-maternal-100">
                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="pr-4 flex-1">
                        <p className="font-bold text-maternal-900 text-sm">{doc.name}</p>
                        <p className="text-[10px] font-bold text-maternal-500 mb-1 uppercase tracking-wider">{doc.specialty}</p>
                        <p className="text-[10px] text-maternal-400 leading-tight mb-2">{doc.description}</p>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-[9px] text-maternal-500">
                            <Phone className="w-2.5 h-2.5" />
                            {doc.phone}
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] text-maternal-500">
                            <Mail className="w-2.5 h-2.5" />
                            {doc.email}
                          </div>
                        </div>
                      </div>
                      {formData.doctor === doc.name && (
                        <div className="absolute top-2 right-2 text-maternal-600">
                          <CheckCircle2 className="w-5 h-5 fill-maternal-50" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-maternal-700 mb-2">Date</label>
                  <input
                    required
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-3.5 border border-maternal-200 rounded-2xl focus:ring-2 focus:ring-maternal-500 focus:border-transparent outline-none transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-maternal-700 mb-2">Time</label>
                  <input
                    required
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-3.5 border border-maternal-200 rounded-2xl focus:ring-2 focus:ring-maternal-500 focus:border-transparent outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-maternal-700 mb-2">Notes (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Anything specific to discuss?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3.5 border border-maternal-200 rounded-2xl focus:ring-2 focus:ring-maternal-500 focus:border-transparent outline-none transition-all shadow-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-maternal-600 hover:bg-maternal-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-maternal-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Schedule Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
