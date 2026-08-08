import React, { useState, useEffect } from 'react';
import { useRiverpod } from '../context/RiverpodContext';
import { X, Volume2, VolumeX, Play, Pause, Sparkles } from 'lucide-react';

export const BoxBreathingModal: React.FC = () => {
  const { isBreathingOpen, setIsBreathingOpen } = useRiverpod();
  const [phase, setPhase] = useState<'Inhale' | 'Hold 1' | 'Exhale' | 'Hold 2'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isRunning, setIsRunning] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Web Audio Synth chime
  const playChime = (freq: number) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      // Audio context fallback
    }
  };

  useEffect(() => {
    if (!isBreathingOpen || !isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phase
        if (phase === 'Inhale') {
          setPhase('Hold 1');
          playChime(440); // A4 note
        } else if (phase === 'Hold 1') {
          setPhase('Exhale');
          playChime(392); // G4 note
        } else if (phase === 'Exhale') {
          setPhase('Hold 2');
          playChime(349); // F4 note
        } else {
          setPhase('Inhale');
          setCyclesCompleted(c => c + 1);
          playChime(523); // C5 note
        }
        return 4;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingOpen, isRunning, phase, soundEnabled]);

  if (!isBreathingOpen) return null;

  const phaseInstruction = {
    'Inhale': 'Breathe in slowly through your nose...',
    'Hold 1': 'Gently hold your breath...',
    'Exhale': 'Exhale smoothly through your mouth...',
    'Hold 2': 'Rest gently before next breath...'
  }[phase];

  const circleScale = phase === 'Inhale' ? 'scale-125' : phase === 'Exhale' ? 'scale-90' : 'scale-110';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-white to-[#f0f3ff] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#b89edc]/30 flex flex-col items-center relative overflow-hidden animate-scale-up">
        {/* Close Button */}
        <button
          onClick={() => setIsBreathingOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#f0f3ff] text-[#717970] hover:text-[#111c2c]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#6a548c] font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>4-4-4-4 Box Breathing</span>
        </div>

        <h3 className="font-display font-bold text-2xl text-[#111c2c] mb-1">
          Exam & Study Reset
        </h3>
        <p className="text-xs text-[#717970] text-center mb-6">
          Lower cortisol and restore autonomic focus in 4 cycles.
        </p>

        {/* Breathing Circle Animation */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-6">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#7fb685]/40 to-[#bde5fc]/50 blur-xl transition-all duration-1000 ${circleScale}`} />
          <div className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-[#35693f] bg-white flex flex-col items-center justify-center shadow-lg transition-all duration-1000 ${circleScale}`}>
            <span className="font-display font-bold text-3xl text-[#35693f]">{phase}</span>
            <span className="font-display font-extrabold text-4xl text-[#111c2c] mt-1">{secondsLeft}s</span>
          </div>
        </div>

        <p className="font-medium text-sm text-[#414940] text-center h-6 mb-6">
          {phaseInstruction}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="bg-[#35693f] text-white p-3.5 rounded-full hover:bg-[#1c5129] shadow-md transition-all active:scale-95"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="bg-[#f0f3ff] text-[#3c6376] p-3.5 rounded-full hover:bg-[#dee8ff] border border-[#dee8ff] transition-all"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>

        <div className="mt-6 text-xs text-[#717970] font-semibold bg-white/80 px-4 py-1.5 rounded-full border border-[#dee8ff]">
          Completed: {cyclesCompleted} Cycles
        </div>
      </div>
    </div>
  );
};
