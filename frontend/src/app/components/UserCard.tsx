import type { User } from '../../types/chat';

type UserCardProps = {
  user: User;
};

const UserCard = ({ user }: UserCardProps) => (
  <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/20">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Você</p>
        <p className="text-lg font-semibold text-white">{user.name}</p>
      </div>
    </div>
    <div className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-400">
      userId: <span className="break-all font-mono text-slate-200">{user.id}</span>
    </div>
    <p className="text-sm text-slate-400">Histórico limitado a 50 mensagens mais recentes.</p>
  </aside>
);

export { UserCard };
