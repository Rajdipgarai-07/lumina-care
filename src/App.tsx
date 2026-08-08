import React from 'react';
import { RiverpodProvider, useRiverpod } from './context/RiverpodContext';
import { TopHeader } from './components/TopHeader';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeTab } from './components/HomeTab';
import { HabitsTab } from './components/HabitsTab';
import { ResourcesTab } from './components/ResourcesTab';
import { JournalTab } from './components/JournalTab';
import { ProfileTab } from './components/ProfileTab';
import { BoxBreathingModal } from './components/BoxBreathingModal';
import { RiverpodInspectorModal } from './components/RiverpodInspectorModal';
import { CalendarModal } from './components/CalendarModal';
import { EmergencyModal } from './components/EmergencyModal';
import { Smartphone, Wifi, Battery, Signal } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, isMobileFrame, setIsMobileFrame } = useRiverpod();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'habits':
        return <HabitsTab />;
      case 'resources':
        return <ResourcesTab />;
      case 'journal':
        return <JournalTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#111c2c] flex flex-col items-center justify-center p-0 sm:p-4 md:p-8 font-sans">
      {/* Mobile Device Bezel Frame Toggle Wrapper */}
      {isMobileFrame ? (
        <div className="w-full max-w-[440px] bg-white rounded-[48px] shadow-[0_20px_60px_-15px_rgba(53,105,63,0.18)] border-[10px] border-[#111c2c] overflow-hidden flex flex-col h-[90vh] max-h-[880px] min-h-[700px] relative transition-all duration-300">
          
          {/* Mobile Phone Top Notch / Status Bar */}
          <div className="bg-[#f9f9ff] px-6 pt-3 pb-1 flex justify-between items-center text-xs font-bold text-[#111c2c] shrink-0 border-b border-[#dee8ff]/40">
            <span>9:41</span>
            
            {/* Camera Pill */}
            <div className="w-20 h-4 bg-[#111c2c] rounded-full mx-auto" />
            
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-[#111c2c]" />
            </div>
          </div>

          {/* App Header */}
          <TopHeader />

          {/* Main Tab Viewport */}
          <main className="flex-1 overflow-y-auto relative">
            {renderActiveTab()}
          </main>

          {/* Bottom App Bar */}
          <BottomNavBar />

          {/* Mobile Home Pill Indicator */}
          <div className="bg-[#f9f9ff] py-1 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-[#111c2c]/30 rounded-full" />
          </div>
        </div>
      ) : (
        /* Responsive Wide Desktop View */
        <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-xl border border-[#dee8ff] min-h-[85vh] flex flex-col overflow-hidden my-4">
          <TopHeader />
          <main className="flex-1 overflow-y-auto">
            {renderActiveTab()}
          </main>
          <BottomNavBar />
        </div>
      )}

      {/* Floating Helper Switcher for Desktop */}
      <div className="fixed bottom-4 right-4 hidden sm:flex items-center gap-2 bg-[#111c2c] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-2xl z-40">
        <span>Flutter Device Preview:</span>
        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          className="bg-[#35693f] text-white px-3 py-1 rounded-full font-bold hover:bg-[#1c5129] transition-colors"
        >
          {isMobileFrame ? 'Expand to Responsive Web' : 'Switch to Phone Mockup'}
        </button>
      </div>

      {/* Modals */}
      <BoxBreathingModal />
      <RiverpodInspectorModal />
      <CalendarModal />
      <EmergencyModal />
    </div>
  );
};

export default function App() {
  return (
    <RiverpodProvider>
      <AppContent />
    </RiverpodProvider>
  );
}
