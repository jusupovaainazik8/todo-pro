const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const statsText = document.getElementById('stats-text');

let todos = JSON.parse(localStorage.getItem('todos-pro')) || [];

function saveToLocalStorage() {
  localStorage.setItem('todos-pro', JSON.stringify(todos));
}

function updateStats() {
  const total = todos.length;
  const completed = todos.filter(function(t) { return t.completed; }).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  if (statsText) {
    statsText.innerText = 'Выполнено ' + completed + ' из ' + total + ' задач (' + percent + '%)';
  }
}

function renderTodos() {
  if (!todoList) return;
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.innerHTML = '<li style="text-align:center; color:#888; padding:15px; list-style:none;">Задач пока нет. Добавьте первую!</li>';
    updateStats();
    return;
  }

  todos.forEach(function(todo, index) {
    const li = document.createElement('li');
    li.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 12px; margin-bottom: 8px; background: #f4f4f9; border-radius: 8px; list-style: none;";
    
    if (todo.completed) {
      li.style.opacity = "0.5";
      li.style.textDecoration = "line-through";
    }

    const checkState = todo.completed ? 'checked' : '';

    li.innerHTML = 
      '<div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" onclick="toggleComplete(' + index + ')">' +
        '<input type="checkbox" ' + checkState + ' style="cursor: pointer;">' +
        '<span style="font-size: 16px; color: #333;">' + escapeHtml(todo.text) + '</span>' +
      '</div>' +
      '<button onclick="deleteTodo(' + index + ')" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer;">✕</button>';

    todoList.appendChild(li);
  });

  updateStats();
}

function addTodo(event) {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  todos.push({ text: text, completed: false });
  saveToLocalStorage();
  renderTodos();
  todoInput.value = '';
}

function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveToLocalStorage();
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveToLocalStorage();
  renderTodos();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}

if (todoForm) {
  todoForm.addEventListener('submit', addTodo);
}

renderTodos();
