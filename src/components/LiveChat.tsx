import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Users, Flame, Mic, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUsername } from '../hooks/useUsername';
import type { RealtimeChannel } from '@supabase/supabase-js';

/* ── types ─────────────────────────────────────────────── */

interface ChatMessage {
  id: string;
  username: string;
  avatar: string;
  message: string;
  color: string;
  created_at: string;
}

/* ── helpers ───────────────────────────────────────────── */

const COLORS = [
  'text-pablo-orange',
  'text-pablo-gold',
  'text-pablo-burnt',
  'text-red-400',
  'text-amber-400',
  'text-orange-300',
  'text-yellow-500',
];

function colorForUser(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/* ── component ─────────────────────────────────────────── */

const LiveChat = () => {
  const { identity, setUsername, clearUsername } = useUsername();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [connectionError, setConnectionError] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNearBottomRef = useRef(true);

  /* ── smart auto-scroll: only if user is near bottom ──── */
  const scrollToBottom = useCallback(() => {
    if (chatRef.current && isNearBottomRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 80;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /* ── load existing messages ──────────────────────────── */
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        console.error('Failed to load messages:', error);
        setConnectionError(true);
      } else {
        setMessages(data ?? []);
        setConnectionError(false);
      }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  /* ── realtime subscriptions ──────────────────────────── */
  useEffect(() => {
    // 1) Postgres Changes – new messages
    const channel = supabase
      .channel('mic-in-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            // de-duplicate by id
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      // 2) Broadcast – typing indicators
      .on('broadcast', { event: 'typing' }, (payload) => {
        const user = payload.payload?.username as string | undefined;
        if (!user || user === identity?.username) return;
        setTypingUsers((prev) => {
          if (prev.includes(user)) return prev;
          return [...prev, user];
        });
        // Auto-remove after 3s
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== user));
        }, 3000);
      })
      // 3) Presence – online count
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const count = Object.keys(state).reduce(
          (sum, key) => sum + (state[key] as unknown[]).length,
          0
        );
        setOnlineCount(Math.max(count, 1));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && identity) {
          await channel.track({
            username: identity.username,
            online_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity?.username]);

  /* ── re-track presence when identity changes ─────────── */
  useEffect(() => {
    if (identity && channelRef.current) {
      channelRef.current.track({
        username: identity.username,
        online_at: new Date().toISOString(),
      });
    }
  }, [identity]);

  /* ── send message ────────────────────────────────────── */
  const handleSend = async () => {
    if (!inputValue.trim() || !identity || sending) return;

    const text = inputValue.trim();
    setInputValue('');
    setSending(true);

    const { error } = await supabase.from('messages').insert({
      username: identity.username,
      avatar: identity.avatar,
      message: text,
      color: identity.color,
    });

    if (error) {
      console.error('Failed to send:', error);
      setInputValue(text); // restore on failure
    }
    setSending(false);
  };

  /* ── broadcast typing ───────────────────────────────── */
  const broadcastTyping = useCallback(() => {
    if (!channelRef.current || !identity) return;
    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { username: identity.username },
    });
  }, [identity]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    // Throttle typing broadcasts to every 2s
    if (typingTimeoutRef.current) return;
    broadcastTyping();
    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
    }, 2000);
  };

  /* ── set username ────────────────────────────────────── */
  const handleSetUsername = () => {
    const name = usernameInput.trim().replace(/\s+/g, '_').slice(0, 20);
    if (name.length < 2) return;
    setUsername(name);
    setUsernameInput('');
  };

  /* ── render ──────────────────────────────────────────── */
  return (
    <section id="chat" className="py-16 md:py-24 bg-pablo-dark relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-pablo-orange rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[40%] bg-pablo-gold rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Section header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-tight text-pablo-cream mb-4">
              LIVE <span className="text-pablo-orange">CHAT</span>
            </h2>
            <p className="text-white/50 font-oswald tracking-[0.2em] uppercase text-sm">
              talk your talk — the mic is on
            </p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-pablo-charcoal/80 backdrop-blur-sm border-2 border-pablo-orange/30 rounded-none"
          >
            {/* Chat header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-pablo-orange" />
                  <span className="font-oswald text-white tracking-wider uppercase text-sm font-bold">
                    Global Room
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 rounded-full">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs text-red-400 font-bold">LIVE</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {identity && (
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-xs text-white/40 font-oswald tracking-wider">
                      {identity.avatar} {identity.username}
                    </span>
                    <button
                      onClick={clearUsername}
                      className="text-white/20 hover:text-pablo-orange transition-colors"
                      title="Change username"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Users className="w-4 h-4" />
                  <span className="font-oswald tracking-wider">{onlineCount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div
              ref={chatRef}
              onScroll={handleScroll}
              className="h-[400px] overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-pablo-orange/30"
            >
              {/* Connection error */}
              {connectionError && (
                <div className="text-center py-8">
                  <p className="text-white/30 text-sm mb-2 font-oswald tracking-wider">
                    ⚠️ COULD NOT CONNECT TO SUPABASE
                  </p>
                  <p className="text-white/20 text-xs">
                    Check your <code className="text-pablo-orange">.env</code> file and make sure the <code className="text-pablo-orange">messages</code> table exists.
                  </p>
                </div>
              )}

              {/* Loading */}
              {loading && !connectionError && (
                <div className="flex items-center justify-center py-8 gap-3">
                  <Loader2 className="w-5 h-5 text-pablo-orange animate-spin" />
                  <span className="text-white/30 font-oswald tracking-wider text-sm">LOADING MESSAGES...</span>
                </div>
              )}

              {/* Empty state */}
              {!loading && !connectionError && messages.length === 0 && (
                <div className="text-center py-16">
                  <span className="text-4xl mb-4 block">🎤</span>
                  <p className="text-white/30 font-oswald tracking-wider text-sm">
                    NO MESSAGES YET — BE THE FIRST TO SPEAK
                  </p>
                </div>
              )}

              {/* Messages */}
              {messages.map((msg) => {
                const isMe = msg.username === identity?.username;
                const displayColor = isMe ? 'text-pablo-cream' : colorForUser(msg.username);
                return (
                  <div
                    key={msg.id}
                    className={`chat-message-enter flex items-start gap-3 ${
                      isMe ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{msg.avatar}</span>
                    <div className={`${isMe ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-2 mb-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <span className={`font-oswald text-sm font-bold tracking-wider ${displayColor}`}>
                          {isMe ? 'YOU' : msg.username}
                        </span>
                        <span className="text-xs text-white/30">{formatTime(msg.created_at)}</span>
                      </div>
                      <p
                        className={`text-sm text-white/80 leading-relaxed ${
                          isMe ? 'bg-pablo-orange/20 px-3 py-2 rounded-lg inline-block' : ''
                        }`}
                      >
                        {msg.message}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              <AnimatePresence>
                {typingUsers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="flex items-center gap-2 pt-1"
                  >
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-pablo-orange rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-pablo-orange rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-pablo-orange rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-white/30 font-oswald tracking-wider">
                      {typingUsers.length === 1
                        ? `${typingUsers[0]} is typing...`
                        : `${typingUsers.slice(0, 2).join(', ')}${typingUsers.length > 2 ? ` +${typingUsers.length - 2}` : ''} are typing...`}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Username prompt OR chat input */}
            <div className="p-4 border-t border-white/10">
              {!identity ? (
                /* ── username entry ───────────────────────────── */
                <div>
                  <p className="text-xs text-white/40 font-oswald tracking-wider uppercase mb-3">
                    Choose your name to enter the chat
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Enter a username..."
                      value={usernameInput}
                      maxLength={20}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSetUsername()}
                      className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-pablo-orange transition-colors font-inter"
                    />
                    <button
                      onClick={handleSetUsername}
                      disabled={usernameInput.trim().length < 2}
                      className="bg-pablo-orange text-white px-6 py-3 font-oswald text-sm font-bold tracking-[0.15em] uppercase hover:bg-pablo-burnt transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      JOIN
                    </button>
                  </div>
                  <p className="text-[10px] text-white/20 mt-2 font-oswald tracking-wider">
                    2-20 CHARACTERS • NO SPACES
                  </p>
                </div>
              ) : (
                /* ── message input ────────────────────────────── */
                <div>
                  <div className="flex items-center gap-3">
                    <button className="text-white/30 hover:text-pablo-gold transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      placeholder="Say something..."
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-pablo-orange transition-colors font-inter"
                      disabled={sending}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || sending}
                      className="bg-pablo-orange text-white p-3 hover:bg-pablo-burnt transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-pablo-orange" />
                      <span className="text-[10px] text-white/40 font-oswald tracking-wider uppercase">
                        Chat Rules Apply
                      </span>
                    </div>
                    <span className="text-[10px] text-white/20">•</span>
                    <span className="text-[10px] text-white/40 font-oswald tracking-wider uppercase">
                      Keep it wavy 🌊
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveChat;
