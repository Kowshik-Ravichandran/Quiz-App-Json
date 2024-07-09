let currentPage = 0;
let timer;
let timeRemaining = 300; // 5 minutes in seconds
let userAnswers = {};

const questions = [
    { "type": "text", "content": "What is the tallest mountain in the world?", "answer": "Mount Everest" },
    { "type": "radio", "content": "Which planet is known as the Red Planet?", "options": ["Mars", "Jupiter", "Saturn"], "answer": "Mars" },
    { "type": "checkbox", "content": "Which of the following are programming languages?", "options": ["JavaScript", "HTML", "Python", "CSS"], "answer": ["JavaScript", "Python"] },
    { "type": "dropdown", "content": "Select the smallest continent in the world.", "options": ["Australia", "Antarctica", "Europe"], "answer": "Australia" },
    { "type": "radio", "content": "Is water a compound?", "options": ["Yes", "No"], "answer": "Yes" },
    { "type": "text", "content": "Who wrote the play \"Romeo and Juliet\"?", "answer": "William Shakespeare" },
    { "type": "radio", "content": "Which one is a fruit?", "options": ["Carrot", "Apple", "Broccoli"], "answer": "Apple" },
    { "type": "checkbox", "content": "Which of the following are elements?", "options": ["Oxygen", "Water", "Iron", "Plastic"], "answer": ["Oxygen", "Iron"] },
    { "type": "radio", "content": "Which of the following is not a programming language?", "options": ["Python", "HTML", "Java", "C++"], "answer": "HTML" },
    { "type": "dropdown", "content": "Select the country with the largest population.", "options": ["USA", "India", "China"], "answer": "China" },
    { "type": "text", "content": "What is the chemical symbol for water?", "answer": "H2O" },
    { "type": "text", "content": "What is the capital of France?", "answer": "Paris" },
    { "type": "checkbox", "content": "Which of the following are mammals?", "options": ["Whale", "Shark", "Dolphin", "Octopus"], "answer": ["Whale", "Dolphin"] },
    { "type": "radio", "content": "Which color is not a primary color?", "options": ["Red", "Blue", "Green"], "answer": "Green" },
    { "type": "text", "content": "How many continents are there?", "answer": "7" },
    { "type": "checkbox", "content": "Which of the following are prime numbers?", "options": ["2", "3", "4", "5"], "answer": ["2", "3", "5"] },
    { "type": "text", "content": "What is the capital of Japan?", "answer": "Tokyo" },
    { "type": "radio", "content": "Which is the largest ocean on Earth?", "options": ["Atlantic", "Indian", "Pacific"], "answer": "Pacific" },
    { "type": "checkbox", "content": "Which of the following are web browsers?", "options": ["Chrome", "Python", "Firefox", "Edge"], "answer": ["Chrome", "Firefox", "Edge"] },
    { "type": "dropdown", "content": "Which element is known as the king of chemicals?", "options": ["Hydrogen", "Oxygen", "Sulfur"], "answer": "Sulfur" }
];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-button').addEventListener('click', startQuiz);
    document.getElementById('submit-button').addEventListener('click', submitQuiz);
    document.getElementById('next-button').addEventListener('click', nextPage);
    document.getElementById('prev-button').addEventListener('click', prevPage);
});

function startQuiz() {
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('timer').style.display = 'block';
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('navigation').style.display = 'block';

    loadQuestions();
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById('time').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeRemaining <= 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

function loadQuestions() {
    displayPage();
}

function displayPage() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = '';

    const questionsPerPage = 5;
    const startIndex = currentPage * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, questions.length);

    for (let i = startIndex; i < endIndex; i++) {
        const question = questions[i];
        const questionElement = document.createElement('div');
        questionElement.className = 'question';

        const label = document.createElement('label');
        label.textContent = question.content;
        questionElement.appendChild(label);

        if (question.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `q${i}`;
            input.value = userAnswers[`q${i}`] || '';
            input.addEventListener('input', saveAnswer);
            questionElement.appendChild(input);
        } else if (question.type === 'radio') {
            question.options.forEach(option => {
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `q${i}`;
                radio.value = option;
                radio.checked = userAnswers[`q${i}`] === option;
                radio.addEventListener('click', saveAnswer);

                const radioLabel = document.createElement('label');
                radioLabel.textContent = option;

                const radioContainer = document.createElement('div');
                radioContainer.appendChild(radio);
                radioContainer.appendChild(radioLabel);
                questionElement.appendChild(radioContainer);
            });
        } else if (question.type === 'checkbox') {
            question.options.forEach(option => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = `q${i}`;
                checkbox.value = option;
                checkbox.checked = userAnswers[`q${i}`] && userAnswers[`q${i}`].includes(option);
                checkbox.addEventListener('click', saveAnswer);

                const checkboxLabel = document.createElement('label');
                checkboxLabel.textContent = option;

                const checkboxContainer = document.createElement('div');
                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(checkboxLabel);
                questionElement.appendChild(checkboxContainer);
            });
        } else if (question.type === 'dropdown') {
            const select = document.createElement('select');
            select.name = `q${i}`;
            question.options.forEach(option => {
                const selectOption = document.createElement('option');
                selectOption.value = option;
                selectOption.textContent = option;
                selectOption.selected = userAnswers[`q${i}`] === option;
                select.appendChild(selectOption);
            });
            select.addEventListener('change', saveAnswer);
            questionElement.appendChild(select);
        }

        questionContainer.appendChild(questionElement);
    }

    updateNavigation();
}

function updateNavigation() {
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const submitButton = document.getElementById('submit-button');
    const totalPages = Math.ceil(questions.length / 5);

    nextButton.style.display = currentPage < totalPages - 1 ? 'inline-block' : 'none';
    prevButton.style.display = currentPage > 0 ? 'inline-block' : 'none';
    submitButton.style.display = currentPage === totalPages - 1 ? 'inline-block' : 'none';
}

function nextPage() {
    currentPage++;
    displayPage();
}

function prevPage() {
    currentPage--;
    displayPage();
}

function saveAnswer(event) {
    const questionIndex = event.target.name.slice(1);
    const answer = event.target.type === 'checkbox' ? 
        Array.from(document.querySelectorAll(`input[name="q${questionIndex}"]:checked`)).map(input => input.value) :
        event.target.value;

    userAnswers[`q${questionIndex}`] = answer;
}

function submitQuiz() {
    clearInterval(timer);  // Stop the timer
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('navigation').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    let score = 0;

    questions.forEach((question, index) => {
        const userAnswer = userAnswers[`q${index}`];
        const correctAnswer = question.answer;
        const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);

        const resultElement = document.createElement('div');
        resultElement.className = isCorrect ? 'correct-answer' : 'incorrect-answer';

        const questionLabel = document.createElement('label');
        questionLabel.textContent = question.content;
        resultElement.appendChild(questionLabel);

        const userAnswerLabel = document.createElement('div');
        userAnswerLabel.textContent = `Your answer: ${userAnswer}`;
        resultElement.appendChild(userAnswerLabel);

        const correctAnswerLabel = document.createElement('div');
        correctAnswerLabel.textContent = `Correct answer: ${correctAnswer}`;
        resultElement.appendChild(correctAnswerLabel);

        resultsContainer.appendChild(resultElement);

        if (isCorrect) {
            score++;
        }
    });

    const scoreElement = document.createElement('div');
    scoreElement.className = 'score';
    scoreElement.textContent = `You scored ${score} out of ${questions.length}`;
    resultsContainer.appendChild(scoreElement);
}
