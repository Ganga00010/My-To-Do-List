let tasksArr = [];
let nextId = 1;
let filterMode = 'all';

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});
document.getElementById('addBtn').onclick = addTask;

function addTask() {
  const text = taskInput.value.trim();

  if (!text) return showError("Can't add empty task.");
  if (text.length < 3) return showError("Task is too short (min 3 chars).");
  if (tasksArr.find(t => t.text.toLowerCase() === text.toLowerCase())) 
    return showError("Already in the list.");

  tasksArr.push({ id: nextId++, text, done: false });

  taskInput.value = "";
  showSuccess("Task added!");
  renderTasks();
  updateStats();
}

function renderTasks() {
  let filtered = filterMode === 'all' ? tasksArr 
               : filterMode === 'completed' ? tasksArr.filter(t => t.done) 
               : tasksArr.filter(t => !t.done);

  if (filtered.length === 0) {
    taskList.innerHTML = '<div class="no-tasks">No tasks here</div>';
    document.getElementById('clearCompleted').style.display = "none";
    return;
  }

  taskList.innerHTML = "";
  filtered.forEach(t => {
    const div = document.createElement("div");
    div.className = "task-item" + (t.done ? " completed" : "");
    div.innerHTML = `
      <div class="task-content">
        <input type="checkbox" ${t.done ? "checked" : ""} onchange="toggleDone(${t.id})">
        <span class="task-text ${t.done ? 'completed' : ''}">${t.text}</span>
      </div>
      <button class="delete-btn" onclick="deleteTask(${t.id})">X</button>
    `;
    taskList.appendChild(div);
  });

  const hasDone = tasksArr.some(t => t.done);
  document.getElementById('clearCompleted').style.display = hasDone ? "block" : "none";
}

function toggleDone(id) {
  const task = tasksArr.find(t => t.id === id);
  if (task) task.done = !task.done;
  renderTasks();
  updateStats();
}

function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  tasksArr = tasksArr.filter(t => t.id !== id);
  renderTasks();
  updateStats();
}

function setFilter(mode) {
  filterMode = mode;
  renderTasks();
}

function clearCompleted() {
  if (!confirm("Clear all completed tasks?")) return;
  tasksArr = tasksArr.filter(t => !t.done);
  renderTasks();
  updateStats();
}

function updateStats() {
  const total = tasksArr.length;
  const done = tasksArr.filter(t => t.done).length;
  const left = total - done;
  document.getElementById("totalCount").innerText = total;
  document.getElementById("doneCount").innerText = done;
  document.getElementById("leftCount").innerText = left;
}

function showError(msg) {
  const e = document.getElementById("errorMsg");
  e.innerText = msg;
  e.style.display = "block";
  setTimeout(() => { e.style.display = "none"; }, 2500);
}

function showSuccess(msg) {
  const s = document.getElementById("successMsg");
  s.innerText = msg;
  s.style.display = "block";
  setTimeout(() => { s.style.display = "none"; }, 1500);
}

renderTasks();
updateStats();
