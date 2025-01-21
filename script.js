let answer;
let questionsArray;
let lastChecked = null;
let questions;
let answers;
let question;
let index = 0;
let radioId;
let blacklist = [];
let isShuffled = false; // Track if questions are shuffled
let originalQuestions; // Store the original order of questions

function setAnswer(num) {
    radioId = num;
    num--;
    answer = answers[num];
    let correctAnswer = questions[index].correctAnswer;
    validateAnswer(correctAnswer);
}

// Tailwind CSS Snackbar
function snackbar(txt, isError = false) {
    const snackbarElement = document.getElementById('snackbar');

    // Set the snackbar content and color
    snackbarElement.textContent = txt;
    snackbarElement.className = `w-full max-w-md text-center px-4 py-2 rounded-lg shadow-lg text-white opacity-0 transition-opacity duration-500 ${
        isError ? 'bg-red-500' : 'bg-green-500'
    }`;

    // Show the snackbar
    setTimeout(() => {
        snackbarElement.classList.remove('opacity-0');
        snackbarElement.classList.add('opacity-100');
    }, 10);

    // Hide the snackbar after 3 seconds
    setTimeout(() => {
        snackbarElement.classList.remove('opacity-100');
        snackbarElement.classList.add('opacity-0');
    }, 3000);
}

let marks = 0;

function validateAnswer(correctAnswer) {
    let correctRadioId = `radio${answers.indexOf(correctAnswer) + 1}`;
    let correctLabel = document.querySelector(`label[for="${correctRadioId}"]`);
    if (answer === correctAnswer) {
        snackbar('Correct answer.', false);
        if (!blacklist.includes(index)) {
            marks++;
        }
        document.getElementById('correct').textContent = `Correct answers: ${marks}/${questions.length}`;
    } else {
        snackbar('Incorrect answer.', true);
        if (correctLabel) {
            // Blink the correct answer twice
            blinkCorrectAnswer(correctLabel);
        }
    }
    blacklist.push(index);
    return answer === correctAnswer;
}

// Function to blink the correct answer twice
function blinkCorrectAnswer(correctLabel) {
    let blinkCount = 0;
    const originalColor = correctLabel.style.backgroundColor; // Store the original color

    // Function to toggle the green color
    const toggleGreen = () => {
        if (blinkCount % 2 === 0) {
            correctLabel.classList.add('correct-answer'); // Turn green
        } else {
            correctLabel.classList.remove('correct-answer'); // Revert to original color
        }
        blinkCount++;
    };

    // First blink happens immediately
    toggleGreen();

    // Subsequent blinks happen every 200ms
    const blinkInterval = setInterval(() => {
        if (blinkCount < 4) { // 4 toggles (2 full blinks)
            toggleGreen();
        } else {
            clearInterval(blinkInterval); // Stop blinking after 2 blinks
            correctLabel.style.backgroundColor = originalColor; // Ensure it reverts to the original color
        }
    }, 100); // Toggle every 200ms
}

function next() {
    if (index + 1 === questions.length && answer === undefined) {
        snackbar('Please select an answer.', true);
        return;
    }
    let correctAnswer = questions[index].correctAnswer;
    question = document.getElementById('question');
    index++;
    question.textContent = questions[index].question;
    document.getElementById('question-num').textContent = `Question ${index + 1}`;
    document.querySelectorAll('.custom-radio').forEach((radio) => (radio.checked = false));
    displayButton('prev');
    if (index === questions.length - 1) {
        hideButton('next');
    }
    setRadios();
    answer = undefined;
    document.title = `Question ${index + 1}`;
}

function hideButton(identifier) {
    document.getElementById(`${identifier}`).style.visibility = 'hidden';
}

function displayButton(identifier) {
    document.getElementById(`${identifier}`).style.visibility = '';
}

function previous() {
    let correctAnswer = questions[index].correctAnswer;
    question = document.getElementById('question');
    index--;
    if (index === 0) {
        hideButton('prev');
    }
    displayButton('next');
    question.textContent = questions[index].question;
    document.getElementById('question-num').textContent = `Question ${index + 1}`;
    document.querySelectorAll('.custom-radio').forEach((radio) => (radio.checked = false));
    answer = undefined;
    setRadios();
    document.title = `Question ${index + 1}`;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));
        [array[i], array[random]] = [array[random], array[i]];
    }
}

// Toggle shuffle functionality
function toggleShuffle() {
    if (isShuffled) {
        questions = [...originalQuestions]; // Revert to original order
        isShuffled = false;
        snackbar('Questions reverted to original order.', false);
    } else {
        originalQuestions = [...questions]; // Store original order
        shuffle(questions);
        isShuffled = true;
        snackbar('Questions shuffled.', false);
    }
    index = 0; // Reset to the first question
    setRadios();
    document.getElementById('question').textContent = questions[index].question;
    document.getElementById('question-num').textContent = `Question ${index + 1}`;
    updateShuffleButtonText(); // Update button text
}

// Update shuffle button text
function updateShuffleButtonText() {
    const shuffleButton = document.getElementById('shuffle-button');
    if (shuffleButton) {
        shuffleButton.textContent = isShuffled ? 'Unshuffle questions' : 'Shuffle questions';
    }
}

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const file = urlParams.get('file');
    if (!file) {
        snackbar('No file specified in the URL.', true);
        return;
    }

    fetch(file)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch questions.');
            }
            return response.json();
        })
        .then((data) => {
            questions = data.questions;
            originalQuestions = [...questions]; // Store original order
            question = document.getElementById('question');
            question.textContent = questions[index].question;
            setRadios();

            // Add shuffle button dynamically
            const shuffleButton = document.createElement('button');
            shuffleButton.id = 'shuffle-button';
            shuffleButton.textContent = 'Shuffle Questions';
            shuffleButton.className =
                'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300';
            shuffleButton.onclick = toggleShuffle;
            document.getElementById('shuffle-button-container').appendChild(shuffleButton);
        })
        .catch((error) => {
            snackbar('Failed to load questions. Please check the file URL.', true);
            console.error(error);
        });
};

function setRadios() {
    answers = questions[index].answers;
    
    let len = answers.length;

    // Hide/show radio buttons based on the number of answers
    if (len === 2) {
        // True/False question: Hide the last two radio buttons
        document.getElementById('radio3').style.display = 'none';
        document.getElementById('q3').style.display = 'none';
        document.getElementById('radio4').style.display = 'none';
        document.getElementById('q4').style.display = 'none';
    } else {
        // Show all radio buttons
        document.getElementById('radio3').style.display = '';
        document.getElementById('q3').style.display = '';
        document.getElementById('radio4').style.display = '';
        document.getElementById('q4').style.display = '';
    }

    for (let i = 0; i < len; i++) {
        document.getElementById(`q${i + 1}`).innerText = answers[i];
    }
}