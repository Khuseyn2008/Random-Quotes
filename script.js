const getQuoteBtn = document.querySelector('.getQuoteBtn'); // Кнопка получить цитату
const quoteBlock = document.querySelector('.quoteBlock'); // Блок для цитаты
const quoteText = document.querySelector('.quoteText'); // Текст цитаты
const quoteAuthor = document.querySelector('.quoteAuthor'); // Автор цитаты
const addFavoriteBtn = document.querySelector('.addFavoriteBtn'); // Кнопка добавить в избранное
const favoritesList = document.querySelector('.favoritesList'); // Список избранных цитат

let favQuote = null;  
let saveQuoteFav = []; 
const api_url = 'https://dummyjson.com/quotes'; // ссылка API 

// Загружаем сохранённые продукты из localStorage при загрузке страницы
if (localStorage.getItem('saveQuoteFav')) {
  saveQuoteFav = JSON.parse(localStorage.getItem('saveQuoteFav'));
  saveQuoteFav.forEach(quote => {
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

//  нажимаем на кнопку "Получить цитату"
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

        //  класс hidden-а даф мекнем
        quoteBlock.classList.remove('hidden');

        // Сохраняем текущую цитату
        favQuote = randomquote;

        console.log(data);
      })
      .catch(err => console.error('Ошибка:', err));
  }
  getQuote(api_url);
});

addFavoriteBtn.addEventListener('click', function displayQuote() {

  const favoriteQuotesIndex = saveQuoteFav.findIndex((fp) => fp.id === favQuote.id);
  if (favoriteQuotesIndex !== -1) {
    return;
  }
    
  const randomquote = favQuote;

  saveQuoteFav.push(randomquote);
  localStorage.setItem('saveQuoteFav', JSON.stringify(saveQuoteFav));

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

// Избранные 
favoritesList.addEventListener('click', (e) => {
  if (e.target.dataset.name !== 'delete-from-favorites') {
    return;
  }
  const quoteBlock = e.target.closest('#quoteBlock');
  if (quoteBlock) {
    const id = quoteBlock.dataset.id;

    const index = saveQuoteFav.findIndex(q => q.id == id);
    if (index !== -1) {
      saveQuoteFav.splice(index, 1);
      localStorage.setItem('saveQuoteFav', JSON.stringify(saveQuoteFav));
    }

    quoteBlock.remove();
  }
});
