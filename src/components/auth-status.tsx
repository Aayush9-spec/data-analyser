
"use client";

import type { FC } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // auth can be undefined
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserCircle2, LogIn, UserPlus } from 'lucide-react'; // Added LogIn, UserPlus

const AuthStatus: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authAvailable, setAuthAvailable] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (!auth) {
      setIsLoading(false);
      setAuthAvailable(false);
      console.warn("AuthStatus: Firebase Auth is not available. Auth features disabled.");
      return;
    }
    setAuthAvailable(true); // Assume available if auth object exists
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    }, (error) => { // Add error callback for onAuthStateChanged
      console.error("AuthStatus: Error in onAuthStateChanged:", error);
      setIsLoading(false);
      setAuthAvailable(false); // If there's an error, auth might not be truly available/configured
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (!auth) {
      console.error("Sign out failed: Firebase Auth is not available.");
      return;
    }
    try {
      await signOut(auth);
      router.push('/'); 
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  if (!mounted) { // Avoid SSR or pre-hydration render flicker for auth state
    return <div className="h-9 w-20 animate-pulse rounded-md bg-muted"></div>; // Or some other placeholder
  }

  if (isLoading) {
    return <div className="h-9 w-20 animate-pulse rounded-md bg-muted"></div>;
  }

  // This component is also used in the mobile menu sheet.
  // We'll render slightly different UI for mobile sheet vs desktop header.
  // A prop like `isMobileSheetView` could be passed, but for now, we can infer
  // or have a simpler mobile layout if no DropdownMenu is desired.

  // For desktop view:
  if (user && authAvailable) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-cursor-interactive="true">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} />
              <AvatarFallback>
                {user.email ? user.email.charAt(0).toUpperCase() : <UserCircle2 />}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.displayName || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/dashboard')} data-cursor-interactive="true">
            Dashboard
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => router.push('/account-settings')} data-cursor-interactive="true">
            Account Settings
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} data-cursor-interactive="true">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // For mobile sheet view (or if !authAvailable on desktop):
  // Render as full-width buttons in the mobile menu.
  // Check if this component is being rendered in a context where it should be full width (e.g. inside SheetContent)
  // For simplicity, we'll render this version if no user OR if auth is not available.

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 w-full md:w-auto">
      {!authAvailable && (
        <p className="text-xs text-destructive px-2 py-1 md:hidden">Auth Unavailable</p>
      )}
      <Button 
        asChild 
        variant="ghost" 
        className="w-full justify-start text-lg font-medium md:w-auto md:text-sm md:justify-center" 
        data-cursor-interactive="true"
        disabled={!authAvailable && isLoading} // Disable if loading and auth not yet confirmed available
      >
        <Link href="/login">
          <LogIn className="mr-2 h-5 w-5 md:hidden" />
          Sign In
        </Link>
      </Button>
      <Button 
        asChild 
        className="w-full justify-start text-lg font-medium md:w-auto md:text-sm md:justify-center" 
        data-cursor-interactive="true"
        disabled={!authAvailable && isLoading}
      >
        <Link href="/signup">
          <UserPlus className="mr-2 h-5 w-5 md:hidden" />
          Sign Up
        </Link>
      </Button>
    </div>
  );
};

export default AuthStatus;
