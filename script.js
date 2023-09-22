const domGameBoard = document.getElementById("game-board");
const resultText = document.getElementById("result-text");
const GRID_WIDTH = 3;
const GRID_HEIGHT = 3;
let gameOver = false;
setupDomBoard();


const startGameButton = document.getElementById("start-game");
startGameButton.addEventListener("click", startGame);

let playerOne = null;
let playerTwo = null;
let playerOneWins = 0;
let playerTwoWins = 0;
const playerOneWinsElem = document.getElementById("player-one-wins");
const playerTwoWinsElem = document.getElementById("player-two-wins");
playerOneWinsElem.innerText = "Total wins: " + playerOneWins;
playerTwoWinsElem.innerText = "Total wins: " + playerTwoWins;



const playerOneNameInput = document.getElementById("player-one-name");
const playerTwoNameInput = document.getElementById("player-two-name");
const playerOneAiInput = document.getElementById("player-one-ai");
const playerTwoAiInput = document.getElementById("player-two-ai");


const gameBoard = (() => {
    let cells = [[],[],[]];
    for(i=0; i<GRID_WIDTH; i++){
        for(j=0; j<GRID_HEIGHT;j++){
            cells[i].push(" ");
        }
    }
    const setCell = (x,y, value) => {
        if(cells[x][y]== " "){
            cells[x][y] = value;
            setDomSquare(x,y,value);
            return true;
        }
        return false;
    }
    const getCell = (x,y) => {
        return cells[x][y];
    }
    const clearCells = () => {
        for(i=0; i<GRID_WIDTH; i++){
            for(j=0; j<GRID_HEIGHT;j++){
                cells[i][j] = " ";
            }
        }
    }
    const availableCells = () => {
        let cellOutput = [];
        for(i=0; i<GRID_WIDTH; i++){
            for(j=0; j<GRID_HEIGHT;j++){
                if(cells[i][j] == " "){
                    let newArr = [i,j];
                    cellOutput.push(newArr);
                }
            }
        }
        return cellOutput;
    }
    return {
      setCell,
      getCell,
      clearCells,
      availableCells
    };
  })();

  const game = (() => {
    let currentPlayer = null;
    const checkForWin = () => {
        let winner = false;


        //Check columns and rows
        for(i=0; i<GRID_WIDTH; i++){
            let currentValue =  " ";
            for(j=0; j<GRID_HEIGHT;j++){
                if(j==0){
                    currentValue = gameBoard.getCell(i,j);
                    if (currentValue == " "){
                        break;
                    }
                } else{
                    if(currentValue != gameBoard.getCell(i,j)){
                        break;
                    } else{
                        if(j == GRID_HEIGHT - 1){
                            currentPlayer = null;
                            return playerWins(gameBoard.getCell(i,j));
                        }
                    }
                }
                if(gameBoard.getCell(i,j)==" "){
                    emptyCell = true;
                }
            }
        }
        for(i=0; i<GRID_WIDTH; i++){
            let currentValue =  " ";
            for(j=0; j<GRID_HEIGHT;j++){
                if(j==0){
                    currentValue = gameBoard.getCell(j,i);
                    if (currentValue == " "){
                        break;
                    }
                } else{
                    if(currentValue != gameBoard.getCell(j,i)){
                        break;
                    } else{
                        if(j == GRID_HEIGHT - 1){
                            currentPlayer = null;
                            return playerWins(gameBoard.getCell(i,j));
                        }
                    }
                }
                if(gameBoard.getCell(j,i)==" "){
                    emptyCell = true;
                }
            }
        }
        //Check diaganols
        if(gameBoard.getCell(0,0) == "X" && gameBoard.getCell(1,1) == "X" && gameBoard.getCell(2,2) == "X"){
            currentPlayer = null;
            return playerWins("X");
        }
        if(gameBoard.getCell(0,0) == "O" && gameBoard.getCell(1,1) == "O" && gameBoard.getCell(2,2) == "O"){
            currentPlayer = null;
            return playerWins("O");
        }
        if(gameBoard.getCell(0,2) == "X" && gameBoard.getCell(1,1) == "X" && gameBoard.getCell(2,0) == "X"){
            currentPlayer = null;
            return playerWins("X");
        }
        if(gameBoard.getCell(0,2) == "O" && gameBoard.getCell(1,1) == "O" && gameBoard.getCell(2,0) == "O"){
            currentPlayer = null;
            return playerWins("O");
        }


        //Check for full board 
        let emptyCell = false;
        for(i=0; i<GRID_WIDTH; i++){
            for(j=0; j<GRID_HEIGHT;j++){
                if(gameBoard.getCell(i,j)==" "){
                    emptyCell = true;
                }
            }
        }
        if(!emptyCell){
            currentPlayer = null;
            return "The game is a tie!";
        }

        return false;
    }
    const setCurrentPlayer = (playerIn) => {
        currentPlayer = playerIn;
        if(currentPlayer.ai){
            let availableCells = gameBoard.availableCells();
            if(availableCells && currentPlayer){
                let moveCellIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
                currentPlayer.makeMove(moveCellIndex[0],moveCellIndex[1]); 
            }
        } 
        return currentPlayer == playerOne ? "It is player one's turn." : "It is player two's turn.";

    }    
    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    const playerWins = (cellValue) => {
        if(!gameOver){                gameOver = true;
            if(cellValue == "X"){
                playerOneWins++;
                resultText.innerText = "Player one wins!";
            }else{
                playerTwoWins++;
                resultText.innerText = "Player two wins!";   
            }
            playerOneWinsElem.innerText = "Total wins: " + playerOneWins;
            playerTwoWinsElem.innerText = "Total wins: " + playerTwoWins;
        }
    }

    return {
        setCurrentPlayer,
        getCurrentPlayer,
        checkForWin
    };
})();


