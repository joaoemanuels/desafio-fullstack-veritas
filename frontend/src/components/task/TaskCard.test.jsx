import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

function renderWithDnd(ui) {
  return render(
    <DndContext>
      <SortableContext items={["1"]}>{ui}</SortableContext>
    </DndContext>,
  );
}

const baseTask = {
  id: "1",
  title: "Configurar ambiente de desenvolvimento",
  description: "Instalar Node.js e preparar o repositório base.",
  category: "devops",
  priority: "Alta",
  status: "todo",
  color: "bg-blue-400",
};

describe("TaskCard", () => {
  it("renderiza título, descrição, categoria e prioridade corretamente", () => {
    renderWithDnd(
      <TaskCard task={baseTask} onDelete={vi.fn()} onEdit={vi.fn()} />,
    );

    expect(
      screen.getByText("Configurar ambiente de desenvolvimento"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Instalar Node.js e preparar o repositório base."),
    ).toBeInTheDocument();
    expect(screen.getByText("devops")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
  });

  it.each([
    ["Baixa", "bg-emerald-100"],
    ["Média", "bg-yellow-100"],
    ["Alta", "bg-orange-100"],
    ["Crítica", "bg-red-100"],
  ])("aplica a cor correta para prioridade %s", (priority, expectedClass) => {
    const task = { ...baseTask, priority };
    renderWithDnd(<TaskCard task={task} onDelete={vi.fn()} onEdit={vi.fn()} />);

    const priorityBadge = screen.getByText(priority);
    expect(priorityBadge.className).toContain(expectedClass);
  });

  it("chama onEdit com a task correta ao clicar no ícone de editar", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    renderWithDnd(
      <TaskCard task={baseTask} onDelete={vi.fn()} onEdit={onEdit} />,
    );

    const editButton = screen.getByLabelText(`Editar tarefa ${baseTask.title}`);
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(baseTask);
  });

  it("abre o ConfirmDeleteModal ao clicar no ícone de excluir, sem excluir direto", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    renderWithDnd(
      <TaskCard task={baseTask} onDelete={onDelete} onEdit={vi.fn()} />,
    );

    const deleteButton = screen.getByLabelText(
      `Excluir tarefa ${baseTask.title}`,
    );
    await user.click(deleteButton);

    const excluirElements = screen.getAllByText(/excluir/i);
    expect(excluirElements.length).toBeGreaterThan(1);

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("chama onDelete com o ID correto ao confirmar exclusão no modal", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    renderWithDnd(
      <TaskCard task={baseTask} onDelete={onDelete} onEdit={vi.fn()} />,
    );

    const deleteButton = screen.getByLabelText(
      `Excluir tarefa ${baseTask.title}`,
    );
    await user.click(deleteButton);

    const excluirButtons = screen.getAllByRole("button", { name: /excluir/i });

    const confirmButton = excluirButtons[excluirButtons.length - 1];
    await user.click(confirmButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(baseTask.id);
  });
});
