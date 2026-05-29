const taskDatas = {};
let currentEditTask = null;
const todoColumn = document.querySelector("#todo");
const inProgressColumn = document.querySelector("#in-progress");
const doneColumn = document.querySelector("#done");
const allColumns = [todoColumn, inProgressColumn, doneColumn];
const modalBtn = document.querySelector("#add-new-task");
const addNewTaskBtn = document.querySelector("#add-new-task-to-column");
const modal = document.querySelector(".add-new-task-modal");
const modalBg = document.querySelector("#modalBg");
const editModal = document.querySelector(".edit-modal");

let dragElement = null;
const now = new Date();
const time = `${now.getFullYear()} ${now.getMonth()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

function addNewTask(title, desc, clumn) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `<h2>${title}</h2>
                    <p>${desc}</p>
                      <div class="btn-row">
                      <button class="edit-btn">Edit</button>
                      <button class="delete-btn">Delete</button>
  </div>`;

  clumn.appendChild(div);
  div.addEventListener("dragstart", (e) => {
    dragElement = div;
  });

  const deleteBtn = div.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", (e) => {
    div.remove();
    updateCountTasks();
  });

  const editBtn = div.querySelector(".edit-btn");
  editBtn.addEventListener("click", (e) => {
    editModal.style.display = "flex";
    currentEditTask = e.currentTarget.closest(".task");
    const showTitle = currentEditTask.querySelector("h2").textContent;
    const showDesc = currentEditTask.querySelector("p").textContent;

    const editInputTitle = (document.querySelector("#edit-input-title").value =
      showTitle);
    const editInputdesc = (document.querySelector("#edit-input-desc").value =
      showDesc);
  });

  return div;
}

const saveBtn = document.querySelector("#save-btn");

saveBtn.addEventListener("click", (e) => {
  const editInputTitle = document.querySelector("#edit-input-title").value;
  const editInputDesc = document.querySelector("#edit-input-desc").value;

  currentEditTask.querySelector("h2").textContent = editInputTitle;
  currentEditTask.querySelector("p").textContent = editInputDesc;

  editModal.style.display = "none";
  updateCountTasks();
});

const tasks = document.querySelectorAll(".task");

function updateCountTasks() {
  allColumns.forEach((columns) => {
    const totalColTasks = columns.querySelectorAll(".task");
    const count = columns.querySelector(".right");

    taskDatas[columns.id] = Array.from(totalColTasks).map((t) => {
      return {
        title: t.querySelector("h2").textContent,
        description: t.querySelector("p").textContent,
      };
    });

    localStorage.setItem("savedTaskData", JSON.stringify(taskDatas));
    count.textContent = totalColTasks.length;
  });
}

const localStSavedData = JSON.parse(localStorage.getItem("savedTaskData"));
if (localStSavedData) {
  for (let col in localStSavedData) {
    const column = document.querySelector(`#${col}`);
    localStSavedData[col].forEach((task) => {
      addNewTask(task.title, task.description, column);
    });
  }
  updateCountTasks();
}

function addDragOverDropLeaveEvents(column) {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("dragenter", (e) => {
    e.currentTarget.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    e.currentTarget.classList.remove("hover-over");
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    const targetTask = e.target.closest(".task");
    console.log(targetTask);

    if (targetTask && targetTask !== dragElement) {
      targetTask.parentNode.insertBefore(dragElement, targetTask);
    } else {
      e.currentTarget.appendChild(dragElement);
    }

    e.currentTarget.classList.remove("hover-over");
    updateCountTasks();
  });
}

addDragOverDropLeaveEvents(todoColumn);
addDragOverDropLeaveEvents(inProgressColumn);
addDragOverDropLeaveEvents(doneColumn);

modalBtn.addEventListener("click", (e) => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", (e) => {
  modal.classList.remove("active");
});

addNewTaskBtn.addEventListener("click", (e) => {
  const titleInput = document.querySelector("#task-title-input").value;
  const descInput = document.querySelector("#task-description-input").value;
  addNewTask(titleInput, descInput, todoColumn);
  updateCountTasks();
  modal.classList.remove("active");

  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-description-input").value = "";
});
