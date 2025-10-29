
document.addEventListener('DOMContentLoaded', () => {
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const feedbackElement = document.getElementById('feedback');
    const nextButton = document.getElementById('next-btn');
    const restartButton = document.getElementById('restart-btn');
    const quizContainer = document.querySelector('.quiz-container');

    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let missedQuestions = [];

    async function fetchQuestions() {
        try {
            const response = await fetch('questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            currentQuestions = data.questions;
            startQuiz();
        } catch (error) {
            console.error('Error loading questions:', error);
            feedbackElement.textContent = 'Error loading questions. Please try again later.';
        }
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        missedQuestions = [];
        quizContainer.style.display = 'block';
        nextButton.classList.add('hide');
        restartButton.classList.add('hide');
        setNextQuestion();
    }

    function setNextQuestion() {
        resetState();
        if (currentQuestionIndex < currentQuestions.length) {
            showQuestion(currentQuestions[currentQuestionIndex]);
        } else {
            if (missedQuestions.length > 0) {
                // If there are missed questions, start reviewing them
                currentQuestions = missedQuestions;
                currentQuestionIndex = 0;
                missedQuestions = []; // Clear missed questions for the review round
                feedbackElement.textContent = 'Reviewing missed questions!';
                setTimeout(() => showQuestion(currentQuestions[currentQuestionIndex]), 1500);
            } else {
                showResults();
            }
        }
    }

    function showQuestion(question) {
        questionElement.innerHTML = question.question; // Use innerHTML to render potential HTML tags
        answerButtonsElement.innerHTML = ''; // Clear previous answers
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.innerHTML = answer.text; // Use innerHTML for answers as well
            button.classList.add('btn');
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        clearFeedback();
        nextButton.classList.add('hide');
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === 'true';

        Array.from(answerButtonsElement.children).forEach(button => {
            setStatusClass(button, button.dataset.correct === 'true');
            button.removeEventListener('click', selectAnswer); // Disable further clicks
        });

        if (correct) {
            feedbackElement.textContent = 'Correct!';
            feedbackElement.style.color = 'green';
        } else {
            feedbackElement.textContent = 'Incorrect! Try again.';
            feedbackElement.style.color = 'red';
            // Add the current question to missed questions if it's not already there
            const q = currentQuestions[currentQuestionIndex];
            if (!missedQuestions.includes(q)) {
                missedQuestions.push(q);
            }
        }
        nextButton.classList.remove('hide');
    }

    function setStatusClass(element, correct) {
        clearStatusClass(element);
        if (correct) {
            element.classList.add('correct');
        } else {
            element.classList.add('incorrect');
        }
    }

    function clearStatusClass(element) {
        element.classList.remove('correct');
        element.classList.remove('incorrect');
    }

    function clearFeedback() {
        feedbackElement.textContent = '';
        feedbackElement.style.color = '';
    }

    function showResults() {
        questionElement.textContent = 'Quiz Finished!';
        answerButtonsElement.innerHTML = '';
        feedbackElement.textContent = 'You have completed the quiz.';
        feedbackElement.style.color = 'black';
        nextButton.classList.add('hide');
        restartButton.classList.remove('hide');
    }

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        setNextQuestion();
    });

    restartButton.addEventListener('click', fetchQuestions); // Restart by fetching questions again

    fetchQuestions();
});
