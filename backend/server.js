const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const cors = require("cors")

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(cors());

var crodOp ={
    origin: '*',
    methods: "GET,PATCH,POST",
    optionSuccesStatus: 200
}


let highScoreList = [];

const highScoreFilePath = path.join(__dirname, "data", "highscore.json");


app.get("/api/highscore", cors(crodOp),(req, res) => {
    console.warn("INSIDE!!!");
    const data = fs.readFileSync("./data/highscore.json", "utf-8");
    highScoreList = JSON.parse(data);
    console.log(highScoreList);
    res.json(highScoreList);
});

app.post("/api/highscore2", cors(crodOp),(req, res) => {
    const { playerName, currentScore } = req.body;

    const newHighScore = {
        playerName,
        currentScore,
    };

    highScoreList.push(newHighScore);

    highScoreList.sort((a, b) => b.currentScore - a.currentScore);


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
