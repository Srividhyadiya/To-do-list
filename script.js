document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const progressBar = document.getElementById('progressBar');
    const completedCountSpan = document.getElementById('completedCount');
    const totalCountSpan = document.getElementById('totalCount');

    let tasks = [];

    // Helper function to render all tasks
    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.dataset.id = task.id;
            if (task.completed) {
                listItem.classList.add('completed');
            }
            
            // Use a slight delay to trigger the animation
            setTimeout(() => {
                listItem.classList.add('task-entering');
            }, 10);

            listItem.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <span>${task.text}</span>
                </div>
                <div class="action-buttons">
                    <button class="edit-btn" aria-label="Edit Task">✏️</button>
                    <button class="remove-btn" aria-label="Remove Task">✖️</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });
        updateProgress();
    };

    // CRUD Operations
    const createTask = (taskText) => {
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        renderTasks();
    };

    const updateTask = (id, newText, completed) => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex > -1) {
            tasks[taskIndex].text = newText;
            tasks[taskIndex].completed = completed;
            renderTasks();
        }
    };
    
    const deleteTask = (id) => {
        const listItem = taskList.querySelector(`li[data-id="${id}"]`);
        if (listItem) {
            // Start the delete animation by adding a class
            listItem.classList.add('task-leaving');
            // Wait for the animation to end before removing the element
            listItem.addEventListener('transitionend', () => {
                tasks = tasks.filter(task => task.id !== id);
                renderTasks();
            }, { once: true }); // The { once: true } option ensures the listener is removed after it runs once
        }
    };

    const updateProgress = () => {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;

        totalCountSpan.textContent = totalTasks;
        completedCountSpan.textContent = completedTasks;

        if (totalTasks === 0) {
            progressBar.style.width = '0%';
        } else {
            const progressPercentage = (completedTasks / totalTasks) * 100;
            progressBar.style.width = `${progressPercentage}%`;
        }
    };
    
    // Event Listeners
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            createTask(taskText);
            taskInput.value = '';
            taskInput.focus();
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const listItem = target.closest('li');
        if (!listItem) return;
        const taskId = Number(listItem.dataset.id);
        
        // Toggle complete
        if (target.type === 'checkbox') {
            const isCompleted = target.checked;
            const taskToUpdate = tasks.find(task => task.id === taskId);
            updateTask(taskId, taskToUpdate.text, isCompleted);
        }
        
        // Delete a task
        if (target.classList.contains('remove-btn')) {
            deleteTask(taskId);
        }

        // Edit a task
        if (target.classList.contains('edit-btn')) {
            const currentSpan = listItem.querySelector('.task-content span');
            const newText = prompt("Edit your task:", currentSpan.textContent);
            if (newText !== null && newText.trim() !== '') {
                const taskToUpdate = tasks.find(task => task.id === taskId);
                updateTask(taskId, newText.trim(), taskToUpdate.completed);
            }
        }
    });
    
    // Initial render
    renderTasks();
});
