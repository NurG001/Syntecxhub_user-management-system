import { MoreVertical, Phone, Mail, Edit, Trash2, Building2 } from 'lucide-react';
import { useState } from 'react';

const UserCard = ({ user, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getInitials = (name) => {
    return name ? name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) : '??';
  };

  const colors = ['bg-indigo-100 text-indigo-600', 'bg-pink-100 text-pink-600', 'bg-emerald-100 text-emerald-600', 'bg-amber-100 text-amber-600', 'bg-cyan-100 text-cyan-600'];
  const randomColor = colors[user.name.length % colors.length];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative hover:shadow-md transition-shadow">
      <div className="absolute top-4 right-4">
        <button onClick={() => setShowMenu(!showMenu)} className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg border border-slate-100 py-2 w-36 z-20 animate-in fade-in zoom-in duration-200">
            <button onClick={() => { onEdit(user); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
              <Edit className="w-4 h-4" /> Edit
            </button>
            <button onClick={() => { onDelete(user._id); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${randomColor}`}>
          {getInitials(user.name)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
          <p className="text-sm font-medium text-indigo-600">{user.role}</p>
        </div>
      </div>

      <div className="space-y-3 pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Mail className="w-4 h-4 text-slate-400" />
          <span className="truncate">{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Phone className="w-4 h-4 text-slate-400" />
            <span>{user.phone}</span>
          </div>
        )}
      </div>

      {/* --- NEW: Organization Display --- */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <Building2 className="w-3 h-3" />
        <span>{user.organization || 'Organization'}</span>
      </div>
    </div>
  );
};

export default UserCard;