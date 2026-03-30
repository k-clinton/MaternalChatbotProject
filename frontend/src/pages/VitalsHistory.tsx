import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, HeartPulse, Scale, LineChart as ChartIcon, Table as TableIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/tw';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
interface VitalsLog {
  id: string;
  bloodPressure: string | null;
  weight: number | null;
  fetalMovement: number | null;
  loggedAt: string;
}

export default function VitalsHistory() {
  const { token } = useAuth();
  const [vitals, setVitals] = useState<VitalsLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
        const response = await axios.get(`${baseUrl}/vitals`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVitals(response.data);
      } catch (error) {
        console.error('Failed to fetch vitals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVitals();
  }, [token]);

  // Process data for charts
  const chartData = [...vitals].reverse().map(log => {
    const [systolic, diastolic] = log.bloodPressure?.split('/')?.map(Number) || [null, null];
    return {
      date: new Date(log.loggedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      systolic,
      diastolic,
      weight: log.weight,
      fetalMovement: log.fetalMovement
    };
  });

  const getStatus = (log: VitalsLog) => {
    let status: 'normal' | 'warning' | 'alert' = 'normal';
    
    if (log.bloodPressure) {
      const systolic = parseInt(log.bloodPressure.split('/')[0], 10);
      if (systolic >= 140) status = 'alert';
      else if (systolic >= 130) status = 'warning';
    }
    
    if (log.fetalMovement !== null) {
      if (log.fetalMovement < 3) status = 'alert';
      else if (log.fetalMovement < 10 && status !== 'alert') status = 'warning';
    }
    
    return status;
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-maternal-900 tracking-tight">Health History</h1>
          <p className="text-maternal-600 mt-2 text-lg">Track your vitals and fetal progress over time.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-maternal-100 shadow-sm self-start">
          <button 
            onClick={() => setViewMode('chart')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'chart' ? 'bg-maternal-600 text-white shadow-sm' : 'text-maternal-500 hover:text-maternal-700'}`}
          >
            <ChartIcon className="w-4 h-4" />
            Charts
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'table' ? 'bg-maternal-600 text-white shadow-sm' : 'text-maternal-500 hover:text-maternal-700'}`}
          >
            <TableIcon className="w-4 h-4" />
            Logs
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
           <div className="w-12 h-12 border-4 border-maternal-200 border-t-maternal-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {viewMode === 'chart' ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Blood Pressure Chart */}
              <div className="bg-white p-8 rounded-3xl border border-maternal-100 shadow-sm flex flex-col h-[450px]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2.5 rounded-xl text-red-600">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-maternal-900">Blood Pressure</h2>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 text-maternal-600"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Sys</span>
                    <span className="flex items-center gap-1.5 text-maternal-600"><span className="w-3 h-3 bg-red-400 opacity-60 rounded-full"></span> Dia</span>
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={['dataMin - 20', 'dataMax + 20']} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorSys)" />
                      <Area type="monotone" dataKey="diastolic" stroke="#f87171" strokeWidth={2} strokeOpacity={0.6} fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Weight Chart */}
              <div className="bg-white p-8 rounded-3xl border border-maternal-100 shadow-sm flex flex-col h-[450px]">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-maternal-50 p-2.5 rounded-xl text-maternal-600">
                      <Scale className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-maternal-900">Weight</h2>
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="stepAfter" dataKey="weight" stroke="#0d9488" strokeWidth={4} dot={{ r: 6, fill: '#0d9488', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-maternal-100 overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-maternal-50/50 border-b border-maternal-100">
                    <th className="px-8 py-5 text-sm font-bold text-maternal-700">Date Logged</th>
                    <th className="px-8 py-5 text-sm font-bold text-maternal-700 text-center">Blood Pressure</th>
                    <th className="px-8 py-5 text-sm font-bold text-maternal-700 text-center">Weight</th>
                    <th className="px-8 py-5 text-sm font-bold text-maternal-700 text-center">Fetal Movement</th>
                    <th className="px-8 py-5 text-sm font-bold text-maternal-700 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-maternal-50">
                  {vitals.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 text-maternal-800 font-medium">
                        {new Date(log.loggedAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                        <div className="text-[10px] text-maternal-400 mt-1 uppercase tracking-widest font-bold">
                          {new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center font-bold text-maternal-900">{log.bloodPressure || '-'}</td>
                      <td className="px-8 py-5 text-center text-maternal-600">{log.weight ? `${log.weight} lbs` : '-'}</td>
                      <td className="px-8 py-5 text-center text-maternal-600">{log.fetalMovement !== null ? `${log.fetalMovement} kicks` : '-'}</td>
                      <td className="px-8 py-5 text-right">
                        {(() => {
                          const status = getStatus(log);
                          return (
                            <span className={cn(
                              "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold leading-none border",
                              status === 'normal' ? "bg-green-50 text-green-700 border-green-100" :
                              status === 'warning' ? "bg-amber-50 text-amber-700 border-amber-100" :
                              "bg-red-50 text-red-700 border-red-100"
                            )}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          );
                        })()}
                      </td>
                    </tr>
                  ))}
                  {vitals.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-maternal-400">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No vitals logged yet.</p>
                        <p className="text-sm">Your health metrics will appear here once you start logging.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
