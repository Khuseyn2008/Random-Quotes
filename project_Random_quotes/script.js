const getQuoteBtn = document.querySelector('.getQuoteBtn'); // Кнопка получить цитату
const quoteBlock = document.querySelector('.quoteBlock'); // Блок для отображения цитаты
const quoteText = document.querySelector('.quoteText'); // Текст цитаты
const quoteAuthor = document.querySelector('.quoteAuthor'); // Автор цитаты
const addFavoriteBtn = document.querySelector('.addFavoriteBtn'); // Кнопка добавить в избранное
const favoritesList = document.querySelector('.favoritesList'); // Список избранных цитат

let favQuote = null;  // Текущая выбранная цитата
let saveQuoteFav = [];  // Массив сохранённых цитат
const api_url = 'https://dummyjson.com/quotes'; // URL API для получения цитат

// Загружаем сохранённые цитаты из localStorage при загрузке страницы
if (localStorage.getItem('saveQuoteFav')) {
  saveQuoteFav = JSON.parse(localStorage.getItem('saveQuoteFav'));
  saveQuoteFav.forEach(quote => {
    // Создаем HTML-разметку для каждой цитаты и добавляем её в список избранного
    const markyp = `
      <div id="quoteBlock"
        class="relative max-w-2xl mx-auto p-6 bg-slate-200 rounded-lg shadow-md" 
        data-id="${quote.id}">
        <button id="deleteQuoteBtn" data-name="delete-from-favorites" 
          class="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-red-600 text-xl font-bold"
          title="Удалить цитату">&times;</button>
        <p id="quoteText" class="text-lg font-serif italic text-gray-800">${quote.quote}</p> 
        <p id="quoteAuthor" class="mt-4 text-left text-md font-semibold text-gray-600">— ${quote.author}</p>
      </div>
    `;
    favoritesList.innerHTML += markyp;
  });
}

// Получаем все цитаты с API (для примера — вывод в консоль)
fetch(api_url)
.then((response) => {
  if (!response.ok) {
    throw new Error('Ответ с сервера не ок');
  }
  return response.json();
})
.then((data) => {
  console.log(data);
})
.catch((error) => {
  console.error('Ошибка запроса:', error);
});

// Обработчик нажатия кнопки "Получить цитату"
getQuoteBtn.addEventListener('click', () => {
  function getQuote(url) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Выбираем случайную цитату из массива
        const randomQuoteIndex = Math.floor(Math.random() * data.quotes.length);
        const randomquote = data.quotes[randomQuoteIndex];

        // Отображаем цитату и автора на странице
        quoteText.textContent = `"${randomquote.quote}"`;
        quoteAuthor.textContent = `— ${randomquote.author}`;

        // Показываем блок с цитатой (убираем класс hidden)
        quoteBlock.classList.remove('hidden');

        // Сохраняем текущую цитату для добавления в избранное
        favQuote = randomquote;

        console.log(data);
      })
      .catch(err => console.error('Ошибка:', err));
  }
  getQuote(api_url);
});

// Обработчик кнопки "Добавить в избранное"
addFavoriteBtn.addEventListener('click', function displayQuote() {
  const randomquote = favQuote;

  // Добавляем цитату в массив и сохраняем в localStorage
  saveQuoteFav.push(randomquote);
  localStorage.setItem('saveQuoteFav', JSON.stringify(saveQuoteFav));

  // Создаем HTML для новой цитаты и добавляем в список избранных
  const markyp = `
  <div id="quoteBlock"
  class="relative max-w-2xl mx-auto p-6 bg-slate-200 rounded-lg shadow-md" 
   data-id="${randomquote.id}">
  <button id="deleteQuoteBtn" data-name="delete-from-favorites" 
  class="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-red-600 text-xl font-bold"
  title="Удалить цитату">&times;</button>
  <p id="quoteText" class="text-lg font-serif italic text-gray-800">${randomquote.quote}</p> 
  <p id="quoteAuthor" class="mt-4 text-left text-md font-semibold text-gray-600">— ${randomquote.author}</p>
  </div>
  `;

  favoritesList.innerHTML += markyp;
});

// Обработчик кликов по списку избранных цитат (для удаления)
favoritesList.addEventListener('click', (e) => {
  if (e.target.dataset.name !== 'delete-from-favorites') {
    return; // Если клик не по кнопке удаления, ничего не делаем
  }
  const quoteBlock = e.target.closest('#quoteBlock');
  if (quoteBlock) {
    const id = quoteBlock.dataset.id;

    // Находим цитату в массиве по id и удаляем её
    const index = saveQuoteFav.findIndex(q => q.id == id);
    if (index !== -1) {
      saveQuoteFav.splice(index, 1);
      localStorage.setItem('saveQuoteFav', JSON.stringify(saveQuoteFav));
    }

    // Удаляем цитату из DOM
    quoteBlock.remove();
  }
});
