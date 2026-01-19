import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, Building2, CheckCircle2, Command } from 'lucide-react';
// IMPORT CRITICAL: Switched from axios to your custom api instance
import api from '../api'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.removeItem('user');
      // UPDATED: Now uses the dynamic baseURL from api.js
      const { data } = await api.post('/login', {
        email,
        password
      });
      localStorage.setItem('user', JSON.stringify(data));
      window.location.href = '/'; 
    } catch (error) {
      alert(error.response?.data?.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-150">
        
        {/* --- LEFT SIDE: Marketing / Info --- */}
        <div className="bg-linear-to-br from-indigo-600 to-violet-700 p-12 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"></div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
              <Command className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">StaffSync</span>
          </div>

          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Manage your team with confidence.
            </h1>
            <p className="text-indigo-100 text-lg leading-relaxed">
              The all-in-one platform to streamline your workforce, track performance, and scale your organization securely.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">Real-time Dashboard Analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">Secure Multi-Tenant Architecture</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">Instant Team Onboarding</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-indigo-200 mt-8">
            © 2026 StaffSync Inc. All rights reserved.
          </div>
        </div>

        {/* --- RIGHT SIDE: Login Form --- */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-500">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="email" 
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="password" 
                    required
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm mb-4">Don't have an organization account?</p>
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-slate-100 rounded-xl text-slate-600 font-bold text-sm hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all w-full"
              >
                <Building2 className="w-4 h-4" />
                Register New Organization
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;