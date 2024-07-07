import { type GetServerSideProps } from 'next';
import Link from 'next/link';
import { Page } from '~/components/global/Page';
import { getServerAuthSession } from '~/server/auth';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

export default function Home() {
  return (
    <>
      <Page
        title="Arcade"
        description="A recreation of a retro arcade, online."
      >
        <Link href="/snake">Snake</Link>
      </Page>
    </>
  );
}
