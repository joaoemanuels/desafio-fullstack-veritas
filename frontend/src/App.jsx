import { useEffect, useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";

import Header from "./components/Header";
import TaskModal from "./components/TaskModal";
import KanbanBoard from "./components/KanbanBoard";
import * as api from "./services/api";

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
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTasks();
      setTasks(data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveTask(task) {
    setError(null);

    try {
      const created = await api.createTask({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: task.status,
      });

      setTasks((prev) => [...prev, created]);
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteTask(id) {
    setError(null);
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleMoveTask(id, newStatus) {
    setError(null);
    const task = tasks.find((t) => t.id === id);
    if (!task || task.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
    );

    try {
      const updated = await api.updateTask(id, { ...task, status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    handleMoveTask(taskId, newStatus);
  }

  const columns = columnsMeta.map((meta) => ({
    ...meta,
    tasks: tasks
      .filter((task) => task.status === meta.id)
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
        <p className="p-4 text-sm text-zinc-500">Carregando tarefas...</p> //implementar o componente de loading
      ) : (
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <KanbanBoard columns={columns} onDeleteTask={handleDeleteTask} />
        </DndContext>
      )}

      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveTask}
        />
      )}
    </>
  );
}
