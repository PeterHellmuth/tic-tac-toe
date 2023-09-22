const domGameBoard = document.getElementById("game-board");
const resultText = document.getElementById("result-text");
const GRID_WIDTH = 3;
const GRID_HEIGHT = 3;
setupDomBoard();


const startGameButton = document.getElementById("start-game");
startGameButton.addEventListener("click", startGame);

let playerOne = null;
let playerTwo = null;

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
    return {
      setCell,
      getCell
    };
  })();

  const game = (() => {
    let currentPlayer = null;
    const checkForWin = () => {

    }
    const setCurrentPlayer = (player) => {
        currentPlayer = player;
        return(currentPlayer == playerOne ? resultText.innertext = "It is player one's turn." : resultText.innertext = "It is player two's turn.");
    }    
    const getCurrentPlayer = () => {
        return currentPlayer;
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
            if(!currentPlayer.ai){
                if(currentPlayer == playerOne){
                    gameBoard.setCell(x,y,"X");
                    game.setCurrentPlayer(playerTwo);
                } else{
                    gameBoard.setCell(x,y,"O");
                    game.setCurrentPlayer(playerOne);
                }
            }
        }
    }
    return {name, ai, makeMove};
};

function startGame() {
    playerOne = player(playerOneNameInput.value, playerOneAiInput.checked);
    playerTwo = player(playerTwoNameInput.value, playerTwoAiInput.checked);
    resultText.innerText = game.setCurrentPlayer(playerOne);
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

function setDomSquare(x,y,value){
    let square = document.getElementById(x+":"+y);
    square.innerText = value;
}
