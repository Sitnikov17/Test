const parse = [
    {
        name: 'Стол руководителя',
        price: '27900',
        number: 1,
        position: { top: 46, left: 30 },
    },
    {
        name: 'Брифинг-приставка',
        price: '14600',
        number: 2,
        position: { top: 54, left: 65 },
    },
    {
        name: 'Тумба с ящиками',
        price: '10500',
        number: 3,
        position: { top: 31, left: 32 },
    },
    {
        name: 'Шкаф для одежды',
        price: '55000',
        number: 4,
        position: { top: 3, left: 14 },
    },
    {
        name: 'Кресло руководителя',
        price: '43800',
        number: 5,
        position: { top: 30, left: 17 },
    },
    {
        name: 'Кресло посетителя',
        price: '13500',
        number: 6,
        position: { top: 39, left: 86 },
    },
];

const picturesCircles = [];
const picturesCircleInfo = [];
const furnitureElements = [];

// проходим циклом по объекту с данными и создаем равное количество элементов
// добавляем дли них классы
for (let i = 0; i < parse.length; i++) {
    // для картинки
    picturesCircles.push(document.createElement('div'));
    picturesCircleInfo.push(document.createElement('div'));
    picturesCircles[i].classList.add('pictures-circle');
    picturesCircleInfo[i].classList.add('pictures-circle-info');

    document.querySelector('.pictures-img').appendChild(picturesCircles[i]);
    document.querySelector('.pictures-img').appendChild(picturesCircleInfo[i]);

    // для таблицы
    furnitureElements.push(document.createElement('tr'));
    furnitureElements[i].classList.add('furniture-elements');
    furnitureElements[i].innerHTML = `<td class="furniture-elements-one">
        <div class="furniture-elements-circle"></div>
    </td>
    <td class="furniture-elements-text"></td>
    <td class="furniture-elements-price"></td>
    <td class="furniture-input">
        <input type="number" min="0" max="10" value="0" class="elements-input"/>
        <div class="elements-button">
            <button class="elements-button-up"></button>
            <button class="elements-button-down"></button>
        </div>
    </td>`;

    document.querySelector('.furniture').appendChild(furnitureElements[i]);

    createListeners(picturesCircles[i], picturesCircleInfo[i]);
}

onInit();

// собираем все новые элементы в константы

const furnitureElementsCircle = document.querySelectorAll(
    '.furniture-elements-circle'
);
const furnitureElementsText = document.querySelectorAll(
    '.furniture-elements-text'
);
const furnitureElementsPrice = document.querySelectorAll(
    '.furniture-elements-price'
);

const buttonsUp = document.querySelectorAll('.elements-button-up');
const buttonsDown = document.querySelectorAll('.elements-button-down');
const elementsInput = document.querySelectorAll('.elements-input');
const sumCalc = document.querySelector('.sum');

// проходим циклом по элементам и вешаем событие при клике(всплывание плашки)

function createListeners(pictureCircle, pictureCircleInfo) {
    pictureCircle.addEventListener('click', () => {
        pictureCircleInfo.classList.toggle('none');
    });
    pictureCircle.addEventListener('mouseout', () => {
        setTimeout(() => {
            pictureCircleInfo.classList.remove('none');
        }, 1200);
    });
}

// функция возвращает массив координат с простыми объектами
function coordinatesParse(array) {
    let arr = [];
    for (let el in parse) {
        arr.push(array[el].position);
    }
    return arr;
}

// функия для форматирования числа(добавление пробела)
function formattingNum(n) {
    let number = new Intl.NumberFormat('ru-RU').format(n);
    return number;
}

let coordinates = coordinatesParse(parse);

