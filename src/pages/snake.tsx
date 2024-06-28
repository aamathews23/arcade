import { Cabinet } from '~/components/game/Cabinet';
import { Leaderboard } from '~/components/game/Leaderboard';
import { Page } from '~/components/global/Page';
import { useSnake } from '~/hooks/useSnake';

/**
 * TODO: Add mechanism to save score to db when user is signed in.
 */

export default function Snake() {
  const { canvas, score, highScore, message } = useSnake();

  return (
    <Page
      title="Snake"
      description="The classic game of Snake."
    >
      <Cabinet
        title="Snake"
        canvas={canvas}
        score={score}
        highScore={highScore}
        message={message}
      />
      <Leaderboard />
    </Page>
  );
}
