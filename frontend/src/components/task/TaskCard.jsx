import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import ConfirmDeleteModal from "../../ui/ConfirmModal";
import { Trash2 } from "lucide-react";

export default function TaskCard({ task, onDelete, onEdit }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityStyles = {
    Baixa: "bg-emerald-100 text-emerald-600",
    Média: "bg-yellow-100 text-yellow-600",
    Alta: "bg-orange-100 text-orange-600",
    Crítica: "bg-red-100 text-red-600",
  };

  const priorityClass =
    priorityStyles[task.priority] || "bg-zinc-100 text-zinc-500";

  return (
    <>
      <article
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onClick={() => onEdit(task)}
        className="relative cursor-grab overflow-hidden rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md active:cursor-grabbing sm:p-5"
      >
        <div className={`absolute left-0 top-0 h-full w-1 ${task.color}`} />

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteModal(true);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-red-50 hover:text-red-500"
          aria-label={`Excluir tarefa ${task.title}`}
        >
          <Trash2 size={17} />
        </button>

        <div className="pr-8">
          <h3 className="text-base font-bold leading-tight text-zinc-900 sm:text-xl">
            {task.title}
          </h3>
          <p className="mt-2 line-clamp-1 text-sm leading-relaxed text-zinc-700 sm:mt-4 sm:text-lg">
            {task.description}
          </p>
        </div>

        <div className="my-3 h-px bg-zinc-100 sm:my-5" />

        <div className="flex items-center justify-between gap-2">
          <span className="truncate rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-700 sm:px-3 sm:py-1.5 sm:text-sm">
            {task.category}
          </span>
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold sm:h-9 sm:w-9 sm:text-sm ${priorityClass}`}
          >
            {task.priority}
          </div>
        </div>
      </article>

      {showDeleteModal && (
        <ConfirmDeleteModal
          task={task}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            onDelete(task.id);
            setShowDeleteModal(false);
          }}
        />
      )}
    </>
  );
}
