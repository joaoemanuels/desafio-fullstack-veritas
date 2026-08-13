import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDeleteModal from "./ConfirmModal";

const task = {
  id: "1",
  title: "Configurar ambiente de desenvolvimento",
};

describe("ConfirmDeleteModal", () => {
  it("exibe o título da tarefa a ser excluída", () => {
    render(
      <ConfirmDeleteModal task={task} onClose={vi.fn()} onConfirm={vi.fn()} />,
    );

    expect(screen.getByText(task.title)).toBeInTheDocument();
  });

  it("chama onConfirm ao clicar em Excluir", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <ConfirmDeleteModal
        task={task}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    await user.click(screen.getByRole("button", { name: /^excluir$/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("chama onClose ao clicar em Cancelar", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <ConfirmDeleteModal task={task} onClose={onClose} onConfirm={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("chama onClose ao clicar no botão de fechar (X)", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <ConfirmDeleteModal task={task} onClose={onClose} onConfirm={vi.fn()} />,
    );

    await user.click(screen.getByLabelText("Fechar"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
