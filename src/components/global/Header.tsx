import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button, type ButtonVariant } from '~/components/ui/Button';

export const Header = () => {
  const { data: sessionData } = useSession();
  const buttonType: ButtonVariant = sessionData ? 'secondary' : 'default';
  const buttonText = sessionData ? 'Sign out' : 'Sign in';
  const handleSignInOutClick = () => {
    if (sessionData) {
      void signOut();
    } else {
      void signIn();
    }
  };
  return (
    <header className="flex flex-row items-center justify-between px-8 py-4">
      <Link
        className="text-xl font-extrabold"
        href="/"
      >
        Aaron{"'"}s Arcade
      </Link>
      <div className="flex flex-row items-center gap-8">
        {sessionData && <p>Welcome, {sessionData.user.name}</p>}
        <Button
          variant={buttonType}
          onClick={handleSignInOutClick}
        >
          {buttonText}
        </Button>
      </div>
    </header>
  );
};
