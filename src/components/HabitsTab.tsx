import React, { useState } from 'react';
import { useRiverpod } from '../context/RiverpodContext';
import { Plus, Check, Moon, BookOpen, Users, Activity, Sparkles, Sliders } from 'lucide-react';
import { Habit } from '../types';

export const HabitsTab: React.FC = () => {
  const { habits, updateHabitDay, addNewHabit, studentProfile } = useRiverpod();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUnit, setNewUnit] = useState('hours');
  const [energyLevel, setEnergyLevel] = useState(75);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const customHabit: Habit = {
      id: Date.now().toString(),
      title: newTitle,
      icon: 'fitness_center',
      targetUnit: newUnit,
      badgeText: `0 ${newUnit}`,
      colorTheme: 'sage',
      weeklyDays: [
        { dayName: 'M', date: 'Mon', completed: false, value: 0 },
        { dayName: 'T', date: 'Tue', completed: false, value: 0 },
        { dayName: 'W', date: 'Wed', completed: false, value: 0 },
        { dayName: 'T', date: 'Thu', completed: false, value: 0 },
        { dayName: 'F', date: 'Fri', completed: false, value: 0 },
        { dayName: 'S', date: 'Sat', completed: false, value: 0 },
        { dayName: 'S', date: 'Sun', completed: false, value: 0 },
      ]
    };
    addNewHabit(customHabit);
    setNewTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-[760px] mx-auto px-4 pt-6 pb-12 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif-italic text-2xl font-bold text-[#2D2D2A]">
            Weekly Lifestyle Goals
          </h2>
          <p className="text-xs text-[#7C7B71]">
            Track daily vitality & academic equilibrium
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#3D4B3A] text-white px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#8FA18B] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Habits List */}
      <div className="flex flex-col gap-4">
        {habits.map((habit) => (
          <div key={habit.id} className="bg-white rounded-[32px] p-6 border border-[#E8E7E0] shadow-sm flex flex-col gap-4">
            {/* Habit Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F1F3EF] flex items-center justify-center text-[#8FA18B]">
                  <span className="material-symbols-outlined text-xl">
                    {habit.icon}
                  </span>
                </div>
                <span className="font-semibold text-base text-[#2D2D2A]">
                  {habit.title}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#3D4B3A] bg-[#F0F4EF] px-3 py-1 rounded-full border border-[#DCE4DA]">
                {habit.badgeText}
              </span>
            </div>

            {/* Weekly Days Row */}
            <div className="grid grid-cols-7 gap-2 mt-1">
              {habit.weeklyDays.map((day, idx) => {
                const isChecklist = habit.targetUnit === 'events';
                const hasValue = day.value !== undefined && day.value > 0;
                const isCompleted = isChecklist ? day.completed : hasValue;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#B0AFAB] uppercase tracking-tighter">
                      {day.dayName}
                    </span>
                    <button
                      onClick={() => {
                        if (isChecklist) {
                          updateHabitDay(habit.id, idx, undefined, !day.completed);
                        } else {
                          const nextVal = ((day.value || 0) + 1) % 12;
                          updateHabitDay(habit.id, idx, nextVal, nextVal > 0);
                        }
                      }}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-[#8FA18B] text-white shadow-sm hover:bg-[#7A8B77]'
                          : 'bg-[#F5F5F0] text-[#7C7B71] hover:bg-[#E8E7E0]'
                      }`}
                      title={`Click to log ${habit.title} for ${day.date}`}
                    >
                      {isChecklist ? (
                        isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : '-'
                      ) : (
                        day.value ? `${day.value}h` : '+'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Insights Section */}
      <section className="flex flex-col gap-3 mt-2">
        <h3 className="font-display font-bold text-lg text-[#111c2c]">
          Lifestyle Insights
        </h3>

        <div className="bg-white rounded-2xl p-5 ambient-shadow border border-[#e7eeff] flex flex-col gap-3">
          <h4 className="font-semibold text-base text-[#111c2c]">
            Mood vs. Exercise Correlation
          </h4>
          <p className="text-sm text-[#414940] leading-relaxed">
            You tend to feel more energetic on days you log physical activity. Keep it up!
          </p>

          <div className="mt-2 p-4 bg-[#eddcff] rounded-xl flex items-center gap-4">
            <span className="material-symbols-outlined text-[#6a548c] text-3xl">
              fitness_center
            </span>
            <div className="flex-1 flex flex-col gap-1.5">
              <input
                type="range"
                min="0"
                max="100"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-[#6a548c] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-semibold text-[#523c72]">
                <span>Low Energy (20%)</span>
                <span>Active ({energyLevel}%)</span>
                <span>High Energy (100%)</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#6a548c] text-3xl">
              sentiment_satisfied
            </span>
          </div>
        </div>
      </section>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#dee8ff] animate-scale-up">
            <h3 className="font-display font-bold text-lg text-[#111c2c] mb-3">
              Add Student Lifestyle Habit
            </h3>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#414940] mb-1">
                  Habit Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Hydration (8 glasses), Walk on campus"
                  className="w-full bg-[#f9f9ff] border border-[#d8e3fa] rounded-xl px-3 py-2 text-sm focus:border-[#35693f] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#414940] mb-1">
                  Target Measurement
                </label>
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="w-full bg-[#f9f9ff] border border-[#d8e3fa] rounded-xl px-3 py-2 text-sm focus:border-[#35693f] outline-none"
                >
                  <option value="hours">Hours per day</option>
                  <option value="events">Checklist (Done / Not Done)</option>
                  <option value="days">Days per week</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-[#717970] hover:bg-[#f0f3ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-bold bg-[#35693f] text-white hover:bg-[#1c5129]"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
