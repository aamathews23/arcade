import Head from 'next/head';
import { useSnake } from '~/hooks/useSnake';

/**
 * TODO: Add mechanism to save score to db when user is signed in.
 * TODO: Create generic page component for game metadata.
 * TODO: Review other react implementations.
 */

export default function Snake() {
  const { canvas, message } = useSnake();

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
        <span>{message}</span>
        <canvas
          ref={canvas}
          id="snake"
          className="border-2 border-slate-900 bg-slate-700"
          width="512"
          height="512"
        />
      </main>
    </>
  );
}
