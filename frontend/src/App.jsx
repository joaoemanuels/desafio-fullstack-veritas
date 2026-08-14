import { DndContext, closestCenter } from "@dnd-kit/core";
import { useState } from "react";

import { useTasks } from "./hooks/useTasks";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import Header from "./components/Header";
import KanbanBoardSkeleton from "./components/board/KanbanBoardSkeleton";
import KanbanBoard from "./components/board/KanbanBoard";
import TaskAddModal from "./components/task/TaskAddModal";
import TaskEditModal from "./components/task/TaskEditModal";

const columnsMeta = [
  {
    id: "todo",
    title: "A Fazer",
    color: "bg-blue-400",
    countColor: "bg-zinc-200 text-zinc-500",
  },
  {
    id: "in_progress",
    title: "Em Progresso",
    color: "bg-orange-400",
    countColor: "bg-orange-100 text-orange-500",
  },
  {
    id: "done",
    title: "Concluídas",
    color: "bg-emerald-400",
    countColor: "bg-emerald-100 text-emerald-500",
  },
];

export default function App() {
  const {
    tasks,
    setTasks,
    isLoading,
    error,
    loadTasks,
    createTask,
    deleteTask,
    updateTask,
    reorderTasks,
  } = useTasks();
  const { sensors, handleDragOver, handleDragEnd } = useDragAndDrop(
    tasks,
    setTasks,
    reorderTasks,
    columnsMeta,
  );

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  async function handleSaveTask(task) {
    await createTask(task);
    setShowModal(false);
  }

  async function handleUpdateTask(updates) {
    await updateTask(editingTask.id, updates);
    setEditingTask(null);
  }

  const columns = columnsMeta.map((meta) => ({
    ...meta,
    tasks: tasks
      .filter((task) => task.status === meta.id)
      .sort((a, b) => a.order - b.order)
      .map((task) => ({ ...task, color: meta.color })),
  }));

  return (
    <>
      <Header onNewTask={() => setShowModal(true)} />

      {error && (
        <div className="mx-4 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={loadTasks}
            className="ml-2 font-medium underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {isLoading ? (
        <KanbanBoardSkeleton />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <KanbanBoard
            columns={columns}
            onDeleteTask={deleteTask}
            onEditTask={setEditingTask}
          />
        </DndContext>
      )}

      {showModal && (
        <TaskAddModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveTask}
        />
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
        />
      )}
    </>
  );
}
