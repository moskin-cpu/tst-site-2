let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question-text');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const feedbackElement = document.getElementById('feedback');

// Function to fetch questions
async function fetchQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        questions = await response.json();
        console.log("Questions loaded:", questions);
        startQuiz(); // Calling startQuiz after questions are loaded
    } catch (error) {
        console.error("Error loading questions:", error);
        feedbackElement.textContent = "Error loading questions: " + error.message;
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    // Get the title screen and quiz container elements
    const titleScreen = document.getElementById('title-screen');
    const quizContainer = document.getElementById('quiz-container');

    // Hide the title screen and show the quiz container
    if (titleScreen) {
        titleScreen.style.display = 'none';
    }
    if (quizContainer) {
        quizContainer.style.display = 'block'; // Make sure the quiz container is visible
    }

    nextButton.classList.remove('hide'); // Ensure next button is visible if it was hidden by default
    showQuestion();
}

function showQuestion() {
    resetState();
    if (questions.length === 0) {
        questionElement.innerText = "No questions available.";
        return;
    }
    const question = questions[currentQuestionIndex];
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
    nextButton.classList.add('hide');
    feedbackElement.innerText = '';
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) {
        score++;
        feedbackElement.innerText = 'Correct!';
    } else {
        feedbackElement.innerText = 'Incorrect!';
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === 'true');
        button.removeEventListener('click', selectAnswer);
    });
    nextButton.classList.remove('hide');
}

function setStatusClass(element, correct) {
    element.classList.remove('correct');
    element.classList.remove('incorrect');
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('incorrect');
    }
}

function setNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    questionElement.innerText = `You scored ${score} out of ${questions.length}!`;
    answerButtonsElement.innerHTML = '';
    nextButton.classList.add('hide');
    feedbackElement.innerText = 'Quiz Finished!';
    // Optional: add a restart button
    const restartButton = document.createElement('button');
    restartButton.innerText = 'Restart Quiz';
    restartButton.classList.add('btn');
    restartButton.addEventListener('click', () => {
        // Reload page or reinitialize quiz state without full reload
        location.reload(); // Simple reload for now
    });
    answerButtonsElement.appendChild(restartButton); // Append to answer buttons area
}

nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        setNextQuestion();
    } else {
        endQuiz(); // Call endQuiz when all questions are answered
    }
});

// Initial call to load questions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchQuestions);

// If there's a specific 'start-quiz-button' in index.html,
// ensure it also triggers the startQuiz function.
// This example assumes questions are loaded and quiz starts immediately.
// If a button is intended, the DOMContentLoaded listener for fetchQuestions
// might need adjustment, or fetchQuestions might need to be called by the button.
// For now, assuming direct load and start.
