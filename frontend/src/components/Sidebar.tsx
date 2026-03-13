'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { 
  LayoutDashboard, 
  FileText, 
  Files, 
  BarChart, 
  Vote, 
  Globe
} from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
  const { user } = useAuth();
  const currentPath = usePathname();

  if (!user) return null;

  const getLinks = () => {
    const base = [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/cases', label: 'Cases', icon: Files },
      { href: '/polls', label: 'Polls', icon: Vote },
      { href: '/public-hub', label: 'Public Hub', icon: Globe },
    ];

    if (user.role === 'Staff') {
      base.splice(1, 0, { href: '/submit', label: 'Submit Case', icon: FileText });
    }

    if (['Secretariat', 'Admin'].includes(user.role)) {
      base.push({ href: '/analytics', label: 'Analytics', icon: BarChart });
    }

    return base;
  };

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 sticky top-0 h-screen overflow-y-auto">
      <div className="mb-8 p-2">
        <h1 className="text-2xl font-bold text-blue-400">NeoConnect</h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{user.role}</p>
      </div>
      <nav className="space-y-2">
        {getLinks().map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.href || currentPath.startsWith(`${link.href}/`);
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
