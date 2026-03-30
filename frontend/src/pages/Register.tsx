import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, User, Baby, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    weeksPregnant: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      const response = await axios.post(`${apiUrl}/users/register`, {
        ...formData,
        weeksPregnant: formData.weeksPregnant ? parseInt(formData.weeksPregnant) : undefined
      });
      
      const { token, user } = response.data;
      login(token, user);
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Registration failed. Please try again.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-maternal-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-accent p-3 rounded-2xl shadow-lg ring-4 ring-accent-light/20">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-maternal-900 tracking-tight">
          Join us today
        </h2>
        <p className="mt-2 text-center text-sm text-maternal-600">
          Start your personalized maternal health experience
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-maternal-200/50 sm:rounded-2xl sm:px-10 border border-maternal-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-maternal-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-maternal-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-maternal-200 rounded-xl leading-5 bg-white placeholder-maternal-300 focus:outline-none focus:ring-2 focus:ring-maternal-500 focus:border-maternal-500 sm:text-sm transition-all shadow-sm"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-maternal-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-maternal-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-maternal-200 rounded-xl leading-5 bg-white placeholder-maternal-300 focus:outline-none focus:ring-2 focus:ring-maternal-500 focus:border-maternal-500 sm:text-sm transition-all shadow-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="password" className="block text-sm font-medium text-maternal-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-maternal-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-maternal-200 rounded-xl leading-5 bg-white placeholder-maternal-300 focus:outline-none focus:ring-2 focus:ring-maternal-500 focus:border-maternal-500 sm:text-sm transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="weeksPregnant" className="block text-sm font-medium text-maternal-700">
                  Weeks Pregnant
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Baby className="h-5 w-5 text-maternal-400" />
                  </div>
                  <input
                    id="weeksPregnant"
                    name="weeksPregnant"
                    type="number"
                    min="1"
                    max="45"
                    value={formData.weeksPregnant}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-maternal-200 rounded-xl leading-5 bg-white placeholder-maternal-300 focus:outline-none focus:ring-2 focus:ring-maternal-500 focus:border-maternal-500 sm:text-sm transition-all shadow-sm"
                    placeholder="24"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-maternal-600 hover:bg-maternal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maternal-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center">
                    Create account <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-maternal-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-maternal-600 hover:text-maternal-700 font-bold transition-colors underline decoration-2 underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
