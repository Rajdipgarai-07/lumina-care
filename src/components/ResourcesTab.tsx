import React, { useState } from 'react';
import { useRiverpod, HOTLINK_IMAGES } from '../context/RiverpodContext';
import { Search, Play, Hospital, Wind, Eye, Sparkles } from 'lucide-react';

export const ResourcesTab: React.FC = () => {
  const { setIsBreathingOpen, setIsEmergencyOpen } = useRiverpod();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeGroundingStep, setActiveGroundingStep] = useState<number | null>(null);

  const groundingSteps = [
    { count: 5, sense: 'Things you can SEE around your study space', example: 'Desk lamp, notebook, tree outside window...' },
    { count: 4, sense: 'Things you can TOUCH or feel', example: 'Cozy sweater, keycaps, mug warmth...' },
    { count: 3, sense: 'Things you can HEAR right now', example: 'Library hum, soft breeze, rain...' },
    { count: 2, sense: 'Things you can SMELL', example: 'Coffee, fresh paper, lavender oil...' },
    { count: 1, sense: 'Thing you can TASTE or mindfully experience', example: 'Sip of tea or cool water...' }
  ];

  return (
    <div className="max-w-[760px] mx-auto px-4 pt-6 pb-20 flex flex-col gap-6">
      {/* Search Bar */}
      <div className="relative flex items-center w-full">
        <Search className="absolute left-4 w-5 h-5 text-[#717970]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find a coping strategy or study break..."
          className="w-full pl-12 pr-4 py-3.5 rounded-full bg-[#f0f3ff] border border-[#c1c9be] focus:border-[#35693f] focus:ring-2 focus:ring-[#35693f]/20 outline-none text-sm text-[#111c2c] placeholder-[#717970] shadow-inner transition-all"
        />
      </div>

      {/* Categories */}
      <div>
        <h2 className="font-display font-bold text-xl text-[#111c2c] mb-3">
          Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'mindfulness' ? 'all' : 'mindfulness')}
            className={`rounded-2xl p-4 flex flex-col items-start gap-2 text-left ambient-shadow transition-transform active:scale-95 ${
              selectedCategory === 'mindfulness' ? 'bg-[#35693f] text-white' : 'bg-[#7fb685] text-[#114721]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">self_improvement</span>
            </div>
            <span className="font-bold text-sm">Mindfulness</span>
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'study-breaks' ? 'all' : 'study-breaks')}
            className={`rounded-2xl p-4 flex flex-col items-start gap-2 text-left ambient-shadow transition-transform active:scale-95 ${
              selectedCategory === 'study-breaks' ? 'bg-[#3c6376] text-white' : 'bg-[#bde5fc] text-[#40687b]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">coffee</span>
            </div>
            <span className="font-bold text-sm">Study Breaks</span>
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'journaling' ? 'all' : 'journaling')}
            className={`rounded-2xl p-4 flex flex-col items-start gap-2 text-left ambient-shadow transition-transform active:scale-95 col-span-2 sm:col-span-1 ${
              selectedCategory === 'journaling' ? 'bg-[#6a548c] text-white' : 'bg-[#b89edc] text-[#493369]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">edit_note</span>
            </div>
            <span className="font-bold text-sm">Journaling Prompts</span>
          </button>
        </div>
      </div>

      {/* Recommended for you */}
      <div>
        <h2 className="font-display font-bold text-xl text-[#111c2c] mb-3">
          Recommended for you
        </h2>
        <div className="flex flex-col gap-4">
          {/* Box Breathing Card */}
          <div 
            onClick={() => setIsBreathingOpen(true)}
            className="bg-white rounded-2xl p-4 sm:p-5 ambient-shadow border border-[#e7eeff] flex gap-4 cursor-pointer hover:bg-[#f9f9ff] transition-colors group"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#d8e3fa] shrink-0 relative">
              <img 
                src={HOTLINK_IMAGES.boxBreathing} 
                alt="Box Breathing Technique" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#b7f1bb] text-[#1c5129] px-2 py-0.5 rounded-full">
                  4-Min Guided
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-[#111c2c] group-hover:text-[#35693f] transition-colors">
                Box Breathing Technique
              </h3>
              <p className="text-xs text-[#414940] line-clamp-2 mt-0.5">
                A simple 4-step breathing exercise to quickly reduce acute exam anxiety and regain focus.
              </p>
            </div>
          </div>

          {/* 5-4-3-2-1 Grounding Card */}
          <div 
            onClick={() => setActiveGroundingStep(activeGroundingStep === null ? 0 : null)}
            className="bg-white rounded-2xl p-4 sm:p-5 ambient-shadow border border-[#e7eeff] flex flex-col gap-3 cursor-pointer hover:bg-[#f9f9ff] transition-colors group"
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#d8e3fa] shrink-0 relative">
                <img 
                  src={HOTLINK_IMAGES.groundingMug} 
                  alt="5-4-3-2-1 Grounding" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#c0e8ff] text-[#234b5e] px-2 py-0.5 rounded-full">
                    Interactive Sensory
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-[#111c2c] group-hover:text-[#3c6376] transition-colors">
                  The 5-4-3-2-1 Grounding
                </h3>
                <p className="text-xs text-[#414940] line-clamp-2 mt-0.5">
                  Use your senses to pull yourself back to the present moment when feeling overwhelmed.
                </p>
              </div>
            </div>

            {/* Interactive Grounding Tool Drawer */}
            {activeGroundingStep !== null && (
              <div className="mt-3 pt-3 border-t border-[#dee8ff] animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#6a548c]">
                    Step {activeGroundingStep + 1} of 5
                  </span>
                  <button 
                    onClick={() => setActiveGroundingStep(null)}
                    className="text-xs text-[#717970] hover:text-[#111c2c]"
                  >
                    Close
                  </button>
                </div>
                <div className="bg-[#eddcff]/50 p-4 rounded-xl border border-[#b89edc]/40 text-center">
                  <span className="text-3xl font-bold text-[#6a548c] block mb-1">
                    {groundingSteps[activeGroundingStep].count}
                  </span>
                  <p className="font-bold text-sm text-[#111c2c] mb-1">
                    {groundingSteps[activeGroundingStep].sense}
                  </p>
                  <p className="text-xs text-[#414940] italic">
                    Example: {groundingSteps[activeGroundingStep].example}
                  </p>
                </div>
                <div className="flex justify-between mt-3">
                  <button
                    disabled={activeGroundingStep === 0}
                    onClick={() => setActiveGroundingStep(prev => (prev! > 0 ? prev! - 1 : 0))}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#f0f3ff] text-[#3c6376] disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setActiveGroundingStep(prev => (prev! < 4 ? prev! + 1 : 0))}
                    className="text-xs font-bold px-4 py-1.5 rounded-full bg-[#6a548c] text-white"
                  >
                    {activeGroundingStep === 4 ? 'Complete Grounding 🎉' : 'Next Step →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Support Bar */}
      <div className="mt-4">
        <button
          onClick={() => setIsEmergencyOpen(true)}
          className="w-full bg-[#ffdad6] text-[#93000a] font-bold text-sm py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-[#ffd1cc] active:scale-[0.98] transition-all border border-[#ba1a1a]/20"
        >
          <span className="material-symbols-outlined">local_hospital</span>
          <span>Emergency Student Support</span>
        </button>
      </div>
    </div>
  );
};
