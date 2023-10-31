

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
    let cpuChoice=choices[randomIndex];
    document.getElementById("cpuHistory").innerHTML=cpuChoice
    console.log(cpuChoice);
    return cpuChoice
}

// Funktion för att spela en omgång
// Lägg till en flagga för att indikera om spelet är över
let isGameOver = false;


function playRound(playerChoice) {
    document.getElementById("playerHistory").innerHTML=playerChoice

    if (isGameOver) {
        return;
    }

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
    
        // Uppdatera poängen
        updateScores();
    
        if (consecutiveWins >= 3) {
            let finalResult = "Congratulations! You win the game! 🎉";
            showResultScreen(finalResult);
            rockButton.disabled = true;
            scissorsButton.disabled = true;
            paperButton.disabled = true;
            
            computerChoiceElement.style.display = "block";
            playerChoiceElement.style.display = "block";
    
            // Spara high score-data när spelet är över
            const highScoreData = { playerName: playerNameText, currentScore: playerPoints };
            saveHighScore(highScoreData, function () {
                initializeHighScoreList();
            });


    
            // Markera att spelet är över
            isGameOver = true;
        }
        
    } else {
        result = "The winner is the computer!";
        computerPoints++;
        consecutiveWins = 0;
        playerPoints = 0;
    
        // Markera att spelet är över när datorn vinner
        isGameOver = true;
    
    
        // Uppdatera poängen
        updateScores();
        showResultScreen(result);
    }
    
    

    if (consecutiveWins >= 5) {
        let finalResult = "Congratulations! You win the game! 🎉";
        showResultScreen(finalResult);
        rockButton.disabled = true;
        scissorsButton.disabled = true;
        paperButton.disabled = true;;
        computerChoiceElement.style.display = "none";
        playerChoiceElement.style.display = "none";
        
        // Spara high score-data när spelet är över
        const highScoreData = { playerName: playerNameText, currentScore: playerPoints };
        saveHighScore(highScoreData, function () {
            initializeHighScoreList();
        });
    } else {

        playerChoiceElement.style.display = "block";
        computerChoiceElement.style.display = "block";
    }
}

function restartGame() {
    playerPoints = 0;
    computerPoints = 0;
    consecutiveWins = 0;
    
    // Återställ eventuell flagga för att markera att spelet är över
    isGameOver = false;

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

nextRoundButton.addEventListener("click", function () {
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
async function initializeHighScoreList() {
    console.log("hejsan");
    await fetch("http://localhost:3005/api/highscore",{method: "GET"})
        .then( async (response) => await response.json() )
        .then((data) => {
            console.log(data)
            updateAndDisplayHighScores(data); // Update and display high scores
        })
        .catch((error) => {
            console.log("error Merva")

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
    fetch("http://localhost:3005/api/highscore2", {
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
//saveHighScore(highScoreData, initializeHighScoreList);


// Ladda high score-listan vid sidans laddning
document.addEventListener("DOMContentLoaded", function () {
    initializeHighScoreList();
});


