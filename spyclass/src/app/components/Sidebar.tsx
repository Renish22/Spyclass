'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck,
  Radio, 
  School 
} from 'lucide-react';
import React from 'react';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  href, 
  icon, 
  label, 
  isActive 
}) => {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
        isActive 
          ? 'bg-secondary text-primary' 
          : 'text-muted-foreground hover:bg-secondary/50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  
  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      href: '/dashboard/analytics',
      label: 'People counting',
      icon: <Users size={20} />,
    },
    {
      href: '/dashboard/users',
      label: 'Attandance',
      icon: < ClipboardCheck size={20} />,
    },
    {
      href: '/dashboard/reports',
      label: 'Classroom Monitoring',
      icon: <Radio size={20} />,
    },
    {
      href: '/dashboard/settings',
      label: 'Exam cheat detaction',
      icon: <School size={20} />,
    },
  ];

  return (
    <div className="flex h-full flex-col bg-card border-r">
      <div className="px-3 py-4 flex flex-col gap-1">
        <div className="mb-4 px-4">
          <h1 className="text-4xl font-semibold tracking-tight">
            SpyClass
          </h1>
        </div>
        <nav className="flex flex-col gap-1">
          {routes.map((route) => (
            <SidebarItem
              key={route.href}
              href={route.href}
              icon={route.icon}
              label={route.label}
              isActive={pathname === route.href}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};