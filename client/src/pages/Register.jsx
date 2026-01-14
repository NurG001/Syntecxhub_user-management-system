import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, User, Mail, Lock, Loader2, Command, CheckCircle2, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', organization: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      alert('Organization Registered Successfully! Please Login.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-162.5">
        
        {/* --- LEFT SIDE: Marketing / Info --- */}
        <div className="bg-linear-to-br from-indigo-600 to-violet-700 p-12 flex flex-col justify-between text-white relative overflow-hidden order-2 md:order-1">
          {/* Decorative Elements */}
          <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-60 h-60 bg-indigo-500/30 rounded-full blur-3xl"></div>

          {/* Brand Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
              <Command className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">StaffSync</span>
          </div>

          {/* Marketing Content */}
          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Start your journey with us.
            </h1>
            <p className="text-indigo-100 text-lg leading-relaxed">
              Join thousands of forward-thinking companies efficiently managing their workforce with StaffSync.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-400/20 p-1 rounded-full">
                   <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="font-medium">Instant Organization Setup</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-emerald-400/20 p-1 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="font-medium">Unlimited Team Members</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-emerald-400/20 p-1 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="font-medium">Enterprise-Grade Security</span>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="relative z-10 text-xs text-indigo-200 mt-8">
            Already trusted by market leaders.
          </div>
        </div>

        {/* --- RIGHT SIDE: Registration Form --- */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-white order-1 md:order-2 overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
              <p className="text-slate-500">Set up your organization in seconds.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Organization Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Organization Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="text" required 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g. Acme Corp"
                    value={formData.organization}
                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  />
                </div>
              </div>

              {/* Admin Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Admin Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="text" required 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="email" required 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="password" required 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-70 mt-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                  <>
                    Create Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in</Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;