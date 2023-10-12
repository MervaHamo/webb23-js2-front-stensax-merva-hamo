

const nameInputLabel = document.getElementById("name-label");
const highScoreList = document.getElementById("highScoreList"); 
const startButton = document.getElementById("startButton");
const playerName = document.getElementById("playerName");
const gameContainer = document.getElementById("game");
const scissorsButton = document.getElementById("scissorsButton");
const paperButton = document.getElementById("paperButton");
const resultText = document.getElementById("resultText");
const resultContainer = document.getElementById("result");
const playerScore = document.getElementById("playerScore");
const rockButton = document.getElementById("rockButton");
const nameForm = document.getElementById("nameForm");
const restartButton = document.getElementById("restartButton");
const computerChoiceElement = document.getElementById("computerChoice");
const playerChoiceElement = document.getElementById("playerChoice");


// Spelvariabler
let playerNameText = ""; // För att spara spelarens namn
let playerPoints = 0;                    
let computerPoints = 0;                                                                                 
let consecutiveWins = 0; 
let highScoreData = 5;
let highScores = [];


// Funktion för att visa spelet           
function showGameScreen() {
    playerName.style.display = "none";
    nameInputLabel.style.display = "none";
    startButton.style.display = "none";
    gameContainer.style.display = "block";
    resultContainer.style.display = "none";
    restartButton.style.display = "none";
    playerName.textContent = playerNameText; // Uppdatera spelarens namn
    playerScore.textContent = playerPoints; // Uppdatera spelarens poäng
}

// Funktion för att visa resultatet efter varje spelrunda
function showResultScreen(result) {
    resultText.textContent = result;
    resultContainer.style.display = "block";
}

// Funktion för att uppdatera poängen för användaren
function updateScores() {
    playerName.textContent = playerNameText; // Uppdatera spelarens namn
    playerScore.textContent = playerPoints; // Uppdatera spelarens poäng
}

// Funktion för att generera ett slumpmässigt val för datorn
function getRandomChoice() {
    const choices = ["rock", "scissors", "paper"];
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Funktion för att spela en omgång
function playRound(playerChoice) {
    const computerChoice = getRandomChoice();

    let result;
    if (playerChoice === computerChoice) {
        result = "Oavgjort! 👀";
        consecutiveWins = 0; 
    } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "scissors" && computerChoice === "paper") ||
        (playerChoice === "paper" && computerChoice === "rock")
    ) {
        result = "The winner is you!";
        playerPoints++;
        highScores.push({ playerName: playerNameText, currentScore: playerPoints });
        highScores.sort((a, b) => b.currentScore - a.currentScore);
        highScores = highScores.slice(0, 5);
        consecutiveWins++;
    } else {
        result = "The winner is the computer!";
        result = "The winner is the computer!";
    computerPoints++;
    consecutiveWins = 0; // Återställ antal vinster i rad vid förlust
    playerPoints = 0;   // Återställ spelarens poäng vid förlust
    }

    updateScores();
    showResultScreen(result);

    if (consecutiveWins >= 3) {
        let finalResult = "Congratulations! You win the game! 🎉";
        showResultScreen(finalResult);
        rockButton.disabled = true;
        scissorsButton.disabled = true;
        paperButton.disabled = true;
        restartButton.style.display = "block";
        computerChoiceElement.style.display = "none";
        playerChoiceElement.style.display = "none";

        // Spara high score-data när spelet är över
        const highScoreData = { playerName: playerNameText, currentScore: playerPoints };
        saveHighScore(highScoreData, function () {
            initializeHighScoreList();
        });
    } else {
        playerChoiceElement.textContent = `Spelare: ${playerChoice}`;
        computerChoiceElement.textContent = `Dator: ${computerChoice}`;
        playerChoiceElement.style.display = "block";
        computerChoiceElement.style.display = "block";
    }
}

// Funktion för att starta om spelet
function restartGame() {
    playerPoints = 0;
    computerPoints = 0;
    consecutiveWins = 0; // Återställ antal vinster i rad
    updateScores();
    restartButton.style.display = "none";
    rockButton.disabled = false;
    scissorsButton.disabled = false;
    paperButton.disabled = false;
    showGameScreen();
    initializeHighScoreList(); 
}

// Lyssna på formuläret för att starta spelet
nameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    playerNameText = playerName.value; // Spara spelarens namn

    highScoreData = { playerName: playerNameText, currentScore: playerPoints };

    if (playerNameText) {
        showGameScreen();
    }
});

// Lyssna på val av sten
rockButton.addEventListener("click", function () {
    playRound("rock");
});

// Lyssna på val av sax
scissorsButton.addEventListener("click", function () {
    playRound("scissors");
});

// Lyssna på val av påse
paperButton.addEventListener("click", function () {
    playRound("paper");
});

// Lyssna på starta om-knappen
restartButton.addEventListener("click", function () {
    restartGame();
});

// Function for updating and displaying high scores
function updateAndDisplayHighScores(data) {
    const highScoreList = document.getElementById("highScoreList");
    highScoreList.innerHTML = ""; // Clear the list first

    data.forEach((score) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${score.playerName}: ${score.currentScore}`;
        highScoreList.appendChild(listItem);
    });
}

// Function to initialize and load high scores
function initializeHighScoreList() {
    fetch("/api/highscore")
        .then((response) => response.json())
        .then((data) => {
            updateAndDisplayHighScores(data); // Update and display high scores
        })
        .catch((error) => {
            console.error("Error fetching high score data:", error); // Log the error
        });
}


// Anropa funktionen när sidan laddas
document.addEventListener("DOMContentLoaded", function () {
    initializeHighScoreList();
});


// Lyssna på formuläret för att starta spelet
nameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    name = playerName.value;
    if (name) {
        // Uppdatera gränssnittet med spelarens namn
        const playerNameDisplay = document.getElementById("playerNameDisplay");
        playerNameDisplay.textContent = name;
        showGameScreen();
    }
});


function saveHighScore(highScoreData, callback) {
    fetch("http://localhost:3000/api/highscore2", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(highScoreData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Svar från server:", data);
            if (typeof callback === "function") {
                callback();
            }
        })
        .catch((error) => {
            console.error("Fel vid sändning av data:", error);
        });
}


highScoreData = { playerName: playerNameText, currentScore: playerPoints };    
saveHighScore(highScoreData, initializeHighScoreList);


// Ladda high score-listan vid sidans laddning
document.addEventListener("DOMContentLoaded", function () {
    initializeHighScoreList();
});


