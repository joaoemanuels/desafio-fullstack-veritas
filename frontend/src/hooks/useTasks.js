import { useState, useEffect, useCallback } from "react";
import * as api from "../services/api";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTasks() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await api.getTasks();

        if (!cancelled) {
          setTasks(data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getTasks();
      setTasks(data ?? []);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function createTask(task) {
    setError(null);

    try {
      const created = await api.createTask(task);

      setTasks((prev) => [...prev, created]);

      return created;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function deleteTask(id) {
    setError(null);

    try {
      await api.deleteTask(id);

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function updateTask(id, updates) {
    setError(null);

    try {
      const current = tasks.find((task) => task.id === id);

      if (!current) {
        throw new Error("Tarefa não encontrada");
      }

      const updated = await api.updateTask(id, {
        ...current,
        ...updates,
      });

      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));

      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function reorderTasks(updatedItems) {
    setTasks((prev) =>
      prev.map((task) => {
        const match = updatedItems.find((item) => item.id === task.id);

        return match
          ? {
              ...task,
              status: match.status,
              order: match.order,
            }
          : task;
      }),
    );

    try {
      await api.reorderTasks(updatedItems);
    } catch (err) {
      setError(err.message);

      try {
        await loadTasks();
      } catch {
        // O erro original já foi armazenado
      }
    }
  }

  return {
    tasks,
    setTasks,
    isLoading,
    error,
    loadTasks,
    createTask,
    deleteTask,
    updateTask,
    reorderTasks,
  };
}
