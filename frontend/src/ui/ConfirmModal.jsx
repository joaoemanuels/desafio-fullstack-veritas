import { Trash2, X } from "lucide-react";

export default function ConfirmDeleteModal({ task, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
              <Trash2 size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-zinc-900">
                Excluir tarefa
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Essa ação não poderá ser desfeita.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 transition hover:text-zinc-100 hover:bg-zinc-700 p-1 rounded-md cursor-pointer"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 rounded-lg bg-zinc-50 px-4 py-3">
          <p className="text-sm text-zinc-600">
            Você realmente deseja excluir a tarefa:
          </p>

          <p className="mt-1 font-semibold text-zinc-900">{task.title}</p>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex h-9 items-center gap-2 rounded-md bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-600 cursor-pointer"
          >
            <Trash2 size={15} />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
