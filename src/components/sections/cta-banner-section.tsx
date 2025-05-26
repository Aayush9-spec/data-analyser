
"use client";

import type { FC } from 'react';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const CtaBannerSection: FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.1 } 
    );

    const currentSectionRef = sectionRef.current;
    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }

    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  return (
    <section id="cta" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={sectionRef}
          className={cn(
            "group transform transition-all duration-300 ease-out", // For hover effects on the border
            "p-0.5 group-hover:p-1.5 rounded-xl", // Border padding and hover spread
            "bg-gradient-to-br from-primary/70 via-accent/70 to-secondary/70", // Gradient for the border
            "bg-[length:200%_200%] group-hover:animate-gradient-flow", // Gradient flow on hover
            "shadow-xl hover:shadow-2xl", // Shadow
            // Drop-in animation
            "transition-all duration-700 ease-out",
            isInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          )}
          data-cursor-interactive="true"
        >
          <div className="bg-card text-card-foreground rounded-lg h-full w-full p-8 md:p-12 overflow-hidden flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-card-foreground text-shimmer">
                Ready to <span className="text-primary">Unleash</span> Your Data's Potential?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join Ventures AI today and turn raw data into strategic assets. Start making informed decisions backed by powerful analytics.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="font-semibold" data-cursor-interactive="true">
                  <Link href="/demo#chatbot-demo">
                    Start Your Free Trial
                    <Gift className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-semibold" data-cursor-interactive="true">
                  <Link href="/demo">
                    Request a Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div
              className="lg:w-1/2 mt-8 lg:mt-0 group/image" // Renamed inner group to avoid conflict
              style={{ perspective: '1500px' }}
            >
              <Image
                src="https://placehold.co/600x400.png"
                alt="3D Ventures AI data analysis platform"
                width={600}
                height={400}
                className="rounded-lg shadow-lg object-cover transform-gpu transition-all duration-300 ease-out group-hover/image:[transform:rotateX(-2deg)_rotateY(3deg)_scale(1.07)_translateZ(15px)]"
                data-ai-hint="Ventures AI dashboard"
                data-cursor-interactive="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBannerSection;
