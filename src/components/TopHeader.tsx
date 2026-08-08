import React from 'react';
import { useRiverpod } from '../context/RiverpodContext';
import { Smartphone, Monitor, Cpu, Calendar, Flame } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { 
    studentProfile, 
    isMobileFrame, 
    setIsMobileFrame, 
    isInspectorOpen, 
    setIsInspectorOpen,
    setIsCalendarOpen 
  } = useRiverpod();

  return (
    <header className="w-full sticky top-0 bg-[#F9F8F4]/90 backdrop-blur-md z-40 px-5 py-3 border-b border-[#E8E7E0] flex justify-between items-center transition-all">
      {/* Left: Avatar & Greeting */}
      <div className="flex items-center gap-3">
        <div className="relative group cursor-pointer" onClick={() => setIsCalendarOpen(true)}>
          <img 
            src={studentProfile.avatarUrl} 
            alt={studentProfile.name}
            className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-white group-hover:scale-105 transition-transform" 
          />
          <div className="absolute -bottom-1 -right-1 bg-[#8FA18B] text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-italic font-bold text-lg md:text-xl text-[#2D2D2A] tracking-tight leading-tight">
              Good morning, {studentProfile.name}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 bg-[#F0F4EF] text-[#3D4B3A] text-xs px-2.5 py-0.5 rounded-full font-semibold border border-[#DCE4DA]">
              <Flame className="w-3 h-3 text-[#8FA18B] fill-[#8FA18B]" />
              {studentProfile.streakDays}d Streak
            </span>
          </div>
          <p className="text-xs text-[#7C7B71] hidden sm:block">
            {studentProfile.major} • {studentProfile.academicYear}
          </p>
        </div>
      </div>

      {/* Right: Actions (Flutter Frame Switch, Riverpod Inspector, Calendar) */}
      <div className="flex items-center gap-2">
        {/* Riverpod State Inspector Button */}
        <button
          onClick={() => setIsInspectorOpen(!isInspectorOpen)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
            isInspectorOpen 
              ? 'bg-[#3D4B3A] text-white shadow-sm' 
              : 'bg-[#F1F3EF] text-[#3D4B3A] hover:bg-[#E0E5DC] border border-[#E8E7E0]'
          }`}
          title="Toggle Riverpod Flutter State Inspector"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Riverpod</span>
        </button>

        {/* View Frame Mode Toggle */}
        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          className="p-2 rounded-full bg-[#F1F3EF] text-[#7C7B71] hover:bg-[#E0E5DC] border border-[#E8E7E0] transition-colors"
          title={isMobileFrame ? "Switch to Full Screen View" : "Switch to Flutter Phone Frame View"}
        >
          {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
        </button>

        {/* Calendar Trigger */}
        <button 
          onClick={() => setIsCalendarOpen(true)}
          className="p-2 rounded-full text-[#3D4B3A] hover:bg-[#F0F4EF] transition-colors active:scale-95"
          title="Open Calendar History"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
