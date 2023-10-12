const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const cors = require("cors")

app.use(express.json());
app.use(cors());

let highScoreList = [];

const highScoreFilePath = path.join(__dirname, "data", "highscore.json");

app.get("/", (req, res) => {

    const htmlPath = path.join(__dirname, "public", "index.html");

    fs.readFile(htmlPath, 'utf-8', (error, data) => {
        if (error) {
            console.error('Fel vid läsning av HTML-fil:', error);
            return res.status(500).send('Det uppstod ett fel.');
        }


        const htmlWithHighscore = data.replace("{HIGHSCORE_DATA}", JSON.stringify(highScoreList));

        res.send(htmlWithHighscore);
    });
});

app.get("/api/highscore", (req, res) => {
    const data = fs.readFileSync("./data/highscore.json", "utf-8");
    highScoreList = JSON.parse(data);
    res.json(highScoreList);
});

app.post("/api/highscore2", (req, res) => {
    const { playerName, currentScore } = req.body;

    // Skapa ett nytt highscore-objekt med spelarens namn och poäng
    const newHighScore = {
        playerName,
        currentScore,
    };

    highScoreList.push(newHighScore);

    // Sortera highscore-listan i fallande ordning baserat på poäng
    highScoreList.sort((a, b) => b.currentScore - a.currentScore);

    // Behåll endast de fem högsta resultaten
    highScoreList = highScoreList.slice(0, 5);

    // Uppdatera JSON-filen med den nya highscore-listan
    fs.writeFile(highScoreFilePath, JSON.stringify(highScoreList, null, 2), 'utf-8', (error) => {
        if (error) {
            console.error('Fel vid skrivning av highscore.json:', error);
            res.status(500).json({ success: false, error: 'Något gick fel.' });
        } else {
            res.json({ success: true });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
