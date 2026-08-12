package main

import (
	"encoding/json"
	"net/http"
	"sort"
	"strconv"
	"sync"
)

type store struct {
	mu     sync.Mutex
	tasks  map[string]Task
	nextID int
}

func newStore() *store {
	return &store{
		tasks:  make(map[string]Task),
		nextID: 1,
	}
}

var db = newStore()

func respondJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}

func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, map[string]string{"error": message})
}

func GetTasks(w http.ResponseWriter, r *http.Request) {
	db.mu.Lock()
	defer db.mu.Unlock()

	tasks := make([]Task, 0, len(db.tasks))
	for _, t := range db.tasks {
		tasks = append(tasks, t)
	}

	sort.Slice(tasks, func(i, j int) bool {
		if tasks[i].Status != tasks[j].Status {
			return tasks[i].Status < tasks[j].Status
		}
		return tasks[i].Order < tasks[j].Order
	})

	respondJSON(w, http.StatusOK, tasks)
}

func nextOrderForStatus(status string) int {
	maxOrder := -1
	for _, t := range db.tasks {
		if t.Status == status && t.Order > maxOrder {
			maxOrder = t.Order
		}
	}
	return maxOrder + 1
}

func CreateTask(w http.ResponseWriter, r *http.Request) {
	var task Task
	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		respondError(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	if err := task.Validate(); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	db.mu.Lock()
	task.ID = strconv.Itoa(db.nextID)
	db.nextID++
	task.Order = nextOrderForStatus(task.Status)
	db.tasks[task.ID] = task
	db.mu.Unlock()

	respondJSON(w, http.StatusCreated, task)
}

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var updates Task
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		respondError(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	if err := updates.Validate(); err != nil {
		respondError(w, http.StatusBadRequest, err.Error())
		return
	}

	db.mu.Lock()
	defer db.mu.Unlock()

	existing, ok := db.tasks[id]
	if !ok {
		respondError(w, http.StatusNotFound, "tarefa não encontrada")
		return
	}

	existing.Title = updates.Title
	existing.Description = updates.Description
	existing.Category = updates.Category
	existing.Priority = updates.Priority

	if existing.Status != updates.Status {
		existing.Status = updates.Status
		existing.Order = nextOrderForStatus(updates.Status)
	}

	db.tasks[id] = existing

	respondJSON(w, http.StatusOK, existing)
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	db.mu.Lock()
	defer db.mu.Unlock()

	if _, ok := db.tasks[id]; !ok {
		respondError(w, http.StatusNotFound, "tarefa não encontrada")
		return
	}

	delete(db.tasks, id)
	respondJSON(w, http.StatusOK, map[string]string{"message": "tarefa removida"})
}

type reorderItem struct {
	ID     string `json:"id"`
	Status string `json:"status"`
	Order  int    `json:"order"`
}

func ReorderTasks(w http.ResponseWriter, r *http.Request) {
	var items []reorderItem
	if err := json.NewDecoder(r.Body).Decode(&items); err != nil {
		respondError(w, http.StatusBadRequest, "corpo da requisição inválido")
		return
	}

	db.mu.Lock()
	defer db.mu.Unlock()

	for _, item := range items {
		task, ok := db.tasks[item.ID]
		if !ok {
			continue
		}
		task.Status = item.Status
		task.Order = item.Order
		db.tasks[item.ID] = task
	}

	respondJSON(w, http.StatusOK, map[string]string{"message": "ordem atualizada"})
}
