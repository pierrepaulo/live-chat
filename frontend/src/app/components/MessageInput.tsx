import type { FormEvent } from 'react';

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  isSending: boolean;
};

const MessageInput = ({ value, onChange, onSend, disabled, isSending }: MessageInputProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSend();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite sua mensagem"
        className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none ring-emerald-500/40 focus:border-emerald-400 focus:ring-2"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-700"
      >
        {isSending ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};

export { MessageInput };
