package main

import (
	"context"
	"encoding/json"
	"net/http"
	"github.com/jackc/pgx/v5/pgxpool"
)

var db *pgxpool.Pool

func respondJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(payload)
}

func respondError(w http.ResponseWriter, status int, message string) {
	respondJSON(w, status, map[string]string{
		"error": message,
	})
}

func GetTasks(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query(
		r.Context(),
		`SELECT
			id,
			title,
			description,
			category,
			priority,
			status,
			"order"
		FROM tasks
		ORDER BY status, "order"`,
	)
	if err != nil {
		respondError(
			w,
			http.StatusInternalServerError,
			"erro ao buscar tarefas",
		)
		return
	}

	defer rows.Close()

	tasks := make([]Task, 0)

	for rows.Next() {
		var task Task

		if err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.Category,
			&task.Priority,
			&task.Status,
			&task.Order,
		); err != nil {
			respondError(
				w,
				http.StatusInternalServerError,
				"erro ao processar tarefas",
			)
			return
		}

		tasks = append(tasks, task)
	}

	if err := rows.Err(); err != nil {
		respondError(
			w,
			http.StatusInternalServerError,
			"erro ao ler tarefas",
		)
		return
	}

	respondJSON(w, http.StatusOK, tasks)
}

func nextOrderForStatus(
	ctx context.Context,
	status string,
) (int, error) {
	var order int

	err := db.QueryRow(
		ctx,
		`SELECT COALESCE(MAX("order"), -1) + 1
		 FROM tasks
		 WHERE status = $1`,
		status,
	).Scan(&order)

	return order, err
}

func CreateTask(w http.ResponseWriter, r *http.Request) {
	var task Task

	if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
		respondError(
			w,
			http.StatusBadRequest,
			"corpo da requisição inválido",
		)
		return
	}

	if err := task.Validate(); err != nil {
		respondError(
			w,
			http.StatusBadRequest,
			err.Error(),
		)
		return
	}

	order, err := nextOrderForStatus(
		r.Context(),
		task.Status,
	)
	if err != nil {
		respondError(
			w,
			http.StatusInternalServerError,
			"erro ao calcular ordem da tarefa",
		)
		return
	}

	err = db.QueryRow(
		r.Context(),
		`INSERT INTO tasks (
			title,
			description,
			category,
			priority,
			status,
			"order"
		)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id`,
		task.Title,
		task.Description,
		task.Category,
		task.Priority,
		task.Status,
		order,
	).Scan(&task.ID)

	if err != nil {
		respondError(
			w,
			http.StatusInternalServerError,
			"erro ao criar tarefa",
		)
		return
	}

	task.Order = order

	respondJSON(
		w,
		http.StatusCreated,
		task,
	)
}

func UpdateTask(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var updates Task

	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		respondError(
			w,
			http.StatusBadRequest,
			"corpo da requisição inválido",
		)
		return
	}

	if err := updates.Validate(); err != nil {
		respondError(
			w,
			http.StatusBadRequest,
			err.Error(),
		)
		return
	}

	var existing Task

	err := db.QueryRow(
		r.Context(),
		`SELECT
			id,
			title,
			description,
			category,
			priority,
			status,
			"order"
		FROM tasks
		WHERE id = $1`,
		id,
	).Scan(
		&existing.ID,
		&existing.Title,
		&existing.Description,
		&existing.Category,
		&existing.Priority,
		&existing.Status,
		&existing.Order,
	)

	if err != nil {
		respondError(
			w,
			http.StatusNotFound,
			"tarefa não encontrada",
		)
		return
	}

	newOrder := existing.Order

	if existing.Status != updates.Status {
		newOrder, err = nextOrderForStatus(
			r.Context(),
			updates.Status,
		)

		if err != nil {
			respondError(
				w,
				http.StatusInternalServerError,
				"erro ao calcular nova ordem",
			)
			return
		}
	}

	err = db.QueryRow(
		r.Context(),
		`UPDATE tasks
		SET
			title = $1,
			description = $2,
			category = $3,
			priority = $4,
			status = $5,
			"order" = $6,
			updated_at = NOW()
		WHERE id = $7
		RETURNING
			id,
			title,
			description,
			category,
			priority,
			status,
			"order"`,
		updates.Title,
		updates.Description,
		updates.Category,
		updates.Priority,
		updates.Status,
		newOrder,
		id,
	).Scan(
		&existing.ID,
		&existing.Title,
		&existing.Description,
		&existing.Category,
		&existing.Priority,
		&existing.Status,
		&existing.Order,
	)

	if err != nil {
		respondError(
			w,
			http.StatusInternalServerError,
			"erro ao atualizar tarefa",
		)
		return
	}

	respondJSON(
		w,
		http.StatusOK,
		existing,
	)
}

func DeleteTask(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	result, err := db.Exec(
		r.Context(),
		`DELETE FROM tasks WHERE id = $1`,
		id,
	)

	if err != nil {
		respondError(
			w,
			http.StatusInternalServerError,
			"erro ao remover tarefa",
		)
		return
	}

	if result.RowsAffected() == 0 {
		respondError(
			w,
			http.StatusNotFound,
			"tarefa não encontrada",
		)
		return
	}

	respondJSON(
		w,
		http.StatusOK,
		map[string]string{
			"message": "tarefa removida",
		},
	)
}

type reorderItem struct {
	ID     string `json:"id"`
	Status string `json:"status"`
	Order  int    `json:"order"`
}

func ReorderTasks(w http.ResponseWriter, r *http.Request) {
	var items []reorderItem

	if err := json.NewDecoder(r.Body).Decode(&items); err != nil {
		respondError(
			w,
			http.StatusBadRequest,
			"corpo da requisição inválido",
		)
		return
	}

	tx, err := db.Begin(r.Context())
	if err != nil {
		respondError(
			w,
			http.StatusInternalServerError,
			"erro ao iniciar transação",
		)
		return
	}

	defer tx.Rollback(r.Context())

	for _, item := range items {
		_, err := tx.Exec(
			r.Context(),
			`UPDATE tasks
			SET
				status = $1,
				"order" = $2,
				updated_at = NOW()
			WHERE id = $3`,
			item.Status,
			item.Order,
			item.ID,
		)

		if err != nil {
			respondError(
				w,
				http.StatusInternalServerError,
				"erro ao atualizar ordem das tarefas",
			)
			return
		}
	}

	if err := tx.Commit(r.Context()); err != nil {
		respondError(
			w,
			http.StatusInternalServerError,
			"erro ao salvar nova ordem",
		)
		return
	}

	respondJSON(
		w,
		http.StatusOK,
		map[string]string{
			"message": "ordem atualizada",
		},
	)
}