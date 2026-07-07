import { useState, useCallback } from 'react';

const AVATARS = ['🎵', '🎧', '🌊', '🔥', '💿', '✨', '🎤', '💫', '🙏', '⚡'];
const COLORS = [
  'text-pablo-orange',
  'text-pablo-gold',
  'text-pablo-burnt',
  'text-red-400',
  'text-amber-400',
  'text-orange-300',
  'text-yellow-500',
];

function getOrCreateIdentity() {
  const stored = localStorage.getItem('mic_in_identity');
  if (stored) {
    try {
      return JSON.parse(stored) as { username: string; avatar: string; color: string };
    } catch {
      // fall through
    }
  }
  return null;
}

function saveIdentity(identity: { username: string; avatar: string; color: string }) {
  localStorage.setItem('mic_in_identity', JSON.stringify(identity));
}

export function useUsername() {
  const [identity, setIdentity] = useState(getOrCreateIdentity);

  const setUsername = useCallback((username: string) => {
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newIdentity = { username: username.trim(), avatar, color };
    saveIdentity(newIdentity);
    setIdentity(newIdentity);
  }, []);

  const clearUsername = useCallback(() => {
    localStorage.removeItem('mic_in_identity');
    setIdentity(null);
  }, []);

  return { identity, setUsername, clearUsername };
}
