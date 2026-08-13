package main

import "testing"

func TestTaskValidate(t *testing.T) {
	tests := []struct {
		name          string
		task          Task
		wantErr       bool
		expectedState string
	}{
		{
			name: "tarefa válida",
			task: Task{
				Title:  "Estudar Go",
				Status: StatusTodo,
			},
			wantErr: false,
		},
		{
			name: "título vazio",
			task: Task{
				Title:  "",
				Status: StatusTodo,
			},
			wantErr: true,
		},
		{
			name: "status vazio assume todo",
			task: Task{
				Title:  "Estudar Go",
				Status: "",
			},
			wantErr:       false,
			expectedState: StatusTodo,
		},
		{
			name: "status inválido",
			task: Task{
				Title:  "Estudar Go",
				Status: "pending",
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.task.Validate()

			if (err != nil) != tt.wantErr {
				t.Errorf("Validate() error = %v, wantErr = %v", err, tt.wantErr)
			}

			if tt.expectedState != "" && tt.task.Status != tt.expectedState {
				t.Errorf("Status = %v, want %v", tt.task.Status, tt.expectedState)
			}
		})
	}
}
