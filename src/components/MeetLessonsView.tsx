import React, { useState } from 'react';
import { 
  Video, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  Users, 
  Sparkles, 
  Play, 
  BookOpen, 
  ArrowRight,
  Filter,
  Check,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { GoogleMeetSession, UserProfile } from '../types';

interface MeetLessonsViewProps {
  sessions: GoogleMeetSession[];
  user: UserProfile;
  onRsvp: (sessionId: string) => void;
  onCancelBooking?: (sessionId: string) => void;
  onOpenPlaygroundWithCode: (code: string) => void;
  onOpenAdminSchedule?: () => void;
}

export const MeetLessonsView: React.FC<MeetLessonsViewProps> = ({
  sessions,
  user,
  onRsvp,
  onCancelBooking,
  onOpenPlaygroundWithCode,
  onOpenAdminSchedule,
}) => {
  const [filter, setFilter] = useState<'all' | 'registered' | 'beginner' | 'past'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'past') return s.isPast;
    if (s.isPast) return false;
    if (filter === 'registered') return user.registeredMeetSessionIds.includes(s.id);
    if (filter === 'beginner') return s.level === 'Beginner';
    return true;
  });

  // Calculate friendly time format
  const formatSessionTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Video className="w-4 h-4" />
            <span>Interactive Live Learning</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Google Meet Live Classes & Workshops
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1.5 max-w-2xl">
            Learn directly from mentors, ask coding questions in real time, and share your screen for instant live code reviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onOpenAdminSchedule && (
            <button
              onClick={onOpenAdminSchedule}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Class (Admin)</span>
            </button>
          )}
          <a
            href="https://meet.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <Video className="w-4 h-4" />
            <span>Launch Google Meet</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter:</span>
          {(['all', 'registered', 'beginner', 'past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab === 'registered' ? 'My Classes' : tab}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filteredSessions.length}</span> sessions
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSessions.map((session) => {
          const isRegistered = user.registeredMeetSessionIds.includes(session.id);
          const isCopied = copiedId === session.id;

          return (
            <div
              key={session.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                session.isPast
                  ? 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'
                  : isRegistered
                  ? 'bg-white dark:bg-slate-900 border-indigo-400 dark:border-indigo-600 shadow-md ring-1 ring-indigo-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="p-6">
                
                {/* Status Badges & Time */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        session.level === 'Beginner'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : session.level === 'Intermediate'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      }`}
                    >
                      {session.level}
                    </span>
                    {session.isPast ? (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        Past Recording
                      </span>
                    ) : isRegistered ? (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1">
                        <Check className="w-3 h-3" /> RSVP'd (+100 XP)
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{session.durationMinutes} mins</span>
                  </div>
                </div>

                {/* Session Title & Description */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {session.title}
                </h3>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                  {session.topic}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                  {session.description}
                </p>

                {/* Date & Time pill */}
                <div className="flex items-center gap-2 mt-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatSessionTime(session.scheduledTime)}
                  </span>
                  <span className="text-slate-400">|</span>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{session.attendeeCount} / {session.maxCapacity} students</span>
                  </div>
                </div>

                {/* Instructor Info - ONLY ONE TEACHER: ADMIN */}
                <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-lg">
                      {session.instructorAvatar || '🛡️'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{session.instructorName}</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                          Sole Teacher
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {session.instructorTitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agenda list */}
                {session.agenda && session.agenda.length > 0 && (
                  <div className="mt-4 space-y-1.5">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Agenda & Topics
                    </div>
                    {session.agenda.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="p-4 sm:p-6 pt-0 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                
                {/* Starter Code action */}
                {session.starterCodeSnippet ? (
                  <button
                    onClick={() => onOpenPlaygroundWithCode(session.starterCodeSnippet!)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Lesson Starter Code</span>
                  </button>
                ) : (
                  <div className="text-xs text-slate-400">Google Meet Audio & Video</div>
                )}

                {/* Join / RSVP / Delete Booking buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(session.meetUrl, session.id)}
                    aria-label={`Copy Google Meet link for ${session.title}`}
                    title="Copy Meet link"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {!session.isPast ? (
                    <>
                      {!isRegistered ? (
                        <button
                          onClick={() => onRsvp(session.id)}
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs shadow-sm transition-transform hover:scale-105"
                        >
                          RSVP (+100 XP)
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (confirm(`Delete your booking for "${session.title}"?`)) {
                              if (onCancelBooking) onCancelBooking(session.id);
                            }
                          }}
                          title="Delete Booked Class / Cancel RSVP"
                          className="flex items-center gap-1 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Booking</span>
                        </button>
                      )}

                      <a
                        href={session.meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Google Meet</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  ) : (
                    <a
                      href={session.recordingUrl || session.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Watch Recording</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
