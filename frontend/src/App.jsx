import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import * as api from "./services/api";
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
  const sensors = useSensors(useSensor(PointerSensor));

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
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

  async function handleUpdateTask(updates) {
    setError(null);
    try {
      const updated = await api.updateTask(editingTask.id, {
        ...editingTask,
        ...updates,
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? updated : t)),
      );
      setEditingTask(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteFromEdit(id) {
    await handleDeleteTask(id);
    setEditingTask(null);
  }

  function findColumnOfTask(taskId) {
    return tasks.find((t) => t.id === taskId)?.status;
  }
  function handleDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeStatus = findColumnOfTask(activeId);
    const overStatus = columnsMeta.some((c) => c.id === overId)
      ? overId
      : findColumnOfTask(overId);

    if (!activeStatus || !overStatus || activeStatus === overStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, status: overStatus } : t)),
    );
  }
  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const targetStatus = columnsMeta.some((c) => c.id === overId)
      ? overId
      : findColumnOfTask(overId);

    const tasksInColumn = tasks
      .filter((t) => t.status === targetStatus)
      .sort((a, b) => a.order - b.order);

    const oldIndex = tasksInColumn.findIndex((t) => t.id === activeId);
    const overIndex = tasksInColumn.findIndex((t) => t.id === overId);

    const newOrder =
      oldIndex !== -1 && overIndex !== -1
        ? arrayMove(tasksInColumn, oldIndex, overIndex)
        : tasksInColumn;

    const updatedItems = newOrder.map((t, index) => ({
      id: t.id,
      status: targetStatus,
      order: index,
    }));

    setTasks((prev) =>
      prev.map((t) => {
        const match = updatedItems.find((u) => u.id === t.id);
        return match ? { ...t, status: match.status, order: match.order } : t;
      }),
    );

    try {
      await api.reorderTasks(updatedItems);
    } catch (err) {
      setError(err.message);
      loadTasks();
    }
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
            onDeleteTask={handleDeleteTask}
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
          onDelete={handleDeleteFromEdit}
        />
      )}
    </>
  );
}
