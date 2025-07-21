document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz');
    const loadingElement = document.getElementById('loading');
    const resultsContainer = document.getElementById('results');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const counterElement = document.getElementById('counter');
    const nextButton = document.getElementById('next-btn');
    const playAgainButton = document.getElementById('play-again');
    const scoreElement = document.getElementById('score');
    
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let selectedAnswer = null;
    
    fetch('https://opentdb.com/api.php?amount=10')
        .then(response => response.json())
        .then(data => {
            questions = data.results.map(question => {
                const formattedQuestion = {
                    question: decodeHTML(question.question),
                    correct_answer: decodeHTML(question.correct_answer),
                    incorrect_answers: question.incorrect_answers.map(answer => decodeHTML(answer)),
                    type: question.type
                };
                
                const allAnswers = [
                    formattedQuestion.correct_answer,
                    ...formattedQuestion.incorrect_answers
                ];
                
                formattedQuestion.shuffled_answers = shuffleArray(allAnswers);
                
                return formattedQuestion;
            });
            
            loadingElement.style.display = 'none';
            quizContainer.style.display = 'block';
            showQuestion();
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            loadingElement.textContent = 'Failed to load questions. Please try again later.';
        });
    
    function showQuestion() {
        selectedAnswer = null;
        nextButton.disabled = true;
        
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        
        counterElement.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
        
        if (currentQuestionIndex === questions.length - 1) {
            nextButton.textContent = 'Finish Quiz';
        } else {
            nextButton.textContent = 'Next Question';
        }
        
        optionsElement.innerHTML = '';
        
        currentQuestion.shuffled_answers.forEach(answer => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = answer;
            
            optionElement.addEventListener('click', () => {
                if (selectedAnswer !== null) return;
                
                selectedAnswer = answer;
                
                document.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('correct', 'incorrect');
                });
                
                if (answer === currentQuestion.correct_answer) {
                    optionElement.classList.add('correct');
                    score++;
                } else {
                    optionElement.classList.add('incorrect');
                    document.querySelectorAll('.option').forEach(opt => {
                        if (opt.textContent === currentQuestion.correct_answer) {
                            opt.classList.add('correct');
                        }
                    });
                }
                
                nextButton.disabled = false;
            });
            
            optionsElement.appendChild(optionElement);
        });
    }
    
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            quizContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
            scoreElement.textContent = `You answered ${score}/${questions.length} questions correctly!`;
        }
    });
    
    playAgainButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        
        resultsContainer.style.display = 'none';
        loadingElement.style.display = 'block';
        
        fetch('https://opentdb.com/api.php?amount=10')
            .then(response => response.json())
            .then(data => {
                questions = data.results.map(question => {
                    const formattedQuestion = {
                        question: decodeHTML(question.question),
                        correct_answer: decodeHTML(question.correct_answer),
                        incorrect_answers: question.incorrect_answers.map(answer => decodeHTML(answer)),
                        type: question.type
                    };
                    
                    const allAnswers = [
                        formattedQuestion.correct_answer,
                        ...formattedQuestion.incorrect_answers
                    ];
                    
                    formattedQuestion.shuffled_answers = shuffleArray(allAnswers);
                    
                    return formattedQuestion;
                });
                
                loadingElement.style.display = 'none';
                quizContainer.style.display = 'block';
                showQuestion();
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
                loadingElement.textContent = 'Failed to load questions. Please try again later.';
            });
    });
    
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    function decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }
});