import { useState, useEffect } from "react";
import '../../css/Game.css'


function Game() {

  const GameState = {
    playerXWins: 0,
    playerOWins: 1,
    draw: 2,
    inProgress: 3,
  };

  const gameOverSound = new Audio("/voice/game_over.wav");
  const clickSound = new Audio("/voice/click.wav");
  gameOverSound.volume = 0.2;
  clickSound.volume = 0.5;


  const PLAYER_X = "X";
  const PLAYER_O = "O";

  const winningCombinations = [
    { combo: [0, 1, 2], strikeClass: "strike-row-1" },
    { combo: [3, 4, 5], strikeClass: "strike-row-2" },
    { combo: [6, 7, 8], strikeClass: "strike-row-3" },

    { combo: [0, 3, 6], strikeClass: "strike-column-1" },
    { combo: [1, 4, 7], strikeClass: "strike-column-2" },
    { combo: [2, 5, 8], strikeClass: "strike-column-3" },

    { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
    { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
  ];

  function checkWinner(tiles: any, setStrikeClass: any, setGameState: any) {


  }




  const [tiles, setTiles] = useState<any>(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState<any>(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState<any>();
  const [gameState, setGameState] = useState<any>(GameState.inProgress);

  const handleTileClick = (index: number) => {
    if (gameState !== GameState.inProgress) {
      return;
    }

    if (tiles[index] !== null) {
      return;
    }

    const newTiles = [...tiles];
    newTiles[index] = playerTurn;
    setTiles(newTiles);
    if (playerTurn === PLAYER_X) {
      setPlayerTurn(PLAYER_O);
    } else {
      setPlayerTurn(PLAYER_X);
    }
  };

  const handleReset = () => {
    setGameState(GameState.inProgress);
    setTiles(Array(9).fill(null));
    setPlayerTurn(PLAYER_X);
    setStrikeClass(null);
  };

  useEffect(() => {
    for (const { combo, strikeClass } of winningCombinations) {
      const tileValue1 = tiles[combo[0]];
      const tileValue2 = tiles[combo[1]];
      const tileValue3 = tiles[combo[2]];

      if (tileValue1 && tileValue1 === tileValue2 && tileValue1 === tileValue3) {
        setStrikeClass(strikeClass);
        if (tileValue1 === PLAYER_X) {
          setGameState(GameState.playerXWins);
        } else {
          setGameState(GameState.playerOWins);
        }
        return;
      }
    }

    const areAllTilesFilledIn = tiles.every((tile: any) => tile !== null);

    if (areAllTilesFilledIn) { setGameState(GameState.draw); }
  }, [tiles]);

  useEffect(() => {
    if (tiles.some((tile: any) => tile !== null)) {
      clickSound.play();
    }
  }, [tiles]);

  useEffect(() => {
    if (gameState !== GameState.inProgress) {
      gameOverSound.play();
    }
  }, [gameState]);

  const tileClassNames = [
    { index: 0, className: "right-border bottom-border" },
    { index: 1, className: "right-border bottom-border" },
    { index: 2, className: "bottom-border" },
    { index: 3, className: "right-border bottom-border" },
    { index: 4, className: "right-border bottom-border" },
    { index: 5, className: "bottom-border" },
    { index: 6, className: "right-border" },
    { index: 7, className: "right-border" },
    { index: 8, className: "" }
  ];


  return (
    <div className="GameBody">
      <div>
        <h1 className="text-xl font-bold text-center mb-6">Tic Tac Toe</h1>

        <div className="game_board">
          {tileClassNames.map(({ index, className }) => (
            <Tile
              key={index}
              playerTurn={playerTurn}
              onClick={() => handleTileClick(index)}
              value={tiles[index]}
              className={className}
            />
          ))}
          <div className={`strike ${strikeClass}`} />
        </div>


        {gameState === GameState.playerOWins && <div className="game-over">O Wins</div>}
        {gameState === GameState.playerXWins && <div className="game-over">X Wins</div>}
        {gameState === GameState.draw && <div className="game-over">Draw</div>}
        {gameState !== GameState.inProgress && <button onClick={handleReset} className="reset-button"> Play Again </button>}

      </div>
    </div>
  )
}

export default Game






function Tile({ className, value, onClick, playerTurn }: any) {
  let hoverClass = null;
  if (value == null && playerTurn != null) { hoverClass = `${playerTurn.toLowerCase()}-hover` }
  return (
    <div onClick={onClick} className={`tile ${className} ${hoverClass}`}>
      {value}
    </div>
  );
}