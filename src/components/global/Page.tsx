import Head from 'next/head';
import { Header } from './Header';

type PageProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export const Page = ({ title, description, children }: PageProps) => (
  <>
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content={description}
      />
    </Head>
    <Header />
    <main className="m-auto flex min-h-screen max-w-[512px] flex-col items-center justify-center gap-4">
      {children}
    </main>
  </>
);
