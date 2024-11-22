let taskCounter = localStorage.getItem('taskCounter') ? parseInt(localStorage.getItem('taskCounter')) : 0;
let itemsArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

function saveToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(itemsArray));
    localStorage.setItem('taskCounter', taskCounter.toString());
}

function renderTasks() {
    itemsArray.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.id = task.id;
        taskDiv.innerHTML = task.content;

        taskDiv.querySelector('.delete-btn').addEventListener('click', function() {
            taskDiv.remove();
            itemsArray = itemsArray.filter(item => item.id !== task.id);
            saveToLocalStorage();
        });

        taskDiv.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', taskDiv.id);
        });

        const container = document.querySelector(`#${task.container}`);
        if (container) {
            container.appendChild(taskDiv);
        }
    });
}

renderTasks();

document.getElementById('addTaskButton').addEventListener('click', function() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;

    if (title === '' || description === '') {
        alert('Si us plau, ompliu tant el títol com la descripció.');
        return;
    }

    taskCounter++;

    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.id = `task-${taskCounter}`;

    const date = new Date().toLocaleDateString();

    const content = `
        <div draggable="true">
            <h3>${title}</h3>
            <p>${description}</p>
            <p><strong>Data:</strong> ${date}</p>
            <button class="delete-btn">Borrar</button>
        </div>
    `;

    taskDiv.innerHTML = content;

    itemsArray.push({
        id: taskDiv.id,
        content: content,
        container: 'taskList'
    });
    saveToLocalStorage();

    taskDiv.querySelector('.delete-btn').addEventListener('click', function() {
        taskDiv.remove();
        itemsArray = itemsArray.filter(item => item.id !== taskDiv.id);
        saveToLocalStorage();
    });

    taskDiv.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', taskDiv.id);
    });

    document.getElementById('taskList').appendChild(taskDiv);
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
});

['container1', 'container2', 'container3'].forEach(containerId => {
    const container = document.querySelector(`#${containerId}`);
    container.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    container.addEventListener('drop', function(e) {
        e.preventDefault();
        const draggedTaskId = e.dataTransfer.getData('text/plain');
        const draggedTask = document.getElementById(draggedTaskId);

        if (draggedTask) {
            container.appendChild(draggedTask);

            const task = itemsArray.find(item => item.id === draggedTaskId);
            if (task) {
                task.container = containerId;
                saveToLocalStorage();
            }
        }
    });
});