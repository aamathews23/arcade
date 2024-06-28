import { useEffect, useState } from 'react';
import { type Point } from '~/types/snake';
import { useCanvas } from './useCanvas';
import { useGame } from './useGame';
import { spawnFood, move } from '~/utils/snake';

const CANVAS_SIZE = 512;
const CELL_SIZE = 16;

export const useSnake = () => {
  const { canvasRef, canvas } = useCanvas();
  const { score, direction, isGameActive, isGameOver, gameOver, updateScore, resetGame } = useGame({
    allowBackwardsMove: false,
  });
  const [snake, setSnake] = useState<Point[]>([{ x: 0, y: 0 }]);
  const [food, setFood] = useState<Point>(spawnFood(snake));

  useEffect(() => {
    let requestId: number;

    const cancelAnimation = () => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
    };
    if (isGameOver) {
      cancelAnimation();
      setSnake([{ x: 0, y: 0 }]);
      setFood(spawnFood(snake));
      resetGame();
    }
    if (isGameActive) {
      let last = performance.now();

      if (!canvas) {
        cancelAnimation();
      } else {
        const draw = (timestamp: number) => {
          cancelAnimation();
          requestId = requestAnimationFrame(draw);

          canvas.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
          canvas.beginPath();
          for (const node of snake) {
            canvas.rect(node.x, node.y, CELL_SIZE, CELL_SIZE);
          }
          canvas.fillStyle = '#f8fafc';
          canvas.fill();

          if (food) {
            canvas.fillStyle = '#fca5a5';
            canvas.fillRect(food.x, food.y, CELL_SIZE, CELL_SIZE);
          }

          if (timestamp - last >= 60) {
            const head = snake[0];

            if (head && food) {
              const newHead = move(head, direction);
              const newSnake = snake.slice();
              newSnake.pop();
              newSnake.unshift(newHead);
              setSnake(newSnake);
              const endBound = CANVAS_SIZE - CELL_SIZE;
              if (head.x < 0 || head.x > endBound || head.y < 0 || head.y > endBound) {
                gameOver();
              }

              for (let i = 1; i < snake.length; i++) {
                const node = snake[i];
                if (node && head.x === node.x && head.y === node.y) {
                  gameOver();
                  break;
                }
              }

              if (head.x === food.x && head.y === food.y) {
                updateScore(score + 1);
                setFood(spawnFood(snake));

                const newSnake = snake.slice();
                const node = move(head, direction);
                newSnake.unshift(node);
                setSnake(newSnake);
              }
            }

            last = timestamp;
          }
        };

        requestId = requestAnimationFrame(draw);

        return cancelAnimation;
      }
    }
  }, [
    canvas,
    direction,
    food,
    snake,
    score,
    isGameActive,
    isGameOver,
    gameOver,
    updateScore,
    resetGame,
  ]);

  const message = isGameActive
    ? `Score: ${score}`
    : isGameOver
      ? 'Game over. Press Enter to play again.'
      : 'Press Enter to play.';

  return {
    canvas: canvasRef,
    message,
  };
};
