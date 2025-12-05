import { formatTime } from '../../lib/format';
import type { Message } from '../../types/chat';

type MessageListProps = {
  messages: Message[];
  currentUserId: string;
};

const MessageList = ({ messages, currentUserId }: MessageListProps) => (
  <div className="flex h-[60vh] flex-col gap-3 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 p-4">
    {messages.length === 0 ? (
      <p className="text-sm text-slate-500">Nenhuma mensagem ainda. Envie a primeira!</p>
    ) : (
      messages.map((msg) => {
        const isMine = msg.userId === currentUserId;
        return (
          <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] rounded-xl px-4 py-3 text-sm shadow-sm ${
                isMine ? 'bg-emerald-500 text-emerald-950' : 'bg-slate-800 text-slate-100'
              }`}
            >
              <div className="mb-1 flex items-center justify-between gap-3 text-xs opacity-80">
                <span className="font-semibold">{msg.user.name}</span>
                <span>{formatTime(msg.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          </div>
        );
      })
    )}
  </div>
);

export { MessageList };
