'use client';

import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  toggleSidebar: () => void;
}

// export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
//   const { theme, setTheme } = useTheme();
  
//   return (
//     <header className="border-b bg-card p-4 flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <button 
//           onClick={toggleSidebar} 
//           className="lg:hidden p-2 rounded-lg hover:bg-secondary/80"
//         >
//           <Menu size={20} />
//         </button>
//         {/* <h1 className="text-lg font-medium">A classroom managment system</h1> */}
//         <h1 className="text-lg font-medium flex-1 text-center">A classroom management system 2</h1>

//       </div>
//       <div className="flex items-center gap-3">
//         <button className="p-2 rounded-lg hover:bg-secondary/80">
//           <Bell size={20} />
//         </button>
//         {/* <button className="p-2 rounded-lg hover:bg-secondary/80">
//           <User size={20} />
//         </button> */}
//         <button
//           onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//           className="p-2 rounded-lg hover:bg-secondary/80"
//         >
//           {theme === 'dark' ? '🌙' : '☀️'}
//         </button>
//       </div>
//     </header>
//   );
// };

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="border-b bg-card p-4 flex items-center justify-between">
      <div className="lg:hidden">
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-lg hover:bg-secondary/80"
        >
          <Menu size={20} />
        </button>
      </div>
      <h1 className="text-2xl font-bold flex-1 text-center">Smart Classroom Monitoring System</h1>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-secondary/80">
          <Bell size={20} />
        </button>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-secondary/80"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};