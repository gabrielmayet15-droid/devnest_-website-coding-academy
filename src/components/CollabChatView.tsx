import React, { useState } from 'react';
import { 
  Send, 
  Code2, 
  Smile, 
  Users, 
  Hash, 
  Play, 
  Sparkles, 
  Terminal,
  Paperclip,
  Check
} from 'lucide-react';
import { ChatChannel, ChatMessage, UserProfile, StudentProgressRecord } from '../types';
import { getLeagueByXP, LeagueTier } from '../utils/leagues';

interface CollabChatViewProps {
  channels: ChatChannel[];
  messages: ChatMessage[];
  students: StudentProgressRecord[];
  user: UserProfile;
  customTiers: LeagueTier[];
  onSendMessage: (channelId: string, text: string, codeSnippet?: { language: 'html' | 'css' | 'javascript'; code: string }) => void;
  onRunCodeInPlayground: (code: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
}

export const CollabChatView: React.FC<CollabChatViewProps> = ({
  channels,
  messages,
  students,
  user,
  customTiers,
  onSendMessage,
  onRunCodeInPlayground,
  onAddReaction,
}) => {
  const [activeChannelId, setActiveChannelId] = useState<string>(channels[0]?.id || 'general');
  const [inputText, setInputText] = useState('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeLang, setCodeLang] = useState<'html' | 'css' | 'javascript'>('html');
  const [codeBody, setCodeBody] = useState('');

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const channelMessages = messages.filter(m => m.channelId === activeChannelId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !codeBody.trim()) return;

    let snippetObj = undefined;
    if (codeBody.trim()) {
      snippetObj = { language: codeLang, code: codeBody };
    }

    onSendMessage(activeChannelId, inputText.trim(), snippetObj);
    setInputText('');
    setCodeBody('');
    setIsCodeModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row h-[680px]">
      
      {/* Left Sidebar: Channels & Real Student Roster */}
      <div className="w-full md:w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
        
        {/* Channels header */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
            <Hash className="w-3.5 h-3.5 text-indigo-500" />
            <span>Collab Rooms</span>
          </div>
        </div>

        {/* Channels list */}
        <div className="p-2 space-y-1 overflow-y-auto flex-1">
          {channels.map((channel) => {
            const isActive = channel.id === activeChannelId;
            return (
              <button
                key={channel.id}
                onClick={() => setActiveChannelId(channel.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{channel.icon}</span>
                <span className="truncate">#{channel.name}</span>
              </button>
            );
          })}

          {/* Real Students Roster */}
          <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Real Students ({students.length})</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-1">
              {students.map((student) => {
                const isMe = student.id === user.id;
                const studentLeague = getLeagueByXP(student.xp, customTiers);

                return (
                  <div key={student.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="text-base">{student.avatar}</span>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 leading-tight flex items-center gap-1">
                          <span>{student.name}</span>
                          {isMe && <span className="text-[10px] text-indigo-500">(You)</span>}
                        </div>
                        <div className="text-[10px] text-slate-400">{studentLeague.name.split(' ')[0]} ({student.xp} XP)</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Area: Active Chat Channel */}
      <div className="flex-1 flex flex-col justify-between h-full bg-white dark:bg-slate-900">
        
        {/* Channel Top Header */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">{activeChannel.icon}</span>
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
                #{activeChannel.name}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {activeChannel.topic}
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Real Student Chat
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {channelMessages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <div className="text-2xl mb-1">💬</div>
              <p>No messages in #{activeChannel.name} yet.</p>
              <p className="text-[11px] mt-0.5">Be the first to share an idea, question, or website code snippet!</p>
            </div>
          ) : (
            channelMessages.map((msg) => {
              const isMe = msg.senderId === user.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-base shrink-0 border border-slate-200 dark:border-slate-700">
                    {msg.senderAvatar}
                  </div>

                  <div className={`max-w-xl ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className="flex items-center gap-2 mb-1 text-[11px]">
                      <span className="font-bold text-slate-900 dark:text-slate-200">
                        {msg.senderName}
                      </span>
                      {msg.senderTitle && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {msg.senderTitle}
                        </span>
                      )}
                      <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
                      }`}
                    >
                      {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                      {/* Shared Code Snippet Box */}
                      {msg.codeSnippet && (
                        <div className="mt-2.5 bg-slate-950 text-slate-200 rounded-xl p-3 font-mono text-xs overflow-x-auto border border-slate-800">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] uppercase text-indigo-400 font-bold">
                            <span>{msg.codeSnippet.language}</span>
                            <button
                              onClick={() => onRunCodeInPlayground(msg.codeSnippet!.code)}
                              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
                            >
                              <Play className="w-3 h-3 fill-emerald-400" />
                              <span>Run in Playground</span>
                            </button>
                          </div>
                          <pre className="text-slate-300 whitespace-pre-wrap">
                            {msg.codeSnippet.code}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Reactions Bar */}
                    <div className="flex items-center gap-1 mt-1">
                      {msg.reactions && msg.reactions.map((react, i) => (
                        <button
                          key={i}
                          onClick={() => onAddReaction(msg.id, react.emoji)}
                          className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                        >
                          <span>{react.emoji}</span>
                          <span className="font-bold text-[9px] text-slate-600 dark:text-slate-300">{react.count}</span>
                        </button>
                      ))}
                      <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                        {['🔥', '🚀', '❤️', '💡'].map((em) => (
                          <button
                            key={em}
                            onClick={() => onAddReaction(msg.id, em)}
                            className="hover:scale-125 transition-transform text-xs"
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          {/* Optional Code Snippet Modal */}
          {isCodeModalOpen && (
            <div className="mb-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1 text-indigo-400">
                  <Code2 className="w-4 h-4" /> Share Code Snippet
                </span>
                <div className="flex items-center gap-1">
                  {(['html', 'css', 'javascript'] as const).map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setCodeLang(l)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        codeLang === l ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsCodeModalOpen(false)}
                    className="ml-2 text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <textarea
                value={codeBody}
                onChange={e => setCodeBody(e.target.value)}
                placeholder="Paste your HTML, CSS, or JS code to share with other real students..."
                className="w-full h-20 bg-slate-950 border border-slate-800 rounded-lg p-2 font-mono text-xs text-emerald-300 outline-none resize-none"
              />
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCodeModalOpen(!isCodeModalOpen)}
              title="Share Code Snippet"
              className={`p-2 rounded-xl border transition-colors ${
                isCodeModalOpen
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Code2 className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Collaborate with real students in #${activeChannel.name}...`}
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !codeBody.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
