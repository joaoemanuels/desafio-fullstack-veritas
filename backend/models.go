package main

import "errors"

type Task struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Priority    string `json:"priority"`
	Status      string `json:"status"`
	Order       int    `json:"order"`
}

const (
	StatusTodo       = "todo"
	StatusInProgress = "in_progress"
	StatusDone       = "done"
)

var validStatuses = map[string]bool{
	StatusTodo:       true,
	StatusInProgress: true,
	StatusDone:       true,
}

func (t *Task) Validate() error {
	if t.Title == "" {
		return errors.New("título é obrigatório")
	}

	if t.Status == "" {
		t.Status = StatusTodo
	}

	if !validStatuses[t.Status] {
		return errors.New("status inválido: use todo, in_progress ou done")
	}

	return nil
}
