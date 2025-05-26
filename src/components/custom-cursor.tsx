
"use client";
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const CustomCursor: FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Start off-screen
  const [clicked, setClicked] = useState(false);
  const [hoveringInteractive, setHoveringInteractive] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const mobileCheck = window.innerWidth < 768;
      setIsMobile(mobileCheck);
      if (!mobileCheck) {
        // Make cursor visible shortly after mount to avoid flash at 0,0
        setTimeout(() => setIsVisible(true), 100);
      }
    }
  }, []);

  useEffect(() => {
    if (!isClient || isMobile) return;

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 300); // Ripple duration
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-cursor-interactive="true"]')) {
        setHoveringInteractive(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-cursor-interactive="true"]')) {
        setHoveringInteractive(false);
      }
    };
    
    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    
    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isClient, isMobile]);

  if (!isClient || isMobile || !isVisible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[9999] pointer-events-none transition-transform duration-75 ease-out"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      {/* Outer ring */}
      <div
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-300 ease-out",
          hoveringInteractive ? "w-10 h-10 opacity-50 border-primary" : "w-8 h-8 opacity-30 border-primary",
          clicked ? "w-16 h-16 scale-150 opacity-0 border-primary/50" : "" // Enhanced click effect
        )}
      />
      {/* Inner dot */}
      <div
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-all duration-150 ease-out",
          hoveringInteractive ? "w-1.5 h-1.5" : "w-2 h-2",
           clicked ? "w-2.5 h-2.5 opacity-75" : "opacity-100" // Slightly larger inner dot on click
        )}
      />
    </div>
  );
};

export default CustomCursor;
