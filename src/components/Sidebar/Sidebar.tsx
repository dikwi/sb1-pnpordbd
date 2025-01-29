import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Printer, Home } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: <Home className="h-5 w-5" /> },
  { name: 'Clients', path: '/clients', icon: <Users className="h-5 w-5" /> },
  { name: 'Print Jobs', path: '/print-jobs', icon: <Printer className="h-5 w-5" /> },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-full bg-white border-r border-gray-200 w-64 fixed left-0 top-16">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <div
                  className={`${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3`}
                >
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}