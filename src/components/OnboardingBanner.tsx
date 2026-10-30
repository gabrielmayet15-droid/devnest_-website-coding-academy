import React from 'react';
import { Sparkles, Video, Code2, Trophy, X, ArrowRight } from 'lucide-react';

interface OnboardingBannerProps {
  onDismiss: () => void;
  onNavigate: (tab: string) => void;
  onOpenProfile: () => void;
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({
  onDismiss,
  onNavigate,
  onOpenProfile,
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-2xl p-6 sm:p-7 shadow-xl shadow-indigo-500/10 mb-8 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-xl">
              👋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-white/20 text-indigo-100">
                  Beginner Friendly
                </span>
                <span className="text-xs text-indigo-200">3-Step Quickstart</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mt-0.5">
                Welcome to DevNest! Ready to build your first website?
              </h2>
            </div>
          </div>

          <button
            onClick={onDismiss}
            aria-label="Dismiss onboarding guide"
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-indigo-100 text-sm sm:text-base mt-2 max-w-2xl">
          We combine interactive browser playgrounds, live instructor Google Meet sessions, and ranked leagues so learning web development feels like an exciting quest.
        </p>

        {/* 3 Step Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
          
          <button
            onClick={() => onNavigate('meets')}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/15 transition-all text-left border border-white/10 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm flex items-center gap-1 group-hover:text-emerald-300 transition-colors">
                1. Join Google Meet
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </div>
              <div className="text-xs text-indigo-200 mt-0.5">
                Live interactive coding classes with instant instructor feedback.
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('playground')}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/15 transition-all text-left border border-white/10 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/30 flex items-center justify-center text-sky-300 shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm flex items-center gap-1 group-hover:text-sky-300 transition-colors">
                2. Code in Playground
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </div>
              <div className="text-xs text-indigo-200 mt-0.5">
                Live HTML, CSS & JS editor with real-time visual output.
              </div>
            </div>
          </button>

          <button
            onClick={onOpenProfile}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/15 transition-all text-left border border-white/10 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-sm flex items-center gap-1 group-hover:text-amber-300 transition-colors">
                3. Customize & Rank Up
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </div>
              <div className="text-xs text-indigo-200 mt-0.5">
                Express your style with custom avatars and earn league ranks!
              </div>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};
