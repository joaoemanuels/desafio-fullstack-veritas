import { TouchSensor, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export function useDragAndDrop(tasks, setTasks, reorderTasks, columnsMeta) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
  );

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

    reorderTasks(updatedItems);
  }

  return { sensors, handleDragOver, handleDragEnd };
}
