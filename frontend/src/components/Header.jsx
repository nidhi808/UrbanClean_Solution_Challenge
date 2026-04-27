import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-20 glass-panel border-x-0 border-t-0 rounded-none px-6 lg:px-8 flex items-center justify-between z-20">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-400 hover:text-white transition-colors">
          <Menu size={24} />
        </button>
        
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search regions, issues..." 
            className="bg-dark-800/50 border border-white/5 focus:border-brand-blue/50 text-sm text-white placeholder-gray-500 rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-brand-blue/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20">
          <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
          <span className="text-xs font-medium text-brand-green">System Online</span>
        </div>
        
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-dark-900"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple p-[2px] cursor-pointer">
          <div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center overflow-hidden">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=transparent" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
