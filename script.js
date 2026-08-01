// DOM Элементтери
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const prioritySelect = document.getElementById('priority-select') || { value: 'low' };
const categorySelect = document.getElementById('category-select') || { value: 'personal' };
const statsText = document.getElementById('stats-text');

// LocalStorage'ден маалыматты алуу
let todos = JSON.parse(localStorage.getItem('todos-pro')) || [];

function saveToLocalStorage() {
  localStorage.setItem('todos-pro', JSON.stringify(todos));
}

// Статистиканы жаңылоо Функциясы
function updateStats() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  if (statsText) {
    statsText.innerText = Выполнено ${completed} из ${total} задач (${percent}%);
  }
}

// Экранга чыгаруу (Render)
function renderTodos() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.innerHTML = '<li class="empty-msg" style="text-align:center; color:#888; padding:15px;">Задач пока нет. Добавьте первую!</li>';
    updateStats();
    return;
  }

  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = todo-item ${todo.completed ? 'completed' : ''};

    li.innerHTML = `
      <div class="todo-content" onclick="toggleComplete(${index})">
        <input type="checkbox" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${escapeHtml(todo.text)}</span>
      </div>
      <button class="delete-btn" onclick="deleteTodo(${index})" title="Удалить">✕</button>
    `;

    todoList.appendChild(li);
  });

  updateStats();
}

// Тапшырма кошуу
function addTodo(event) {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    text: text,
    completed: false
  };

  todos.push(newTodo);
  saveToLocalStorage();
  renderTodos();
  todoInput.value = '';
}

// Бүткөнүн белгилөө
function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveToLocalStorage();
  renderTodos();
}

// Өчүрүү
function deleteTodo(index) {
  todos.splice(index, 1);
  saveToLocalStorage();
  renderTodos();
}

// XSS Коргоо
function escapeHtml(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}

if (todoForm) {
  todoForm.addEventListener('submit', addTodo);
}

// Ишке киргизүү
renderTodos();