import { Plus } from "lucide-react";

export default function Header({ onNewTask }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 w-full max-w-281.5 items-center justify-between px-5 sm:px-8">
        <h1 className="font-heading text-[22px] font-medium tracking-tight text-text-h">
          Mini Kanban
        </h1>

        <button
          type="button"
          onClick={onNewTask}
          className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-95 cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
          Nova Tarefa
        </button>
      </div>
    </header>
  );
}
