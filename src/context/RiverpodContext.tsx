import React, { createContext, useContext, useState, useEffect } from 'react';
import { MoodLog, MoodType, Habit, JournalEntry, StudentProfile, RiverpodStateSlice } from '../types';

// Hotlinked avatar images from prompt HTML
export const AVATAR_URLS = {
  primary: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0eubAnzL2LioYCyebYHZxEDY3UAwYfb5Kusm7W2A1gI2XkP-KxgDNgKby5RlUUe7hr2E-vCJwDIib-PTc3MB1EuCxGmXqcfcq0HXtibIGkzu86KwwBRjD4YhKGdgv-_s-i8kIU3F0AgZ0Qpw90KU0xyLZCfycsZCOSwkfivX71DJwwdJGuMyq1giLlbjEekMkaHfZsnRE0JVLMPw0QCqUX6qtE7eJHaqVqgTQWy2ci2UhbQge4sQxZQ",
  secondary: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKbb-Pc0YLzGOoSk2CwA_oyKwjPsCWVWC53e_KQlUXbyeV1S5s9iFPWdd1tt-hmfvePQouoDRcaehooZAwFbSn49QSWKyAW1RlO28SdZf7ipvSMSzRFxybs_FX8BhSPsGN-OV6zv2pK_ZGvjJIfe_P6h56BCRj8RqMII19HnhXYAGhxg3gVoHbAjCU4yepSmCKQt661UakHwUNYdUPGEC-Xv_oEEmlRmYUp-67H7LQuwJsKDqM3WKE9w",
  calmAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7YdBnEGwuO18WfZlfgpI18O6ORO0j8QEXzzqGvSTsvbOpVlBE4g5bfgwD_WQOdtDTZMhumCqPwEkDibtSSLObmtQbe4WZvouGBPPd4Xtp4DCzf0S2nf7yeYB9EuOhH3yAipHcP0R-qyMzDHnq6ee_zO_mZ9oAINklNJXqZqNu298w_wDakTf51k5cRMJVcrC41hpFSI9nSH8waOwCRXeB5_yhYADGo5nQdyBbOqP0OskRkdgxrgUD_Q"
};

export const HOTLINK_IMAGES = {
  boxBreathing: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdaUFH-0YbYcbRbhKFArThNSYksXPfpS4p0_HtxhK3zFtijOB_ExTSGv3L57_Ir8HGESqqndJdrshqxxQHycxCxwD3ozu8arHwRIy-i1-ZJIKqP-iRmSi2LXHDyJWdajONP6SjCWw2QPN5GOHRdwCdfNbNzuPMWpEOaUrvrxAndPBi39i4OqTaybZYEnKbjbJJfVLBxUfmCgfyjm_TpEJExCZWXRX_6yq9TAtk7PvFWqfXSc97Qaf-eA",
  groundingMug: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxxQq13Gmq-GA4h8t1E6bMonp4mVEuj6PmubGDkQftESVwyNL5rm-DlqOV1BMkAZzdI5JmL9QLPt0VG_KPxu5iaa3Cfgqp115ab0QOvmEqO34Eaigc5VjnIhWxQoGUOHcRC-9ZzDNnHuz4NNoW8e2O_bStW4YuFJ3fDnFDieD2sP3DG2IsensJz-Tllr_4Du6K3tYdiC-r6_ZhbJ2GxTXIvgXNDD-hxPpNPKvbluYYVitNmV64Km_zrQ"
};

const INITIAL_PROFILE: StudentProfile = {
  name: "Jamie",
  avatarUrl: AVATAR_URLS.primary,
  major: "Computer Science & Design",
  academicYear: "Junior (Year 3)",
  university: "State University",
  streakDays: 12,
  upcomingExams: [
    { title: "Algorithms & Data Structures", date: "Aug 11, 2026", daysLeft: 3 },
    { title: "Human-Computer Interaction", date: "Aug 15, 2026", daysLeft: 7 }
  ]
};

