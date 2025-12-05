import type { FormEvent } from 'react';

type JoinFormProps = {
  name: string;
  isJoining: boolean;
  onSubmit: (name: string) => void;
  onNameChange: (value: string) => void;
};

const JoinForm = ({ name, isJoining, onSubmit, onNameChange }: JoinFormProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(name.trim());
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/30">
      <h2 className="text-xl font-semibold text-white">Informe seu nome</h2>
      <p className="mt-1 text-sm text-slate-400">Criamos um usuário simples para você entrar no chat.</p>
      <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Seu nome"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2"
        />
        <button
          type="submit"
          disabled={isJoining || !name.trim()}
          className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-700 sm:w-auto"
        >
          {isJoining ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  );
};

export { JoinForm };
