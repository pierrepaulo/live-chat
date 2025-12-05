import type { Message, User } from '../../types/chat';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import { UserCard } from './UserCard';

type ChatLayoutProps = {
  user: User;
  messages: Message[];
  isLoadingHistory: boolean;
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
  sendDisabled: boolean;
};

const ChatLayout = ({
  user,
  messages,
  isLoadingHistory,
  messageInput,
  onMessageChange,
  onSend,
  isSending,
  sendDisabled,
}: ChatLayoutProps) => (
  <div className="grid gap-6 md:grid-cols-[280px_1fr]">
    <UserCard user={user} />

    <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-black/30">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Chat</h2>
        {isLoadingHistory ? <span className="text-xs text-slate-400">Carregando...</span> : null}
      </div>

      <div className="mt-4 flex-1 overflow-hidden">
        <MessageList messages={messages} currentUserId={user.id} />
      </div>

      <MessageInput
        value={messageInput}
        onChange={onMessageChange}
        onSend={onSend}
        isSending={isSending}
        disabled={sendDisabled}
      />
    </section>
  </div>
);

export { ChatLayout };
