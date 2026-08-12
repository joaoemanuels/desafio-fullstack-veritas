import Column from "./KanbanColumn";

export default function KanbanBoard({ columns, onDeleteTask, onEditTask }) {
  return (
    <main className="p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </main>
  );
}
