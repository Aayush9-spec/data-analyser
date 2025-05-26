
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';

export default function DemoLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add('no-footer');
    document.body.classList.add('no-bubble-background'); // Add class to hide bubbles
    // Cleanup function to remove the classes when the component unmounts
    return () => {
      document.body.classList.remove('no-footer');
      document.body.classList.remove('no-bubble-background'); // Remove class
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  return <>{children}</>;
}
