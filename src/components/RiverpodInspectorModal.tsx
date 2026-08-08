import React, { useState } from 'react';
import { useRiverpod } from '../context/RiverpodContext';
import { X, Cpu, RefreshCw, Terminal, CheckCircle2, Layers } from 'lucide-react';

export const RiverpodInspectorModal: React.FC = () => {
  const { isInspectorOpen, setIsInspectorOpen, riverpodSlices, selectedMood, setSelectedMood } = useRiverpod();
  const [selectedSlice, setSelectedSlice] = useState<string>(riverpodSlices[0].providerName);

  if (!isInspectorOpen) return null;

  const activeSlice = riverpodSlices.find(s => s.providerName === selectedSlice) || riverpodSlices[0];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111c2c] text-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-[#3c6376] flex flex-col max-h-[85vh] overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#3c6376]/40">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#9cd4a1]" />
            <h3 className="font-display font-bold text-lg text-white">
              Flutter Riverpod State Inspector
            </h3>
            <span className="bg-[#1c5129] text-[#9cd4a1] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#9cd4a1]/30">
              v2.5.0 Reactive
            </span>
          </div>
          <button
            onClick={() => setIsInspectorOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col sm:flex-row gap-4 py-4 flex-1 overflow-hidden">
          {/* Provider List */}
          <div className="w-full sm:w-1/3 flex flex-col gap-2 overflow-y-auto pr-1 border-r border-[#3c6376]/20">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2">
              Active Providers
            </span>
            {riverpodSlices.map((slice) => (
              <button
                key={slice.providerName}
                onClick={() => setSelectedSlice(slice.providerName)}
                className={`text-left p-2.5 rounded-xl text-xs font-mono transition-all flex flex-col gap-1 ${
                  selectedSlice === slice.providerName 
                    ? 'bg-[#35693f] text-white font-bold shadow-md' 
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#9cd4a1]" />
                  <span className="truncate">{slice.providerName}</span>
                </div>
                <span className="text-[10px] opacity-75 font-sans">{slice.type}</span>
              </button>
            ))}
          </div>

          {/* Provider Inspector Details */}
          <div className="flex-1 flex flex-col gap-3 overflow-hidden bg-black/40 rounded-2xl p-4 border border-white/10 font-mono text-xs">
            <div className="flex justify-between items-center text-gray-400 text-[11px] pb-2 border-b border-white/10">
              <span>Slice: <strong className="text-[#9cd4a1]">{activeSlice.providerName}</strong></span>
              <span>Updated: {activeSlice.lastUpdated}</span>
            </div>

            {/* JSON Output */}
            <pre className="flex-1 overflow-auto text-emerald-300 bg-black/50 p-3 rounded-xl border border-emerald-900/40 text-[11px] leading-relaxed">
              {JSON.stringify(activeSlice.value, null, 2)}
            </pre>

            {/* Quick State Mutation Testing */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-gray-400 font-sans">Simulate Riverpod Mutation:</span>
              <div className="flex gap-1">
                {(['calm', 'happy', 'stressed'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMood(m)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold capitalize ${
                      selectedMood === m ? 'bg-[#9cd4a1] text-black' : 'bg-white/10 text-gray-300'
                    }`}
                  >
                    Set {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#3c6376]/40 flex justify-between items-center text-xs text-gray-400">
          <span>Riverpod Container: <code className="text-[#9cd4a1]">ProviderScope</code> initialized</span>
          <button
            onClick={() => setIsInspectorOpen(false)}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-1.5 rounded-full text-xs"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
