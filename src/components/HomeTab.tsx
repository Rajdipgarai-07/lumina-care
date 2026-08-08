import React, { useState } from 'react';
import { useRiverpod } from '../context/RiverpodContext';
import { MoodType, MoodItem } from '../types';
import { Heart, Sparkles, Moon, GraduationCap, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import confetti from 'canvas-confetti';

const MOOD_ITEMS: MoodItem[] = [
  {
    id: 'happy',
    label: 'Radiant',
    emoji: '😊',
    bgClass: 'bg-[#F0F4EF]',
    borderClass: 'hover:border-[#8FA18B]',
    colorHex: '#3D4B3A',
    description: 'Energetic, optimistic & joyful'
  },
  {
    id: 'calm',
    label: 'Calm',
    emoji: '😌',
    bgClass: 'bg-[#F0F4EF]',
    borderClass: 'hover:border-[#8FA18B]',
    colorHex: '#3D4B3A',
    description: 'Peaceful, focused & grounded'
  },
  {
    id: 'stressed',
    label: 'Stressed',
    emoji: '😤',
    bgClass: 'bg-[#F9F1F3]',
    borderClass: 'hover:border-[#9C717C]',
    colorHex: '#9C717C',
    description: 'Overwhelmed by academic load'
  },
  {
    id: 'sad',
    label: 'Low',
    emoji: '😔',
    bgClass: 'bg-[#FDF0E8]',
    borderClass: 'hover:border-[#A67D65]',
    colorHex: '#A67D65',
    description: 'Low energy or feeling down'
  },
  {
    id: 'anxious',
    label: 'Tired',
    emoji: '😴',
    bgClass: 'bg-[#F0F4EF]',
    borderClass: 'hover:border-[#8FA18B]',
    colorHex: '#6D8A68',
    description: 'Restless or nervous about exams'
  }
];

export const HomeTab: React.FC = () => {
  const { 
    selectedMood, 
    setSelectedMood, 
    reflectionText, 
    setReflectionText, 
    saveMoodCheckIn, 
    moodLogs,
    studentProfile,
    setIsBreathingOpen,
    setActiveTab
  } = useRiverpod();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSavedLog, setLastSavedLog] = useState<any>(null);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const saved = await saveMoodCheckIn();
      setLastSavedLog(saved);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8FA18B', '#C7B59F', '#9C717C']
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Recharts Mood Trend Data
  const chartData = [
    { day: 'Mon', score: 3, label: 'Calm' },
    { day: 'Tue', score: 4, label: 'Happy' },
    { day: 'Wed', score: 2, label: 'Stressed' },
    { day: 'Thu', score: 2, label: 'Anxious' },
    { day: 'Fri', score: 4, label: 'Calm' },
    { day: 'Sat', score: 5, label: 'Happy' },
    { day: 'Sun', score: 4, label: 'Calm' },
  ];

  return (
    <div className="max-w-[760px] mx-auto px-4 pt-6 pb-12 flex flex-col gap-8">
      {/* Welcome Title */}
      <div className="text-center">
        <h2 className="font-serif-italic text-3xl sm:text-4xl font-bold text-[#2D2D2A] tracking-tight mb-2">
          How is your energy flowing today?
        </h2>
        <p className="text-sm sm:text-base text-[#7C7B71] max-w-lg mx-auto">
          Tap the emotion that best matches your current state.
        </p>
      </div>

      {/* Current State Card & Mood Selectors */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E8E7E0] shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8FA18B] mb-6">
          Current State
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {MOOD_ITEMS.map((item) => {
            const isSelected = selectedMood === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedMood(item.id)}
                className={`mood-selector rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center border transition-all cursor-pointer ${
                  isSelected 
                    ? 'mood-selected bg-[#8FA18B] text-white border-[#7A8B77] shadow-lg shadow-[#8FA18B]/20' 
                    : `${item.bgClass} border-[#E8E7E0] hover:border-[#8FA18B] text-[#2D2D2A]`
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-transform duration-300 ${
                  isSelected ? 'bg-white/20' : 'bg-white/60'
                }`}>
                  {item.emoji}
                </div>
                <span className={`font-bold text-xs tracking-wide ${isSelected ? 'text-white' : 'text-[#2D2D2A]'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Journal / Optional Reflection Area */}
      <div className="bg-[#3D4B3A] text-white rounded-[32px] p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-[#8FA18B] rounded-full opacity-20 blur-2xl pointer-events-none" />
        
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8FA18B] mb-3">
          Quick Reflection
        </h3>

        <label htmlFor="reflection-input" className="block text-xl font-serif-italic leading-relaxed mb-4 text-[#F1F3EF]">
          "What is one thing you are grateful for this morning?"
        </label>
        
        <textarea
          id="reflection-input"
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="What's contributing to your flow? (e.g. Sleep, study workload, fresh air...)"
          rows={3}
          className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm text-white placeholder-white/60 focus:bg-white/15 focus:border-white/40 outline-none transition-all resize-none shadow-inner"
        />
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-white text-[#3D4B3A] font-semibold px-8 py-3.5 rounded-2xl hover:bg-[#F1F3EF] active:scale-95 transition-all flex items-center gap-2 text-sm disabled:opacity-60 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-[#8FA18B]" />
                <span>Saving Reflection...</span>
              </>
            ) : (
              <>
                <span>Save Entry</span>
                <Heart className="w-4 h-4 fill-[#8FA18B] text-[#8FA18B]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lumina AI Empathetic Companion Feedback Card */}
      {lastSavedLog && lastSavedLog.aiFeedback && (
        <div className="bg-white rounded-[32px] p-6 border border-[#E8E7E0] shadow-sm relative animate-fade-in">
          <div className="flex items-center gap-2 text-[#8FA18B] font-semibold text-xs uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4 text-[#8FA18B]" />
            <span>Lumina Serene Reflection</span>
          </div>
          <p className="text-[#2D2D2A] font-serif-italic text-lg leading-relaxed mb-4">
            "{lastSavedLog.aiFeedback.empatheticResponse}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E8E7E0] text-xs">
            <div className="bg-[#F1F3EF] p-4 rounded-2xl border border-[#DCE4DA]">
              <span className="font-bold text-[#3D4B3A] block mb-1">💡 Mindful Tip</span>
              <p className="text-[#7C7B71]">{lastSavedLog.aiFeedback.microTip}</p>
            </div>
            <div className="bg-[#FDF0E8] p-4 rounded-2xl border border-[#F5D5C2]">
              <span className="font-bold text-[#A67D65] block mb-1">🌱 Daily Affirmation</span>
              <p className="text-[#7C7B71]">{lastSavedLog.aiFeedback.affirmation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mood Trend Section */}
      <section className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E8E7E0] shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8FA18B] mb-1">
              Stress Analysis
            </h3>
            <p className="text-sm text-[#7C7B71]">
              Weekly emotional rhythm & equilibrium
            </p>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-[#3D4B3A] bg-[#F0F4EF] px-3 py-1 rounded-full border border-[#DCE4DA]">
            <TrendingUp className="w-3.5 h-3.5 text-[#8FA18B]" /> +18% Stability
          </span>
        </div>

        {/* Recharts Curve */}
        <div className="h-44 w-full bg-[#F9F8F4] rounded-2xl p-2 relative overflow-hidden border border-[#E8E7E0]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8FA18B" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#8FA18B" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#7C7B71" fontSize={12} tickLine={false} />
              <YAxis domain={[1, 5]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', borderColor: '#E8E7E0', fontSize: '12px', color: '#2D2D2A' }}
                formatter={(val: any) => [`Level ${val}/5`, 'Mood Score']}
              />
              <Area type="monotone" dataKey="score" stroke="#8FA18B" strokeWidth={3} fillOpacity={1} fill="url(#moodGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Insights Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sleep Insight */}
        <div 
          onClick={() => setActiveTab('habits')}
          className="bg-white rounded-[32px] p-6 border border-[#E8E7E0] shadow-sm flex gap-4 items-center cursor-pointer hover:border-[#8FA18B] transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#F1F3EF] flex items-center justify-center shrink-0 text-[#8FA18B]">
            <span className="material-symbols-outlined text-2xl">bedtime</span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-[#8FA18B] uppercase tracking-widest mb-1">
              Sleep Quality
            </h4>
            <p className="font-semibold text-sm text-[#2D2D2A] leading-snug">
              Sleep improved your mood by 20% this week
            </p>
          </div>
        </div>

        {/* Upcoming Exam */}
        <div 
          onClick={() => setIsBreathingOpen(true)}
          className="bg-white rounded-[32px] p-6 border border-[#E8E7E0] shadow-sm flex gap-4 items-center cursor-pointer hover:border-[#8FA18B] transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FDF0E8] flex items-center justify-center shrink-0 text-[#A67D65]">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-[#A67D65] uppercase tracking-widest mb-1">
              Upcoming Exam
            </h4>
            <p className="font-semibold text-sm text-[#2D2D2A] leading-snug">
              Next exam in 3 days – time for a 4-min breathing break?
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
