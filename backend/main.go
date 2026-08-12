package main

import (
	"log"
	"net/http"
)

func withCORS(next http.Handler) http.Handler {
	allowedOrigins := map[string]bool{
		"http://localhost:5173":                             true,
		"http://localhost:4173":                             true,
		"http://192.168.0.6:5173":                           true,
		"http://192.168.0.2:5173":                           true,
		"https://desafio-fullstack-veritas-c82j.vercel.app": true,
		"https://desafioveritas.online":                     true,
		"https://www.desafioveritas.online":                 true,
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /tasks", GetTasks)
	mux.HandleFunc("POST /tasks", CreateTask)
	mux.HandleFunc("PUT /tasks/{id}", UpdateTask)
	mux.HandleFunc("DELETE /tasks/{id}", DeleteTask)
	mux.HandleFunc("PUT /tasks/reorder", ReorderTasks)

	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write([]byte(`
		<!DOCTYPE html>
		<html lang="pt-BR">
		<head>
			<meta charset="UTF-8">
			<title>Kanban API</title>
			<style>
				body {
					font-family: system-ui, sans-serif;
					background: #0f172a;
					color: #f1f5f9;
					display: flex;
					align-items: center;
					justify-content: center;
					height: 100vh;
					margin: 0;
				}
				.card {
					background: #1e293b;
					padding: 2rem 3rem;
					border-radius: 12px;
					text-align: center;
					box-shadow: 0 4px 20px rgba(0,0,0,0.4);
				}
				h1 { margin: 0 0 0.5rem; color: #38bdf8; }
				p { margin: 0; color: #94a3b8; }
				.status {
					display: inline-block;
					width: 10px;
					height: 10px;
					background: #22c55e;
					border-radius: 50%;
					margin-right: 8px;
				}
			</style>
		</head>
		<body>
			<div class="card">
				<h1><span class="status"></span>API do Kanban</h1>
				<p>Servidor rodando</p>
			</div>
		</body>
		</html>
	`))
	})

	handler := withCORS(mux)

	log.Println("Servidor rodando em http://localhost:8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}
