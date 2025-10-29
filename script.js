document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const feedbackElement = document.getElementById('feedback');
    const nextButton = document.getElementById('next-btn');

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
            nextButton.style.display = 'none';

            // Assuming options are an array of objects like {text: "Option A", isCorrect: false}
            // Or just an array of strings if correct answer is in a separate field
            const options = questionData.options || [
                { text: questionData["(A)"], isCorrect: questionData["→ Correct answer:"] === "(A)" },
                { text: questionData["(B)"], isCorrect: questionData["→ Correct answer:"] === "(B)" },
                { text: questionData["(C)"], isCorrect: questionData["→ Correct answer:"] === "(C)" },
                { text: questionData["(D)"], isCorrect: questionData["→ Correct answer:"] === "(D)" },
                { text: questionData["(E)"], isCorrect: questionData["→ Correct answer:"] === "(E)" }
            ];


            options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option.text;
                button.classList.add('option-btn');
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
            nextButton.style.display = 'block';
            disableOptions();
        } else {
            feedbackElement.textContent = `Wrong! The correct answer was: ${correctAnswerText}`;
            feedbackElement.style.color = 'red';
            // Add to missed questions if not already there
            if (!missedQuestions.includes(questionData)) {
                missedQuestions.push(questionData);
            }
            nextButton.style.display = 'block'; // Allow user to move on after seeing the correct answer
            disableOptions();
        }
    }

    function disableOptions() {
        Array.from(optionsElement.children).forEach(button => {
            button.disabled = true;
        });
    }

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            // If all initial questions are done, start reviewing missed questions
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
        quizContainer.innerHTML = '<h2>Quiz Completed!</h2><p>You have answered all questions.</p>';
        if (missedQuestions.length > 0) {
            quizContainer.innerHTML += '<p>You still have some missed questions to review.</p>';
            // Optionally, restart with missed questions or list them
        }
    }

    loadQuestions();
});
