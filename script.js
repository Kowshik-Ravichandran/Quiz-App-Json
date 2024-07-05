let currentPage = 0;
let timer;
let timeRemaining = 300; // 5 minutes in seconds
let userAnswers = {};
let questions = []; // Initialize an empty array to hold the questions

document.addEventListener('DOMContentLoaded', () => {
    fetch('question.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            document.getElementById('start-button').addEventListener('click', startQuiz);
        })
        .catch(error => console.error('Error loading questions:', error));
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

    if (currentPage === 0) {
        nextButton.disabled = false;
        prevButton.style.display = 'none';
        submitButton.style.display = 'none';
    } else {
        prevButton.style.display = 'inline-block';
        submitButton.style.display = 'none';
    }

    if (currentPage === Math.floor(questions.length / 5)) {
        nextButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
    } else {
        nextButton.style.display = 'inline-block';
    }
}

function nextPage() {
    if (currentPage < Math.floor(questions.length / 5)) {
        currentPage++;
        displayPage();
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        displayPage();
    }
}

function saveAnswer(event) {
    const questionIndex = parseInt(event.target.name.substr(1));
    const answer = event.target.type === 'checkbox' ?
        Array.from(document.querySelectorAll(`input[name=q${questionIndex}]:checked`)).map(cb => cb.value) :
        event.target.value;

    userAnswers[`q${questionIndex}`] = answer;
}

function submitQuiz() {
    clearInterval(timer);
    showResults();
}

function showResults() {
    let correctAnswers = 0;
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    questions.forEach((question, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'result-question';

        const userAnswer = userAnswers[`q${index}`];
        const correctAnswer = question.answer;

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = question.content;
        answerDiv.appendChild(questionTitle);

        const userResponse = document.createElement('p');
        userResponse.textContent = `Your Answer: ${userAnswer}`;
        answerDiv.appendChild(userResponse);

        const correctResponse = document.createElement('p');
        correctResponse.textContent = `Correct Answer: ${correctAnswer}`;
        answerDiv.appendChild(correctResponse);

        if (userAnswer && userAnswer.toString() === correctAnswer.toString()) {
            answerDiv.classList.add('correct-answer');
            correctAnswers++;
        } else {
            answerDiv.classList.add('incorrect-answer');
        }

        answersContainer.appendChild(answerDiv);
    });

    const scoreDisplay = document.createElement('p');
    scoreDisplay.textContent = `Your Score: ${correctAnswers} out of ${questions.length}`;
    answersContainer.appendChild(scoreDisplay);

    document.getElementById('question-container').style.display = 'none';
    document.getElementById('navigation').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}
