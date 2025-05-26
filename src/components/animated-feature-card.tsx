
"use client";

import type { FC } from 'react';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Feature {
  icon: FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  dataAiHint: string;
}

interface AnimatedFeatureCardProps {
  feature: Feature;
  index: number;
}

const AnimatedFeatureCard: FC<AnimatedFeatureCardProps> = ({ feature, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const isEven = index % 2 === 0;
  const initialTransform = isEven ? '-translate-x-1/2 scale-95' : 'translate-x-1/2 scale-95';
  const inViewTransform = 'translate-x-0 scale-100';

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false); // Allow animation to repeat
          }
        });
      },
      { threshold: 0.1 } 
    );

    const currentCardRef = cardRef.current;
    if (currentCardRef) {
      observer.observe(currentCardRef);
    }

    return () => {
      if (currentCardRef) {
        observer.unobserve(currentCardRef);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "group transform transition-all duration-700 ease-out hover:-translate-y-2", // Main card lift on hover
        "overflow-hidden flex flex-col",
        "bg-gradient-to-br from-primary/60 via-accent/60 to-secondary/60", 
        "bg-[length:200%_200%] group-hover:animate-gradient-flow", // For gradient flow on hover
        "p-0.5 group-hover:p-1.5 rounded-xl", 
        "hover:shadow-[0_0_25px_3px_hsl(var(--primary)/0.4)]", // Added glow effect
        isInView ? `opacity-100 ${inViewTransform}` : `opacity-0 ${initialTransform}`
      )}
      style={{
        transitionDelay: isInView ? `${index * 150}ms` : '0ms', 
        perspective: '1000px'
      }}
      data-cursor-interactive="true"
    >
      {/* Inner container for actual card content */}
      <div className="bg-card text-card-foreground rounded-lg h-full w-full flex flex-col flex-grow">
        <div className="relative transform transition-all duration-300 ease-out group-hover:[transform:rotateX(2deg)_rotateY(-3deg)_scale(1.08)] flex flex-col flex-grow">
          <CardHeader className="items-center text-center">
            <div className="p-5 bg-primary/10 rounded-full mb-4 transition-colors duration-300 group-hover:bg-primary/20">
              <feature.icon className="h-12 w-12 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <CardTitle className="text-2xl font-semibold">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center flex-grow">
            <CardDescription className="text-base text-muted-foreground">{feature.description}</CardDescription>
          </CardContent>
          <div className="px-6 pb-6 mt-auto">
            <Image
              src={`https://placehold.co/350x210.png`}
              alt={`${feature.title} illustration`}
              width={350}
              height={210}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              data-ai-hint={feature.dataAiHint}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedFeatureCard;
