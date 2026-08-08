import React from 'react';
import { useRiverpod } from '../context/RiverpodContext';
import { User, Flame, GraduationCap, Download, RefreshCw, Award, Heart, Cpu } from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { studentProfile, moodLogs, habits, setIsInspectorOpen } = useRiverpod();

  const exportData = () => {
    const backup = {
      profile: studentProfile,
      moodLogs,
      habits,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina_care_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="max-w-[760px] mx-auto px-4 pt-6 pb-20 flex flex-col gap-6">
      {/* Student Profile Banner */}
      <div className="bg-white rounded-3xl p-6 ambient-shadow border border-[#e7eeff] flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#b7f1bb]/30 rounded-full blur-2xl pointer-events-none" />
        
        <img
          src={studentProfile.avatarUrl}
          alt={studentProfile.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-[#35693f] shadow-md shrink-0"
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 className="font-display font-bold text-2xl text-[#111c2c]">
              {studentProfile.name}
            </h2>
            <span className="bg-[#eddcff] text-[#523c72] text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#6a548c] fill-[#6a548c]" />
              {studentProfile.streakDays} Days Active
            </span>
          </div>

          <p className="text-sm font-semibold text-[#35693f]">
            {studentProfile.major}
          </p>
          <p className="text-xs text-[#717970] mt-0.5">
            {studentProfile.academicYear} • {studentProfile.university}
          </p>

          {/* Quick Badges */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
            <span className="text-[11px] bg-[#f0f3ff] text-[#3c6376] px-3 py-1 rounded-full font-semibold border border-[#dee8ff]">
              🌱 Mindful Log 7+ Days
            </span>
            <span className="text-[11px] bg-[#f0f3ff] text-[#3c6376] px-3 py-1 rounded-full font-semibold border border-[#dee8ff]">
              📚 12h Study Logged
            </span>
            <span className="text-[11px] bg-[#f0f3ff] text-[#3c6376] px-3 py-1 rounded-full font-semibold border border-[#dee8ff]">
              💤 7.5h Sleep Avg
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Exam Countdowns */}
      <div className="bg-white rounded-2xl p-5 ambient-shadow border border-[#e7eeff] flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-bold text-base text-[#111c2c] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#ba1a1a]" />
            Upcoming Academic Milestones
          </h3>
          <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6] px-2.5 py-0.5 rounded-full">
            Exam Season
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {studentProfile.upcomingExams.map((exam, idx) => (
            <div key={idx} className="bg-[#f0f3ff] p-3.5 rounded-xl border border-[#dee8ff] flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-[#111c2c]">{exam.title}</p>
                <p className="text-[11px] text-[#717970]">{exam.date}</p>
              </div>
              <span className="text-xs font-bold text-[#ba1a1a] bg-white px-2.5 py-1 rounded-full border border-[#ffdad6]">
                In {exam.daysLeft} days
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Riverpod Developer Inspection Link */}
      <div className="bg-[#f0f3ff] rounded-2xl p-5 border border-[#dee8ff] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="font-display font-bold text-sm text-[#111c2c] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#35693f]" />
            Flutter Riverpod Architecture State
          </h4>
          <p className="text-xs text-[#717970] mt-0.5">
            View active StateNotifiers, Providers, and state mutations in real time.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsInspectorOpen(true)}
            className="bg-[#35693f] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#1c5129] transition-all"
          >
            Inspect Riverpod
          </button>
          <button
            onClick={exportData}
            className="bg-white text-[#3c6376] border border-[#dee8ff] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#dee8ff] transition-all flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            Backup JSON
          </button>
        </div>
      </div>
    </div>
  );
};
