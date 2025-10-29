const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const resultsContainer = document.getElementById('results');
const scoreElement = document.getElementById('score');

let shuffledQuestions, currentQuestionIndex;
let score = 0;

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        shuffledQuestions = data.sort(() => Math.random() - 0.5);
        startQuiz();
    });

function startQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    nextButton.classList.add('hide');
    resultsContainer.classList.add('hide');
    questionContainer.classList.remove('hide');
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    if (shuffledQuestions.length > currentQuestionIndex) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        showResults();
    }
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    setStatusClass(document.body, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });
    if (correct) {
        score++;
    }

    setTimeout(() => {
        currentQuestionIndex++;
        setNextQuestion();
    }, 1000); // 1 second delay before next question
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function showResults() {
    questionContainer.classList.add('hide');
    resultsContainer.classList.remove('hide');
    resultsContainer.innerHTML = '<h2>Quiz Completed!</h2>';
}
