import { useState } from "react";

export default function TaskEditModal({ task, onClose, onSave }) {
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const updates = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      priority,
      status,
    };

    onSave(updates);
  }

  const statuses = [
    {
      value: "todo",
      label: "A Fazer",
      dotClass: "bg-blue-500",
      activeClass: "border-blue-200 bg-blue-50 text-blue-600",
    },
    {
      value: "in_progress",
      label: "Em Progresso",
      dotClass: "bg-orange-500",
      activeClass: "border-orange-200 bg-orange-50 text-orange-600",
    },
    {
      value: "done",
      label: "Concluídas",
      dotClass: "bg-emerald-500",
      activeClass: "border-emerald-200 bg-emerald-50 text-emerald-600",
    },
  ];

  const categories = [
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "devops", label: "DevOps" },
    { value: "database", label: "Database" },
    { value: "design", label: "Design" },
  ];

  const priorities = [
    {
      value: "Baixa",
      label: "Baixa",
      dotClass: "bg-emerald-500",
      activeClass: "border-emerald-200 bg-emerald-50 text-emerald-600",
    },
    {
      value: "Média",
      label: "Média",
      dotClass: "bg-yellow-500",
      activeClass: "border-yellow-200 bg-yellow-50 text-yellow-600",
    },
    {
      value: "Alta",
      label: "Alta",
      dotClass: "bg-orange-500",
      activeClass: "border-orange-200 bg-orange-50 text-orange-600",
    },
    {
      value: "Crítica",
      label: "Crítica",
      dotClass: "bg-red-500",
      activeClass: "border-red-200 bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-3 sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-105 flex-col overflow-hidden rounded-[9px] bg-white shadow-2xl">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 px-4 sm:h-12.5">
          <h2 className="text-base font-semibold text-zinc-800 sm:text-[14px]">
            Editar Tarefa
          </h2>

          <div className="flex items-center gap-3">
            <span className="h-4 w-px bg-zinc-200" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar modal"
              className="p-1 text-2xl leading-none text-zinc-500 transition hover:text-zinc-900 sm:p-0 sm:text-[23px] cursor-pointer"
            >
              ×
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-4 pt-3.5">
          <div className="mb-3 flex flex-col">
            <label
              htmlFor="title"
              className="mb-1.5 text-xs font-semibold text-zinc-700 sm:text-[9px]"
            >
              Título <span className="text-red-500">*</span>
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={task.title}
              className="h-10 w-full border border-zinc-200 px-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-zinc-400 sm:h-6.25 sm:text-[10px]"
            />
          </div>

          <div className="mb-3 flex flex-col">
            <label
              htmlFor="description"
              className="mb-1.5 text-xs font-semibold text-zinc-700 sm:text-[9px]"
            >
              Descrição
              <span className="font-normal text-zinc-500">(Opcional)</span>
            </label>

            <textarea
              id="description"
              name="description"
              defaultValue={task.description}
              className="min-h-20 w-full resize-none border border-zinc-200 p-2 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 focus:border-zinc-400 sm:min-h-12.5 sm:text-[10px]"
            />
          </div>

          <div className="mb-3 flex flex-col">
            <label
              htmlFor="category"
              className="mb-1.5 text-xs font-semibold text-zinc-700 sm:text-[9px]"
            >
              Categoria
            </label>

            <select
              id="category"
              name="category"
              required
              defaultValue={task.category}
              className="h-10 w-full border border-zinc-200 bg-white px-2 text-sm text-zinc-800 outline-none focus:border-zinc-400 sm:h-6.25 sm:text-[10px] cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3 flex flex-col">
            <label className="mb-1.5 text-xs font-semibold text-zinc-700 sm:text-[9px]">
              Prioridade
            </label>

            <div className="grid grid-cols-4 gap-2 ">
              {priorities.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setPriority(item.value)}
                  className={`flex h-10 items-center justify-center gap-1.5 rounded-md border text-xs font-medium transition sm:h-6.25 sm:text-[9px] cursor-pointer ${
                    priority === item.value
                      ? item.activeClass
                      : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${item.dotClass}`}
                  />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3 flex flex-col">
            <label className="mb-1.5 text-xs font-semibold text-zinc-700 sm:text-[9px]">
              Status
            </label>
            <div className="grid h-10 grid-cols-3 rounded-md p-0.5 sm:h-6.25 gap-1">
              {statuses.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setStatus(item.value)}
                  className={`flex h-10 items-center justify-center gap-1.5 rounded-md border text-xs font-medium transition sm:h-6.25 sm:text-[9px] cursor-pointer ${
                    status === item.value
                      ? `${item.activeClass} shadow-sm`
                      : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${item.dotClass}`}
                  />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <footer className="sticky bottom-0 -mx-4 mt-5 flex items-center justify-end gap-4 border-t border-zinc-200 bg-white px-4 py-2.5">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 sm:text-[10px] cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="h-9 min-w-32 bg-black px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:h-6 sm:min-w-20 sm:px-2.5 sm:text-[10px] cursor-pointer"
            >
              Salvar Alterações
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
