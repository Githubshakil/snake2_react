import { useEffect, useState } from 'react';
import './App.css'
function App() {

 
 
// Constants for the game not to be changed (do this first in the code) 
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{x: 10, y: 10}];
const INITIAL_FOOD = {x: 15, y: 15};
const INITIAL_DIRECTION = "RIGHT";


// State variables for the game setup (do this second in the code) changeble variable
const [snake, setSnake] = useState(INITIAL_SNAKE);
const [food, setFood] = useState(INITIAL_FOOD);
const [direction, setDirection] = useState(INITIAL_DIRECTION);
const [score, setScore] = useState(0);
const [gameOver, setGameOver] = useState(false);
const [gamePause, setGamePause] = useState(false)


// food generation function
// This function will generate a random food position on the grid

const generateFood = () => {
  const newFood = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
  return snake.some((item)=> item.x === newFood.x && item.y === newFood.y)
    ? generateFood()
    : newFood;

}


// This function will move the snake in the current direction
// It will update the snake's position based on the direction

const moveSnake = () => {
  if (gameOver || gamePause) return;
  const head = { ...snake[0]};
  switch (direction) {
    case "UP":
      head.y -= 1;
      break;
    case "DOWN":
      head.y += 1;
      break;
    case "LEFT":
      head.x -= 1;
      break;
    case "RIGHT":
      head.x += 1;
      break;
    default:
      break;
  }


  
  // If the snake touches the border line or itself, the game is over
  if(head.x < 0 ||
     head.x >= GRID_SIZE ||
     head.y < 0 || 
     head.y >= GRID_SIZE ||
     snake.some((item) => item.x === head.x && item.y === head.y)
    ) {
    setGameOver(true);
    return;
  }

  //increae the score if the snake eats the food
  const newSnake = [head, ...snake];
  if(head.x === food.x && head.y === food.y) {
    setScore(score + 1);
    setFood(generateFood());
  }else{
    newSnake.pop();
  }
  setSnake(newSnake);
}


// This function will handle the key press events

useEffect(() => {
  const handeleKeyPress = (event) => {
    switch (event.key) {
      case "ArrowUp":
        if (direction !== "DOWN") setDirection("UP");
        break;
      case "ArrowDown":
        if (direction !== "UP") setDirection("DOWN");
        break;
      case "ArrowLeft":
        if (direction !== "RIGHT") setDirection("LEFT");
        break;
      case "ArrowRight":
        if (direction !== "LEFT") setDirection("RIGHT");
        break;
      default:
        break;
    }
  }
  window.addEventListener("keydown", handeleKeyPress);
  return () => {
    window.removeEventListener("keydown", handeleKeyPress);
  };
},[direction]);



// This function will start the game loop
useEffect(() => {
  const gameLoop = setInterval((moveSnake), 200);
  return () => {
    clearInterval(gameLoop);
  }
},[snake, direction, gameOver , gamePause]);



// This function will render the game grid

const randerGrid = () => {
  const grid = [];
  for(let i = 0; i < GRID_SIZE; i++) {
    for(let j = 0 ; j < GRID_SIZE; j++) {
      const isSnake = snake.some((item) => item.x === j && item.y === i);
      const isFood = food.x === j && food.y === i;
      grid.push(
        <div
          key={`${i}-${j}`}
          className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}
         
        ></div>
      );
    }
  }
  return grid;
}

let playAgain = () => {
  setSnake(INITIAL_SNAKE);
  setFood(INITIAL_FOOD);
  setDirection(INITIAL_DIRECTION);
  setScore(0);
  setGameOver(false);
}

//score increse speed increase
useEffect(() => {
  if (score > 0 && score === 0) {
    clearInterval(gameLoop);
    setInterval(() => {
      moveSnake();
    }, 200 - score * 10);
  }
}
, [score]);





  return (
 <>
  <div className='game-container'>
      <div className="score">Score: {score}</div>
      <div className="game-board" style={{gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`}}>
        {randerGrid()}
      </div>
      {gameOver && (
        <div className="game-over">
        <h2>Game Over</h2>
        <p>Your Score: {score}</p>
        <button onClick={playAgain}>Play Again</button>
      </div>
      )
    }

    {gamePause && (
        <div className='game-pause'>
     <button onClick={() => setGamePause(false)}>Resume</button>
    </div>
      )
    }

    <button onClick={() => setGamePause(true)}>Pause</button>
    

     </div>
 </>
  )
}

export default App
