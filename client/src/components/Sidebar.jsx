import { Home, Users, LogOut, Command, Settings } from 'lucide-react';

const Sidebar = ({ currentView, onNavigate, onLogout, isOpen }) => {
  
  const getNavItemClass = (viewName) => {
    const isActive = currentView === viewName;
    return `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative font-medium ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 translate-x-1' 
        : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-1'
    }`;
  };

  return (
    // Responsive Logic:
    // 1. Mobile: Hidden by default (-translate-x-full), slides in when isOpen is true (translate-x-0).
    // 2. Desktop (md:): Always visible (translate-x-0), fixed position.
    <aside className={`
      w-64 bg-white h-screen fixed top-0 left-0 border-r border-slate-100 flex flex-col z-50 shadow-xl md:shadow-none
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0
    `}>
      
      {/* Brand */}
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
            <Command className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">StaffSync</h1>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 space-y-1 flex-1 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 mt-2">Main Menu</p>
        
        <button onClick={() => onNavigate('home')} className={getNavItemClass('home')}>
          <Home className={`w-5 h-5 ${currentView === 'home' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
          <span>Dashboard</span>
        </button>
        
        <button onClick={() => onNavigate('users')} className={getNavItemClass('users')}>
          <Users className={`w-5 h-5 ${currentView === 'users' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
          <span>Team Members</span>
        </button>
<button 
  onClick={() => onNavigate('settings')}
  className={getNavItemClass('settings')}
>
  <Settings className={`w-5 h-5 ${currentView === 'settings' ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
  <span>Settings</span>
</button>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 m-4 bg-slate-50 rounded-2xl border border-slate-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 p-2 text-slate-600 hover:text-red-600 transition-colors group">
          <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-red-50 transition-colors">
             <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold group-hover:text-red-600 transition-colors">Sign Out</p>
            <p className="text-xs text-slate-400">End session</p>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;