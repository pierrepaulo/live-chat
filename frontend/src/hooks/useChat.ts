import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMessages } from '../lib/api';
import { createChatSocket } from '../lib/socket';
import type { Message, SocketStatus, User } from '../types/chat';
import { useErrors } from './useErrors';

const useChat = (user: User | null) => {
  const { getErrorMessage } = useErrors();
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<SocketStatus>('disconnected');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<ReturnType<typeof createChatSocket> | null>(null);

  useEffect(() => {
    if (!user) return;

    let active = true;

    const loadHistory = async () => {
      setIsLoadingHistory(true);
      setError(null);
      try {
        const data = await fetchMessages();
        if (!active) return;
        setMessages(data);
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err, 'Failed to load messages'));
      } finally {
        if (!active) return;
        setIsLoadingHistory(false);
      }
    };

    void Promise.resolve().then(loadHistory);

    return () => {
      active = false;
    };
  }, [user, getErrorMessage]);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = createChatSocket({
      onMessage: (message) => {
        setMessages((prev) => [...prev, message]);
      },
      onError: (msg) => setError(msg),
      onStatusChange: (nextStatus) => setStatus(nextStatus),
    });

    socket.connect();
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!user || !socketRef.current) return false;
      const trimmed = content.trim();
      if (!trimmed) return false;
      setError(null);
      try {
        socketRef.current.emitMessage({ content: trimmed, userId: user.id });
        return true;
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to send message'));
        return false;
      }
    },
    [user, getErrorMessage],
  );

  const clearError = useCallback(() => setError(null), []);

  const resetChat = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setMessages([]);
    setStatus('disconnected');
    setIsLoadingHistory(false);
    setError(null);
  }, []);

  return { messages, sendMessage, status, error, clearError, isLoadingHistory, resetChat };
};

export { useChat };
