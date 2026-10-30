import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Sign In with Google
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Check if user profile exists in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);

      let profileData: UserProfile;
      if (userSnap.exists()) {
        profileData = userSnap.data() as UserProfile;
      } else {
        // Create new student starting fresh from the beginning (0 XP)
        profileData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Web Explorer',
          username: (firebaseUser.email?.split('@')[0] || 'student').toLowerCase(),
          email: firebaseUser.email || '',
          avatar: '🌱',
          avatarBg: 'from-emerald-400 to-teal-600',
          title: 'HTML Pioneer 🌱',
          bio: 'Building my web development skills on DevNest.',
          statusMessage: 'Starting from the beginning at 0 XP! 🚀',
          themeAura: 'indigo',
          xp: 0, // Starts at 0 XP
          streakDays: 1,
          lastActive: 'Just now',
          role: 'student',
          pinnedBadgeIds: [],
          completedLessonIds: [],
          registeredMeetSessionIds: [],
          createdProjectCount: 0,
        };

        try {
          await setDoc(userDocRef, profileData);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
        }
      }

      confetti({ particleCount: 50, spread: 70 });
      onLoginSuccess(profileData);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to authenticate with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sign Up / Log In with Email & Password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMsg('Please enter your full name');
          setLoading(false);
          return;
        }

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = cred.user;

        // Fresh student profile starting at 0 XP
        const newProfile: UserProfile = {
          id: firebaseUser.uid,
          name: name.trim(),
          username: email.split('@')[0].toLowerCase(),
          email: email.trim(),
          avatar: '🌱',
          avatarBg: 'from-emerald-400 to-teal-600',
          title: 'HTML Pioneer 🌱',
          bio: 'Starting my website creation journey with DevNest!',
          statusMessage: 'Learning HTML, CSS & JavaScript from scratch!',
          themeAura: 'indigo',
          xp: 0, // Fresh start at 0 XP
          streakDays: 1,
          lastActive: 'Just now',
          role: 'student',
          pinnedBadgeIds: [],
          completedLessonIds: [],
          registeredMeetSessionIds: [],
          createdProjectCount: 0,
        };

        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          await setDoc(userDocRef, newProfile);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
        }

        confetti({ particleCount: 60, spread: 80 });
        onLoginSuccess(newProfile);
        onClose();
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = cred.user;

        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);

        let profileData: UserProfile;
        if (userSnap.exists()) {
          profileData = userSnap.data() as UserProfile;
        } else {
          profileData = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Student',
            username: email.split('@')[0],
            email: firebaseUser.email || email,
            avatar: '🌱',
            avatarBg: 'from-emerald-400 to-teal-600',
            title: 'HTML Pioneer 🌱',
            bio: 'Learning web development with DevNest.',
            statusMessage: 'Coding web apps!',
            themeAura: 'indigo',
            xp: 0,
            streakDays: 1,
            lastActive: 'Just now',
            role: 'student',
            pinnedBadgeIds: [],
            completedLessonIds: [],
            registeredMeetSessionIds: [],
            createdProjectCount: 0,
          };
          await setDoc(userDocRef, profileData);
        }

        onLoginSuccess(profileData);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 id="auth-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              {mode === 'signup' ? 'Create Real Student Account' : 'Welcome Back, Coder'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close authentication dialog"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-all shadow-sm active:scale-98"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute">
              or use email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-98 flex items-center justify-center gap-1.5"
            >
              {mode === 'signup' ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{loading ? 'Processing...' : mode === 'signup' ? 'Create Real Account (0 XP)' : 'Sign In to Account'}</span>
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
            {mode === 'signup' ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(null); }}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Need an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(null); }}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Create one now
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
