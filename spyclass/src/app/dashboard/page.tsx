"use client"

import { useState } from 'react';
import { Users, Calendar, Video, Shield, ChevronRight, Activity, PieChart, BarChart } from 'lucide-react';
import { ReactNode } from 'react';

// Define TypeScript interfaces for our props
interface ModuleCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  metrics: {
    label: string;
    value: string;
    icon?: ReactNode;
  }[];
  link: string;
  color: string;
}

export default function Dashboard() {
  return (
    <div className="bg-gray-950 min-h-screen p-4 md:p-8 text-gray-200">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">SpyClass Dashboard</h1>
          <p className="text-gray-400 mt-1">AI-powered monitoring and analytics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
            <Users size={20} className="text-purple-400" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModuleCard 
          title="People Counting"
          icon={<Users size={24} className="text-blue-500" />}
          description="Track and analyze real-time occupancy data across locations"
          metrics={[
            { label: "Today", value: "247", icon: <Activity size={16} className="text-green-400" /> },
            { label: "Trend", value: "+12%" }
          ]}
          link="/dashboard/analytics"
          color="blue"
        />
        
        <ModuleCard 
          title="Attendance"
          icon={<Calendar size={24} className="text-green-500" />}
          description="Monitor automated attendance tracking records"
          metrics={[
            { label: "Rate", value: "94%", icon: <PieChart size={16} className="text-blue-400" /> },
            { label: "Change", value: "+5%" }
          ]}
          link="/dashboard/users"
          color="green"
        />
        
        <ModuleCard 
          title="Classroom Monitoring"
          icon={<Video size={24} className="text-yellow-500" />}
          description="Real-time classroom engagement tracking"
          metrics={[
            { label: "Active", value: "8", icon: <Activity size={16} className="text-yellow-400" /> },
            { label: "Status", value: "2 Live" }
          ]}
          link="/dashboard/reports"
          color="yellow"
        />
        
        <ModuleCard 
          title="Exam Cheat Detection"
          icon={<Shield size={24} className="text-red-500" />}
          description="AI-powered exam proctoring and monitoring"
          metrics={[
            { label: "This Week", value: "12", icon: <BarChart size={16} className="text-red-400" /> },
            { label: "Alerts", value: "0" }
          ]}
          link="/dashboard/settings"
          color="red"
        />
      </div>
    </div>
  );
}

function ModuleCard({ title, icon, description, metrics, link, color }: ModuleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getGradient = () => {
    switch (color) {
      case 'blue': return 'from-blue-500/20 to-blue-700/5';
      case 'green': return 'from-green-500/20 to-green-700/5';
      case 'yellow': return 'from-yellow-500/20 to-yellow-700/5';
      case 'red': return 'from-red-500/20 to-red-700/5';
      default: return 'from-purple-500/20 to-purple-700/5';
    }
  };
  
  const getBorderColor = () => {
    switch (color) {
      case 'blue': return 'border-blue-500/30';
      case 'green': return 'border-green-500/30';
      case 'yellow': return 'border-yellow-500/30';
      case 'red': return 'border-red-500/30';
      default: return 'border-purple-500/30';
    }
  };
  
  return (
    <div 
      className={`rounded-xl bg-gradient-to-br ${getGradient()} p-6 border ${getBorderColor()} transition-all duration-300 ${
        isHovered ? 'shadow-lg shadow-blue-500/10' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="mr-3">
            {icon}
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div className="bg-gray-900 rounded-full p-1">
          <div className={`w-2 h-2 rounded-full bg-${color}-500`}></div>
        </div>
      </div>
      
      <p className="text-gray-400 mb-6">{description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-900/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">{metric.label}</span>
              {metric.icon && metric.icon}
            </div>
            <div className="text-xl font-bold">{metric.value}</div>
          </div>
        ))}
      </div>
      
      <a 
        href={link}
        className={`w-full mt-2 py-3 px-4 rounded-lg flex items-center justify-between bg-gray-900/60 hover:bg-gray-800 transition-colors`}
      >
        <span>Open {title}</span>
        <ChevronRight size={18} />
      </a>
    </div>
  );
}