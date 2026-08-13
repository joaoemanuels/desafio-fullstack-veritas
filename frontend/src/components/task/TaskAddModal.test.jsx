import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskAddModal from "./TaskAddModal";

describe("TaskAddModal", () => {
  it("chama onSave com os dados preenchidos ao submeter", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<TaskAddModal onClose={vi.fn()} onSave={onSave} />);

    await user.type(screen.getByLabelText(/título/i), "Nova tarefa de teste");
    await user.type(screen.getByLabelText(/descrição/i), "Descrição de teste");
    await user.selectOptions(screen.getByLabelText(/categoria/i), "backend");

    await user.click(screen.getByRole("button", { name: /alta/i }));
    await user.click(screen.getByRole("button", { name: /em progresso/i }));

    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Nova tarefa de teste",
        description: "Descrição de teste",
        category: "backend",
        priority: "Alta",
        status: "in_progress",
      }),
    );
  });

  it("impede o submit quando o título está vazio", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<TaskAddModal onClose={vi.fn()} onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(onSave).not.toHaveBeenCalled();
  });
});
