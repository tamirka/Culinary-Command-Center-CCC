
import React from 'react';
import { NavLink } from 'react-router-dom';
import { DashboardIcon, POSIcon, KitchenIcon, ManagementIcon } from './common';

const navigation = [
  { name: 'Dashboard', href: '/', icon: DashboardIcon },
  { name: 'POS', href: '/pos', icon: POSIcon },
  { name: 'Kitchen', href: '/kitchen', icon: KitchenIcon },
  { name: 'Management', href: '/management', icon: ManagementIcon },
];

const Sidebar = () => {
  return (
    <div className="w-20 lg:w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h1 className="hidden lg:block ml-3 text-2xl font-bold text-white tracking-wider">CulinaryOS</h1>
      </div>
      <nav className="flex-1 px-2 lg:px-4 py-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end
            className={({ isActive }) =>
              `group flex items-center px-2 py-3 text-sm lg:text-base font-medium rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon />
            <span className="hidden lg:block ml-4">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
