//Загрузка документа
document.addEventListener('DOMContentLoaded', () => {
    //Получение элементов и переменных
    const form = document.getElementById('vacation-form'); //Форма добавления отпуска
    const vacationsContainer = document.getElementById('vacations-container'); // Контейнер для карточек отпусков

    // Массив объектов с информацией об отпусках
    let vacations = JSON.parse(localStorage.getItem('vacations')) || [];

    //Отображение всех карточек отдыхов
    function renderVacations() {
        vacationsContainer.innerHTML = ''; //Очищаем существующий контент контейнера
        vacations.forEach((vacation, index) => {  // Генерируем HTML-код каждой карточки
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4');
            card.innerHTML = `
                <div class="card vacation-card">
                    <img src="${vacation.imageUrl}" alt="${vacation.name}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${vacation.name}</h5>
                        <p class="card-text">מחיר: ${vacation.price}$</p>
                        <p class="card-text">דירוג: ${vacation.rating}</p>
                        <button data-index="${index}" class="like-button">Like (${vacation.likes})</button>
                        <button data-index="${index}" class="delete-button">Delete</button>
                    </div>
                </div>
            `;
            vacationsContainer.appendChild(card); //Добавляем карточку в конец контейнера
        });
    }
//Заполнение полей и сохранение введённых данных
    form.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const imageUrl = document.getElementById('image-url').value;
        const price = parseFloat(document.getElementById('price').value);
        const rating = document.getElementById('rating').value;
        const newVacation = { name, imageUrl, price, rating, likes: 0 };
        vacations.push(newVacation);
        localStorage.setItem('vacations', JSON.stringify(vacations)); //Сохранение данных в Local Storage
        renderVacations(); //Перерисовываем страницу
        form.reset();
    });
//Активация кнопок "лайк" и "удалить" и сохранение их состояния
    vacationsContainer.addEventListener('click', event => {
        if (event.target.classList.contains('like-button')) {
            const index = parseInt(event.target.dataset.index);
            vacations[index].likes++;
            localStorage.setItem('vacations', JSON.stringify(vacations));
            renderVacations();
        } else if (event.target.classList.contains('delete-button')) {
            const index = parseInt(event.target.dataset.index);
            vacations.splice(index, 1);
            localStorage.setItem('vacations', JSON.stringify(vacations));
            renderVacations();
        }
    });

    renderVacations();
});