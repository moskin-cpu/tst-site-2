
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");
const scoreContainer = document.getElementById("score-container");
const scoreText = document.getElementById("score");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Function to load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch("questions.json");
        questions = await response.json();
        startQuiz();
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}

// Function to start the quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    scoreContainer.classList.add("hide");
    nextButton.classList.add("hide");
    showQuestion(questions[currentQuestionIndex]);
}

// Function to display a question
function showQuestion(question) {
    questionText.innerText = question.question;
    answerButtons.innerHTML = "";
    question.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(answer));
        answerButtons.appendChild(button);
    });
}

// Function to handle answer selection
function selectAnswer(answer) {
    const correct = answer.correct;
    if (correct) {
        score++;
    }
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;
    });
    nextButton.classList.remove("hide");
}

// Function to show the next question
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions[currentQuestionIndex]);
        nextButton.classList.add("hide");
    } else {
        showScore();
    }
}

// Function to display the final score
function showScore() {
    questionContainer.classList.add("hide");
    scoreContainer.classList.remove("hide");
    scoreText.innerText = `You scored ${score} out of ${questions.length}!`;
}

// Event listener for the next button
nextButton.addEventListener("click", nextQuestion);

// Load questions when the page loads
loadQuestions();
