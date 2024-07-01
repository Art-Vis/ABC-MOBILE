const burger = document.getElementById('burger');
const burgerDropdown = document.getElementById('burgerDropdown');
const body = document.body;

burger.addEventListener('click', () => {
	burger.classList.toggle('active');
	burgerDropdown.classList.toggle('active');
	body.classList.toggle('body-lock');
});

const startTestBtns = document.querySelectorAll('#startTestBtn');
const testContainer = document.getElementById('testContainer');
const progressBarFill = document.getElementById('progressBarFill');
const testQuestion = document.getElementById('testQuestion');
const answersContainer = document.getElementById('answersContainer');
const nextBtn = document.getElementById('nextBtn');
const sectionsToHide = document.querySelectorAll('section, footer');
const descriptionSection = document.querySelector('.description');
const burgerTestVisible = document.querySelector('.burger__test');
const burgerResultVisible = document.querySelector('.burger__result');
const spinner = document.getElementById('spinner');
const resultContainer = document.getElementById('resultContainer');
const questionImage = document.getElementById('questionImage');

const questions = [
	{ question: 'Ваш пол:', options: ['Мужской', 'Женский'], type: 'radio' },
	{
		question: 'Укажите ваш возраст:',
		options: ['До 18', 'От 18 до 28', 'От 29 до 35', 'От 36'],
		type: 'radio',
	},
	{
		question: 'Выберите лишнее:',
		options: ['Дом', 'Шалаш', 'Бунгало', 'Скамейка', 'Хижина'],
		type: 'radio',
	},
	{
		question: 'Продолжите числовой ряд: 18 20 24 32',
		options: ['62', '48', '74', '57', '60', '77'],
		type: 'radio',
	},
	{
		question: 'Выберите цвет, который сейчас наиболее Вам приятен:',
		options: [
			'#A8A8A8',
			'#0000A9',
			'#00A701',
			'#F60100',
			'#FFC700',
			'#A95403',
			'#000000',
			'#850068',
			'#46B2AC',
		],
		type: 'color',
	},
	{
		question:
			'Отдохните пару секунд, еще раз выберите цвет, который сейчас наиболее Вам приятен:',
		options: [
			'#A8A8A8',
			'#46B2AC',
			'#A95403',
			'#00A701',
			'#000000',
			'#F60100',
			'#850068',
			'#FFC700',
			'#0000A9',
		],
		type: 'color',
	},
	{
		question: 'Какой из городов лишний?',
		options: ['Вашингтон', 'Лондон', 'Париж', 'Нью-Йорк', 'Москва', 'Оттава'],
		type: 'radio',
	},
	{
		question: 'Выберите правильную фигуру из четырёх пронумерованных.',
		options: ['1', '2', '3', '4'],
		type: 'radio',
		image: 'assets/question-1.png',
	},
	{
		question: 'Вам привычнее и важнее:',
		options: [
			'Наслаждаться каждой минутой проведенного времени',
			'Быть устремленными мыслями в будущее',
			'Учитывать в ежедневной практике прошлый опыт',
		],
		type: 'radio',
	},
	{
		question:
			'Какое определение, по-Вашему, больше подходит к этому геометрическому изображению:',
		options: [
			'оно остроконечное',
			'оно устойчиво',
			'оно находится в состоянии равновесия',
		],
		custom: 'none',
		type: 'radio',
		image: 'assets/question-2.png',
	},
	{
		question: 'Вставьте подходящее число:',
		options: ['34', '36', '53', '44', '66', '42'],
		type: 'radio',
		image: 'assets/question-3.png',
	},
];

let currentQuestionIndex = 0;
let answers = [];

startTestBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		sectionsToHide.forEach(section => section.classList.add('hidden'));
		descriptionSection.style.display = 'none';
		testContainer.style.display = 'flex';
		burgerTestVisible.style.display = 'flex';
		burger.style.display = 'flex';
		showQuestion();
	});
});

function showQuestion() {
	const currentQuestion = questions[currentQuestionIndex];
	testQuestion.textContent = currentQuestion.question;
	answersContainer.innerHTML = '';

	if (currentQuestion.type === 'radio') {
		currentQuestion.options.forEach(option => {
			answersContainer.classList.remove('answers--color__container');
			const label = document.createElement('label');
			label.classList.add('question-radio');
			label.innerHTML = `<input type="radio" name="question" value="${option}" /> ${option}`;
			if (currentQuestion.image && !currentQuestion.custom) {
				questionImage.src = currentQuestion.image;
				questionImage.style.display = 'block';
				answersContainer.classList.add('answers--with-image');
				label.classList.add('custom');
			} else {
				questionImage.style.display = 'none';
				answersContainer.classList.remove('answers--with-image');
				label.classList.remove('custom');
			}
			answersContainer.appendChild(label);

			// Добавляем обработчик клика для label с классом custom
			if (label.classList.contains('custom')) {
				label.addEventListener('click', () => {
					// Убираем желтый бордер у всех label в контейнере
					const allLabels = answersContainer.querySelectorAll('label.custom');
					allLabels.forEach(lbl => {
						lbl.style.border = '6px solid transparent';
					});
					// Добавляем желтый бордер к текущему label
					label.style.border = '6px solid #FFC700';
				});
			}
		});
	} else if (currentQuestion.type === 'color') {
		currentQuestion.options.forEach(color => {
			answersContainer.classList.add('answers--color__container');
			const label = document.createElement('label');
			label.classList.add('color-label');
			label.innerHTML = `<input type="radio" name="question" value="${color}" />
                <span class="color-block" style="background-color:${color};"></span>`;
			answersContainer.appendChild(label);
		});
	}

	const radioButtons = document.querySelectorAll('input[name="question"]');
	radioButtons.forEach(radio => {
		radio.addEventListener('change', () => {
			nextBtn.disabled = false;
			radioButtons.forEach(rb => {
				rb.nextElementSibling.style.border = '2px solid transparent';
			});
			radio.nextElementSibling.style.border = '2px solid yellow';
		});
	});

	nextBtn.disabled = true; // Disable button initially
	updateProgressBar();
}

function answerQuestion(answer) {
	answers.push({ question: questions[currentQuestionIndex].question, answer });
	currentQuestionIndex++;
	if (currentQuestionIndex < questions.length) {
		showQuestion();
	} else {
		submitAnswers();
	}
}

function updateProgressBar() {
	const progress = (currentQuestionIndex / questions.length) * 100;
	progressBarFill.style.width = `${progress}%`;
}

async function submitAnswers() {
	testContainer.style.display = 'none';
	spinner.style.display = 'block';

	await new Promise(resolve => setTimeout(resolve, 1500));
	spinner.style.display = 'none';
	showResult();
}

function showResult() {
	burgerTestVisible.style.display = 'none';
	burgerResultVisible.style.display = 'flex';
	resultContainer.style.display = 'flex';
}

nextBtn.addEventListener('click', () => {
	const selectedAnswer = document.querySelector(
		'input[name="question"]:checked'
	).value;
	answerQuestion(selectedAnswer);
});
