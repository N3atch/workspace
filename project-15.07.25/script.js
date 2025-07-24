document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const tasksList = document.getElementById('tasksList');

    // Загрузка сохранённых задач из localStorage
    function loadTasks() {
        let storedTasks = localStorage.getItem('tasks');
        if(storedTasks){
            let parsedTasks = JSON.parse(storedTasks);
            for(let i = 0; i < parsedTasks.length; i++){
                addTask(parsedTasks[i].description, parsedTasks[i].dueDateTime);
            }
        }
    }

    // Добавление новой задачи
    function addTask(description, dueDateTime) {
        const newLi = document.createElement('li');
        newLi.innerHTML = `
            ${description}
            <small>${new Date(dueDateTime).toLocaleString()}</small>
            <button class="delete glyphicon glyphicon-remove"></button>
        `;
        tasksList.appendChild(newLi);

        // Сохранение обновленного списка задач в localStorage
        saveTasks();

        // Обработчик удаления задачи
        newLi.querySelector('.delete').addEventListener('click', event => {
            removeTask(event.target.parentNode);
        });
    }

    // Удаление задачи
    function removeTask(liElement) {
        tasksList.removeChild(liElement);
        saveTasks(); // Пересохраняем список задач
    }

    // Сохранение всех задач в localStorage
    function saveTasks() {
        const currentTasks = Array.from(tasksList.children).map(li => ({
            description: li.textContent.trim().split('\n')[0],
            dueDateTime: li.querySelector('small').innerText
        }));
        localStorage.setItem('tasks', JSON.stringify(currentTasks));
    }

    // Обработка формы отправки задачи
    taskForm.addEventListener('submit', e => {
        e.preventDefault();
        const inputs = taskForm.elements;
        const description = inputs.description.value;
        const dueDateTime = inputs.dueDateTime.value;

        if (!description || !dueDateTime) return alert("Заполните поля!");

        addTask(description, dueDateTime);
        taskForm.reset(); // Очистка полей ввода
    });

    // Первоначальная загрузка задач при открытии страницы
    loadTasks();
});