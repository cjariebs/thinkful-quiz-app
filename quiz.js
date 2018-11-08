'use strict';
$(function() {
    // --------------------------------
    // Data

    const _questions = [{
        header: 'What is usually the first program written in a new programming language?',
        answers: ['Lorem Ipsum', 'Hello World', 'init 1', 'C++'],
        correctAnswer: 1,
        selected: null,
        confirmed: null,
    },
    {   
        header: 'Never gonna:',
        answers: ['Give you up', 'Let you down', 'Run around', 'Desert you', 'All of the Above'],
        correctAnswer: 4,
        selected: null,
        confirmed: null,
    },{
        header: 'All your base are:',
        answers: ['Belong to Us', '1337', 'Under attack', 'Protected'],
        correctAnswer: 0,
        selected: null,
        confirmed: null,
    },
    {
        header: 'How many questions does this quiz require?',
        answers: ['One', 'Three', 'Five', 'Seven'],
        correctAnswer: 2,
        selected: null,
        confirmed: null,
    },
    {   
        header: 'How many questions does this quiz app support?',
        answers: ['Exactly five', 'Up to 16', 'Zero', 'As many as Javascript allows'],
        correctAnswer: 3,
        selected: null,
        confirmed: null,
    },{
        header: 'Why are there more than five questions?',
        answers: ['For the lulz'],
        correctAnswer: 0,
        selected: null,
        confirmed: null,
    }];

    // --------------------------------
    // State
    const _state = {
        currentQuestion: -1,
        score: 0,
    };

    // --------------------------------
    // State management

    // returns JSON representing current question
    function getCurrentQuestion() {
        return _questions[getQuestionIndex()];
    }

    // returns machine-readable question index
    function getQuestionIndex() {
        return _state.currentQuestion;
    }

    // returns human-readable question number
    function getQuestionNum() {
        return getQuestionIndex() + 1;
    }

    // returns total number of questions
    function getNumQuestions() {
        return _questions.length;
    }

    // returns current score
    function getScore() {
        return _state.score;
    }

    // adds 1 to score
    function incrementScore() {
        _state.score++;
    }

    // calculate number of incorrectly-answered questions
    function calculateIncorrect() {
        // incorrect_answers = questions_answered-correct_answers
        let incorrect=0;
        for (let i=0; i<getNumQuestions(); i++) {
            if (_questions[i].confirmed !== null && _questions[i].confirmed != _questions[i].correctAnswer) incorrect++;
        }
        return incorrect;
    }

    // resets the game
    function resetState() {
        console.log("resetting state");
        _state.currentQuestion = -1;
        _state.score = 0;
        
        for (let i=0; i < getNumQuestions(); i++) {
            _questions[i].selected = null;
            _questions[i].confirmed = null;
        }

        render();
    }

    // go to next question
    function nextQuestion() {
        console.log("next question");
        _state.currentQuestion++;
        render();
    }

    // --------------------------------
    // User Interface

    // render current question and answers
    function renderQuestion() {
        console.log("rendering question");
        const question = getCurrentQuestion();

        updateHeaderText(`${getQuestionNum()}. ${question.header}`);
        updateAnswerList(question);

        // yes, that was my final answer
        if (question.confirmed !== null) {
            updateStatusText('The correct answer is: ' + question.answers[question.correctAnswer]);

            if (getQuestionNum() >= getNumQuestions()) {
               updateSubmitText('Finish');
            } else {
               updateSubmitText('Next Question');
            }
        } else {
            // is that your final answer?
            updateStatusText(`Question ${getQuestionNum()}/${getNumQuestions()}. Your score is ${getScore()}/${getNumQuestions()}. (${calculateIncorrect()} incorrect)`);
            updateSubmitText('Submit Answer');
        }
    }

    // populate list of answers based on question passed
    function updateAnswerList(question) {
        clearAnswerList();

        for (let i=0; i < question.answers.length; i++) {
            // highlight currently selected answer if re-rendered
            const checked = (question.selected == i ? 'checked' : '');

            // highlight correct/incorrect answers 
            const correct = (question.confirmed !== null && (question.correctAnswer == i) ? 'correct-answer' : '');
            const incorrect = (question.confirmed == i && (question.confirmed != question.correctAnswer) ? 'incorrect-answer' : '');

            // append each answer, formatted for visual feedback
            $('#answers').append(`<label for="${i}" class="${correct} ${incorrect}"><input type="radio" value="${i}" id="${i}" name="answer" ${checked} />${question.answers[i]}</label>`);
        }
    }
    
    // clears answers <ol>
    function clearAnswerList() {
        $('#answers').html('');
    }

    // render start page
    function renderStartPage() {
        console.log("rendering start page");
        clearAnswerList();
        updateHeaderText("Welcome to the Quiz!");
        updateStatusText("Press 'Start Quiz' to Begin.");
        updateSubmitText("Start Quiz");
    }

    // render end page
    function renderEndPage() {
        console.log("rendering end page");
        clearAnswerList();
        updateHeaderText(`Final score: ${getScore()}/${getNumQuestions()}`);
        updateStatusText("That's all, folks!");
        updateSubmitText("Restart Quiz");
    }

    // choose which page to render based on app state
    function render() {
        // go to start page initially
        if (getQuestionIndex() < 0) {
            renderStartPage();
        } else if (getQuestionIndex() >= getNumQuestions()) {
            // go to end page if there are no more questions
            renderEndPage();
        } else {
            // render questions
            renderQuestion();
        }
    }

    // updates text on question header
    function updateHeaderText(text) {
        $('legend').text(text);
    }
    
    // updates text on submit button
    function updateSubmitText(text) {
        $('input[type="submit"]').val(text);
    }

    // updates status bar text
    function updateStatusText(text) {
        $('header').text(text);
    }

    // --------------------------------
    // Input Handling

    // handles all answer selection inputs
    function handleSelect(num) {
        console.log("selecting answer " + num);
        const question = getCurrentQuestion();
        question.selected = num;
       // render();
    }

    // handles all submit button input
    function handleSubmit() {
        console.log("handling submit");
        const question = getCurrentQuestion();

        // negative question index means we're on the start page
        if (getQuestionIndex() < 0) {
            updateSubmitText('Submit Answer');
            nextQuestion();
            return;
        }

        // index greater than length means we're at the end page
        if (getQuestionIndex() >= getNumQuestions()) {
            resetState();
            return;
        }

        // if answer is finalized, submit goes to next question
        if (question.confirmed !== null) {
            updateSubmitText('Submit Answer');
            nextQuestion();

        } else {
            // finalize answer, then re-render for feedback
            question.confirmed = question.selected;

            // give the user a cookie :)
            if (question.confirmed == question.correctAnswer) {
                incrementScore();
            }

            updateSubmitText('Next Question');
        }
        
        render();
    }

    // jquery event handlers make our app interactive
    function setupEventHandlers() {
        console.log("setting up event handlers");
        $('form').on('click', 'input', function(event) {

            // submit button
            const button = $(this);
            if (button.attr('type') === "submit") {
                event.preventDefault();
                handleSubmit();
            }
            else {
              // radio button
              handleSelect(button.val());
            }
        });
    }

    // --------------------------------
    // init+go

    setupEventHandlers();
    resetState();
});
