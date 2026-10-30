import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Video, 
  Trophy, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Award, 
  Search, 
  CheckCircle, 
  ExternalLink,
  Save,
  Clock,
  Sparkles
} from 'lucide-react';
import { Course, GoogleMeetSession, StudentProgressRecord } from '../types';
import { LeagueTier, LEAGUE_TIERS } from '../utils/leagues';

interface AdminViewProps {
  courses: Course[];
  meetSessions: GoogleMeetSession[];
  students: StudentProgressRecord[];
  customTiers: LeagueTier[];
  onAddCourse: (newCourse: Course) => void;
  onAddMeetSession: (newSession: GoogleMeetSession) => void;
  onUpdateLeagues: (tiers: LeagueTier[]) => void;
  onAwardStudentXP: (studentId: string, amount: number) => void;
  onDeleteStudent?: (studentId: string) => void;
  onDeleteMultipleStudents?: (studentIds: string[]) => void;
  onDeleteCourse?: (courseId: string) => void;
  onDeleteMeetSession?: (sessionId: string) => void;
  onLockAdmin?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  courses,
  meetSessions,
  students,
  customTiers,
  onAddCourse,
  onAddMeetSession,
  onUpdateLeagues,
  onAwardStudentXP,
  onDeleteStudent,
  onDeleteMultipleStudents,
  onDeleteCourse,
  onDeleteMeetSession,
  onLockAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'meets' | 'leagues' | 'students'>('students');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressRecord | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [userToDelete, setUserToDelete] = useState<StudentProgressRecord | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<GoogleMeetSession | null>(null);

