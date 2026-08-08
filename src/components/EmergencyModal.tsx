import React from 'react';
import { useRiverpod } from '../context/RiverpodContext';
import { X, PhoneCall, MessageSquare, ShieldAlert, HeartHandshake, Wind } from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { isEmergencyOpen, setIsEmergencyOpen, setIsBreathingOpen } = useRiverpod();

  if (!isEmergencyOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-[#ffdad6] flex flex-col gap-4 relative animate-scale-up">
        {/* Close */}
        <button
          onClick={() => setIsEmergencyOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#f0f3ff] text-[#717970] hover:text-[#111c2c]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#ba1a1a]">
          <ShieldAlert className="w-6 h-6" />
          <h3 className="font-display font-bold text-xl text-[#111c2c]">
            Student Emergency Support
          </h3>
        </div>

        <p className="text-xs text-[#414940] leading-relaxed">
          If you are experiencing overwhelming distress or feeling unsafe, please reach out immediately. You do not have to carry this alone.
        </p>

        {/* Immediate 1-Min Calming Action */}
        <div className="bg-[#eddcff]/60 p-4 rounded-2xl border border-[#b89edc]/40 flex items-center justify-between">
          <div>
            <span className="font-bold text-xs text-[#6a548c] block">Need immediate grounding?</span>
            <span className="text-[11px] text-[#414940]">Start 4-min box breathing reset now.</span>
          </div>
          <button
            onClick={() => {
              setIsEmergencyOpen(false);
              setIsBreathingOpen(true);
            }}
            className="bg-[#6a548c] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-[#523c72]"
          >
            <Wind className="w-3.5 h-3.5" />
            Breathe
          </button>
        </div>

        {/* Helplines List */}
        <div className="flex flex-col gap-2.5 mt-1">
          {/* National Crisis Line */}
          <a
            href="tel:988"
            className="bg-[#ffdad6] p-3.5 rounded-2xl flex items-center justify-between text-[#93000a] hover:bg-[#ffd1cc] transition-colors"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold text-sm block">988 Suicide & Crisis Lifeline</span>
                <span className="text-[11px] opacity-80">Free, confidential 24/7 support</span>
              </div>
            </div>
            <span className="font-bold text-xs bg-white text-[#ba1a1a] px-2.5 py-1 rounded-full shadow-sm">
              Call 988
            </span>
          </a>

          {/* Crisis Text Line */}
          <a
            href="sms:741741?body=HOME"
            className="bg-[#f0f3ff] p-3.5 rounded-2xl flex items-center justify-between text-[#234b5e] border border-[#dee8ff] hover:bg-[#dee8ff] transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 shrink-0 text-[#3c6376]" />
              <div>
                <span className="font-bold text-sm block">Crisis Text Line</span>
                <span className="text-[11px] text-[#717970]">Text HOME to 741741</span>
              </div>
            </div>
            <span className="font-bold text-xs bg-[#3c6376] text-white px-2.5 py-1 rounded-full">
              Text
            </span>
          </a>

          {/* Campus Counseling */}
          <div className="bg-[#f9f9ff] p-3.5 rounded-2xl border border-[#d8e3fa]">
            <div className="flex items-center gap-2 text-[#35693f] font-bold text-xs mb-1">
              <HeartHandshake className="w-4 h-4" />
              <span>Campus Counseling Center</span>
            </div>
            <p className="text-xs text-[#414940]">
              State University Health Center, Building B • Phone: (555) 019-2834
            </p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setIsEmergencyOpen(false)}
            className="text-xs font-semibold text-[#717970] hover:text-[#111c2c]"
          >
            Close Support Panel
          </button>
        </div>
      </div>
    </div>
  );
};
