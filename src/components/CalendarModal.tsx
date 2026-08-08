import React from 'react';
import { useRiverpod } from '../context/RiverpodContext';
import { X, Calendar as CalendarIcon, CheckCircle, Flame } from 'lucide-react';

export const CalendarModal: React.FC = () => {
  const { isCalendarOpen, setIsCalendarOpen, moodLogs, studentProfile } = useRiverpod();

  if (!isCalendarOpen) return null;

  // Days in current August 2026 month simulation
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#dee8ff] flex flex-col gap-4 relative animate-scale-up">
        <button
          onClick={() => setIsCalendarOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#f0f3ff] text-[#717970] hover:text-[#111c2c]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#35693f]">
          <CalendarIcon className="w-5 h-5" />
          <h3 className="font-display font-bold text-lg text-[#111c2c]">
            August 2026 Mood Calendar
          </h3>
        </div>

        <div className="flex justify-between items-center bg-[#f0f3ff] p-3 rounded-2xl border border-[#dee8ff] text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#35693f]">
            <Flame className="w-4 h-4 fill-[#35693f]" />
            <span>{studentProfile.streakDays} Days Daily Streak</span>
          </div>
          <span className="text-[#717970] font-medium">{moodLogs.length} Total Logs</span>
        </div>

        {/* Calendar Grid */}
        <div>
          <div className="grid grid-cols-7 text-center font-bold text-xs text-[#717970] mb-2">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank start padding for month start */}
            <div /><div /><div /><div /><div /><div />
            {daysInMonth.slice(0, 7).map((d) => {
              const hasLog = d <= 7;
              return (
                <div
                  key={d}
                  className={`h-10 rounded-xl flex items-center justify-center font-semibold text-xs transition-all ${
                    hasLog 
                      ? 'bg-[#7fb685] text-[#114721] font-bold shadow-sm' 
                      : 'bg-[#f0f3ff] text-[#717970]'
                  }`}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent History List */}
        <div className="mt-2 pt-3 border-t border-[#dee8ff]">
          <h4 className="font-bold text-xs text-[#414940] mb-2">Recent Logged Check-ins:</h4>
          <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
            {moodLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="bg-[#f9f9ff] p-2.5 rounded-xl border border-[#dee8ff] flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold capitalize text-[#111c2c]">{log.mood}</span>
                  <span className="text-[#717970] ml-2">({log.time})</span>
                </div>
                <span className="text-[10px] bg-[#b7f1bb] text-[#1c5129] px-2 py-0.5 rounded-full font-bold">
                  {log.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
