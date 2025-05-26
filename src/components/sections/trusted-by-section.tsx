
"use client";

import type { FC, ReactElement } from 'react';
import { Building2 } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { useRef, useState, useEffect } from 'react';

interface Company {
  name: string;
  icon: ReactElement;
}

const placeholderCompanies: Company[] = [
  { name: "QuantumLeap AI", icon: <Building2 className="h-10 w-10 text-primary" /> },
  { name: "Nova Synthetics", icon: <Building2 className="h-10 w-10 text-primary" /> },
  { name: "Apex Data Solutions", icon: <Building2 className="h-10 w-10 text-primary" /> },
  { name: "Stellar Insights", icon: <Building2 className="h-10 w-10 text-primary" /> },
  { name: "Momentum Analytics", icon: <Building2 className="h-10 w-10 text-primary" /> },
  { name: "Evolve Systems", icon: <Building2 className="h-10 w-10 text-primary" /> },
  { name: "InfraCore Tech", icon: <Building2 className="h-10 w-10 text-primary" /> },
  { name: "Vertex Dynamics", icon: <Building2 className="h-10 w-10 text-primary" /> },
];

const TrustedBySection: FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSectionInView, setIsSectionInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsSectionInView(entry.isIntersecting);
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
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
    <section 
      id="trusted-by"
      ref={sectionRef} // Observer watches the whole section
      className={cn(
        "py-20 md:py-28 bg-background overflow-hidden" // Added overflow-hidden here for safety
      )}
    >
      <div 
        className={cn(
          "transition-all duration-700 ease-out",
          isSectionInView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center text-shimmer mb-16">
            Trusted by Leading Companies Worldwide
          </h2>
        </div>
        
        <div className="w-full overflow-hidden relative group">
          <div className="absolute inset-y-0 left-0 w-16 md:w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="flex whitespace-nowrap animate-infinite-scroll group-hover:animate-paused">
            {[...placeholderCompanies, ...placeholderCompanies].map((company, index) => (
              <div
                key={`${company.name}-${index}-outer`} 
                className={cn(
                  "group/item relative inline-block mx-6",
                  "w-56 h-48", 
                  "rounded-xl p-0.5 bg-gradient-to-br from-primary/60 via-accent/60 to-secondary/60 bg-[length:200%_200%]",
                  "transition-all duration-300 ease-out hover:scale-105 hover:p-1 hover:shadow-[0_0_20px_2px_hsl(var(--primary)/0.3)]",
                  "group-hover/item:animate-gradient-flow"
                )}
                data-cursor-interactive="true"
              >
                <div 
                  className="bg-card text-card-foreground rounded-lg h-full w-full flex flex-col items-center justify-center p-4"
                >
                  <div className="mb-3">{company.icon}</div>
                  <p className="text-base font-semibold text-card-foreground text-center">{company.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground mt-16 text-lg">
            ...and many more innovative businesses leverage Ventures AI for their data analysis needs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
