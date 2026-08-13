import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import * as api from "./services/api";

vi.mock("./services/api");

describe("App — estado de carregamento", () => {
  it("exibe skeletons enquanto isLoading é true", () => {
    api.getTasks.mockReturnValue(new Promise(() => {}));

    render(<App />);

    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("substitui os skeletons pelo board real quando os dados chegam", async () => {
    api.getTasks.mockResolvedValue([
      {
        id: "1",
        title: "Tarefa carregada",
        description: "Descrição",
        category: "backend",
        priority: "Alta",
        status: "todo",
        order: 0,
      },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Tarefa carregada")).toBeInTheDocument();
    });

    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(0);
  });
});
