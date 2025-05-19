document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const apiUrl = 'http://localhost:3000/todos';

    // Fetch all todos
    async function fetchTodos() {
        try {
            const response = await fetch(apiUrl);
            const todos = await response.json();
            todoList.innerHTML = '';
            todos.forEach(todo => addTodoToDOM(todo));
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }

    // Add todo to DOM
    function addTodoToDOM(todo) {
        const li = document.createElement('li');
        li.dataset.id = todo.id;
        li.innerHTML = `
            <span>${todo.text}</span>
            <button class="delete-btn" data-id="${todo.id}">Delete</button>
        `;
        todoList.appendChild(li);

        // Add event listener to delete button
        li.querySelector('.delete-btn').addEventListener('click', deleteTodo);
    }

    // Add new todo
    async function addTodo(e) {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text === '') return;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            const newTodo = await response.json();
            addTodoToDOM(newTodo);
            todoInput.value = '';
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    // Delete todo
    async function deleteTodo(e) {
        const id = e.target.dataset.id;
        try {
            await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
            });
            document.querySelector(`li[data-id="${id}"]`).remove();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }

    // Event listeners
    todoForm.addEventListener('submit', addTodo);

    // Initial fetch
    fetchTodos();
});