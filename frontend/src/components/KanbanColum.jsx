import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import EmptyState from "../ui/EmptyState";

export default function Column({ column, onDeleteTask }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
          <h2 className="text-sm font-semibold text-zinc-700">
            {column.title}
          </h2>
        </div>

        <span
          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium ${column.countColor}`}
        >
          {column.tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-50 rounded-lg p-2 transition-colors md:min-h-125 ${
          isOver ? "bg-slate-200" : "bg-slate-100"
        }`}
      >
        {column.tasks.length > 0 ? (
          <div className="flex flex-col gap-2">
            {column.tasks.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
            ))}
          </div>
        ) : (
          <EmptyState message={"Adicione uma tarefa"}/>
        )}
      </div>
    </section>
  );
}
