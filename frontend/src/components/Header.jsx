export default function Header({ onNewTask }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 p-4">
      <h1 className="text-lg font-bold text-zinc-900">Mini Kanban</h1>

      <button
        type="button"
        onClick={onNewTask}
        className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 cursor-pointer"
      >
        + Nova Tarefa
      </button>
    </header>
  );
}
