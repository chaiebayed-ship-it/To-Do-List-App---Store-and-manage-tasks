// Get elements from the HTML
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');

// Load tasks from browser storage when page opens
loadTasks();

// Add task when "Add Task" button is clicked
addBtn.addEventListener('click', addTask);

// Add task when Enter key is pressed
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Don't add empty tasks
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }
    
    // Create task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    
    // Add to display
    displayTask(task);
    
    // Clear input
    taskInput.value = '';
    taskInput.focus();
    
    // Save to browser storage
    saveTasks();
    
    // Update empty message
    updateEmptyMessage();
}

// Function to display a task
function displayTask(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) {
        li.classList.add('completed');
    }
    
    li.innerHTML = `
        <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''}
            onchange="toggleTask(${task.id})"
        >
        <span class="task-text">${task.text}</span>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    `;
    
    taskList.appendChild(li);
}

// Function to toggle task completion
function toggleTask(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        refreshTaskList();
        updateEmptyMessage();
    }
}

// Function to delete a task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        let tasks = getTasks();
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        refreshTaskList();
        updateEmptyMessage();
    }
}

// Function to refresh the task list display
function refreshTaskList() {
    taskList.innerHTML = '';
    const tasks = getTasks();
    tasks.forEach(task => displayTask(task));
}

// Function to save tasks to browser storage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(li => {
        const text = li.querySelector('.task-text').textContent;
        const completed = li.classList.contains('completed');
        tasks.push({ id: Date.now(), text, completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to get tasks from browser storage
function getTasks() {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
}

// Function to load tasks from browser storage
function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(task => displayTask(task));
    updateEmptyMessage();
}

// Function to update empty message visibility
function updateEmptyMessage() {
    if (taskList.children.length === 0) {
        emptyMessage.classList.add('show');
    } else {
        emptyMessage.classList.remove('show');
    }
}
