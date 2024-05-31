let answer;
let questionsArray;
let lastChecked = null;
let questions;
let answers;
var question;
let index = 0;
let radioId;

function setAnswer(num) {
    radioId = num;
    num--;
    answer = answers[num];
}

function hide(){
    document.getElementById(`radio3`).style.visibility = 'hidden';
    document.getElementById(`radio4`).style.visibility = 'hidden';
    document.getElementById(`q3`).style.visibility = 'hidden';
    document.getElementById(`q4`).style.visibility = 'hidden';
}
function display(){
    document.getElementById(`radio3`).style.visibility = '';
    document.getElementById(`radio4`).style.visibility = '';
    document.getElementById(`q3`).style.visibility = '';
    document.getElementById(`q4`).style.visibility = '';
}
let marks = 1;

function next() {
    let correctAnswer = questions[index].correctAnswer;
    question = document.getElementById('question');
    console.log(correctAnswer);
    index++;
    question.textContent = questions[index].question;
    document.getElementById('question num').textContent = `question ${index + 1}`
    document.getElementById(`radio${radioId}`).checked = false;
    if (answer === correctAnswer){
        alert('correct answer');
        document.getElementById('correct').textContent = `correct answers ${marks}/${questions.length}`;
        marks++;
    }
    else alert(`false answer.\nthe correct is: ${correctAnswer}`);
    setRadios();
}

function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        const random = Math.floor(Math.random() * (i + 1));

        [array[i], array[random]] = [array[random], array[i]];
    }
}

window.onload = function() {
    let num = localStorage.getItem("lecNum");
    fetch(`lec${num}.json`)
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
    let len = answers.length;
    if (len == 2){hide();}
    else display();
    for (let i = 0; i < len; i++) {document.getElementById(`q${i+1}`).innerText = answers[i];}
}
