const BASE_URL = import.meta.env.VITE_API_URL;

async function handleResponse(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Erro ao comunicar com o servidor");
  }
  return res.json();
}

export async function getTasks() {
  const res = await fetch(`${BASE_URL}/tasks`);
  return handleResponse(res);
}

export async function createTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return handleResponse(res);
}

export async function updateTask(id, task) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