  // Form states for New Course
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'HTML & CSS' as Course['category'],
    level: 'Beginner' as Course['level'],
    description: '',
    icon: '💻',
    moduleTitle: 'Module 1: Getting Started',
    moduleDesc: 'Basic introduction and first website layout challenge',
    moduleDuration: 30,
    moduleXp: 100,
    starterHtml: `<div class="card">\n  <h2>Hello Web!</h2>\n  <p>Created via Admin Portal</p>\n</div>`,
    starterCss: `.card { padding: 20px; background: #6366f1; color: white; border-radius: 8px; }`,
    starterJs: `console.log('Admin template loaded!');`,
  });

  // Form states for New Google Meet Lesson - ONLY ONE TEACHER: ADMIN
  const [meetForm, setMeetForm] = useState({
    title: '',
    topic: '',
    description: '',
    meetUrl: 'https://meet.google.com/ais-',
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // tomorrow local
    durationMinutes: 60,
    instructorName: 'Admin (DevNest Lead Teacher)',
    instructorAvatar: '🛡️',
    instructorTitle: 'DevNest Academy Lead Teacher & Admin',
    level: 'Beginner' as GoogleMeetSession['level'],
    maxCapacity: 30,
    agenda1: 'Introductions & Code Setup (10 mins)',
    agenda2: 'Live Coding & Step-by-Step Build (35 mins)',
    agenda3: 'Interactive Q&A & Code Reviews with Admin (15 mins)',
    starterCode: `<!-- Google Meet Starter -->\n<div class="live-demo">\n  <h1>Live Meet Demo</h1>\n</div>`,
  });

  // State for Leagues editor
  const [tiersList, setTiersList] = useState<LeagueTier[]>(customTiers);
  const [newLeagueForm, setNewLeagueForm] = useState({
    name: 'Mythic League',
    minXP: 10000,
    badgeIcon: '🔮',
    perk: 'Lifetime DevNest Hall of Fame Induction',
  });

  // Handle Add Course
  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;

    const newCourse: Course = {
      id: `course_${Date.now()}`,
      title: courseForm.title,
      category: courseForm.category,
      level: courseForm.level,
      description: courseForm.description,
      icon: courseForm.icon,
      color: 'from-indigo-500 to-purple-600',
      totalLessons: 1,
      xpTotal: courseForm.moduleXp,
      modules: [
        {
          id: `mod_${Date.now()}`,
          title: courseForm.moduleTitle,
          description: courseForm.moduleDesc,
          durationMinutes: Number(courseForm.moduleDuration),
          xpReward: Number(courseForm.moduleXp),
          starterHtml: courseForm.starterHtml,
          starterCss: courseForm.starterCss,
          starterJs: courseForm.starterJs,
          instructions: ['Customize layout and colors', 'Test in live preview'],
        },
      ],
    };

    onAddCourse(newCourse);
    setCourseForm({
      ...courseForm,
      title: '',
      description: '',
    });
    alert('Course added successfully to DevNest catalog!');
  };

  // Handle Add Meet Lesson
  const handleMeetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetForm.title.trim() || !meetForm.meetUrl.trim()) return;

    const newSession: GoogleMeetSession = {
      id: `meet_${Date.now()}`,
      title: meetForm.title,
      topic: meetForm.topic || 'Interactive Live Workshop',
      description: meetForm.description,
      courseId: courses[0]?.id || 'course_html_css',
      meetUrl: meetForm.meetUrl,
      scheduledTime: new Date(meetForm.date).toISOString(),
      durationMinutes: Number(meetForm.durationMinutes),
      instructorName: meetForm.instructorName,
      instructorAvatar: meetForm.instructorAvatar,
      instructorTitle: meetForm.instructorTitle,
      level: meetForm.level,
      attendeeCount: 1,
      maxCapacity: Number(meetForm.maxCapacity),
      agenda: [meetForm.agenda1, meetForm.agenda2, meetForm.agenda3].filter(Boolean),
      starterCodeSnippet: meetForm.starterCode,
    };

    onAddMeetSession(newSession);
    setMeetForm({
      ...meetForm,
      title: '',
      topic: '',
      description: '',
    });
    alert('Google Meet live class scheduled and added to calendar!');
  };

  // Handle Add League
  const handleAddLeagueTier = () => {
    const newTier: LeagueTier = {
      id: `league_${Date.now()}`,
      name: newLeagueForm.name,
      rankLevel: tiersList.length + 1,
      minXP: Number(newLeagueForm.minXP),
      maxXP: Number(newLeagueForm.minXP) + 4999,
      badgeIcon: newLeagueForm.badgeIcon,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-100 dark:bg-violet-950/40',
      borderColor: 'border-violet-400 dark:border-violet-600',
      perks: [newLeagueForm.perk, 'Exclusive custom chat flair'],
    };

    const updated = [...tiersList, newTier].sort((a, b) => a.minXP - b.minXP);
    setTiersList(updated);
    onUpdateLeagues(updated);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Academy Administration & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Instructor & Admin Control Center
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            Schedule Google Meet workshops, manage curriculum courses, customize ranked leagues, and track student learning progress.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
          {(['students', 'meets', 'courses', 'leagues'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {tab === 'students' ? 'Player Tracking' : tab === 'meets' ? 'Google Meet Classes' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Player Progress Tracking Tab */}
      {activeTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Player Progress & User Management
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monitor student XP, attendance, assign bonus points, and manage or delete user records
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {selectedStudentIds.length > 0 && onDeleteMultipleStudents && (
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${selectedStudentIds.length} selected users? This cannot be undone.`)) {
                      onDeleteMultipleStudents(selectedStudentIds);
                      setSelectedStudentIds([]);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedStudentIds.length})</span>
                </button>
              )}

              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  placeholder="Search student or email..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudentIds(filteredStudents.map(s => s.id));
                        } else {
                          setSelectedStudentIds([]);
                        }
                      }}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">League Rank</th>
                  <th className="py-3 px-3">Total XP</th>
                  <th className="py-3 px-3">Lessons Done</th>
                  <th className="py-3 px-3">Meet Classes</th>
                  <th className="py-3 px-3">Streak</th>
                  <th className="py-3 px-3">Last Active</th>
                  <th className="py-3 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((student) => {
                  const isChecked = selectedStudentIds.includes(student.id);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds([...selectedStudentIds, student.id]);
                            } else {
                              setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id));
                            }
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{student.avatar}</span>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {student.name}
                            </div>
                            <div className="text-[10px] text-slate-400">{student.email || 'Guest Student'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                          {student.leagueId}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                        {student.xp} XP
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {student.completedLessonsCount}
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {student.meetSessionsCount} classes
                      </td>

                      <td className="py-3 px-3 font-semibold text-amber-600 dark:text-amber-400">
                        🔥 {student.streakDays}d
                      </td>

                      <td className="py-3 px-3 text-slate-500">
                        {student.lastActive}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onAwardStudentXP(student.id, 100)}
                            title="Award 100 Bonus XP"
                            className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold"
                          >
                            +100 XP
                          </button>
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                          >
                            Inspect
                          </button>
                          {onDeleteStudent && (
                            <button
                              onClick={() => setUserToDelete(student)}
                              title="Delete Student Record"
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Delete Confirmation Dialog */}
          {userToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-3 text-rose-600">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Delete Student Account?</h3>
                    <p className="text-xs text-slate-500">This action is irreversible.</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Are you sure you want to permanently delete <strong>{userToDelete.name}</strong> ({userToDelete.email || 'Guest'}) and all their progress data?
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setUserToDelete(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (onDeleteStudent) onDeleteStudent(userToDelete.id);
                      setUserToDelete(null);
                    }}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Student Inspection Modal */}
          {selectedStudent && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{selectedStudent.avatar}</span>
                  <span>{selectedStudent.name} ({selectedStudent.title})</span>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Close
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                <strong>Instructor Feedback Notes:</strong> {selectedStudent.notes || 'Student is making steady progress through HTML and responsive layouts.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. Google Meet Classes Scheduler Tab */}
      {activeTab === 'meets' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Schedule Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-500" />
                <span>Schedule New Google Meet Lesson</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Provide meeting link, syllabus agenda, and starter code for live classes
              </p>
            </div>

            <form onSubmit={handleMeetSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  required
                  value={meetForm.title}
                  onChange={e => setMeetForm({ ...meetForm, title: e.target.value })}
                  placeholder="e.g. Live Workshop: CSS Flexbox Animations"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Google Meet Link URL *
                </label>
                <input
                  type="url"
                  required
                  value={meetForm.meetUrl}
                  onChange={e => setMeetForm({ ...meetForm, meetUrl: e.target.value })}
                  placeholder="https://meet.google.com/xyz-abc-def"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={meetForm.date}
                    onChange={e => setMeetForm({ ...meetForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={meetForm.durationMinutes}
                    onChange={e => setMeetForm({ ...meetForm, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Instructor (Sole Teacher)
                  </label>
                  <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2">
                    <span>🛡️</span>
                    <span className="truncate">Admin (Lead Teacher)</span>
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={meetForm.level}
                    onChange={e => setMeetForm({ ...meetForm, level: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lesson Description
                </label>
                <textarea
                  rows={2}
                  value={meetForm.description}
                  onChange={e => setMeetForm({ ...meetForm, description: e.target.value })}
                  placeholder="What will students learn in this live Google Meet workshop?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Starter Code Snippet (Optional for Playground)
                </label>
                <textarea
                  rows={3}
                  value={meetForm.starterCode}
                  onChange={e => setMeetForm({ ...meetForm, starterCode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 font-mono text-emerald-300 border border-slate-800 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
              >
                Schedule Google Meet Class
              </button>
            </form>
          </div>

          {/* Current Scheduled Sessions List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Scheduled Live Classes ({meetSessions.length})
              </h2>
              <span className="text-xs text-slate-400">Instructor: Admin</span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[500px]">
              {meetSessions.map((session) => (
                <div key={session.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {session.title}
                    </div>
                    <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                      🛡️ {session.instructorName} • {session.durationMinutes} mins • {session.level}
                    </div>
                    <a
                      href={session.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-indigo-600 underline flex items-center gap-1 mt-1"
                    >
                      <span>{session.meetUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {session.attendeeCount} RSVPs
                    </span>
                    {onDeleteMeetSession && (
                      <button
                        onClick={() => setSessionToDelete(session)}
                        title="Delete Scheduled Class"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delete Meet Session Confirmation Dialog */}
          {sessionToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-3 text-rose-600">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Delete Live Class?</h3>
                    <p className="text-xs text-slate-500">Cancels this session for all students.</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Are you sure you want to delete <strong>"{sessionToDelete.title}"</strong>?
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSessionToDelete(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (onDeleteMeetSession) onDeleteMeetSession(sessionToDelete.id);
                      setSessionToDelete(null);
                    }}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 3. Course Management Tab */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Add Course Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <span>Add New Course to DevNest</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Design interactive modules, starter templates, and XP rewards
              </p>
            </div>

            <form onSubmit={handleCourseSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="e.g. Modern Fullstack React Websites"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    value={courseForm.icon}
                    onChange={e => setCourseForm({ ...courseForm, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center text-base outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={courseForm.category}
                    onChange={e => setCourseForm({ ...courseForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="HTML & CSS">HTML & CSS</option>
                    <option value="Responsive Design">Responsive Design</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Components">Components</option>
                    <option value="Fullstack">Fullstack</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Level
                  </label>
                  <select
                    value={courseForm.level}
                    onChange={e => setCourseForm({ ...courseForm, level: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={courseForm.description}
                  onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Course overview and expected outcomes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  First Coding Module Starter
                </span>
                <input
                  type="text"
                  value={courseForm.moduleTitle}
                  onChange={e => setCourseForm({ ...courseForm, moduleTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
                <textarea
                  rows={2}
                  value={courseForm.starterHtml}
                  onChange={e => setCourseForm({ ...courseForm, starterHtml: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 text-orange-300 font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01]"
              >
                Create & Publish Course
              </button>
            </form>
          </div>

          {/* Current Courses List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Active Courses ({courses.length})
            </h2>

            <div className="space-y-3">
              {courses.map(course => (
                <div key={course.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{course.icon}</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {course.title}
                      </div>
                      <div className="text-slate-500">
                        {course.category} • {course.modules.length} Lessons • {course.xpTotal} XP
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {course.level}
                    </span>
                    {onDeleteCourse && (
                      <button
                        onClick={() => setCourseToDelete(course)}
                        title="Delete Course (preprogrammed or custom)"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delete Course Confirmation Dialog */}
          {courseToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-3 text-rose-600">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Delete Course?</h3>
                    <p className="text-xs text-slate-500">Deletes this course and its lesson modules.</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Are you sure you want to delete <strong>"{courseToDelete.title}"</strong> ({courseToDelete.modules.length} lessons)?
                </p>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setCourseToDelete(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (onDeleteCourse) onDeleteCourse(courseToDelete.id);
                      setCourseToDelete(null);
                    }}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. Leagues & Ranks Configurator Tab */}
      {activeTab === 'leagues' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add custom league rank */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-500" />
                <span>Add Custom League Rank</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Define new competitive tiers like Master, Legend, or Titanium
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  League Name
                </label>
                <input
                  type="text"
                  value={newLeagueForm.name}
                  onChange={e => setNewLeagueForm({ ...newLeagueForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Min XP Required
                  </label>
                  <input
                    type="number"
                    value={newLeagueForm.minXP}
                    onChange={e => setNewLeagueForm({ ...newLeagueForm, minXP: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Badge Emoji
                  </label>
                  <input
                    type="text"
                    value={newLeagueForm.badgeIcon}
                    onChange={e => setNewLeagueForm({ ...newLeagueForm, badgeIcon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center text-base outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tier Special Perk
                </label>
                <input
                  type="text"
                  value={newLeagueForm.perk}
                  onChange={e => setNewLeagueForm({ ...newLeagueForm, perk: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAddLeagueTier}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-transform hover:scale-[1.01]"
              >
                Add League Tier
              </button>
            </div>
          </div>

          {/* Current Leagues List (2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Configured League Ranks ({tiersList.length})
            </h2>

            <div className="space-y-3">
              {tiersList.map(tier => (
                <div
                  key={tier.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{tier.badgeIcon}</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {tier.name}
                      </div>
                      <div className="text-slate-500">
                        Threshold: {tier.minXP.toLocaleString()} XP • Rank Level {tier.rankLevel}
                      </div>
                      <div className="text-indigo-600 dark:text-indigo-400 text-[11px] mt-0.5">
                        Perks: {tier.perks.join(', ')}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Tier {tier.rankLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
