import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskEditModal from "./TaskEditModal";

const existingTask = {
  id: "1",
  title: "Configurar ambiente de desenvolvimento",
  description: "Instalar Node.js e preparar o repositório base.",
  category: "devops",
  priority: "Alta",
  status: "todo",
};

describe("TaskEditModal", () => {
  it("pré-preenche os campos com os dados da task recebida", () => {
    render(
      <TaskEditModal task={existingTask} onClose={vi.fn()} onSave={vi.fn()} />,
    );

    expect(screen.getByLabelText(/título/i)).toHaveValue(existingTask.title);
    expect(screen.getByLabelText(/descrição/i)).toHaveValue(
      existingTask.description,
    );
    expect(screen.getByLabelText(/categoria/i)).toHaveValue(
      existingTask.category,
    );
  });

  it("atualiza a classe ativa ao trocar prioridade e status", async () => {
    const user = userEvent.setup();

    render(
      <TaskEditModal task={existingTask} onClose={vi.fn()} onSave={vi.fn()} />,
    );

    const altaButton = screen.getByRole("button", { name: /alta/i });
    const criticaButton = screen.getByRole("button", { name: /crítica/i });

    expect(altaButton.className).toContain("border-orange-200");

    await user.click(criticaButton);

    expect(criticaButton.className).toContain("border-red-200");
    expect(altaButton.className).not.toContain("border-orange-200");

    const emProgressoButton = screen.getByRole("button", {
      name: /em progresso/i,
    });
    await user.click(emProgressoButton);

    expect(emProgressoButton.className).toContain("border-orange-200");
  });

  it("chama onSave com os dados atualizados ao submeter", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <TaskEditModal task={existingTask} onClose={vi.fn()} onSave={onSave} />,
    );

    const titleInput = screen.getByLabelText(/título/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Título editado");

    await user.click(
      screen.getByRole("button", { name: /salvar alterações/i }),
    );

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Título editado" }),
    );
  });
});
