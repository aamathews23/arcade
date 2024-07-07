import { useEffect, useRef, useState } from 'react';
import { api } from '~/utils/api';
import { type CommonOpts } from '~/types/common';
import { type DirectionType } from '~/types/snake';

export interface UseGameOpts extends CommonOpts {
  allowBackwardsMove?: boolean;
}

export const useGame = (
  gameName: string,
  { allowBackwardsMove = true, user = undefined, userHighScore = 0 }: UseGameOpts = {},
) => {
  const direction = useRef<DirectionType>('none');
  const [isGameActive, setIsGameActive] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(userHighScore);
  const { mutate } = api.game.setHighScoreForUserByGameId.useMutation();

  const resetGame = () => {
    direction.current = 'none';
    setIsGameActive(true);
    setIsGameOver(false);
    setScore(0);
  };

  const gameOver = (callback?: () => void) => {
    setIsGameActive(false);
    setIsGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      if (user) {
        mutate({ gameName, userId: user.id, highScore: score });
      }
    }
    if (callback) {
      callback();
    }
  };

  const updateScore = (newScore: number) => setScore(newScore);

  const message = isGameOver
    ? 'Game over. Press Enter to play again'
    : isGameActive
      ? 'Press Enter to pause.'
      : 'Press Enter to play.';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { key } = e;
      if (key === 'Enter') {
        if (isGameOver) {
          resetGame();
        } else {
          setIsGameActive(!isGameActive);
        }
      } else {
        if (isGameActive) {
          switch (key.toLowerCase()) {
            case 'w':
            case 'arrowup':
              if (allowBackwardsMove) {
                direction.current = 'up';
              } else {
                if (direction.current !== 'down') {
                  direction.current = 'up';
                }
              }
              break;
            case 's':
            case 'arrowdown':
              if (allowBackwardsMove) {
                direction.current = 'down';
              } else {
                if (direction.current !== 'up') {
                  direction.current = 'down';
                }
              }
              break;
            case 'd':
            case 'arrowright':
              if (allowBackwardsMove) {
                direction.current = 'right';
              } else {
                if (direction.current !== 'left') {
                  direction.current = 'right';
                }
              }
              break;
            case 'a':
            case 'arrowleft':
              if (allowBackwardsMove) {
                direction.current = 'left';
              } else {
                if (direction.current !== 'right') {
                  direction.current = 'left';
                }
              }
              break;
            default:
              break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [allowBackwardsMove, isGameActive, isGameOver]);

  return {
    direction,
    score,
    highScore,
    message,
    isGameActive,
    isGameOver,
    gameOver,
    updateScore,
    resetGame,
  };
};
