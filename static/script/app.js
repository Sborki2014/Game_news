(function () {
    'use strict';

    const state = { currentCategory: 'all' };

    const elements = {
        grid: document.getElementById('newsGrid'),
        filters: document.getElementById('filters'),
        counter: document.getElementById('newsCount')
    };

    const FALLBACK_IMAGE = 'images/pc.jpg';


    function pluralizeNews(n) {
        const mod10 = n % 10;
        const mod100 = n % 100;
        if (mod10 === 1 && mod100 !== 11) return 'новость';
        if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'новости';
        return 'новостей';
    }

    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getFilteredNews() {
        if (state.currentCategory === 'all') return NEWS_DATA;
        return NEWS_DATA.filter(item => item.category === state.currentCategory);
    }


    function updateCounter(count) {
        elements.counter.textContent = `${count} ${pluralizeNews(count)}`;
    }

    function createCard(item, index) {
        const card = document.createElement('article');
        card.className = 'news-card';
        card.style.animationDelay = `${index * 0.05}s`;

        const imageSrc = item.image || FALLBACK_IMAGE;

        card.innerHTML = `
            <div class="news-card__cover">
                <img
                    class="news-card__image"
                    src="${escapeHTML(imageSrc)}"
                    alt="Обложка новости: ${escapeHTML(item.title)}"
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="400"
                    onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'"
                >
                <span class="news-card__badge">${escapeHTML(item.category)}</span>
            </div>
            <div class="news-card__body">
                <div class="news-card__meta">
                    <span class="news-card__tag">${escapeHTML(item.category)}</span>
                    <time class="news-card__date">${escapeHTML(item.date)}</time>
                </div>
                <h2 class="news-card__title">${escapeHTML(item.title)}</h2>
                <p class="news-card__description">${escapeHTML(item.description)}</p>
                <div class="news-card__footer">
                    <span class="news-card__read-time">Время чтения: ${escapeHTML(item.readTime)}</span>
                    <button class="read-more" type="button" data-id="${item.id}">Читать</button>
                </div>
            </div>
        `;

        return card;
    }

    function createEmptyState() {
        const div = document.createElement('div');
        div.className = 'empty-message';
        div.textContent = 'В этой категории пока нет новостей';
        return div;
    }

    function renderNews() {
        const filtered = getFilteredNews();
        elements.grid.innerHTML = '';

        if (filtered.length === 0) {
            elements.grid.appendChild(createEmptyState());
            updateCounter(0);
            return;
        }

        const fragment = document.createDocumentFragment();
        filtered.forEach((item, index) => {
            fragment.appendChild(createCard(item, index));
        });
        elements.grid.appendChild(fragment);

        updateCounter(filtered.length);
    }


    function handleFilterClick(event) {
        const btn = event.target.closest('.filter-btn');
        if (!btn) return;
        if (btn.dataset.category === state.currentCategory) return;

        elements.filters.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.toggle('filter-btn--active', b === btn);
        });

        state.currentCategory = btn.dataset.category;
        renderNews();
    }

    function handleReadMore(event) {
        const btn = event.target.closest('.read-more');
        if (!btn) return;

        const id = Number(btn.dataset.id);
        const item = NEWS_DATA.find(n => n.id === id);
        if (!item) return;

        alert([
            item.title,
            '',
            item.description,
            '',
            `Дата: ${item.date}`,
            `Категория: ${item.category}`,
            `Время чтения: ${item.readTime}`,
            '',
            '(Демонстрационное приложение — полный текст недоступен)'
        ].join('\n'));
    }


    function init() {
        elements.filters.addEventListener('click', handleFilterClick);
        elements.grid.addEventListener('click', handleReadMore);
        renderNews();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();