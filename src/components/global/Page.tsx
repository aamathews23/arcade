import Head from 'next/head';

type PageProps = {
  title: string;
  description: string;
  children: React.ReactElement[];
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
    <main className="m-auto flex min-h-screen max-w-[512px] flex-col items-center justify-center gap-4">
      {children}
    </main>
  </>
);
