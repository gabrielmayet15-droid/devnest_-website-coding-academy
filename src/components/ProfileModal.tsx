import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  User, 
  Smile, 
  Palette, 
  Trophy, 
  Shield, 
  Flame,
  Save
} from 'lucide-react';
import { UserProfile } from '../types';
import { AVATAR_OPTIONS, TITLE_OPTIONS, THEME_AURAS } from '../data/initialData';
import { Badge } from '../utils/badges';
import confetti from 'canvas-confetti';

interface ProfileModalProps {
  user: UserProfile;
  badges: Badge[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
}

const BG_GRADIENTS = [
  { id: 'sunset', class: 'from-amber-400 to-orange-500', label: 'Sunset' },
  { id: 'indigo', class: 'from-indigo-500 to-purple-600', label: 'Electric Indigo' },
  { id: 'emerald', class: 'from-emerald-400 to-teal-600', label: 'Cyber Emerald' },
  { id: 'rose', class: 'from-rose-500 to-pink-600', label: 'Neon Rose' },
  { id: 'cyan', class: 'from-sky-400 to-blue-600', label: 'Ocean Cyan' },
  { id: 'midnight', class: 'from-slate-700 to-slate-900', label: 'Midnight Dark' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  badges,
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [avatarBg, setAvatarBg] = useState(user.avatarBg);
  const [title, setTitle] = useState(user.title);
  const [bio, setBio] = useState(user.bio);
  const [statusMessage, setStatusMessage] = useState(user.statusMessage);
  const [themeAura, setThemeAura] = useState(user.themeAura);
  const [pinnedBadges, setPinnedBadges] = useState<string[]>(user.pinnedBadgeIds);

  if (!isOpen) return null;

  const handleToggleBadgePin = (badgeId: string) => {
    if (pinnedBadges.includes(badgeId)) {
      setPinnedBadges(pinnedBadges.filter(id => id !== badgeId));
    } else {
      if (pinnedBadges.length < 3) {
        setPinnedBadges([...pinnedBadges, badgeId]);
      } else {
        // Replace first
        setPinnedBadges([...pinnedBadges.slice(1), badgeId]);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      avatar,
      avatarBg,
      title,
      bio,
      statusMessage,
      themeAura,
      pinnedBadgeIds: pinnedBadges,
    });
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden my-8"
      >
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 id="profile-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Customize Your Dev Identity
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close profile customization modal"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Live Preview Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatarBg} flex items-center justify-center text-3xl shadow-md ring-4 ring-indigo-500/30`}>
              {avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  {name || 'Anonymous Coder'}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {title}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                "{statusMessage || 'Coding my first website!'}"
              </p>
              
              {/* Pinned Badges preview */}
              <div className="flex items-center gap-1.5 mt-2">
                {pinnedBadges.map(bId => {
                  const b = badges.find(x => x.id === bId);
                  return b ? (
                    <span key={b.id} title={b.title} className="text-sm bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      {b.icon}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          {/* 1. Avatar Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Choose Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((opt) => (
                <button
                  key={opt.emoji}
                  type="button"
                  onClick={() => setAvatar(opt.emoji)}
                  className={`p-3 rounded-2xl text-2xl transition-all border text-center ${
                    avatar === opt.emoji
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 scale-105 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  {opt.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Avatar Background Color */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Avatar Glow Gradient
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {BG_GRADIENTS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setAvatarBg(bg.class)}
                  className={`h-10 rounded-xl bg-gradient-to-br ${bg.class} relative flex items-center justify-center transition-all ${
                    avatarBg === bg.class ? 'ring-4 ring-indigo-500/40 scale-105' : 'hover:scale-102'
                  }`}
                >
                  {avatarBg === bg.class && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Dev Title Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Coder Title
            </label>
            <select
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {TITLE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Display Name & Status Message */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status Message
              </label>
              <input
                type="text"
                value={statusMessage}
                onChange={e => setStatusMessage(e.target.value)}
                placeholder="e.g. Building responsive cards! ✨"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* 5. Pin Badges to Profile */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pin Showcase Badges (Select up to 3)
              </label>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                {pinnedBadges.length} / 3 pinned
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {badges.filter(b => b.isUnlocked).map((b) => {
                const isPinned = pinnedBadges.includes(b.id);
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleToggleBadgePin(b.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                      isPinned
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{b.icon}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{b.title}</span>
                    </div>
                    {isPinned && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Save Action */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
