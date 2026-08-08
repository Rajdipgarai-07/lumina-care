export type MoodType = 'happy' | 'calm' | 'stressed' | 'sad' | 'anxious' | 'energetic' | 'overwhelmed';

export interface MoodItem {
  id: MoodType;
  label: string;
  emoji: string;
  bgClass: string;
  borderClass: string;
  colorHex: string;
  description: string;
}

export interface MoodLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mood: MoodType;
  intensity: number; // 1-5
  reflection?: string;
  tags?: string[];
  aiFeedback?: {
    empatheticResponse: string;
    microTip: string;
    affirmation: string;
  };
}

export interface HabitDay {
  dayName: string; // 'M', 'T', 'W', 'T', 'F', 'S', 'S'
  date: string;
  value?: number; // e.g. 8 for 8 hours
  completed?: boolean;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  targetUnit: string; // 'hours', 'days', 'events', 'glasses'
  weeklyDays: HabitDay[];
  badgeText: string;
  colorTheme: 'sage' | 'sky' | 'lavender' | 'amber';
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  prompt?: string;
  mood: MoodType;
  tags: string[];
}

export interface CopingResource {
  id: string;
  title: string;
  category: 'mindfulness' | 'study-breaks' | 'journaling' | 'grounding';
  duration: string;
  description: string;
  imageUrl: string;
  badge: string;
}

export interface StudentProfile {
  name: string;
  avatarUrl: string;
  major: string;
  academicYear: string;
  university: string;
  streakDays: number;
  upcomingExams: { title: string; date: string; daysLeft: number }[];
}

export interface RiverpodStateSlice {
  providerName: string;
  type: 'StateNotifierProvider' | 'StateProvider' | 'FutureProvider';
  lastUpdated: string;
  value: any;
}
