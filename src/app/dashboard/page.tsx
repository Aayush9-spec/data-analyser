
"use client";
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';

const DashboardPage: FC = () => {
  const router = useRouter();
  const [authNotAvailable, setAuthNotAvailable] = useState(false);

  // Conditionally call the hook only if auth is defined.
  // If auth is undefined, provide default values that indicate a loading/error state.
  const [user, loading, authHookError] = auth ? useAuthState(auth) : [undefined, true, undefined];

  const firebaseAuthError = authHookError;

  useEffect(() => {
    if (!auth) {
      setAuthNotAvailable(true);
      console.error("DashboardPage: Firebase Auth object is not available. This usually means Firebase failed to initialize due to missing environment variables or misconfiguration. Check console logs from 'src/lib/firebase.ts' and ensure Firebase config is correct.");
      return;
    }
    if (!loading && !user && !authNotAvailable) {
      router.push('/login');
    }
  }, [user, loading, router, authNotAvailable]);

  const handleSignOut = async () => {
    if (!auth) {
      console.error("Sign out failed: Firebase Auth is not available.");
      return;
    }
    try {
      await signOut(auth);
      router.push('/');
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  if (authNotAvailable) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md text-center bg-card p-8 rounded-xl shadow-xl">
          <h1 className="text-2xl font-bold text-destructive mb-4">Authentication Service Unavailable</h1>
          <p className="text-muted-foreground mb-6">
            Firebase Authentication is not configured correctly. Please ensure all Firebase environment variables (e.g., NEXT_PUBLIC_FIREBASE_API_KEY) are set and your server has been restarted. Check the browser console for more specific errors from 'src/lib/firebase.ts'.
          </p>
          <Button onClick={() => router.push('/')} className="font-semibold">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (firebaseAuthError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-red-500">Error loading user: {firebaseAuthError.message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-8 bg-gradient-to-br from-background to-secondary/20">
      <div className="w-full max-w-2xl text-center bg-card p-8 md:p-12 rounded-xl shadow-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-6">
          Welcome to Your Dashboard!
        </h1>
        <p className="text-lg text-card-foreground mb-4">
          Hello, {user.displayName || user.email}!
        </p>
        <p className="text-muted-foreground mb-8">
          This is your personal space in Ventures AI. More features coming soon!
        </p>
        <Button
          onClick={handleSignOut}
          variant="destructive"
          size="lg"
          className="font-semibold"
          data-cursor-interactive="true"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
