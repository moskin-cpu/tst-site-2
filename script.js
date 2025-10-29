
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const feedbackContainer = document.getElementById("feedback-container");
const feedbackText = document.getElementById("feedback");

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
    feedbackContainer.classList.add("hide");
    nextButton.classList.add("hide");
    restartButton.classList.add("hide");
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
        feedbackText.innerText = "Correct!";
    } else {
        feedbackText.innerText = "Incorrect.";
    }
    feedbackContainer.classList.remove("hide");
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
        feedbackContainer.classList.add("hide");
    } else {
        showScore();
    }
}

// Function to display the final score
function showScore() {
    questionContainer.classList.add("hide");
    feedbackContainer.classList.remove("hide");
    feedbackText.innerText = `You scored ${score} out of ${questions.length}!`;
    restartButton.classList.remove("hide");
}

// Event listener for the next button
nextButton.addEventListener("click", nextQuestion);

// Event listener for the restart button
restartButton.addEventListener("click", startQuiz);

// Load questions when the page loads
loadQuestions();
