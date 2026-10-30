import React, { useState } from 'react';
import { 
  Laptop, 
  Video, 
  BookOpen, 
  Code2, 
  MessagesSquare, 
  Trophy, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Flame, 
  HelpCircle,
  Menu,
  X,
  Lock,
  Unlock,
  LogIn,
  UserPlus
} from 'lucide-react';
import { UserProfile } from '../types';
import { getLeagueByXP, LeagueTier } from '../utils/leagues';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  customTiers: LeagueTier[];
  isDark: boolean;
  toggleDark: () => void;
  isAdminUnlocked: boolean;
  onOpenProfile: () => void;
  onOpenOnboarding: () => void;
  onOpenAuth: () => void;
  onOpenAdminGate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  customTiers,
  isDark,
  toggleDark,
  isAdminUnlocked,
  onOpenProfile,
  onOpenOnboarding,
  onOpenAuth,
  onOpenAdminGate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentLeague = getLeagueByXP(user.xp, customTiers);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Laptop },
    { id: 'meets', label: 'Live Classes', icon: Video, badge: 'Meet' },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'playground', label: 'Playground', icon: Code2 },
    { id: 'chat', label: 'Collab Chat', icon: MessagesSquare },
    { id: 'leagues', label: 'Leagues', icon: Trophy },
  ];

  const handleAdminClick = () => {
    if (isAdminUnlocked) {
      setActiveTab('admin');
    } else {
      onOpenAdminGate();
    }
  };

  const isGuest = !user.email;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-13">
          
          {/* Logo & Brand - Compact */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              aria-label="DevNest Home"
              className="flex items-center gap-2 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                DevNest
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links - Compact & Sleek */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Admin Portal Button with Lock/Unlock Indicator */}
            <button
              onClick={handleAdminClick}
              aria-label="Admin Portal"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin</span>
              {isAdminUnlocked ? (
                <Unlock className="w-3 h-3 text-emerald-500" />
              ) : (
                <Lock className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </nav>

          {/* Right Controls: Streak, League Rank, Auth, Dark Mode, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Daily Streak Indicator - Compact */}
            <div 
              title={`${user.streakDays}-Day Coding Streak!`}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80 text-[11px] font-bold"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{user.streakDays}d</span>
            </div>

            {/* League Rank Chip */}
            <button
              onClick={() => setActiveTab('leagues')}
              aria-label={`Current rank: ${currentLeague.name}, ${user.xp} XP`}
              className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border transition-transform hover:scale-105 ${currentLeague.bgColor} ${currentLeague.color} ${currentLeague.borderColor}`}
            >
              <span>{currentLeague.badgeIcon}</span>
              <span>{user.xp} XP</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-yellow-400 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Real Account Login / Register Button if Guest */}
            {isGuest ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-transform active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Sign Up</span>
              </button>
            ) : (
              /* User Profile Avatar */
              <button
                onClick={onOpenProfile}
                aria-label="Open profile customization"
                className="relative flex items-center gap-1.5 p-0.5 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700"
              >
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${user.avatarBg} flex items-center justify-center text-sm shadow-sm ring-1 ring-indigo-500/50`}>
                  {user.avatar}
                </div>
                <span className="hidden lg:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-3 pt-2 pb-3 space-y-1 bg-white dark:bg-slate-900 shadow-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-indigo-500" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Live
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleAdminClick();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Admin Portal</span>
            </div>
            {isAdminUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-500" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>
      )}
    </header>
  );
};
