'use client';

import { useState } from 'react';
import { ChatLayout } from './components/ChatLayout';
import { JoinForm } from './components/JoinForm';
import { StatusBadge } from './components/StatusBadge';
import { useChat } from '../hooks/useChat';
import { useErrors } from '../hooks/useErrors';
import { useLocalUser } from '../hooks/useLocalUser';
import { createUser } from '../lib/api';

export default function Home() {
  const [nameInput, setNameInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { user, saveUser, clearUser } = useLocalUser();
  const { messages, sendMessage, status, error: chatError, clearError, isLoadingHistory, resetChat } =
    useChat(user);
  const { getErrorMessage } = useErrors();

  const handleJoin = async (name: string) => {
    if (!name.trim()) return;
    setIsJoining(true);
    setLocalError(null);
    clearError();
    try {
      const newUser = await createUser({ name: name.trim() });
      saveUser(newUser);
      setNameInput('');
    } catch (err) {
      setLocalError(getErrorMessage(err, 'Failed to join chat'));
    } finally {
      setIsJoining(false);
    }
  };

  const handleSend = () => {
    if (!user) return;
    setIsSending(true);
    setLocalError(null);
    clearError();
    const sent = sendMessage(messageInput);
    if (sent) {
      setMessageInput('');
    }
    setIsSending(false);
  };

  const handleReset = () => {
    clearUser();
    setMessageInput('');
    setNameInput('');
    clearError();
    setLocalError(null);
    resetChat();
  };

  const combinedError = localError ?? chatError;
  const sendDisabled = isSending || status !== 'connected';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Live Chat</h1>
            <p className="text-sm text-slate-400">
              Digite seu nome para entrar, envie mensagens e veja o histórico.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            {user ? (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 hover:border-slate-500 hover:text-white"
              >
                Trocar usuário
              </button>
            ) : null}
          </div>
        </header>

        {combinedError ? (
          <div className="rounded-lg border border-rose-600/50 bg-rose-900/30 px-4 py-3 text-sm text-rose-100">
            {combinedError}
          </div>
        ) : null}

        {!user ? (
          <JoinForm
            name={nameInput}
            isJoining={isJoining}
            onNameChange={setNameInput}
            onSubmit={handleJoin}
          />
        ) : (
          <ChatLayout
            user={user}
            messages={messages}
            isLoadingHistory={isLoadingHistory}
            messageInput={messageInput}
            onMessageChange={setMessageInput}
            onSend={handleSend}
            isSending={isSending}
            sendDisabled={sendDisabled}
          />
        )}
      </div>
    </div>
  );
}