// вставляем данные с бэкенда на страницу
function dataAssignment() {
    for (let i = 0; i < picturesCircles.length; i++) {
        // данные на картинку
        picturesCircles[i].textContent = parse[i].number;
        picturesCircleInfo[i].innerHTML = `<p>${
            parse[i].name
        }</p><p>от ${formattingNum(parse[i].price)} руб</p>`;

        // присваиваем координаты
        picturesCircles[i].style.left = coordinates[i].left + '%';
        picturesCircles[i].style.top = coordinates[i].top + '%';

        picturesCircleInfo[i].style.left = coordinates[i].left + '%';
        picturesCircleInfo[i].style.top = coordinates[i].top + 5 + '%';

        // данные в таблицу
        furnitureElementsCircle[i].textContent = parse[i].number;
        furnitureElementsText[i].textContent = parse[i].name;
        furnitureElementsPrice[i].innerHTML = `<p>от ${formattingNum(
            parse[i].price
        )} руб</p>`;

        // добавляем атрибут к кнопкам о суммах (для калькулятора)

        buttonsUp[i].setAttribute('data-price', parse[i].price);
        buttonsDown[i].setAttribute('data-price', parse[i].price);
    }
}
dataAssignment();

function calcSum() {
    let sum = sumInput.reduce((a, b) => {
        return a + b;
    }, 0);
    if (sum === 0) {
        document.querySelector('.price-none').classList.remove('price-price');
        document.querySelector('.price').classList.add('price-price');
    } else {
        document.querySelector('.price').classList.remove('price-price');
        document.querySelector('.price-none').classList.add('price-price');
    }
    sumCalc.textContent = sum + ' руб';
}

// калькулятор цены за комплект
let sumInput = [];

for (let i = 0; i < elementsInput.length; i++) {
    sumInput.push(0);

    elementsInput[i].addEventListener('input', (event) => {
        sumInput[i] = +event.data * +buttonsUp[i].getAttribute('data-price');
        calcSum();
    });
    buttonsUp[i].addEventListener('click', () => {
        elementsInput[i].stepUp();
        sumInput[i] =
            +elementsInput[i].value * +buttonsUp[i].getAttribute('data-price');

        calcSum();
        buttonsDown[i].disabled = false;
    });
    buttonsDown[i].addEventListener('click', () => {
        elementsInput[i].stepDown();
        sumInput[i] =
            +elementsInput[i].value * +buttonsUp[i].getAttribute('data-price');

        calcSum();
        if (elementsInput[i].value <= 0) {
            elementsInput[i].value = 0;
        }
    });
}

// закрываем модалку
document.querySelector('.fancybox-cross').addEventListener('click', () => {
    Fancybox.close();
});

function onInit() {
    const flag = window.innerWidth < 768;

    const selector = flag ? '.swiper-slide' : '.pictures-img';

    for (let i = 0; i < picturesCircles.length; i++) {
        document.querySelector(selector).appendChild(picturesCircles[i]);
        document.querySelector(selector).appendChild(picturesCircleInfo[i]);
    }
}

window.addEventListener('resize', onInit);

// скрываем-раскрываем текст
document.querySelector('.read').addEventListener('click', hideReveal);

function hideReveal() {
    let expand = document.querySelector('.expand');
    let collapse = document.querySelector('.collapse');
    let read = document.querySelector('.read');

    if (expand.style.display === 'none') {
        expand.style.display = 'inline';
        read.innerHTML = 'Читать полностью';
        collapse.style.display = 'none';
        document.querySelector('.transparent').style.color = '#4141407c';
    } else {
        expand.style.display = 'none';
        read.innerHTML = 'Скрыть';
        collapse.style.display = 'inline';

        document.querySelector('.transparent').style.color = '#414140';
    }
}

// фансибокс
let fanc = Fancybox.bind('[data-fancybox]', {
    hideScrollbar: false,
});

// свайпер
const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: true,
    spaceBetween: 30,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    keyboard: {
        enabled: true,
        onlyInViewport: true,
        pageUpDown: true,
    },
    mousewheel: {
        sensitivity: 1,
    },
});
