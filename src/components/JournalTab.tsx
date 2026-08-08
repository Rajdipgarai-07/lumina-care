import React, { useState } from 'react';
import { useRiverpod } from '../context/RiverpodContext';
import { PenTool, Sparkles, Send, Tag, BookMarked, MessageSquare, Plus } from 'lucide-react';
import { JournalEntry, MoodType } from '../types';

export const JournalTab: React.FC = () => {
  const { journalEntries, addJournalEntry, selectedMood } = useRiverpod();
  
  const [activeSubTab, setActiveSubTab] = useState<'entries' | 'write' | 'chat'>('entries');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activePrompt, setActivePrompt] = useState<string>('');
  const [promptsList, setPromptsList] = useState<string[]>([
    "What is one small win from your study session today?",
    "How can you extend kindness to yourself during this busy week?",
    "What is one worry you can let go of for the next hour?"
  ]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'lumina'; text: string }[]>([
    { sender: 'lumina', text: "Hello Jamie! I'm Lumina, your student wellness companion. How are things going with your classes and mood today?" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  const handleGeneratePrompts = async () => {
    setIsLoadingPrompts(true);
    try {
      const res = await fetch('/api/gemini/journal-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'Self-Care & Academics', currentMood: selectedMood })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.prompts && data.prompts.length > 0) {
          setPromptsList(data.prompts);
        }
      }
    } catch (e) {
      console.warn("Prompt generation error", e);
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      title,
      content,
      prompt: activePrompt,
      mood: selectedMood,
      tags: ['Journal', 'Reflection', selectedMood]
    });

    setTitle('');
    setContent('');
    setActivePrompt('');
    setActiveSubTab('entries');
  };

  const handleSendChat = async () => {
    if (!inputMessage.trim() || isSendingChat) return;

    const userText = inputMessage;
    setInputMessage('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/gemini/reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          reflection: userText,
          studentContext: "Chatting with Lumina student mentor"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [
          ...prev, 
          { sender: 'lumina', text: `${data.empatheticResponse} ${data.microTip}` }
        ]);
      } else {
        setChatMessages(prev => [
          ...prev, 
          { sender: 'lumina', text: "Thank you for sharing. Remember to pause and take 3 deep breaths whenever things feel heavy." }
        ]);
      }
    } catch (e) {
      setChatMessages(prev => [
        ...prev, 
        { sender: 'lumina', text: "I'm listening. You're taking great steps by acknowledging your thoughts!" }
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="max-w-[760px] mx-auto px-4 pt-6 pb-20 flex flex-col gap-6">
      {/* Header & Sub-nav */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-display font-bold text-2xl text-[#111c2c]">
            Student Journal & AI Mentor
          </h2>
          <p className="text-xs text-[#717970]">
            Safe space for thoughts, prompts, and empathetic AI guidance
          </p>
        </div>

        <div className="flex bg-[#f0f3ff] p-1 rounded-full border border-[#dee8ff]">
          <button
            onClick={() => setActiveSubTab('entries')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeSubTab === 'entries' ? 'bg-[#35693f] text-white shadow-sm' : 'text-[#414940]'
            }`}
          >
            Reflections ({journalEntries.length})
          </button>
          <button
            onClick={() => setActiveSubTab('write')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeSubTab === 'write' ? 'bg-[#35693f] text-white shadow-sm' : 'text-[#414940]'
            }`}
          >
            + New Note
          </button>
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
              activeSubTab === 'chat' ? 'bg-[#6a548c] text-white shadow-sm' : 'text-[#414940]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            AI Companion
          </button>
        </div>
      </div>

      {/* SubTab 1: Journal Entries Timeline */}
      {activeSubTab === 'entries' && (
        <div className="flex flex-col gap-4">
          {journalEntries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#dee8ff]">
              <PenTool className="w-10 h-10 text-[#717970] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#111c2c]">No journal entries yet</p>
              <p className="text-xs text-[#717970] mb-4">Start by picking a prompt or writing your thoughts.</p>
              <button
                onClick={() => setActiveSubTab('write')}
                className="bg-[#35693f] text-white px-5 py-2 rounded-full text-xs font-bold"
              >
                Write First Reflection
              </button>
            </div>
          ) : (
            journalEntries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-2xl p-5 ambient-shadow border border-[#e7eeff] flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#717970] font-medium">{entry.date}</span>
                  <span className="bg-[#b7f1bb] text-[#1c5129] px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px]">
                    {entry.mood}
                  </span>
                </div>
                
                <h3 className="font-display font-bold text-base text-[#111c2c]">
                  {entry.title}
                </h3>

                {entry.prompt && (
                  <p className="text-xs italic text-[#6a548c] bg-[#eddcff]/40 p-2.5 rounded-lg border border-[#b89edc]/30">
                    Prompt: "{entry.prompt}"
                  </p>
                )}

                <p className="text-sm text-[#414940] leading-relaxed whitespace-pre-line">
                  {entry.content}
                </p>

                <div className="flex gap-2 mt-1">
                  {entry.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-[#f0f3ff] text-[#3c6376] px-2 py-0.5 rounded-md font-semibold">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SubTab 2: Write New Reflection */}
      {activeSubTab === 'write' && (
        <form onSubmit={handleSaveJournal} className="bg-white rounded-2xl p-6 ambient-shadow border border-[#e7eeff] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-[#111c2c]">
              New Reflection
            </h3>
            <button
              type="button"
              onClick={handleGeneratePrompts}
              disabled={isLoadingPrompts}
              className="text-xs font-bold text-[#6a548c] bg-[#eddcff] hover:bg-[#d6bbfb] px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoadingPrompts ? 'Generating...' : 'Refresh AI Prompts'}</span>
            </button>
          </div>

          {/* Prompt Selector */}
          <div className="bg-[#f0f3ff] p-3 rounded-xl border border-[#dee8ff]">
            <span className="text-xs font-bold text-[#3c6376] block mb-1.5">
              Select an inspiring student prompt (Optional):
            </span>
            <div className="flex flex-col gap-1.5">
              {promptsList.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePrompt(p)}
                  className={`text-left text-xs p-2 rounded-lg transition-all ${
                    activePrompt === p 
                      ? 'bg-[#35693f] text-white font-medium shadow-sm' 
                      : 'bg-white text-[#414940] hover:bg-[#dee8ff]'
                  }`}
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#414940] mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Campus library study reflections..."
              className="w-full bg-[#f9f9ff] border border-[#d8e3fa] rounded-xl px-4 py-2.5 text-sm text-[#111c2c] focus:border-[#35693f] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#414940] mb-1">Your Reflection</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Express what's on your mind freely..."
              rows={5}
              className="w-full bg-[#f9f9ff] border border-[#d8e3fa] rounded-xl p-4 text-sm text-[#111c2c] focus:border-[#35693f] outline-none resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('entries')}
              className="px-4 py-2 rounded-full text-xs text-[#717970]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#35693f] text-white hover:bg-[#1c5129]"
            >
              Save Reflection
            </button>
          </div>
        </form>
      )}

      {/* SubTab 3: Lumina AI Companion Chat */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-2xl p-5 ambient-shadow border border-[#e7eeff] flex flex-col h-[460px]">
          <div className="flex items-center gap-2 pb-3 border-b border-[#dee8ff]">
            <div className="w-8 h-8 rounded-full bg-[#6a548c] text-white flex items-center justify-center font-bold text-xs">
              ✦
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[#111c2c]">
                Lumina Student Mentor AI
              </h3>
              <p className="text-[11px] text-[#717970]">
                Always available for empathetic, non-judgmental support
              </p>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#35693f] text-white self-end rounded-br-none'
                    : 'bg-[#f0f3ff] text-[#111c2c] self-start rounded-bl-none border border-[#dee8ff]'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isSendingChat && (
              <div className="bg-[#f0f3ff] text-[#717970] p-3 rounded-2xl text-xs self-start italic animate-pulse">
                Lumina is typing a thoughtful response...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="pt-3 border-t border-[#dee8ff] flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Type your message or worry..."
              className="flex-1 bg-[#f9f9ff] border border-[#d8e3fa] rounded-full px-4 py-2.5 text-xs sm:text-sm focus:border-[#6a548c] outline-none"
            />
            <button
              onClick={handleSendChat}
              disabled={isSendingChat || !inputMessage.trim()}
              className="bg-[#6a548c] text-white p-2.5 rounded-full hover:bg-[#523c72] disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
