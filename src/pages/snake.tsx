import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import type { DirectionType, Point } from '~/types/snake';
import { move } from '~/utils/snake';

/**
 * TODO: Add logic to end game when snake reach end or hits itself.
 * TODO: Add logic to play again on game over.
 * TODO: Refactor snake game logic to hook.
 * TODO: Refactor game pause and start logic to hook.
 * TODO: Add mechanism to save score to db when user is signed in.
 * TODO: Create generic page component for game metadata.
 * TODO: Review other react implementations.
 */

const spawnFood = () => Math.floor(Math.random() * 31) * 16;

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState<DirectionType>('none');
  const [snake, setSnake] = useState<Point[]>([{ x: 0, y: 0 }]);
  const [food, setFood] = useState<Point>({ x: spawnFood(), y: spawnFood() });

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasCtx(canvasRef.current.getContext('2d'));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      if (key === ' ') {
        setIsGameActive(!isGameActive);
      } else if (isGameActive) {
        switch (key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            if (direction !== 'down') {
              setDirection('up');
            }
            break;
          case 's':
          case 'arrowdown':
            if (direction !== 'up') {
              setDirection('down');
            }
            break;
          case 'd':
          case 'arrowright':
            if (direction !== 'left') {
              setDirection('right');
            }
            break;
          case 'a':
          case 'arrowleft':
            if (direction !== 'right') {
              setDirection('left');
            }
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameActive, direction]);

  useEffect(() => {
    if (isGameActive) {
      let last = performance.now();
      let requestId: number;

      const cancelAnimation = () => {
        if (requestId) {
          cancelAnimationFrame(requestId);
        }
      };

      if (!canvasCtx) {
        return cancelAnimation;
      }

      const draw = (timestamp: number) => {
        cancelAnimation();
        requestId = requestAnimationFrame(draw);

        canvasCtx.clearRect(0, 0, 512, 512);
        canvasCtx.beginPath();
        for (const node of snake) {
          canvasCtx.rect(node.x, node.y, 16, 16);
        }
        canvasCtx.fillStyle = '#f8fafc';
        canvasCtx.fill();

        canvasCtx.fillStyle = '#fca5a5';
        canvasCtx.fillRect(food.x, food.y, 16, 16);

        if (timestamp - last >= 110) {
          const head = snake[0];

          if (head) {
            const newHead = move(head, direction);
            const newSnake = snake.slice();
            newSnake.pop();
            newSnake.unshift(newHead);
            setSnake(newSnake);
          }

          if (head && head.x === food.x && head.y === food.y) {
            setScore(score + 1);
            setFood({ x: spawnFood(), y: spawnFood() });

            const newSnake = snake.slice();
            newSnake.push({ x: head.x, y: head.y });
            setSnake(newSnake);
          }

          last = timestamp;
        }
      };

      requestId = requestAnimationFrame(draw);

      return cancelAnimation;
    }
  }, [isGameActive, direction, canvasCtx, snake, food, score]);

  return (
    <>
      <Head>
        <title>Snake</title>
        <meta
          name="description"
          content="The classic game of Snake."
        />
      </Head>
      <main className="m-auto flex min-h-screen max-w-[500px] flex-col items-center justify-center gap-4">
        <h1>Snake</h1>
        <span>{isGameActive ? `Score: ${score}` : 'Press space to play'}</span>
        <canvas
          ref={canvasRef}
          id="snake"
          className="border-2 border-slate-900 bg-slate-700"
          width="512"
          height="512"
        />
      </main>
    </>
  );
}
