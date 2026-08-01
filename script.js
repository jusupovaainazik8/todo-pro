/**
 * Todo List — простое приложение для управления задачами.
 * Функции: добавление, удаление, отметка выполнения, localStorage, защита от XSS.
 */

// Ключ для хранения задач в localStorage
const STORAGE_KEY = "todoListTasks";

// Ссылки на элементы DOM
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const taskCount = document.getElementById("task-count");

// Массив задач в памяти: { id, text, completed }
let tasks = loadTasks();

// ===== Работа с localStorage =====

/** Загружает задачи из localStorage или возвращает пустой массив */
function loadTasks() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    // Если данные повреждены — начинаем с чистого списка
    return [];
  }
}

/** Сохраняет текущий массив задач в localStorage */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ===== Вспомогательные функции =====

/** Генерирует уникальный id для новой задачи */
function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Экранирует текст для безопасной вставки в HTML (защита от XSS).
 * Преобразует спецсимволы в HTML-сущности.
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/** Возвращает слово «задача» в правильном склонении */
function pluralizeTasks(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) return "задач";
  if (mod10 === 1) return "задача";
  if (mod10 >= 2 && mod10 <= 4) return "задачи";
  return "задач";
}

// ===== Операции с задачами =====

/** Добавляет новую задачу в начало списка */
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  tasks.unshift({
    id: createId(),
    text: trimmed,
    completed: false,
  });

  saveTasks();
  render();
}

/** Переключает статус выполнения задачи */
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  render();
}

/** Удаляет задачу по id */
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

// ===== Отрисовка интерфейса =====

/** Перерисовывает список задач и обновляет счётчик */
function render() {
  list.innerHTML = "";

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "todo-item" + (task.completed ? " todo-item--completed" : "");
    item.dataset.id = task.id;

    // Разметка кнопок; текст задачи экранируется через escapeHtml
    item.innerHTML = `
      <button type="button" class="todo-item__toggle" aria-label="Отметить выполненной">
        <span class="todo-item__toggle-icon">✓</span>
      </button>
      <span class="todo-item__text">${escapeHtml(task.text)}</span>
      <button type="button" class="btn btn--icon todo-item__delete" aria-label="Удалить задачу">✕</button>
    `;

    list.appendChild(item);
  });

  const activeCount = tasks.filter((t) => !t.completed).length;

  taskCount.textContent =
    tasks.length === 0
      ? "0 задач"
      : `Осталось ${activeCount} ${pluralizeTasks(activeCount)}`;

  emptyState.classList.toggle("empty-state--hidden", tasks.length > 0);
}

// ===== Обработчики событий =====

// Отправка формы — добавление задачи
form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask(input.value);
  input.value = "";
  input.focus();
});

// Делегирование кликов по списку (toggle / delete)
list.addEventListener("click", (event) => {
  const item = event.target.closest(".todo-item");
  if (!item) return;

  const id = item.dataset.id;

  if (event.target.closest(".todo-item__toggle")) {
    toggleTask(id);
  } else if (event.target.closest(".todo-item__delete")) {
    deleteTask(id);
  }
});

// Первичная отрисовка при загрузке страницы
render();
