import type { SocketStatus } from '../../types/chat';

type StatusBadgeProps = {
  status: SocketStatus;
};

const statusStyles: Record<SocketStatus, { label: string; className: string }> = {
  connected: {
    label: 'Conectado',
    className: 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40',
  },
  connecting: {
    label: 'Conectando...',
    className: 'bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/40',
  },
  disconnected: {
    label: 'Desconectado',
    className: 'bg-slate-800 text-slate-300 ring-1 ring-slate-700',
  },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { label, className } = statusStyles[status];

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${className}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  );
};

export { StatusBadge };
