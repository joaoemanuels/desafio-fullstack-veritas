import TaskCard from "./TaskCard";
import { FilePlus } from "lucide-react";

export default function KanbanBoard({ columns, onDeleteTask }) {
  return (
    <main className="p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((column) => (
          <section key={column.id} className="min-w-0">
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

            <div className="min-h-50 rounded-lg bg-slate-100 p-2 md:min-h-125">
              {column.tasks.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {column.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-45 flex-col items-center justify-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
                    <FilePlus width={100} height={100} />
                  </div>

                  <p className="text-sm text-zinc-400">
                    Nenhuma tarefa aqui ainda
                  </p>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
