import { useEffect, useState } from 'react';
import { type DirectionType } from '~/types/snake';

export type UseGameOpts = {
  allowBackwardsMove?: boolean;
};

export const useGame = ({ allowBackwardsMove = true }: UseGameOpts = {}) => {
  const [direction, setDirection] = useState<DirectionType>('none');
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const resetGame = () => {
    setDirection('none');
    setIsGameActive(false);
    setIsGameOver(false);
    setScore(0);
  };

  const gameOver = () => {
    setIsGameActive(false);
    setIsGameOver(true);
  };

  const updateScore = (newScore: number) => setScore(newScore);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      if (key === 'Enter') {
        if (!isGameOver) {
          setIsGameActive(!isGameActive);
        }
      } else {
        switch (key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            if (allowBackwardsMove) {
              setDirection('up');
            } else {
              if (direction !== 'down') {
                setDirection('up');
              }
            }
            break;
          case 's':
          case 'arrowdown':
            if (allowBackwardsMove) {
              setDirection('down');
            } else {
              if (direction !== 'up') {
                setDirection('down');
              }
            }
            break;
          case 'd':
          case 'arrowright':
            if (allowBackwardsMove) {
              setDirection('right');
            } else {
              if (direction !== 'left') {
                setDirection('right');
              }
            }
            break;
          case 'a':
          case 'arrowleft':
            if (allowBackwardsMove) {
              setDirection('left');
            } else {
              if (direction !== 'right') {
                setDirection('left');
              }
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
  }, [direction, allowBackwardsMove, isGameActive, isGameOver]);

  return {
    direction,
    score,
    isGameActive,
    isGameOver,
    gameOver,
    updateScore,
    resetGame,
  };
};
