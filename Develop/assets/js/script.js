// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const TODO_COL = "to-do";
const IN_PROGRESS_COL = "in-progress";
const DONE_COL = "done";

// Todo: create a function to generate a unique task id
function generateTaskId() {
    // Generate a random alphanumeric string
    const randomString = Math.random().toString(36).substring(2, 8);
    
    // Concatenate a timestamp to ensure uniqueness
    const timestamp = new Date().getTime();
  
    // Combine the random string and timestamp to create a unique ID
    const taskId = `${randomString}_${timestamp}`;
  
    return taskId;
  }
  const taskId = generateTaskId();
  console.log(taskId); // Output: "abc123_1645632154123"


function createTaskCardHtml(taskName, dueDate, description) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('card', 'mb-3');
  
    // Construct the HTML content for the task card
    taskCard.innerHTML = `
      <div draggable="true" class="card-body">
        <h5 class="card-title">${taskName}</h5>
        <p class="card-text"><strong>Due Date:</strong> ${dueDate}</p>
        <p class="card-text"><strong>Description:</strong> ${description}</p>
      </div>
    `;
    return taskCard;
}
  
// Todo: create a function to create a task card
function createTaskCard(taskName, dueDate, description) {
    const todoCards = document.querySelector('#todo-cards');

    const taskCard = createTaskCardHtml(taskName, dueDate, description)
    if (!taskList) {
        taskList = []
    }

    taskList.push({
        name: taskName,
        date: dueDate,
        description: description,
        column: TODO_COL,
        id: generateTaskId()
    })

    localStorage.setItem("tasks", JSON.stringify(taskList));
    todoCards.insertBefore(taskCard, todoCards.firstChild);
}

function createExistingTaskCard(task) {
    const todoCards = document.querySelector('#todo-cards');
    const inProgressCards = document.querySelector('#in-progress-cards');
    const doneCards = document.querySelector('#done-card');
    const taskCard = createTaskCardHtml(task.name, task.date, task.description);

    if (task.column == TODO_COL) {
        todoCards.insertBefore(taskCard, todoCards.firstChild);
    } else if (task.column == IN_PROGRESS_COL) {
        inProgressCards.insertBefore(taskCard, inProgressCards.firstChild);
    } else {
        doneCards.insertBefore(taskCard, doneCards.firstChild);
    }
}
  
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    taskList?.forEach(createExistingTaskCard);
}



// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // Read tasks from localStorage
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

    // Get the task ID from the dragged element's dataset
    const taskId = ui.draggable[0].dataset.taskId;

    // Get the ID of the lane that the card was dropped into
    const newStatus = event.target.id;

    // Update the status of the dropped task in the task list
    taskList.forEach(task => {
        if (task.id === taskId) {
            task.column = newStatus;
        }
    });

   

    // Save the updated task list to localStorage
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    const taskInput = document.querySelector('#enterTask');
    const dateInput = document.querySelector('#enterDate');
    const descriptionTextArea = document.querySelector('#taskDescriptionTextArea');

    const taskName = taskInput.value;
    const dueDate = dateInput.value;
    const description = descriptionTextArea.value;

    if (taskName && dueDate && description) {
        // Create a new task object
        const newTask = {
            name: taskName,
            date: dueDate,
            description: description,
            column: TODO_COL, // Assuming new tasks are added to the "To Do" column by default
            id: generateTaskId() // Generate a unique ID for the new task
        };

        // Add the new task to the task list
        taskList.push(newTask);

        // Save the updated task list to localStorage
        localStorage.setItem("tasks", JSON.stringify(taskList));

        // Create a new task card
        createTaskCard(taskName, dueDate, description);

        // Clear input fields after adding the task
        taskInput.value = '';
        dateInput.value = '';
        descriptionTextArea.value = '';

        // Close the modal if needed
        $('#formModal').modal('hide');
    } else {
        // Handle case where input fields are empty
        alert("Please fill in all fields to add a new task.");
    }
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    // Confirm with the user before deleting the task
    if (confirm("Are you sure you want to delete this task?")) {
        // Find the task card element that triggered the delete event
        const taskCard = event.target.closest('.card');

        if (taskCard) {
            // Retrieve the task ID from the dataset of the task card
            const taskId = taskCard.dataset.taskId;

            // Filter out the task with the matching ID from the task list
            taskList = taskList.filter(task => task.id !== taskId);

            // Update the task list in localStorage
            localStorage.setItem("tasks", JSON.stringify(taskList));

            // Remove the task card from the DOM
            taskCard.remove();
        }
    }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // Render the task list
    renderTaskList();

    // Initialize date picker
    $('.datepicker').datepicker({
        format: 'mm/dd/yyyy',
        startDate: '-3d'
    });

    // Add event listener for adding a new task
    $('#submitBtn').click(handleAddTask);

    // Add event listener for closing the modal via secondary button
    $('#secondaryBtn').click(function() {
        $('#formModal').modal('hide');
    });

    // Add event listener for closing the modal via close button
    $('#formModal .close').click(function() {
        $('#formModal').modal('hide');
    });

    // Add event listener for closing the modal via clicking outside the modal
    $('#formModal').on('click', function(e) {
        if (e.target == this) {
            $('#formModal').modal('hide');
        }
    });

    // Add event listener for deleting a task (assuming delete buttons have a class of 'delete-task-btn')
    $(document).on('click', '.delete-task-btn', handleDeleteTask);

    // Make lanes droppable
    $('.lane .card-body').droppable({
        accept: '.card',
        drop: handleDrop,
        tolerance: 'pointer'
    });


    // $('.card-body').draggable({
    //     revert: true, // Revert the draggable element if not dropped in a droppable
    //     start: function(event, ui) {
    //       console.log("Drag started");
    //     },
    //     stop: function(event, ui) {
    //       console.log("Drag stopped");
    //     }
    //   });

    // $('#card-body').on({
    //     dragStart: function() {
    //         console.log("drag start");
    //     },
    //     dragEnd: function() {
    //         console.log("drag end");
    //     }
    // })

    $('#submitBtn').click(function() {
        const taskInput = document.querySelector('#enterTask');
        const dateInput = document.querySelector('#enterDate');
        const descriptionTextArea = document.querySelector('#taskDescriptionTextArea');
        createTaskCard(taskInput.value, dateInput.value, descriptionTextArea.value);
    });
});
