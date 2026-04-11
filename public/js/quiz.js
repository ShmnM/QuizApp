
const urlParams = new URLSearchParams(window.location.search);
const numQuestions = urlParams.get("num") || 5;
const timePerQuestion = parseInt(urlParams.get("time")) || 15;

let questions = [];
let currentIndex = 0;
let timer;
let remainingTime = timePerQuestion;
let score = 0;
let answers = [];

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const choicesDiv = document.getElementById("choices");
const timerDiv = document.getElementById("timer");
const nextBtn = document.getElementById("nextBtn");

function startTimer() {
  remainingTime = timePerQuestion;
  timerDiv.textContent = `Time left: ${remainingTime}s`;
  timer = setInterval(() => {
    remainingTime--;
    timerDiv.textContent = `Time left: ${remainingTime}s`;
    if (remainingTime <= 0) {
      clearInterval(timer);
      lockAnswer(null);
    }
  }, 1000);
}

function loadQuestion() {
  if (currentIndex >= questions.length) {
    finishQuiz();
    return;
  }

  const q = questions[currentIndex];
  questionNumber.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  questionText.textContent = decodeHtml(q.question);

  const allChoices = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
  choicesDiv.innerHTML = "";

  allChoices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "list-group-item";
    btn.textContent = decodeHtml(choice);
    btn.onclick = () => lockAnswer(choice);
    choicesDiv.appendChild(btn);
  });

  nextBtn.disabled = true;
  startTimer();
}

function lockAnswer(selected) {
  clearInterval(timer);
  const q = questions[currentIndex];
  const correct = decodeHtml(q.correct_answer);
  const allButtons = choicesDiv.querySelectorAll("button");

  allButtons.forEach(btn => {
    if (btn.textContent === correct) {
      btn.classList.add("bg-success", "text-white");
    } else if (btn.textContent === selected) {
      btn.classList.add("bg-danger", "text-white");
    } else {
      btn.classList.add("bg-light");
    }
    btn.disabled = true;
  });

  if (selected === correct) {
    score++;
  }

  answers.push({
    question: decodeHtml(q.question),
    selected,
    correct,
    choices: [...q.incorrect_answers, q.correct_answer]
  });

  nextBtn.textContent = currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz";
  nextBtn.disabled = false;
}

function finishQuiz() {
  sessionStorage.setItem("quizResults", JSON.stringify({
    score,
    total: questions.length,
    answers
  }));

  fetch("/save-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, total: questions.length, category: "General" })
  })
  .then(() => {
      window.location.href = "/results.html";
  })
  .catch(err => {
      console.error("Save score error:", err);
      window.location.href = "/results.html";
  });
}

nextBtn.onclick = () => {
  if (nextBtn.textContent.includes("Finish")) {
    finishQuiz();
  } else {
    currentIndex++;
    loadQuestion();
  }
};

fetch(`https://opentdb.com/api.php?amount=${numQuestions}&type=multiple`)
  .then(res => res.json())
  .then(data => {
    questions = data.results;
    loadQuestion();
  })
  .catch(err => {
    questionText.textContent = "Error loading questions.";
    console.error(err);
  });

function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
