"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FC } from 'react';

// Helper component to render text with hoverable words
const HoverableText: FC<{ text: string, wordClassName?: string }> = ({ text, wordClassName = "" }) => {
  return (
    <>
      {text.split(' ').map((word, index) => (
        <span
          key={index}
          className={cn(
            "inline-block transition-transform duration-150 ease-out hover:scale-110 hover:-translate-y-px",
            wordClassName
          )}
          data-cursor-interactive="true"
        >
          {word}
        </span>
      )).reduce((acc, el, i, arr) => {
        // Add spaces between words, but not after the last word.
        return i < arr.length - 1 ? [...acc, el, <span key={`space-${i}`}>&nbsp;</span>] : [...acc, el];
      }, [] as React.ReactNode[])}
    </>
  );
};

const HeroSection: FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 md:pb-20">
      {/* Removed bg-background from here to allow global bubbles to show */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h1 
          className={cn(
            "text-5xl md:text-7xl font-extrabold tracking-tight transition-transform duration-300 ease-out",
            "text-shimmer" 
          )}
        >
          <HoverableText text="Transform Your Data into" />
          {' '} 
          <span className="text-primary">
            <HoverableText text="Actionable Insights" wordClassName="text-primary" />
          </span>
          {' '}
          <HoverableText text="with Ventures AI" />
        </h1>
        <p 
          className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground transition-transform duration-300 ease-out"
        >
          <HoverableText text="Harness the power of advanced analytics. Ventures AI helps you visualize, interpret, and act on your data with intuitive tools and stunning dashboards." />
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/login" passHref>
            <Button 
              asChild 
              size="lg" 
              className="font-semibold shine-button hover:scale-105 hover:-translate-y-px transition-transform duration-300 ease-out" 
              data-cursor-interactive="true"
            >
              <span>
                Start Analyzing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </Link>
          <Link href="/about-developers" passHref>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="font-semibold hover:scale-105 hover:-translate-y-px transition-transform duration-300 ease-out" 
              data-cursor-interactive="true"
            >
              <span>
                Learn More
              </span>
            </Button>
          </Link>
        </div>
        <div 
          className="mt-12 group" 
          data-cursor-interactive="true" 
          style={{ perspective: '2000px' }}
        >
          <Image
            src="https://placehold.co/800x450.png"
            alt="3D Data Analysis Website - Ventures AI"
            width={800}
            height={450}
            className="rounded-lg shadow-xl mx-auto object-cover transform-gpu transition-all duration-300 ease-out group-hover:[transform:rotateX(2deg)_rotateY(4deg)_scale(1.07)_translateZ(30px)] group-hover:shadow-[0_0_25px_3px_hsl(var(--primary)/0.3)]"
            data-ai-hint="data analysis website ventures"
            priority 
           />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
