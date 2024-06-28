import { useEffect, useRef } from 'react';
import { type Point } from '~/types/snake';
import { useCanvas } from './useCanvas';
import { useGame } from './useGame';
import { spawnFood, move } from '~/utils/snake';

const CANVAS_SIZE = 512;
const CELL_SIZE = 16;

export const useSnake = () => {
  const { canvasRef, canvas } = useCanvas();
  const { score, highScore, direction, message, isGameActive, isGameOver, gameOver, updateScore } =
    useGame({
      allowBackwardsMove: false,
    });
  const snake = useRef<Point[]>([{ x: 0, y: 0 }]);
  const food = useRef<Point>(spawnFood(snake.current));

  useEffect(() => {
    let requestId: number;

    const cancelAnimation = () => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
    };

    const endGame = () => {
      snake.current = [{ x: 0, y: 0 }];
      food.current = spawnFood(snake.current);
    };

    const checkSnakeCollision = (snake: Point[]) => {
      const head = snake[0];
      const endBound = CANVAS_SIZE - CELL_SIZE;
      let collision = false;
      if (head) {
        if (head.x < 0 || head.x > endBound || head.y < 0 || head.y > endBound) {
          collision = true;
        }

        if (!collision) {
          for (let i = 1; i < snake.length; i++) {
            const node = snake[i];
            if (node && head.x === node.x && head.y === node.y) {
              collision = true;
              break;
            }
          }
        }
      }

      return collision;
    };

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

          for (const node of snake.current) {
            canvas.rect(node.x, node.y, CELL_SIZE, CELL_SIZE);
          }

          canvas.fillStyle = '#f8fafc';
          canvas.fill();

          if (food) {
            canvas.fillStyle = '#fca5a5';
            canvas.fillRect(food.current.x, food.current.y, CELL_SIZE, CELL_SIZE);
          }

          if (timestamp - last >= 60) {
            const head = snake.current[0];

            if (head && food) {
              if (checkSnakeCollision(snake.current)) {
                gameOver(endGame);
              } else if (head.x === food.current.x && head.y === food.current.y) {
                updateScore(score + 1);
                food.current = spawnFood(snake.current);

                const newSnake = snake.current.slice();
                const node = move(head, direction.current);
                newSnake.unshift(node);
                snake.current = newSnake;
              } else {
                const newHead = move(head, direction.current);
                const newSnake = snake.current.slice();
                newSnake.pop();
                newSnake.unshift(newHead);
                snake.current = newSnake;
              }
            }

            last = timestamp;
          }
        };

        requestId = requestAnimationFrame(draw);

        return cancelAnimation;
      }
    }
  }, [canvas, direction, food, snake, score, isGameActive, isGameOver, gameOver, updateScore]);

  return {
    canvas: canvasRef,
    score,
    highScore,
    message,
  };
};
