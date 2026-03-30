import { useState, useEffect, useCallback } from 'react';
import { Pill, Plus, Check, Clock, Trash2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/tw';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  lastTakenAt: string | null;
}

export default function Medications() {
  const { token } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [newName, setNewName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newFrequency, setNewFrequency] = useState('');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

  const fetchMedications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/medications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedications(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch medications:', err);
      setError('Could not load medications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [token, baseUrl]);

  useEffect(() => {
    if (token) {
      fetchMedications();
    }
  }, [token, fetchMedications]);

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const response = await axios.post(`${baseUrl}/medications`, 
        { name: newName, dosage: newDosage, frequency: newFrequency },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMedications([response.data, ...medications]);
      setNewName('');
      setNewDosage('');
      setNewFrequency('');
      setIsAdding(false);
    } catch (err) {
      console.error('Failed to add medication:', err);
      setError('Failed to add medication. Please try again.');
    }
  };

  const handleMarkAsTaken = async (id: string) => {
    try {
      const response = await axios.patch(`${baseUrl}/medications/${id}/taken`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedications(medications.map(m => m.id === id ? response.data : m));
    } catch (err) {
      console.error('Failed to mark as taken:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this medication?')) return;
    try {
      await axios.delete(`${baseUrl}/medications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedications(medications.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete medication:', err);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-maternal-900 tracking-tight">Medication Tracker</h1>
          <p className="text-maternal-600 mt-2 text-lg">Keep track of your prenatal vitamins and other prescribed medications.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={cn(
            "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm",
            isAdding 
              ? "bg-maternal-100 text-maternal-700 hover:bg-maternal-200" 
              : "bg-maternal-600 text-white hover:bg-maternal-700 hover:shadow-md active:scale-95"
          )}
        >
          {isAdding ? 'Cancel' : (
            <>
              <Plus className="w-5 h-5" />
              Add Medication
            </>
          )}
        </button>
      </header>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-in shake duration-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {isAdding && (
        <div className="mb-10 p-8 bg-white border border-maternal-100 rounded-2xl shadow-sm animate-in zoom-in-95 duration-300">
          <h3 className="text-xl font-bold text-maternal-900 mb-6 flex items-center gap-2">
            <Pill className="w-5 h-5 text-maternal-600" />
            New Medication
          </h3>
          <form onSubmit={handleAddMedication} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-maternal-700 ml-1">Medication Name</label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Prenatal Vitamins"
                className="w-full px-4 py-3 bg-maternal-50 border border-maternal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-maternal-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-maternal-700 ml-1">Dosage</label>
              <input 
                type="text" 
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                placeholder="e.g. 1 tablet"
                className="w-full px-4 py-3 bg-maternal-50 border border-maternal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-maternal-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-maternal-700 ml-1">Frequency</label>
              <input 
                type="text" 
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value)}
                placeholder="e.g. Once daily"
                className="w-full px-4 py-3 bg-maternal-50 border border-maternal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-maternal-500 focus:bg-white transition-all shadow-inner"
              />
            </div>
            <div className="md:col-span-3 pt-2">
              <button 
                type="submit"
                className="w-full md:w-auto px-10 py-3.5 bg-maternal-600 text-white rounded-xl font-bold hover:bg-maternal-700 transition-all shadow-md active:scale-95"
              >
                Save Medication
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
          <div className="w-12 h-12 border-4 border-maternal-200 border-t-maternal-600 rounded-full animate-spin mb-4" />
          <p className="text-maternal-500 font-medium">Loading your medications...</p>
        </div>
      ) : medications.length === 0 ? (
        <div className="text-center py-20 bg-white border border-maternal-100 rounded-3xl shadow-sm border-dashed">
          <div className="bg-maternal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Pill className="w-10 h-10 text-maternal-300" />
          </div>
          <h3 className="text-xl font-bold text-maternal-800">No medications logged yet</h3>
          <p className="text-maternal-500 mt-2 max-w-xs mx-auto">Click the button above to start tracking your prenatal medications.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {medications.map((m) => (
            <div key={m.id} className="bg-white p-6 rounded-2xl border border-maternal-100 shadow-sm hover:shadow-md transition-all group flex items-start justify-between">
              <div className="flex gap-4">
                <div className="bg-maternal-50 p-4 rounded-2xl text-maternal-600 shrink-0">
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-maternal-900 group-hover:text-maternal-600 transition-colors uppercase tracking-tight">{m.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm font-medium text-maternal-500">
                    <span className="flex items-center gap-1 bg-maternal-50 px-2.5 py-1 rounded-lg">
                      {m.dosage || 'No dosage set'}
                    </span>
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg">
                      {m.frequency || 'No frequency set'}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-maternal-400">
                    <Clock className="w-3.5 h-3.5" />
                    {m.lastTakenAt ? (
                      <span>Last taken: {new Date(m.lastTakenAt).toLocaleString()}</span>
                    ) : (
                      <span className="text-amber-500 italic">Not taken yet</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleMarkAsTaken(m.id)}
                  className="p-2.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm"
                  title="Mark as taken"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(m.id)}
                  className="p-2.5 text-maternal-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
