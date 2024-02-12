"use strict";
const score = document.querySelector(".player-score");
const question = document.getElementById("question");
const questionTopic = document.getElementById("question-topic");
const optionContainer = document.getElementById("option-container");
const btn = document.getElementById("btn");
const start = document.querySelector(".start");
const contentContainer = document.querySelector(".content-container");
const optionEl = document.querySelectorAll(".option");
const resultContainer = document.querySelector(".result-container");
//////////////////////////////////////////////////////////////////////////////////
//! API---> https://opentdb.com/api.php?amount=1&category=18&difficulty=hard&type=multiple

const randomOption = function (optionArr) {
  //logic for random option
  const random = Math.round(Math.random() * optionArr.length);
  console.log(random);
  for (let i = 0; i < random; i++) {
    const last = optionArr.splice(-1, 1)[0];
    optionArr.unshift(last);
  }
  return optionArr;
};

const display = function (data) {
  console.log(data.question);
  const correctQues = data.question
    .replaceAll("&#039;s", " ")
    .replaceAll("&quot;", " ")
    .replaceAll(":", " ")
    .replaceAll("&amp;", " ")
    .replaceAll("&#039;", " ");
  question.textContent = correctQues;
  questionTopic.textContent = data.category;

  const option = [data.correct_answer, ...data.incorrect_answers];
  const newOptionArr = randomOption(option);
  optionEl.forEach((el, i) =>
    (el.textContent = newOptionArr[i]
      .replaceAll("&#039;", " ")
      .replaceAll("&quot;", " ")).replaceAll("&rsquo;s", " ")
  );
};

const fetchData = async function () {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=1&difficulty=hard&type=multiple"
    );
    const data = await response.json();
    console.log(data);
    display(data.results[0]);
    return data.results[0].correct_answer;
  } catch (err) {
    console.error(err);
  }
};

let correctAnswer;
let selectedChoice;

const gettingAnswer = async function () {
  correctAnswer = await fetchData();
};
gettingAnswer();

const gettingSelectedOption = function (selectedOption) {
  selectedChoice = selectedOption;
};

start.addEventListener("click", function () {
  contentContainer.style.display = "block";
  this.style.display = "none";
});

const nextQuestion = function () {
  //! fetchData();
  optionEl.forEach((el) => {
    el.style.backgroundColor = "#C780FA";
    el.style.color = "white";
  });
  optionContainer.addEventListener("click", chooseOption);
  gettingAnswer();
  btn.addEventListener("click", answerCheck);
};

let playerScore = 0;

const displayScore = function (playerScore) {
  score.textContent = playerScore;
};

const answerCheck = function () {
  resultContainer.innerHTML = "";
  let html;
  if (correctAnswer === selectedChoice) {
    html = `
   <div class="result"><i class="fa-sharp fa-solid fa-circle-check icon"></i> <span>Correct Answer</span></div>
   `;
    playerScore++;
    displayScore(playerScore);
    if (playerScore === 10) {
      contentContainer.innerHTML = `<h1 style="color: #C780FA;">10/10 yeah! you finally made it!</h1>`;
    }
  } else if (!selectedChoice) {
    html = `
    <div class="result"><i class="fa-solid fa-circle-question icon"></i> <span>Please select an option</span></div>
    `;
    resultContainer.insertAdjacentHTML("afterbegin", html);
    return;
  } else {
    html = `
  <div class="result"><i class="fa-sharp fa-solid fa-circle-xmark icon"></i> <span>Incorrect Answer</span></div>
  <div class="correct"><span>Correct Answeer:</span> <span class="correct-answer">${correctAnswer}</span></div>
  `;
  }
  resultContainer.insertAdjacentHTML("afterbegin", html);
  selectedChoice = "";
  nextQuestion();
};

const chooseOption = function (e) {
  const chooseEl = e.target.closest(".option");
  if (!chooseEl) return;
  chooseEl.style.backgroundColor = "rgb(241, 241, 241)";
  chooseEl.style.color = "#222";
  const selectedOption = chooseEl.textContent;

  gettingSelectedOption(selectedOption);
};

optionContainer.addEventListener("click", chooseOption);
btn.addEventListener("click", answerCheck);
