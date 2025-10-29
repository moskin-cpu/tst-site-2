
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackText = document.getElementById('feedback-text');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        showQuestion();
    });

function showQuestion() {
    feedbackText.textContent = '';
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => checkAnswer(option, question.answer));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        feedbackText.textContent = "Correct!";
    } else {
        feedbackText.textContent = "Wrong!";
    }
    
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            questionText.textContent = 'Quiz Completed!';
            optionsContainer.innerHTML = '';
            feedbackText.textContent = '';
        }
    }, 1000);
}
