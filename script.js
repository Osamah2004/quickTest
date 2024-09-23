let answer;
let questionsArray;
let lastChecked = null;
let questions;
let answers;
var question;
let index = 0;
let radioId;
let blacklist = []; // Add this line at the beginning of your script

function setAnswer(num) {
    radioId = num;
    num--;
    answer = answers[num];
    let correctAnswer = questions[index].correctAnswer;
    validateAnswer(correctAnswer);
}
function snackbar(txt) {
    debugger;
    console.log('hello');
    let x = document.createElement('div');
    x.setAttribute('id', 'snackbar');
    x.textContent = txt;
    // Add the "show" class to DIV
    x.className = "show";

    // Append the div to the body
    document.body.appendChild(x);

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        x.className = x.className.replace("show", "");
        // Optionally, remove the div from the DOM after the animation
        setTimeout(function () {
            document.body.removeChild(x);
        }, 500); // Adjust the timing as needed
    }, 3000);
}

function hide(){
    document.getElementById(`radio3`).style.visibility = 'hidden';
    document.getElementById(`q3`).style.visibility = 'hidden';
    document.getElementById(`radio4`).style.visibility = 'hidden';
    document.getElementById(`q4`).style.visibility = 'hidden';
}
function display(){
    document.getElementById(`radio3`).style.visibility = '';
    document.getElementById(`q3`).style.visibility = '';
    document.getElementById(`radio4`).style.visibility = '';
    document.getElementById(`q4`).style.visibility = '';
}
let marks = 0;
let max = 1;

console.log(answer);

function informType(text){
    
    if (document.getElementById('snackbar_').checked){
        snackbar(text);
    }
    else alert(text)
}

function validateAnswer(correctAnswer){
    if (answer === correctAnswer){
        informType('correct answer');
        if (!blacklist.includes(index)){
            marks++;
        }
        document.getElementById('correct').textContent = `correct answers ${marks}/${questions.length}`;
    }
    else informType(`false answer.\nthe correct is: ${correctAnswer}\n`);
    blacklist.push(index);
}


function next() {
    if (max === index + 1 && answer === undefined){
        informType('Please select an answer');
        return;
    }
    let correctAnswer = questions[index].correctAnswer;
    question = document.getElementById('question');
    index++;
    question.textContent = questions[index].question;
    document.getElementById('question num').textContent = `question ${index + 1}`
    document.getElementById(`radio${radioId}`).checked = false;
    displayButton('prev');
    console.log(`max: ${max}`);
    console.log(`index: ${index}`);
    console.log(`answer: ${answer}`);
    if (index === questions.length - 1){hideButton('next')}
    setRadios();
    answer = undefined;
    document.title = `Question ${index + 1}`;
}

function hideButton(identifer){
    document.getElementById(`${identifer}`).style.visibility = 'hidden';
}

function displayButton(identifer){
    document.getElementById(`${identifer}`).style.visibility = '';
}

function previous() {
    let correctAnswer = questions[index].correctAnswer;
    question = document.getElementById('question');
    console.log(correctAnswer);
    index--;
    if (index === 0){hideButton('prev')}
    displayButton('next');
    question.textContent = questions[index].question;
    document.getElementById('question num').textContent = `question ${index + 1}`
    document.getElementById(`radio${radioId}`).checked = false;
    console.log(`max: ${max}`);
    console.log(`index: ${index}`);
    console.log(`answer: ${answer}`);
    answer = undefined;
    setRadios();
    document.title = `Question ${index + 1}`;
}

function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        const random = Math.floor(Math.random() * (i + 1));

        [array[i], array[random]] = [array[random], array[i]];
    }
}

window.onload = function() {
    let num = localStorage.getItem("fileObject");
    console.log(num);
    if (num !== null){
    fetch(num)
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        shuffle(questions);
        question = document.getElementById('question');
        question.textContent = questions[index].question;
        setRadios();
    });
    }
    else fetch(localStorage.getItem('test'))
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        shuffle(questions);
        question = document.getElementById('question');
        question.textContent = questions[index].question;
        setRadios();
    });
};

function setRadios() {
    answers = questions[index].answers;
    shuffle(answers);
    let len = answers.length;

    switch (len){
        case 2:
            hide();
            break;
        case 3:
            document.getElementById(`radio4`).style.visibility = 'hidden';
            document.getElementById(`q4`).style.visibility = 'hidden';
            document.getElementById(`radio3`).style.visibility = '';
            document.getElementById(`q3`).style.visibility = '';
            break;
        case 4:
            display();
            break;
    }

    for (let i = 0; i < len; i++) {
        document.getElementById(`q${i+1}`).innerText = answers[i];
        if (index === questions.length - 1){
            document.getElementById(`q${i+1}`).onclick = () => validateAnswer(questions[index].correctAnswer);
        }
    }
}
