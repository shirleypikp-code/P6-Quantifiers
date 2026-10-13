import React, { useState } from 'react';
import { UserProfile } from '../types/game';
import { sounds } from '../utils/audio';
import { UserCheck, Sparkles, X, Shield, GraduationCap } from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  isInitialSetup?: boolean;
}

const AVATARS = ['🧙‍♂️', '🕵️‍♀️', '🏛️', '🦉', '⚔️', '🦊', '🐉', '✨', '🚀', '🌟'];

const PRESET_CLASSES = [
  'Primary 6-A',
  'Primary 6-B',
  'Primary 6-C',
  'P6 Integrity',
  'P6 Harmony',
  'P6 Respect',
  'P6 Excellence',
  'Other / Custom'
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  isInitialSetup = false
}) => {
  const [name, setName] = useState(currentProfile.name || '');
  const [className, setClassName] = useState(currentProfile.className || 'Primary 6-A');
  const [customClass, setCustomClass] = useState('');
  const [avatar, setAvatar] = useState(currentProfile.avatar || '🧙‍♂️');
  const [isCustomClassSelected, setIsCustomClassSelected] = useState(
    !PRESET_CLASSES.slice(0, -1).includes(currentProfile.className) && !!currentProfile.className
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim();
    const finalClass = (isCustomClassSelected ? customClass : className).trim();

    if (!finalName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!finalClass) {
      setErrorMsg('Please specify your class or section.');
      return;
    }

    sounds.playCorrect();
    onSaveProfile({
      name: finalName,
      className: finalClass,
      avatar
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl relative animate-scaleUp">
        {/* Close Button only if not mandatory initial setup */}
        {!isInitialSetup && (
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg border border-amber-300/40">
            {avatar}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-[11px] font-bold border border-amber-500/30 uppercase tracking-widest">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Identification Badge</span>
          </div>
          <h2 className="text-2xl font-bold font-['Cinzel',serif] text-white">
            {isInitialSetup ? 'Welcome, Scholar!' : 'Edit Student Profile'}
          </h2>
          <p className="text-xs text-slate-300">
            Please enter your name and class so your scores, certificates, and multiplayer duels are identified!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Name */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
              Full Name: <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={28}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMsg('');
              }}
              placeholder="e.g. Shirley Tan"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Student Class / Section */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5">
              Class / Section: <span className="text-rose-400">*</span>
            </label>
            <select
              value={isCustomClassSelected ? 'Other / Custom' : className}
              onChange={(e) => {
                if (e.target.value === 'Other / Custom') {
                  setIsCustomClassSelected(true);
                } else {
                  setIsCustomClassSelected(false);
                  setClassName(e.target.value);
                }
                setErrorMsg('');
              }}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
            >
              {PRESET_CLASSES.map((cls) => (
                <option key={cls} value={cls} className="bg-slate-900 text-white">
                  {cls}
                </option>
              ))}
            </select>

            {isCustomClassSelected && (
              <input
                type="text"
                required
                maxLength={20}
                value={customClass}
                onChange={(e) => {
                  setCustomClass(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Type your class (e.g. P6-D or P6 Hope)..."
                className="w-full mt-2 px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
              />
            )}
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Choose Avatar:
            </label>
            <div className="flex flex-wrap gap-2 justify-center bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => {
                    sounds.playClick();
                    setAvatar(av);
                  }}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    avatar === av
                      ? 'bg-amber-500 text-slate-950 scale-110 shadow-md font-bold'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="text-xs text-rose-300 bg-rose-950/70 border border-rose-500/40 p-2.5 rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Confirm Student Identification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
