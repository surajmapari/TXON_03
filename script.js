let tasks = [];
let dragTaskId;

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
    const newTask = { text: taskText, completed: false, id: Date.now() };
    tasks.push(newTask);
    displayTasks();
    taskInput.value = "";
  }
}

function toggleTaskStatus(taskId) {
  const task = tasks.find(task => task.id === taskId);
  task.completed = !task.completed;
  displayTasks();
}

function displayTasks() {
  const taskListCompleted = document.getElementById("taskListCompleted");
  const taskListUncompleted = document.getElementById("taskListUncompleted");

  taskListCompleted.innerHTML = "";
  taskListUncompleted.innerHTML = "";

  tasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task");
    taskItem.setAttribute("draggable", "true");
    taskItem.setAttribute("data-task-id", task.id);
    taskItem.innerHTML = `
      <span class="task-text">${task.text}</span>
      <span class="delete-btn" onclick="deleteTask(${index})">&#x2715;</span>
    `;

    if (task.completed) {
      taskItem.classList.add("completed");
      taskListCompleted.appendChild(taskItem);
    } else {
      taskListUncompleted.appendChild(taskItem);
    }

    taskItem.addEventListener("dragstart", dragStart);
    taskItem.addEventListener("dragenter", dragEnter);
    taskItem.addEventListener("dragover", allowDrop);
    taskItem.addEventListener("drop", drop);

    taskItem.addEventListener("click", function () {
      toggleTaskStatus(task.id);
    });
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  displayTasks();
}

function filterTasks(status) {
  const filterButtons = document.querySelectorAll(".filter-container button");
  filterButtons.forEach(button => button.classList.remove("active"));
  document.querySelector(`button[data-status="${status}"]`).classList.add("active");

  if (status === "all") {
    displayTasks();
  } else if (status === "completed") {
    const completedTasks = tasks.filter(task => task.completed);
    displayFilteredTasks(completedTasks, "Completed");
  } else if (status === "uncompleted") {
    const uncompletedTasks = tasks.filter(task => !task.completed);
    displayFilteredTasks(uncompletedTasks, "Uncompleted");
  }
}

function displayFilteredTasks(filteredTasks, targetCompartment) {
  const targetList = document.getElementById(`taskList${targetCompartment}`);
  targetList.innerHTML = "";

  filteredTasks.forEach((task, index) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task");
    taskItem.setAttribute("draggable", "true");
    taskItem.setAttribute("data-task-id", task.id);
    taskItem.innerHTML = `
      <span class="task-text">${task.text}</span>
      <span class="delete-btn" onclick="deleteTask(${index})">&#x2715;</span>
    `;
    taskItem.addEventListener("dragstart", dragStart);
    taskItem.addEventListener("dragenter", dragEnter);
    taskItem.addEventListener("dragover", allowDrop);
    taskItem.addEventListener("drop", drop);
    targetList.appendChild(taskItem);
  });
}

function dragStart(event) {
  dragTaskId = event.target.getAttribute("data-task-id");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", event.target.id);
}

function dragEnter(event) {
  event.preventDefault();
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const draggableElement = document.getElementById(data);
  const target = event.target;

  if (target.classList.contains("task-list")) {
    target.appendChild(draggableElement);
    const taskId = parseInt(draggableElement.getAttribute("data-task-id"));
    const task = tasks.find(task => task.id === taskId);
    task.completed = target.parentElement.id === "taskListCompleted";
    displayTasks();
  }
}

// Link Enter key to the Add button
const taskInput = document.getElementById("taskInput");
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("addButton").click();
  }
});

// Initially display all tasks
displayTasks();
