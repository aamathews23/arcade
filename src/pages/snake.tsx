import { type GetServerSideProps } from 'next';
import superjson from 'superjson';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { Cabinet } from '~/components/game/Cabinet';
import { Leaderboard } from '~/components/game/Leaderboard';
import { Page } from '~/components/global/Page';
import { useSnake } from '~/hooks/useSnake';
import { appRouter } from '~/server/api/root';
import { createInnerTRPCContext } from '~/server/api/trpc';
import { getServerAuthSession } from '~/server/auth';
import { type GamePageProps } from '~/types/common';

/**
 * TODO: Add mechanism to save score to db when user is signed in.
 */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  const serverHelpers = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session,
    }),
    transformer: superjson,
  });
  const props: GamePageProps = {
    session,
    user: undefined,
    userHighScore: 0,
  };
  if (session) {
    props.user = session.user;
    const userGame = await serverHelpers.game.getHighScoreForUserByGame.fetch({
      userId: session.user.id,
      name: 'snake',
    });
    if (userGame) {
      props.userHighScore = userGame.highScore;
    }
  }
  return {
    props,
  };
};

export default function Snake({ user, userHighScore }: GamePageProps) {
  const { canvas, score, highScore, message } = useSnake({ user, userHighScore });

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
