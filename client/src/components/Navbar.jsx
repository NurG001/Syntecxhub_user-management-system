import { Search, UserCircle2, Menu } from 'lucide-react';

const Navbar = ({ user, searchTerm, onSearch, onToggleSidebar, onNavigate }) => { // <--- Added onNavigate to props
  return (
    <header className="bg-white border-b border-slate-200 h-20 px-4 md:px-8 flex items-center justify-between fixed top-0 right-0 left-0 md:left-64 z-20 transition-all duration-300">
      
      {/* Left Side: Mobile Menu Button & Search */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        
        {/* Hamburger Button (Visible ONLY on mobile) */}
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Responsive Functional Search Bar */}
        <div className="relative flex-1 md:w-96 group">
          <input 
            type="text" 
            placeholder="Search by name, email, or role..." 
            className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          
          {/* Functional Search Action Button */}
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-600 transition-colors md:block hidden"
            title="Execute Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Side: Dynamic Profile Display (Now Clickable) */}
      <div 
        className="flex items-center gap-4 ml-4 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all"
        onClick={() => onNavigate('profile')} // <--- Triggers the Profile View
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-800 leading-none mb-1">
            {user?.name || 'Admin User'}
          </p>
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {user?.organization || 'StaffSync Admin'}
          </p>
        </div>
        
        {/* Profile Avatar */}
        <div className="hover:opacity-80 transition-opacity">
          <UserCircle2 className="w-9 h-9 md:w-10 md:h-10 text-slate-300 shrink-0" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;