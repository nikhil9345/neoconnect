'use client';

import { useAuth } from './AuthProvider';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Topbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-10 w-full shadow-sm">
      <div className="font-semibold text-gray-700">
        Welcome back, {user.name}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
          <UserIcon size={16} />
          <span>{user.department}</span>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition-colors font-medium px-3 py-1.5 rounded-md hover:bg-red-50"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