const INITIAL_HABITS: Habit[] = [
  {
    id: "sleep",
    title: "Sleep Log",
    icon: "bedtime",
    targetUnit: "hours",
    badgeText: "7/7 days",
    colorTheme: "sky",
    weeklyDays: [
      { dayName: "M", date: "Mon", value: 8, completed: true },
      { dayName: "T", date: "Tue", value: 7, completed: true },
      { dayName: "W", date: "Wed", value: 7, completed: true },
      { dayName: "T", date: "Thu", value: 8, completed: true },
      { dayName: "F", date: "Fri", value: 6, completed: true },
      { dayName: "S", date: "Sat", value: 9, completed: true },
      { dayName: "S", date: "Sun", value: 8, completed: true }
    ]
  },
  {
    id: "study",
    title: "Study Hours",
    icon: "menu_book",
    targetUnit: "hours",
    badgeText: "12h total",
    colorTheme: "sage",
    weeklyDays: [
      { dayName: "M", date: "Mon", value: 2, completed: true },
      { dayName: "T", date: "Tue", value: 3, completed: true },
      { dayName: "W", date: "Wed", value: 0, completed: false },
      { dayName: "T", date: "Thu", value: 4, completed: true },
      { dayName: "F", date: "Fri", value: 3, completed: true },
      { dayName: "S", date: "Sat", value: 0, completed: false },
      { dayName: "S", date: "Sun", value: 0, completed: false }
    ]
  },
  {
    id: "social",
    title: "Social Activity",
    icon: "groups",
    targetUnit: "events",
    badgeText: "3 events",
    colorTheme: "lavender",
    weeklyDays: [
      { dayName: "M", date: "Mon", completed: false },
      { dayName: "T", date: "Tue", completed: true },
      { dayName: "W", date: "Wed", completed: false },
      { dayName: "T", date: "Thu", completed: false },
      { dayName: "F", date: "Fri", completed: true },
      { dayName: "S", date: "Sat", completed: true },
      { dayName: "S", date: "Sun", completed: false }
    ]
  }
];

const INITIAL_MOOD_LOGS: MoodLog[] = [
  { id: "1", date: "2026-08-01", time: "09:00", mood: "calm", intensity: 4, reflection: "Morning coffee and gentle music." },
  { id: "2", date: "2026-08-02", time: "14:30", mood: "happy", intensity: 5, reflection: "Finished project milestone early!" },
  { id: "3", date: "2026-08-03", time: "19:15", mood: "stressed", intensity: 3, reflection: "Exam preparation getting intense." },
  { id: "4", date: "2026-08-04", time: "10:00", mood: "anxious", intensity: 3, reflection: "Midterm group presentation today." },
  { id: "5", date: "2026-08-05", time: "21:00", mood: "calm", intensity: 4, reflection: "Yoga session helped release stress." },
  { id: "6", date: "2026-08-06", time: "08:30", mood: "happy", intensity: 4, reflection: "Good study rhythm with study group." },
  { id: "7", date: "2026-08-07", time: "09:15", mood: "calm", intensity: 4, reflection: "Feeling balanced and ready for the week." }
];

const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: "j1",
    date: "2026-08-06",
    title: "Navigating Midterm Anxiety",
    content: "Felt a surge of worry about the Algorithms exam coming up. Took 10 minutes to do box breathing on campus, which lowered my heart rate noticeably.",
    prompt: "How can you extend kindness to yourself during this busy week?",
    mood: "calm",
    tags: ["Academics", "Breathing", "Self-Care"]
  },
  {
    id: "j2",
    date: "2026-08-04",
    title: "Grateful for Campus Library Quiet Hours",
    content: "Found a cozy corner in the 4th floor library with a view of the quad. Finished two problem sets before sunset.",
    prompt: "What is one small win from your study session today?",
    mood: "happy",
    tags: ["Study", "Gratitude"]
  }
];

interface RiverpodContextType {
  activeTab: 'home' | 'habits' | 'resources' | 'journal' | 'profile';
  setActiveTab: (tab: 'home' | 'habits' | 'resources' | 'journal' | 'profile') => void;
  selectedMood: MoodType;
  setSelectedMood: (mood: MoodType) => void;
  reflectionText: string;
  setReflectionText: (text: string) => void;
  moodLogs: MoodLog[];
  habits: Habit[];
  journalEntries: JournalEntry[];
  studentProfile: StudentProfile;
  isMobileFrame: boolean;
  setIsMobileFrame: React.Dispatch<React.SetStateAction<boolean>>;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (open: boolean) => void;
  isEmergencyOpen: boolean;
  setIsEmergencyOpen: (open: boolean) => void;
  isBreathingOpen: boolean;
  setIsBreathingOpen: (open: boolean) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  
  // Actions
  saveMoodCheckIn: (reflection?: string) => Promise<MoodLog>;
  updateHabitDay: (habitId: string, dayIndex: number, value?: number, completed?: boolean) => void;
  addNewHabit: (habit: Habit) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  
  // State slices inspect array
  riverpodSlices: RiverpodStateSlice[];
}

const RiverpodContext = createContext<RiverpodContextType | undefined>(undefined);

