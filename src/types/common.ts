import type { Session, DefaultSession } from 'next-auth';

export interface CommonOpts {
  user?: DefaultSession['user'] & {
    id: string;
  };
  userHighScore?: number;
}

export interface GamePageProps extends CommonOpts {
  session?: Session | null;
}
