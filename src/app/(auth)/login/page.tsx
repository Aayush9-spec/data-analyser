
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Target } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authAvailable, setAuthAvailable] = useState(false);

  useEffect(() => {
    if (auth) {
      setAuthAvailable(true);
    } else {
      setError("Firebase Authentication is not available. Please ensure Firebase is configured correctly in your environment variables (e.g., .env.local) and restart the application. Check the browser console for more details from 'src/lib/firebase.ts'.");
      console.error("LoginPage: Firebase Auth object is not available from 'src/lib/firebase.ts'. This usually means Firebase failed to initialize. Check console logs from 'src/lib/firebase.ts' for specific errors (e.g., missing API keys), and ensure your Firebase environment variables (NEXT_PUBLIC_FIREBASE_API_KEY, etc.) are correctly set and your server was restarted.");
    }
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    if (!auth) {
      setError("Firebase Authentication is not available. Cannot log in.");
      setIsLoading(false);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setError("Firebase Authentication is not available. Cannot sign in with Google.");
      setIsLoading(false);
      return;
    }
    setError(null);
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="group w-full max-w-md p-0.5 rounded-xl bg-gradient-to-br from-primary/70 via-accent/70 to-secondary/70 shadow-2xl transition-all duration-300 ease-out hover:p-1.5"
      data-cursor-interactive="true"
    >
      <div className="bg-card rounded-lg h-full w-full flex flex-col">
        <CardHeader className="items-center text-center">
          <Link href="/" className="flex items-center gap-2 text-foreground mb-4" data-cursor-interactive="true">
            <Target className="h-10 w-10 text-primary" />
          </Link>
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Sign in to access your Ventures AI dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          {!authAvailable && (
            <p className="text-sm font-medium text-destructive mb-4">
              {error || "Authentication service is currently unavailable. Please try again later or contact support."}
            </p>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading || !authAvailable} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading || !authAvailable} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && !authAvailable && <p className="text-sm font-medium text-destructive">{error}</p>}
              {error && authAvailable && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full font-semibold" disabled={isLoading || !authAvailable}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-muted"></div>
            <span className="mx-4 text-xs text-muted-foreground">OR CONTINUE WITH</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>
          <Button variant="outline" className="w-full font-semibold" onClick={handleGoogleSignIn} disabled={isLoading || !authAvailable}>
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign In with Google
          </Button>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline" data-cursor-interactive="true">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </div>
    </div>
  );
};

export default LoginPage;
