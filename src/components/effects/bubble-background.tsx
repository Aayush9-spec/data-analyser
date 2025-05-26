
"use client";

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname

interface Bubble {
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
}

const BubbleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname(); // Get current pathname to re-trigger effect on route change

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | undefined = undefined;

    // Determine if bubbles should be animated based on the body class
    const shouldAnimateBubbles = typeof window !== "undefined" && !document.body.classList.contains('no-bubble-background');

    if (!shouldAnimateBubbles) {
      // If not supposed to animate (e.g., on /demo), clear the canvas and stop.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return; // Exit effect, no animation setup or listeners
    }

    // Proceed with animation setup if shouldAnimateBubbles is true
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let mouse = { x: width / 2, y: height / 2 };
    let bubbles: Bubble[] = [];

    const createBubbles = () => {
      bubbles = [];
      const numBubbles = Math.min(50, Math.max(15, Math.floor((width * height) / 30000)));
      for (let i = 0; i < numBubbles; i++) {
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 8 + 4,
          dx: (Math.random() - 0.5) * 1.5,
          dy: (Math.random() - 0.5) * 1.5,
        });
      }
    };

    createBubbles();

    const animate = () => {
      if (!ctx || !canvasRef.current) { // Safety check
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      for (let b of bubbles) {
        b.x += b.dx;
        b.y += b.dy;
        if (b.x + b.r > width || b.x - b.r < 0) b.dx *= -1;
        if (b.y + b.r > height || b.y - b.r < 0) b.dy *= -1;
        let distX = b.x - mouse.x;
        let distY = b.y - mouse.y;
        let dist = Math.sqrt(distX * distX + distY * distY);
        if (dist < 100) {
          const forceDirectionX = distX / dist;
          const forceDirectionY = distY / dist;
          const maxSpeed = 3;
          const force = (1 - dist / 100) * maxSpeed;
          b.x += forceDirectionX * force;
          b.y += forceDirectionY * force;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(var(--primary), 0.15)`;
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate(); // Start the animation loop

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (canvasRef.current && ctx) {
        width = canvasRef.current.width = window.innerWidth;
        height = canvasRef.current.height = window.innerHeight;
        // Only recreate bubbles if we are still supposed to be animating for the current path
        if (!document.body.classList.contains('no-bubble-background')) {
            createBubbles();
        } else {
            ctx.clearRect(0,0,width,height); // Clear if class was added during resize
        }
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      // Ensure canvas is cleared when the effect for a specific path is cleaned up
      if(ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, [pathname]); // Key change: Re-run this entire effect when the pathname changes

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default BubbleBackground;
