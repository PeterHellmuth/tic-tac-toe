const domGameBoard = document.getElementById("game-board");
const resultText = document.getElementById("result-text");
const GRID_WIDTH = 3;
const GRID_HEIGHT = 3;
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
    return {
      setCell,
      getCell,
      clearCells
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
                            playerWins(gameBoard.getCell(i,j));
                            currentPlayer = null;
                            return true;
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
                            playerWins(gameBoard.getCell(j,i));
                            currentPlayer = null;
                            return true;
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
            playerWins("X");
            currentPlayer = null;
            return true;
        }
        if(gameBoard.getCell(0,0) == "O" && gameBoard.getCell(1,1) == "O" && gameBoard.getCell(2,2) == "O"){
            playerWins("O");
            currentPlayer = null;
            return true;
        }
        if(gameBoard.getCell(0,2) == "X" && gameBoard.getCell(1,1) == "X" && gameBoard.getCell(2,0) == "X"){
            playerWins("X");
            currentPlayer = null;
            return true;
        }
        if(gameBoard.getCell(0,2) == "O" && gameBoard.getCell(1,1) == "O" && gameBoard.getCell(2,0) == "O"){
            playerWins("O");
            currentPlayer = null;
            return true;
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
            resultText.innerText = "The game is a tie!";
            return true;
        }

        return winner;
    }
    const setCurrentPlayer = (playerIn) => {
        currentPlayer = playerIn;
        if(currentPlayer.ai){
            do {console.log("tried to move");} while (!currentPlayer.makeMove(getRandomInt(3),getRandomInt(3)));
        }
        return currentPlayer == playerOne ? "It is player one's turn." : "It is player two's turn.";
    }    
    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    const playerWins = (cellValue) => {
        if(cellValue == "X"){
            resultText.innerText = "Player one wins!";
            playerOneWins++;
        }else{
            resultText.innerText = "Player two wins!";
            playerTwoWins++;
        }

        playerOneWinsElem.innerText = "Total wins: " + playerOneWins;
        playerTwoWinsElem.innerText = "Total wins: " + playerTwoWins;
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
            //if(!currentPlayer.ai){
            if(currentPlayer == playerOne){
                gameBoard.setCell(x,y,"X");
                if(!game.checkForWin()){
                    resultText.innerText = game.setCurrentPlayer(playerTwo);
                }
            } else{
                gameBoard.setCell(x,y,"O");
                if(!game.checkForWin()){
                    resultText.innerText = game.setCurrentPlayer(playerOne);
                }
            }
            //}
            return true;
        } else{
            return false;
        }
    }
    return {name, ai, makeMove};
};

function startGame() {
    clearBoard();
    playerOne = player(playerOneNameInput.value, playerOneAiInput.checked);
    playerTwo = player(playerTwoNameInput.value, playerTwoAiInput.checked);
    resultText.innerText = game.setCurrentPlayer(playerOne);
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