const player = (name, ai) => {
    const makeMove = (x,y) =>{
        let cellValue = gameBoard.getCell(x,y);

        if(cellValue == " "){
            let currentPlayer = game.getCurrentPlayer();
            if(currentPlayer == playerOne){
                gameBoard.setCell(x,y,"X");
                if(!game.checkForWin()){
                    let tempResult = game.setCurrentPlayer(playerTwo);
                    if(tempResult  && !gameOver){
                        resultText.innerText = tempResult;
                    }
                }
            } else{
                gameBoard.setCell(x,y,"O");
                if(!game.checkForWin()){
                    let tempResult = game.setCurrentPlayer(playerOne);
                    if(tempResult && !gameOver){
                        resultText.innerText = tempResult;
                    }
                }
            }
        }
        return false;
    }
    return {name, ai, makeMove};
};

function startGame() {
    clearBoard();
    gameOver = false;
    playerOne = player(playerOneNameInput.value, playerOneAiInput.checked);
    playerTwo = player(playerTwoNameInput.value, playerTwoAiInput.checked);
    
    let tempResult = game.setCurrentPlayer(playerOne);
    if(!gameOver){
        resultText.innerText = tempResult;
    }
    startGameButton.innerText = "Reset Game";
}


function gridClicked(event){
    let id = event.target.id;
    let x = id.charAt(0);
    let y = id.charAt(2);
    if(game.getCurrentPlayer()){
        game.getCurrentPlayer().makeMove(x,y);
    }
}


function setupDomBoard(){
    for(i=0; i<GRID_WIDTH; i++){
        for(j=0; j<GRID_HEIGHT;j++){
            let newGridDiv = document.createElement("div");
            newGridDiv.id = i+":"+j;
            newGridDiv.classList += "game-square";
            newGridDiv.innerText = " ";
            newGridDiv.addEventListener("click", gridClicked);
            domGameBoard.appendChild(newGridDiv);
        }
    }
}

function clearBoard(){
    gameBoard.clearCells();
    for(i=0; i<GRID_WIDTH; i++){
        for(j=0; j<GRID_HEIGHT;j++){
            document.getElementById(i+":"+j).innerText = " ";
        }
    }
}

function setDomSquare(x,y,value){
    let square = document.getElementById(x+":"+y);
    square.innerText = value;
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }