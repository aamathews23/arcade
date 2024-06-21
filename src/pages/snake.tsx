import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

type DirectionType = 'up' | 'down' | 'left' | 'right' | 'none';
type SnakeNode = {
  x: number;
  y: number;
  direction: DirectionType;
  lastMove: number;
};
type Move = {
  direction: DirectionType;
  timestamp: number;
};

/**
 * TODO: Add logic to extend snake and prevent food from spawning on snake path.
 * TODO: Create a snake with 3 nodes to test movement. Remove snake grow logic for now. Remember that the head and a single body node should change direction each update frame. Not all nodes. All other nodes should move in same direction.
 * TODO: Update queue data structure. Each node manages its own queue?
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
  const [snakeHead, setSnakeHead] = useState<SnakeNode>({
    x: 0,
    y: 0,
    direction: 'none',
    lastMove: 0,
  });
  const [snakeBody, setSnakeBody] = useState<SnakeNode[]>([]);
  const [foodX, setFoodX] = useState(spawnFood());
  const [foodY, setFoodY] = useState(spawnFood());
  const [moveQueue, setMoveQueue] = useState<Move[]>([]);
  const [moveTimestamp, setMoveTimestamp] = useState<number>();

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasCtx(canvasRef.current.getContext('2d'));
    }
  }, []);

  useEffect(() => {
    const updateMoveQueue = (direction: DirectionType) => {
      const queue = moveQueue.slice();
      const timestamp = performance.now();
      queue.push({ direction, timestamp });
      setMoveTimestamp(timestamp);
      setMoveQueue(queue);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      if (key === ' ') {
        setIsGameActive(!isGameActive);
      } else if (isGameActive) {
        switch (key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            setDirection('up');
            updateMoveQueue('up');
            break;
          case 's':
          case 'arrowdown':
            setDirection('down');
            updateMoveQueue('down');
            break;
          case 'd':
          case 'arrowright':
            setDirection('right');
            updateMoveQueue('right');
            break;
          case 'a':
          case 'arrowleft':
            setDirection('left');
            updateMoveQueue('left');
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
  }, [isGameActive, moveQueue]);

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
        canvasCtx.rect(snakeHead.x, snakeHead.y, 16, 16);
        for (const snakeNode of snakeBody) {
          canvasCtx.rect(snakeNode.x, snakeNode.y, 16, 16);
        }
        canvasCtx.fillStyle = '#f8fafc';
        canvasCtx.fill();

        canvasCtx.fillStyle = '#fca5a5';
        canvasCtx.fillRect(foodX, foodY, 16, 16);

        if (timestamp - last >= 110) {
          // evaluate first element in moveQueue, if move has not been made update the node's direction. compare direction and moveTimestamp
          const queue = moveQueue.slice();
          const move = queue.shift();

          if (snakeHead.lastMove !== moveTimestamp) {
            switch (move?.direction) {
              case 'up':
                setSnakeHead({
                  ...snakeHead,
                  y: snakeHead.y - 16,
                  direction: move?.direction,
                  lastMove: move?.timestamp,
                });
                break;
              case 'down':
                setSnakeHead({
                  ...snakeHead,
                  y: snakeHead.y + 16,
                  direction: move?.direction,
                  lastMove: move?.timestamp,
                });
                break;
              case 'right':
                setSnakeHead({
                  ...snakeHead,
                  x: snakeHead.x + 16,
                  direction: move?.direction,
                  lastMove: move?.timestamp,
                });
                break;
              case 'left':
                setSnakeHead({
                  ...snakeHead,
                  x: snakeHead.x - 16,
                  direction: move?.direction,
                  lastMove: move?.timestamp,
                });
                break;
              default:
                break;
            }
          } else {
            switch (snakeHead.direction) {
              case 'up':
                setSnakeHead({
                  ...snakeHead,
                  y: snakeHead.y - 16,
                });
                break;
              case 'down':
                setSnakeHead({
                  ...snakeHead,
                  y: snakeHead.y + 16,
                });
                break;
              case 'right':
                setSnakeHead({
                  ...snakeHead,
                  x: snakeHead.x + 16,
                });
                break;
              case 'left':
                setSnakeHead({
                  ...snakeHead,
                  x: snakeHead.x - 16,
                });
                break;
              default:
                break;
            }
          }

          for (let snakeNodeIdx = 0; snakeNodeIdx < snakeBody.length; snakeNodeIdx++) {
            const snakeNode = snakeBody[snakeNodeIdx];
            let node: SnakeNode = {
              x: 0,
              y: 0,
              direction: 'none',
              lastMove: 0,
            };
            if (snakeNode && snakeNode.lastMove !== moveTimestamp) {
              switch (move?.direction) {
                case 'up':
                  node = {
                    ...snakeNode,
                    y: snakeNode.y - 16,
                    direction: move?.direction,
                    lastMove: move?.timestamp,
                  };
                  break;
                case 'down':
                  node = {
                    ...snakeNode,
                    y: snakeNode.y + 16,
                    direction: move?.direction,
                    lastMove: move?.timestamp,
                  };
                  break;
                case 'right':
                  node = {
                    ...snakeNode,
                    x: snakeNode.x + 16,
                    direction: move?.direction,
                    lastMove: move?.timestamp,
                  };
                  break;
                case 'left':
                  node = {
                    ...snakeNode,
                    x: snakeNode.x - 16,
                    direction: move?.direction,
                    lastMove: move?.timestamp,
                  };
                  break;
                default:
                  break;
              }
              const body = snakeBody.slice();
              body.splice(snakeNodeIdx, 1, node);
              setSnakeBody(body);
            } else {
              if (snakeNode) {
                switch (snakeNode.direction) {
                  case 'up':
                    node = {
                      ...snakeNode,
                      y: snakeNode.y - 16,
                    };
                    break;
                  case 'down':
                    node = {
                      ...snakeNode,
                      y: snakeNode.y + 16,
                    };
                    break;
                  case 'right':
                    node = {
                      ...snakeNode,
                      x: snakeNode.x + 16,
                    };
                    break;
                  case 'left':
                    node = {
                      ...snakeNode,
                      x: snakeNode.x - 16,
                    };
                    break;
                  default:
                    break;
                }
                const body = snakeBody.slice();
                body.splice(snakeNodeIdx, 1, node);
                setSnakeBody(body);
              }
            }
          }
          console.log(snakeBody);
          setMoveQueue(queue);

          if (snakeHead.x === foodX && snakeHead.y === foodY) {
            setScore(score + 1);
            setFoodX(spawnFood());
            setFoodY(spawnFood());

            if (snakeBody.length === 0) {
              setSnakeBody([
                ...snakeBody,
                {
                  x: snakeHead.x + 16,
                  y: snakeHead.y,
                  direction: snakeHead.direction,
                  lastMove: snakeHead.lastMove,
                },
              ]);
            }
          }

          last = timestamp;
        }
      };

      requestId = requestAnimationFrame(draw);

      return cancelAnimation;
    }
  }, [
    isGameActive,
    direction,
    canvasCtx,
    snakeHead,
    snakeBody,
    foodX,
    foodY,
    score,
    moveQueue,
    moveTimestamp,
  ]);

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
