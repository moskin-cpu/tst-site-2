document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.querySelector('.quiz-container'); // Use class selector if no specific ID
    const questionElement = document.getElementById('question-text');
    const optionsElement = document.getElementById('answer-buttons');
    const feedbackElement = document.getElementById('feedback');
    const nextButton = document.getElementById('next-button');

    let questions = [];
    let currentQuestionIndex = 0;
    let missedQuestions = [];

    async function loadQuestions() {
        try {
            const response = await fetch('questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            questions = data; // Assuming the JSON directly contains an array of questions
            if (questions.length > 0) {
                displayQuestion();
            } else {
                quizContainer.innerHTML = '<p>No questions loaded. Please check questions.json.</p>';
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            quizContainer.innerHTML = `<p>Error loading questions: ${error.message}. Please check console for details.</p>`;
        }
    }

    function displayQuestion() {
        if (currentQuestionIndex < questions.length) {
            const questionData = questions[currentQuestionIndex];
            questionElement.textContent = questionData.question;
            optionsElement.innerHTML = '';
            feedbackElement.textContent = '';
            nextButton.classList.add('hide'); // Hide next button initially

            const options = [
                { text: questionData["(A)"], isCorrect: questionData["→ Correct answer:"] === "(A)" },
                { text: questionData["(B)"], isCorrect: questionData["→ Correct answer:"] === "(B)" },
                { text: questionData["(C)"], isCorrect: questionData["→ Correct answer:"] === "(C)" },
                { text: questionData["(D)"], isCorrect: questionData["→ Correct answer:"] === "(D)" },
                { text: questionData["(E)"], isCorrect: questionData["→ Correct answer:"] === "(E)" }
            ];

            options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option.text;
                button.classList.add('btn'); // Use 'btn' class from style.css
                button.addEventListener('click', () => checkAnswer(option.text, questionData["→ Correct answer:"]));
                optionsElement.appendChild(button);
            });
        } else {
            displayQuizResult();
        }
    }

    function checkAnswer(selectedOptionText, correctAnswerLetter) {
        const questionData = questions[currentQuestionIndex];
        const correctAnswerMapping = {
            "(A)": questionData["(A)"],
            "(B)": questionData["(B)"],
            "(C)": questionData["(C)"],
            "(D)": questionData["(D)"],
            "(E)": questionData["(E)"]
        };
        const correctAnswerText = correctAnswerMapping[correctAnswerLetter];

        if (selectedOptionText === correctAnswerText) {
            feedbackElement.textContent = 'Correct!';
            feedbackElement.style.color = 'green';
        } else {
            feedbackElement.textContent = `Wrong! The correct answer was: ${correctAnswerText}`;
            feedbackElement.style.color = 'red';
            if (!missedQuestions.includes(questionData)) {
                missedQuestions.push(questionData);
            }
        }
        feedbackElement.classList.remove('hide');
        nextButton.classList.remove('hide');
        disableOptions();
    }

    function disableOptions() {
        Array.from(optionsElement.children).forEach(button => {
            button.disabled = true;
            // Optionally, highlight correct/incorrect answers
            const questionData = questions[currentQuestionIndex];
            const correctAnswerMapping = {
                "(A)": questionData["(A)"],
                "(B)": questionData["(B)"],
                "(C)": questionData["(C)"],
                "(D)": questionData["(D)"],
                "(E)": questionData["(E)"]
            };
            const correctAnswerText = correctAnswerMapping[questionData["→ Correct answer:"]];

            if (button.textContent === correctAnswerText) {
                button.classList.add('correct');
            } else if (button.disabled && button.textContent !== correctAnswerText) {
                // If it's a wrong answer and was selected, potentially highlight as wrong
                // This part depends on how you want to visually show wrong selected answers
            }
        });
    }

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        feedbackElement.classList.add('hide'); // Hide feedback for next question
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            if (missedQuestions.length > 0) {
                questions = missedQuestions; // Set questions to only missed ones
                currentQuestionIndex = 0;
                missedQuestions = []; // Reset missed questions for the review round
                alert("Reviewing missed questions!");
                displayQuestion();
            } else {
                displayQuizResult();
            }
        }
    });

    function displayQuizResult() {
        questionElement.textContent = 'Quiz Completed!';
        optionsElement.innerHTML = '<p>You have answered all questions.</p>';
        nextButton.classList.add('hide');
        feedbackElement.classList.add('hide');
        if (missedQuestions.length > 0) {
            optionsElement.innerHTML += '<p>You still have some missed questions to review.</p>';
        }
    }

    loadQuestions();
});