export const RiverpodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'habits' | 'resources' | 'journal' | 'profile'>('home');
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [reflectionText, setReflectionText] = useState<string>('');
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => {
    const saved = localStorage.getItem('lumina_mood_logs');
    return saved ? JSON.parse(saved) : INITIAL_MOOD_LOGS;
  });
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('lumina_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('lumina_journal');
    return saved ? JSON.parse(saved) : INITIAL_JOURNAL;
  });
  const [studentProfile] = useState<StudentProfile>(INITIAL_PROFILE);

  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lumina_mood_logs', JSON.stringify(moodLogs));
  }, [moodLogs]);

  useEffect(() => {
    localStorage.setItem('lumina_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('lumina_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Save mood check-in with Gemini server reflection call
  const saveMoodCheckIn = async (customReflection?: string) => {
    const textToSave = customReflection !== undefined ? customReflection : reflectionText;
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let aiFeedback = {
      empatheticResponse: "Thank you for checking in today! Honor where you are right now.",
      microTip: "Take 3 deep breaths and relax your jaw.",
      affirmation: "You are doing great in your academic journey."
    };

    try {
      const res = await fetch('/api/gemini/reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          reflection: textToSave,
          studentContext: `${studentProfile.major}, ${studentProfile.academicYear}`
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.empatheticResponse) {
          aiFeedback = data;
        }
      }
    } catch (e) {
      console.warn("AI reflection call fallback", e);
    }

    const newLog: MoodLog = {
      id: Date.now().toString(),
      date: todayStr,
      time: timeStr,
      mood: selectedMood,
      intensity: selectedMood === 'happy' ? 5 : selectedMood === 'calm' ? 4 : 3,
      reflection: textToSave,
      tags: [selectedMood, "Student Life"],
      aiFeedback
    };

    setMoodLogs(prev => [newLog, ...prev]);
    setReflectionText('');
    return newLog;
  };

  const updateHabitDay = (habitId: string, dayIndex: number, value?: number, completed?: boolean) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const updatedDays = [...h.weeklyDays];
      const targetDay = { ...updatedDays[dayIndex] };
      if (completed !== undefined) targetDay.completed = completed;
      if (value !== undefined) targetDay.value = value;
      updatedDays[dayIndex] = targetDay;

      // recalculate badge text
      let badge = h.badgeText;
      if (h.targetUnit === 'hours') {
        const sum = updatedDays.reduce((acc, curr) => acc + (curr.value || 0), 0);
        badge = `${sum}h total`;
      } else if (h.targetUnit === 'events') {
        const count = updatedDays.filter(d => d.completed).length;
        badge = `${count} events`;
      } else if (h.targetUnit === 'days') {
        const count = updatedDays.filter(d => d.completed).length;
        badge = `${count}/7 days`;
      }

      return { ...h, weeklyDays: updatedDays, badgeText: badge };
    }));
  };

  const addNewHabit = (habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  // Construct Riverpod State Inspection Slices
  const riverpodSlices: RiverpodStateSlice[] = [
    {
      providerName: 'moodNotifierProvider',
      type: 'StateNotifierProvider',
      lastUpdated: 'Just now',
      value: { currentMood: selectedMood, totalLogs: moodLogs.length, latestLog: moodLogs[0] }
    },
    {
      providerName: 'habitsNotifierProvider',
      type: 'StateNotifierProvider',
      lastUpdated: 'Realtime',
      value: habits.map(h => ({ title: h.title, badge: h.badgeText }))
    },
    {
      providerName: 'studentProfileProvider',
      type: 'StateProvider',
      lastUpdated: 'Synced',
      value: { name: studentProfile.name, streak: studentProfile.streakDays, major: studentProfile.major }
    },
    {
      providerName: 'copingResourcesProvider',
      type: 'FutureProvider',
      lastUpdated: 'Loaded',
      value: { categories: ['Mindfulness', 'Study Breaks', 'Journaling', 'Grounding'], activeExercise: isBreathingOpen ? 'Box Breathing' : 'None' }
    }
  ];

  return (
    <RiverpodContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedMood,
      setSelectedMood,
      reflectionText,
      setReflectionText,
      moodLogs,
      habits,
      journalEntries,
      studentProfile,
      isMobileFrame,
      setIsMobileFrame,
      isInspectorOpen,
      setIsInspectorOpen,
      isEmergencyOpen,
      setIsEmergencyOpen,
      isBreathingOpen,
      setIsBreathingOpen,
      isCalendarOpen,
      setIsCalendarOpen,
      saveMoodCheckIn,
      updateHabitDay,
      addNewHabit,
      addJournalEntry,
      riverpodSlices
    }}>
      {children}
    </RiverpodContext.Provider>
  );
};

export const useRiverpod = () => {
  const context = useContext(RiverpodContext);
  if (!context) {
    throw new Error('useRiverpod must be used within a RiverpodProvider');
  }
  return context;
};
