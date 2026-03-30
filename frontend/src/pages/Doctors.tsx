import { useState, useEffect } from 'react';
import { Star, MapPin, Calendar, Search, Filter, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  experience: number;
  rating: number;
  imageUrl: string;
}

export default function Doctors() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
        const response = await axios.get(`${baseUrl}/doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(response.data);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchDoctors();
    }
  }, [token]);

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookAppointment = (doctorId: string) => {
    // Navigate to appointments with doctorId as state
    navigate('/appointments', { state: { doctorId } });
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-maternal-900 tracking-tight">Our Specialists</h1>
        <p className="text-maternal-600 mt-2 text-lg">Connect with highly qualified obstetricians and prenatal care experts.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-maternal-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by doctor name, specialty, or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-maternal-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-maternal-500 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-maternal-200 rounded-2xl text-maternal-700 font-bold hover:bg-maternal-50 transition-all">
          <Filter className="w-5 h-5" />
          More Filters
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Loader2 className="w-12 h-12 text-maternal-600 animate-spin mb-4" />
          <p className="text-maternal-500 font-medium">Finding specialists for you...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-3xl border border-maternal-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
              <div className="relative h-48 bg-maternal-100 overflow-hidden">
                <img 
                  src={doctor.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400"} 
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-maternal-900">{doctor.rating}</span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-maternal-900 group-hover:text-maternal-600 transition-colors uppercase tracking-tight line-clamp-1">{doctor.name}</h3>
                  <p className="text-maternal-500 font-bold text-sm mt-1">{doctor.specialty}</p>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2.5 text-maternal-600 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-maternal-400" />
                    <span className="truncate">{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-maternal-600 text-sm font-medium">
                    <Calendar className="w-4 h-4 text-maternal-400" />
                    <span>{doctor.experience} Years Experience</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleBookAppointment(doctor.id)}
                  className="w-full py-4 bg-maternal-50 text-maternal-700 font-bold rounded-2xl hover:bg-maternal-600 hover:text-white transition-all flex items-center justify-center gap-2 mt-auto"
                >
                  Book Appointment
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
