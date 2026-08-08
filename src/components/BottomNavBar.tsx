import React from 'react';
import { useRiverpod } from '../context/RiverpodContext';
import { Home, CheckSquare, BookOpen, PenTool, User, AlertCircle } from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab, setIsEmergencyOpen } = useRiverpod();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'journal', label: 'Journal', icon: PenTool },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <nav className="sticky bottom-0 left-0 right-0 w-full bg-[#F9F8F4]/95 backdrop-blur-lg border-t border-[#E8E7E0] py-2.5 px-3 z-30 shadow-sm">
      <div className="max-w-[700px] mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3.5 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#F1F3EF] text-[#3D4B3A] scale-105 font-bold shadow-sm border border-[#DCE4DA]' 
                  : 'text-[#7C7B71] hover:text-[#2D2D2A]'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform group-active:scale-90 ${isActive ? 'stroke-[2.5] text-[#8FA18B]' : 'stroke-[1.8]'}`} />
              <span className="text-[11px] font-medium tracking-tight mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* SOS Emergency Hotline Trigger */}
        <button
          onClick={() => setIsEmergencyOpen(true)}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl text-[#9C717C] hover:bg-[#F9F1F3] border border-transparent hover:border-[#EEDDE2] transition-colors"
          title="Emergency Student Support"
        >
          <AlertCircle className="w-5 h-5 animate-pulse" />
          <span className="text-[11px] font-semibold tracking-tight text-[#9C717C]">
            SOS
          </span>
        </button>
      </div>
    </nav>
  );
};
