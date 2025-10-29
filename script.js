
const questionElement = document.getElementById('question-text');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const feedbackElement = document.getElementById('feedback');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let missedQuestions = [];

async function startQuiz() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        shuffleArray(questions); // Shuffle questions for a random order
        currentQuestionIndex = 0;
        score = 0;
        missedQuestions = [];
        nextButton.classList.add('hide');
        feedbackElement.classList.add('hide');
        showQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
        questionElement.innerText = 'Error loading quiz questions. Please try again later.';
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestion() {
    resetState();
    if (questions.length === 0) {
        questionElement.innerText = 'No questions available.';
        return;
    }
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
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
    feedbackElement.classList.add('hide');
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
        feedbackElement.style.color = 'green';
    } else {
        feedbackElement.innerText = 'Wrong!';
        feedbackElement.style.color = 'red';
        missedQuestions.push(questions[currentQuestionIndex]);
    }
    feedbackElement.classList.remove('hide');

    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === 'true');
        button.removeEventListener('click', selectAnswer); // Disable further clicks
    });

    nextButton.classList.remove('hide');
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

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        // All initial questions answered, now tackle missed questions
        if (missedQuestions.length > 0) {
            questions = [...missedQuestions]; // Set questions to only the missed ones
            shuffleArray(questions); // Shuffle missed questions
            missedQuestions = []; // Clear for the next round of missed questions
            currentQuestionIndex = 0;
            alert('Time to review missed questions!');
            showQuestion();
        } else {
            endQuiz();
        }
    }
});

function endQuiz() {
    questionElement.innerText = `Quiz Finished! You scored ${score} out of ${questions.length + missedQuestions.length} questions initially presented!`;
    answerButtonsElement.classList.add('hide');
    nextButton.classList.add('hide');
    feedbackElement.classList.add('hide');
    // alert(`Quiz Finished! Your final score is ${score}!`);
}

startQuiz();
