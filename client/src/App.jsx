import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Plus, X, Users, Database, Activity, Building2, Lock, UserCircle2, LogOut } from 'lucide-react'; // Added LogOut icon
import api from './api';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import UserCard from './components/UserCard';
import toast, { Toaster } from 'react-hot-toast'; // Integrated for professional notifications

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: '' });
  const [isEditing, setIsEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- RESPONSIVE STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  // View State: 'home', 'users', 'profile', or 'settings'
  const [currentView, setCurrentView] = useState('home'); 
  const [dbStatus, setDbStatus] = useState('checking');   
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');

  // --- PROFILE EDIT STATES ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ 
    name: '', 
    email: '',
    password: '' 
  });

  const navigate = useNavigate();

  // Get Logged In Admin Info
  const getUserFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem('user')) || { name: 'Admin', organization: 'My Agency' };
    } catch (e) {
      return { name: 'Admin', organization: 'My Agency' };
    }
  };
  const currentUser = getUserFromStorage();

  // Initialize profile form with current user data
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name,
        email: currentUser.email,
        password: ''
      });
    }
  }, [currentView]); // Re-sync if data changed while in other views

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setDbStatus('checking');
      const { data } = await api.get('/');
      setUsers(data);
      setDbStatus('connected');
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('user');
        navigate('/login');
      }
      setDbStatus('disconnected');
    }
  };

  // --- UPDATED: PROFILE UPDATE HANDLER WITH TOAST ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const t = toast.loading("Saving changes..."); // Show loading state
    try {
      const { data } = await api.put('/profile', profileForm);
      
      const updatedUser = { ...currentUser, name: data.name, email: data.email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success("Profile updated successfully!", { id: t }); // Success Toast
      setIsEditingProfile(false);
      setProfileForm({ ...profileForm, password: '' });
      
      // Short delay so user can see the success toast before reload
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile", { id: t }); // Error Toast
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term && currentView !== 'users') {
      setCurrentView('users');
    }
  };

  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- NEW: PROFESSIONAL LOGOUT MODAL USING TOAST ---
  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <LogOut className="w-5 h-5 text-red-500" />
          <span>Confirm Sign Out</span>
        </div>
        <p className="text-sm text-slate-500">Are you sure you want to end your current session?</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              const signoutToast = toast.loading("Signing out...");
              setTimeout(() => {
                localStorage.removeItem('user'); 
                toast.success("Logged out successfully", { id: signoutToast });
                navigate('/login');              
                window.location.reload();
              }, 800);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      className: 'border-2 border-slate-100 shadow-2xl rounded-2xl p-4 min-w-[320px]',
    });
  };

  // --- UPDATED: CRUD SUBMIT WITH TOAST ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const t = toast.loading(isEditing ? "Updating user..." : "Adding user...");
    try {
      if (isEditing) {
        await api.put(`/${isEditing}`, form);
        toast.success("User updated!", { id: t });
      } else {
        await api.post('/', form);
        toast.success("User added successfully!", { id: t });
      }
      fetchUsers();
      closeModal();
      if(currentView === 'home') setCurrentView('users'); 
    } catch (error) {
      toast.error("Error saving user.", { id: t });
    }
  };

  // --- UPDATED: DELETE WITH TOAST ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const t = toast.loading("Deleting user...");
      try {
        await api.delete(`/${id}`);
        fetchUsers();
        toast.success("User removed.", { id: t });
      } catch (error) { 
        toast.error("Could not delete user.", { id: t });
      }
    }
  };

  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, phone: user.phone || '', role: user.role });
    setIsEditing(user._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setForm({ name: '', email: '', phone: '', role: '' });
    setIsEditing(null);
    setIsModalOpen(false);
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      
      {/* --- NOTIFICATION ENGINE --- */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* --- MOBILE OVERLAY --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen} 
      />
      
      {/* --- NAVBAR --- */}
      <Navbar 
        user={currentUser} 
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onNavigate={handleNavigate}
      />
      
      {/* --- MAIN CONTENT --- */}
      <main className="pt-28 md:pt-32 p-4 md:p-8 md:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          
          {/* --- VIEW 1: HOME DASHBOARD --- */}
          {currentView === 'home' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Welcome Back, {currentUser.name}</h1>
                <p className="text-slate-500 mt-1">
                  System Dashboard Overview for <span className="font-bold text-indigo-600">{currentUser.organization}</span>
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                  <div className="bg-indigo-50 p-4 rounded-xl">
                    <Users className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Users</p>
                    <h2 className="text-3xl font-bold text-slate-800">{users.length}</h2>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${dbStatus === 'connected' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    <Database className={`w-8 h-8 ${dbStatus === 'connected' ? 'text-emerald-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">DB Status</p>
                    <div className="flex items-center gap-2">
                      <h2 className={`text-xl font-bold ${dbStatus === 'connected' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {dbStatus === 'connected' ? 'Connected' : 'Error'}
                      </h2>
                      {dbStatus === 'connected' && (
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <Activity className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">System</p>
                    <h2 className="text-xl font-bold text-blue-700">Online</h2>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center shadow-lg gap-4 text-center md:text-left">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-1">Need to manage your team?</h2>
                  <p className="text-indigo-100 text-sm md:text-base">Add, edit, or remove users from the system easily.</p>
                </div>
                <button 
                  onClick={() => setCurrentView('users')}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition shadow-md w-full md:w-auto"
                >
                  Go to Users
                </button>
              </div>
            </div>
          )}

          {/* --- VIEW 2: USERS LIST --- */}
          {currentView === 'users' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-800">User Management</h1>
                  <p className="text-slate-500 mt-1">Manage {currentUser.organization} team members.</p>
                  
                  {searchTerm && (
                    <p className="text-indigo-600 text-sm font-medium mt-1">
                      Found {filteredUsers.length} result{filteredUsers.length !== 1 && 's'} for "{searchTerm}"
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm flex items-center gap-2 w-full md:w-auto justify-center"
                >
                  <Plus className="w-5 h-5" />
                  Add User
                </button>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
                  <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">No users yet</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">Get started by adding your first team member to the system.</p>
                  <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
                    Add Your First User
                  </button>
                </div>
              ) : (
                <>
                  {filteredUsers.length === 0 && searchTerm ? (
                     <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                        <p className="text-slate-400">No matches found for "{searchTerm}"</p>
                        <button onClick={() => setSearchTerm('')} className="text-indigo-600 font-bold hover:underline mt-2">Clear Search</button>
                     </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredUsers.map((user) => (
                        <UserCard key={user._id} user={user} onEdit={openEdit} onDelete={handleDelete} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* --- VIEW 3: PROFILE SECTION (Editable) --- */}
          {currentView === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Admin Profile</h1>
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-100 text-center md:text-left">
                  <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 ring-4 ring-indigo-50">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{currentUser.name}</h2>
                    <p className="text-slate-500 italic">Administrator for {currentUser.organization}</p>
                  </div>
                </div>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        required
                        disabled={!isEditingProfile}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          isEditingProfile 
                          ? 'border-indigo-500 ring-2 ring-indigo-100' 
                          : 'border-slate-200 bg-slate-50 cursor-not-allowed'
                        }`}
                        value={isEditingProfile ? profileForm.name : currentUser.name} 
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        required
                        disabled={!isEditingProfile}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          isEditingProfile 
                          ? 'border-indigo-500 ring-2 ring-indigo-100' 
                          : 'border-slate-200 bg-slate-50 cursor-not-allowed'
                        }`}
                        value={isEditingProfile ? profileForm.email : currentUser.email} 
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      />
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-medium text-slate-700 mb-2">New Password (Leave blank to keep current)</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-indigo-500 ring-2 ring-indigo-100 focus:outline-none"
                          value={profileForm.password}
                          onChange={(e) => setProfileForm({...profileForm, password: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  {isEditingProfile && (
                    <button 
                      type="submit" 
                      className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
                    >
                      Save All Changes
                    </button>
                  )}

                  {!isEditingProfile && (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <p className="text-xs text-amber-700 leading-relaxed">
                        <strong>Note:</strong> Profile details are synced with your organization records. Contact support for fundamental account changes.
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {/* --- VIEW 4: SETTINGS SECTION --- */}
          {currentView === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">Organization Settings</h1>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    General Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Organization Name</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50" value={currentUser.organization} disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Organization ID</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs" value={currentUser._id} disabled />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-indigo-600" />
                    Security & Privacy
                  </h2>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-xl gap-4">
                    <div>
                      <p className="font-bold text-slate-800">Multi-Factor Authentication</p>
                      <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed opacity-50">
                       <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 border border-slate-100 rounded-xl flex items-start gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Database className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Data Isolation</p>
                      <p className="text-xs text-slate-500 mt-0.5">Your data is strictly isolated to your organization workspace.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL FORM (Standard CRUD) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 scale-100 max-h-[90vh] overflow-y-auto">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="e.g. John Doe"
                  value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role / Job Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="e.g. CEO, HR Manager"
                  value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                <input 
                  type="email" required 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="e.g. john@example.com"
                  value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone (Optional)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="e.g. +1 234 567 890"
                  value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-3.5 text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">{isEditing ? 'Update User' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;