import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  Code2, 
  Sparkles, 
  ArrowRight, 
  ChevronRight,
  Plus,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { Course, CourseModule, UserProfile } from '../types';

interface CoursesViewProps {
  courses: Course[];
  user: UserProfile;
  onSelectLesson: (module: CourseModule) => void;
  onOpenAdminNewCourse?: () => void;
  onDeleteCourse?: (courseId: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  user,
  onSelectLesson,
  onOpenAdminNewCourse,
  onDeleteCourse,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Structured Web Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Website Development Roadmap
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1.5 max-w-2xl">
            Hands-on interactive lessons designed to take you from a complete beginner to building full responsive web applications.
          </p>
        </div>

        {onOpenAdminNewCourse && (
          <button
            onClick={onOpenAdminNewCourse}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course (Admin)</span>
          </button>
        )}
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isSelected = course.id === selectedCourseId;
          const completedCount = course.modules.filter(m => user.completedLessonIds.includes(m.id)).length;
          const progressPercent = Math.round((completedCount / course.modules.length) * 100);

          return (
            <button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className={`rounded-2xl p-6 text-left border transition-all flex flex-col justify-between group ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-lg ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {course.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {course.level}
                    </span>
                    {onDeleteCourse && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCourseToDelete(course);
                        }}
                        title="Delete Course"
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                  {course.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>{completedCount} / {course.modules.length} Lessons</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Course Modules Breakdown */}
      {activeCourse && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <span>Course Syllabus</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Teacher: Admin (DevNest Lead Instructor)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                {activeCourse.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Earn up to {activeCourse.xpTotal} XP</span>
              </div>
              {onDeleteCourse && (
                <button
                  onClick={() => setCourseToDelete(activeCourse)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Course</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {activeCourse.modules.map((module, idx) => {
              const isCompleted = user.completedLessonIds.includes(module.id);

              return (
                <div
                  key={module.id}
                  className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isCompleted
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {module.title}
                        </h4>
                        {isCompleted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                        {module.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {module.durationMinutes} mins
                        </span>
                        <span>•</span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          +{module.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectLesson(module)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm shadow-indigo-600/20 transition-all hover:scale-105 shrink-0"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>{isCompleted ? 'Review Code' : 'Start Code Lesson'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
                <p className="text-xs text-slate-500">Removes this course from catalog.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently delete <strong>"{courseToDelete.title}"</strong> ({courseToDelete.modules.length} lessons)?
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
  );
};

