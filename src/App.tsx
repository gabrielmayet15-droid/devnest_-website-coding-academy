/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OnboardingBanner } from './components/OnboardingBanner';
import { DashboardView } from './components/DashboardView';
import { MeetLessonsView } from './components/MeetLessonsView';
import { CoursesView } from './components/CoursesView';
import { PlaygroundView } from './components/PlaygroundView';
import { CollabChatView } from './components/CollabChatView';
import { LeaguesView } from './components/LeaguesView';
import { AdminView } from './components/AdminView';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';
import { AdminGateModal } from './components/AdminGateModal';
import { GeminiBotWidget } from './components/GeminiBotWidget';

import { 
  INITIAL_USER, 
  INITIAL_COURSES, 
  INITIAL_MEET_SESSIONS, 
  INITIAL_CHANNELS, 
  INITIAL_CHAT_MESSAGES, 
  INITIAL_STUDENTS_PROGRESS 
} from './data/initialData';
import { LEAGUE_TIERS, LeagueTier, getLeagueByXP } from './utils/leagues';
import { evaluateBadges, Badge } from './utils/badges';
import { CourseModule, Course, GoogleMeetSession, ChatMessage, UserProfile, StudentProgressRecord } from './types';
import { 
  auth, 
  db, 
  handleFirestoreError, 
  OperationType 
} from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import confetti from 'canvas-confetti';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to root document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(prev => !prev);

  // App Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isAdminGateOpen, setIsAdminGateOpen] = useState<boolean>(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);

  // Core Data States - Starts fresh at 0 XP with no pre-earned badges
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [meetSessions, setMeetSessions] = useState<GoogleMeetSession[]>(INITIAL_MEET_SESSIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [students, setStudents] = useState<StudentProgressRecord[]>(INITIAL_STUDENTS_PROGRESS);
  const [customTiers, setCustomTiers] = useState<LeagueTier[]>(LEAGUE_TIERS);

  // Playground Code State
  const [playgroundCode, setPlaygroundCode] = useState<{ html?: string; css?: string; js?: string } | undefined>(undefined);

  // Gemini External Trigger
  const [geminiTrigger, setGeminiTrigger] = useState<{ prompt: string; code?: string; timestamp: number } | null>(null);

  // Toast / Achievement alert
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  const showToast = (message: string) => {
    setRecentNotification(message);
    setTimeout(() => setRecentNotification(null), 4000);
  };

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setUser(data);
          } else {
            // Fresh student starting from the beginning (0 XP)
            const freshUser: UserProfile = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'New Coder',
              username: (firebaseUser.email?.split('@')[0] || 'student').toLowerCase(),
              email: firebaseUser.email || '',
              avatar: '🌱',
              avatarBg: 'from-emerald-400 to-teal-600',
              title: 'HTML Pioneer 🌱',
              bio: 'Starting my website development journey with DevNest!',
              statusMessage: 'Ready to learn HTML & CSS! 🚀',
              themeAura: 'indigo',
              xp: 0, // Starts fresh at 0 XP
              streakDays: 1,
              lastActive: 'Just now',
              role: 'student',
              pinnedBadgeIds: [],
              completedLessonIds: [],
              registeredMeetSessionIds: [],
              createdProjectCount: 0,
            };
            await setDoc(userDocRef, freshUser);
            setUser(freshUser);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Chat Messages (Real users, persistent database)
  useEffect(() => {
    const messagesCollection = collection(db, 'chat_messages');
    const q = query(messagesCollection, orderBy('timestamp', 'asc'), limit(50));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const liveMessages: ChatMessage[] = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        } as ChatMessage));
        setChatMessages(liveMessages);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'chat_messages');
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for registered Users in Student Directory
  useEffect(() => {
    const usersCollection = collection(db, 'users');

    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      if (!snapshot.empty) {
        const liveStudents: StudentProgressRecord[] = snapshot.docs.map(docSnap => {
          const u = docSnap.data() as UserProfile;
          const currentLg = getLeagueByXP(u.xp || 0, customTiers);
          return {
            id: docSnap.id,
            name: u.name || 'Anonymous Coder',
            email: u.email || '',
            avatar: u.avatar || '🌱',
            title: u.title || 'Student',
            xp: u.xp || 0,
            leagueId: currentLg.id,
            completedLessonsCount: u.completedLessonIds?.length || 0,
            meetSessionsCount: u.registeredMeetSessionIds?.length || 0,
            streakDays: u.streakDays || 1,
            lastActive: u.lastActive || 'Recently',
            notes: u.bio || 'Active learner.',
          };
        });
        setStudents(liveStudents);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    return () => unsubscribe();
  }, [customTiers]);

  // Synchronize User Profile changes to Firestore
  const syncUserToFirestore = async (updated: UserProfile) => {
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid), updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser.uid}`);
      }
    }
  };

  // Evaluate badges based on current user state
  const userStats = {
    lessonsCompleted: user.completedLessonIds.length,
    meetSessionsJoined: user.registeredMeetSessionIds.length,
    chatMessagesSent: chatMessages.filter(m => m.senderId === user.id).length,
    streakDays: user.streakDays,
    playgroundProjectsRun: user.createdProjectCount,
    totalXP: user.xp,
  };

  const { badges, newlyUnlocked } = evaluateBadges(userStats, user.pinnedBadgeIds);

  // Handle new badge unlock notifications
  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      const b = newlyUnlocked[0];
      showToast(`🏆 Badge Unlocked: "${b.title}"! (+${b.xpReward} XP)`);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
      const updatedUser = {
        ...user,
        xp: user.xp + b.xpReward,
      };
      setUser(updatedUser);
      syncUserToFirestore(updatedUser);
    }
  }, [newlyUnlocked.length]);

  // Actions: RSVP for Google Meet
  const handleRsvpMeet = (sessionId: string) => {
    if (user.registeredMeetSessionIds.includes(sessionId)) return;

    const updatedUser = {
      ...user,
      registeredMeetSessionIds: [...user.registeredMeetSessionIds, sessionId],
      xp: user.xp + 100,
    };
    setUser(updatedUser);
    syncUserToFirestore(updatedUser);

    setMeetSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, attendeeCount: s.attendeeCount + 1 } : s))
    );

    showToast("🎉 Registered for Google Meet session! +100 XP awarded!");
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  // Actions: Start lesson in Playground
  const handleSelectLesson = (module: CourseModule) => {
    setPlaygroundCode({
      html: module.starterHtml,
      css: module.starterCss,
      js: module.starterJs,
    });
    setActiveTab('playground');

    // If not completed, mark complete & award XP
    if (!user.completedLessonIds.includes(module.id)) {
      const updatedUser = {
        ...user,
        completedLessonIds: [...user.completedLessonIds, module.id],
        xp: user.xp + module.xpReward,
      };
      setUser(updatedUser);
      syncUserToFirestore(updatedUser);
      showToast(`🌟 Lesson challenge started! +${module.xpReward} XP`);
    }
  };

  // Actions: Open starter code from Google Meet in Playground
  const handleOpenPlaygroundWithCode = (code: string) => {
    setPlaygroundCode({
      html: code,
      css: `/* Google Meet Workshop Styles */\nbody { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0f172a; font-family: sans-serif; }\n.profile-card { background: white; padding: 2rem; border-radius: 1rem; text-align: center; max-width: 300px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }\n.profile-card img { width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid #6366f1; }\nh3 { margin: 1rem 0 0.25rem; color: #1e1b4b; }\n.role { color: #6366f1; font-weight: 600; font-size: 0.85rem; margin: 0; }`,
      js: `console.log('Google Meet live workshop starter loaded!');`,
    });
    setActiveTab('playground');
    showToast("Code loaded into Playground!");
  };

  // Actions: Save playground project
  const handleProjectSave = () => {
    const updatedUser = {
      ...user,
      createdProjectCount: user.createdProjectCount + 1,
      xp: user.xp + 50,
    };
    setUser(updatedUser);
    syncUserToFirestore(updatedUser);
    showToast("💾 Project saved! +50 XP awarded!");
  };

  // Actions: Send REAL chat message in Student Collab (writes to Firestore)
  const handleSendMessage = async (
    channelId: string,
    text: string,
    codeSnippet?: { language: 'html' | 'css' | 'javascript'; code: string }
  ) => {
    if (!user.email && !auth.currentUser) {
      showToast("Please sign in or create a real account to post in chat!");
      setIsAuthOpen(true);
      return;
    }

    const currentLeague = getLeagueByXP(user.xp, customTiers);
    const newMsgData = {
      senderId: user.id || auth.currentUser?.uid || 'guest',
      senderName: user.name,
      senderAvatar: user.avatar,
      senderLeagueId: currentLeague.id,
      senderTitle: user.title,
      channelId,
      text,
      codeSnippet: codeSnippet || null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
    };

    // Save to Firestore
    try {
      await addDoc(collection(db, 'chat_messages'), newMsgData);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'chat_messages');
      // Optimistic local update fallback
      setChatMessages(prev => [...prev, { id: `msg_${Date.now()}`, ...newMsgData } as any]);
    }

    // Award collaboration XP
    const updatedUser = { ...user, xp: user.xp + 25 };
    setUser(updatedUser);
    syncUserToFirestore(updatedUser);
    showToast("💬 Message posted! +25 XP");
  };

  // Actions: Add reaction to chat message
  const handleAddReaction = (messageId: string, emoji: string) => {
    setChatMessages(prev =>
      prev.map(m => {
        if (m.id !== messageId) return m;
        const reactions = m.reactions || [];
        const existing = reactions.find(r => r.emoji === emoji);
        if (existing) {
          return {
            ...m,
            reactions: reactions.map(r =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            ),
          };
        } else {
          return {
            ...m,
            reactions: [...reactions, { emoji, count: 1, users: [user.id] }],
          };
        }
      })
    );
  };

  // Admin Actions: Delete User from Firestore and active list
  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteDoc(doc(db, 'users', studentId));
      setStudents(prev => prev.filter(s => s.id !== studentId));
      showToast("Student account deleted permanently from database.");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${studentId}`);
      setStudents(prev => prev.filter(s => s.id !== studentId));
      showToast("Student record removed.");
    }
  };

  const handleDeleteMultipleStudents = async (studentIds: string[]) => {
    for (const id of studentIds) {
      try {
        await deleteDoc(doc(db, 'users', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${id}`);
      }
    }
    setStudents(prev => prev.filter(s => !studentIds.includes(s.id)));
    showToast(`${studentIds.length} student records deleted.`);
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
  };

  // Option to delete preprogrammed courses and custom courses
  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    showToast("Course removed from academy catalog.");
  };

  const handleAddMeetSession = (newSession: GoogleMeetSession) => {
    setMeetSessions(prev => [newSession, ...prev]);
  };

  // Option to delete scheduled Google Meet sessions
  const handleDeleteMeetSession = (sessionId: string) => {
    setMeetSessions(prev => prev.filter(s => s.id !== sessionId));
    if (user.registeredMeetSessionIds.includes(sessionId)) {
      const updatedUser = {
        ...user,
        registeredMeetSessionIds: user.registeredMeetSessionIds.filter(id => id !== sessionId),
      };
      setUser(updatedUser);
      syncUserToFirestore(updatedUser);
    }
    showToast("Scheduled Google Meet class deleted.");
  };

  // Option to delete/cancel booked courses & Google Meet sessions
  const handleCancelBooking = (sessionId: string) => {
    const updatedUser = {
      ...user,
      registeredMeetSessionIds: user.registeredMeetSessionIds.filter(id => id !== sessionId),
    };
    setUser(updatedUser);
    syncUserToFirestore(updatedUser);

    setMeetSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, attendeeCount: Math.max(0, s.attendeeCount - 1) } : s))
    );

    showToast("Booked class cancelled. Spot released.");
  };

  // Action: Complete Today's Daily Goal
  const handleCompleteDailyGoal = () => {
    const updatedUser = {
      ...user,
      xp: user.xp + 50,
      streakDays: Math.max(1, user.streakDays),
    };
    setUser(updatedUser);
    syncUserToFirestore(updatedUser);
    showToast("🔥 Daily goal completed! +50 XP awarded!");
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const handleUpdateLeagues = (tiers: LeagueTier[]) => {
    setCustomTiers(tiers);
    showToast("Leagues updated successfully!");
  };

  const handleAwardStudentXP = (studentId: string, amount: number) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, xp: s.xp + amount } : s))
    );
    if (studentId === user.id) {
      const updatedUser = { ...user, xp: user.xp + amount };
      setUser(updatedUser);
      syncUserToFirestore(updatedUser);
    }
    showToast(`Awarded +${amount} XP to student!`);
    confetti({ particleCount: 40, spread: 50 });
  };

  // Ask Gemini Assistant from Playground
  const handleAskGemini = (code: string, prompt?: string) => {
    setGeminiTrigger({
      prompt: prompt || "Please review my website code and suggest improvements!",
      code,
      timestamp: Date.now(),
    });
  };

  // Find next upcoming Google Meet
  const nextMeet = meetSessions.find(s => !s.isPast) || meetSessions[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Neater, Compact Navigation Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        customTiers={customTiers}
        isDark={isDark}
        toggleDark={toggleDark}
        isAdminUnlocked={isAdminUnlocked}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdminGate={() => setIsAdminGateOpen(true)}
      />

      {/* Toast Notification Popup */}
      {recentNotification && (
        <div className="fixed top-16 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 dark:border-slate-300 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-3 fade-in duration-150">
          <span>{recentNotification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        
        {/* Beginner Onboarding Guide Banner */}
        {showOnboarding && (
          <OnboardingBanner
            onDismiss={() => setShowOnboarding(false)}
            onNavigate={(tab) => {
              setActiveTab(tab);
              setShowOnboarding(false);
            }}
            onOpenProfile={() => {
              setIsProfileOpen(true);
              setShowOnboarding(false);
            }}
          />
        )}

        {/* View Switching */}
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            nextMeetSession={nextMeet}
            allMeetSessions={meetSessions}
            courses={courses}
            badges={badges}
            customTiers={customTiers}
            onNavigate={setActiveTab}
            onOpenPlayground={() => setActiveTab('playground')}
            onOpenProfile={() => setIsProfileOpen(true)}
            onCancelBooking={handleCancelBooking}
            onCompleteDailyGoal={handleCompleteDailyGoal}
          />
        )}

        {activeTab === 'meets' && (
          <MeetLessonsView
            sessions={meetSessions}
            user={user}
            onRsvp={handleRsvpMeet}
            onCancelBooking={handleCancelBooking}
            onOpenPlaygroundWithCode={handleOpenPlaygroundWithCode}
            onOpenAdminSchedule={() => {
              if (isAdminUnlocked) {
                setActiveTab('admin');
              } else {
                setIsAdminGateOpen(true);
              }
            }}
          />
        )}

        {activeTab === 'courses' && (
          <CoursesView
            courses={courses}
            user={user}
            onSelectLesson={handleSelectLesson}
            onDeleteCourse={handleDeleteCourse}
            onOpenAdminNewCourse={() => {
              if (isAdminUnlocked) {
                setActiveTab('admin');
              } else {
                setIsAdminGateOpen(true);
              }
            }}
          />
        )}

        {activeTab === 'playground' && (
          <PlaygroundView
            initialCode={playgroundCode}
            onAskGemini={handleAskGemini}
            onProjectSave={handleProjectSave}
          />
        )}

        {activeTab === 'chat' && (
          <CollabChatView
            channels={INITIAL_CHANNELS}
            messages={chatMessages}
            students={students}
            user={user}
            customTiers={customTiers}
            onSendMessage={handleSendMessage}
            onRunCodeInPlayground={(code) => {
              setPlaygroundCode({ html: code, css: '', js: '' });
              setActiveTab('playground');
            }}
            onAddReaction={handleAddReaction}
          />
        )}

        {activeTab === 'leagues' && (
          <LeaguesView
            user={user}
            students={students}
            customTiers={customTiers}
            onOpenAdminLeagues={() => {
              if (isAdminUnlocked) {
                setActiveTab('admin');
              } else {
                setIsAdminGateOpen(true);
              }
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            courses={courses}
            meetSessions={meetSessions}
            students={students}
            customTiers={customTiers}
            onAddCourse={handleAddCourse}
            onAddMeetSession={handleAddMeetSession}
            onUpdateLeagues={handleUpdateLeagues}
            onAwardStudentXP={handleAwardStudentXP}
            onDeleteStudent={handleDeleteStudent}
            onDeleteMultipleStudents={handleDeleteMultipleStudents}
            onDeleteCourse={handleDeleteCourse}
            onDeleteMeetSession={handleDeleteMeetSession}
            onLockAdmin={() => {
              setIsAdminUnlocked(false);
              setActiveTab('dashboard');
              showToast("Admin session locked.");
            }}
          />
        )}

      </main>

      {/* Real Account Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(profile) => {
          setUser(profile);
          showToast(`Welcome ${profile.name}! Real account active.`);
        }}
      />

      {/* Admin Passcode Gate Modal (HACKDUOLINGODNS) */}
      <AdminGateModal
        isOpen={isAdminGateOpen}
        onClose={() => setIsAdminGateOpen(false)}
        onSuccess={() => {
          setIsAdminUnlocked(true);
          setActiveTab('admin');
          showToast("Admin Access Granted! Welcome Instructor.");
        }}
      />

      {/* Profile Customization Modal */}
      <ProfileModal
        user={user}
        badges={badges}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSave={(updated) => {
          const updatedProfile = { ...user, ...updated };
          setUser(updatedProfile);
          syncUserToFirestore(updatedProfile);
          showToast("Profile customized successfully! ✨");
        }}
      />

      {/* Floating Byte AI Chatbot Widget */}
      <GeminiBotWidget
        currentPlaygroundCode={playgroundCode?.html}
        onNavigateTab={setActiveTab}
        externalPrompt={geminiTrigger}
      />

      {/* Footer - Compact */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-4 mt-8 bg-white/40 dark:bg-slate-900/40 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <span>DevNest Website Coding Academy</span>
            <span>•</span>
            <span className="text-indigo-600 dark:text-indigo-400">Firebase Firestore & Gemini AI</span>
          </div>
          <div>
            Learn web development from scratch with live Google Meet classes and ranked leagues.
          </div>
        </div>
      </footer>

    </div>
  );
}
