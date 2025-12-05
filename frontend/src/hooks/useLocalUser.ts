import { useState } from 'react';
import type { User } from '../types/chat';

const STORAGE_KEY = 'live-chat-user';

const useLocalUser = () => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  });

  const saveUser = (value: User) => {
    setUser(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    }
  };

  const clearUser = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  return { user, saveUser, clearUser };
};

export { useLocalUser };
