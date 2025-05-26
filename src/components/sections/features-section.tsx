
"use client";

import type { FC, SVGProps } from 'react';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { BarChart3, DatabaseZap, Share2, ShieldCheck, Database, FolderArchive, CloudCog } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedFeatureCard from '@/components/animated-feature-card';

interface Feature {
  icon: FC<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  dataAiHint: string;
}

const features: Feature[] = [
  {
    icon: BarChart3,
    title: 'Powerful Data Visualization',
    description: 'Create stunning charts and dashboards to understand complex datasets at a glance. Interactive and customizable.',
    dataAiHint: 'data charts'
  },
  {
    icon: DatabaseZap,
    title: 'Advanced Analytics Engine',
    description: 'Leverage sophisticated algorithms and statistical models to uncover hidden patterns and trends in your data.',
    dataAiHint: 'data analytics'
  },
  {
    icon: Share2,
    title: 'Seamless Collaboration',
    description: 'Share your findings and dashboards easily with your team. Work together on data projects in real-time.',
    dataAiHint: 'collaboration team'
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Scalable',
    description: 'Built with enterprise-grade security and designed to scale with your data needs, ensuring reliability.',
    dataAiHint: 'security technology'
  },
  {
    icon: Database,
    title: 'Versatile Database Connectors',
    description: 'Seamlessly connect to a wide range of SQL and NoSQL databases. Import your data directly and keep it synchronized for up-to-date analysis.',
    dataAiHint: 'database connection'
  },
  {
    icon: FolderArchive,
    title: 'Local File System Access',
    description: 'Easily integrate with your local or networked file systems. Securely access and analyze data residing in your existing folder structures.',
    dataAiHint: 'file system folders'
  },
  {
    icon: CloudCog,
    title: 'Cloud Storage Integration',
    description: 'Connect to popular cloud storage services like AWS S3, Google Cloud Storage, and Azure Blob Storage. Analyze large datasets directly from the cloud.',
    dataAiHint: 'cloud storage data'
  },
];

const FeaturesSection: FC = () => {
  const headingContainerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

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

    const currentHeadingContainerRef = headingContainerRef.current;
    if (currentHeadingContainerRef) {
      observer.observe(currentHeadingContainerRef);
    }

    return () => {
      if (currentHeadingContainerRef) {
        observer.unobserve(currentHeadingContainerRef); 
      }
    };
  }, []); 

  return (
    <section id="features" className="py-16 md:py-24"> {/* Removed bg-background */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headingContainerRef}
          className={cn(
            "mb-16 flex flex-col md:flex-row items-center gap-8 lg:gap-12"
          )}
        >
          {/* Image Block */}
          <div
            className={cn(
              "md:w-2/5 md:order-2", 
              "transition-all duration-700 ease-out transform",
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1/4" 
            )}
            style={{ transitionDelay: isInView ? '200ms' : '0ms' }} 
          >
            <Image
              src="https://placehold.co/500x350.png"
              alt="Data analysis illustration"
              width={500}
              height={350}
              className="rounded-lg shadow-xl w-full h-auto"
              data-ai-hint="data analytics abstract"
              data-cursor-interactive="true"
            />
          </div>

          {/* Text Block */}
          <div
            className={cn(
              "md:w-3/5 text-center md:text-left md:order-1", 
              "transition-all duration-700 ease-out transform",
              isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1/4" 
            )}
            style={{ transitionDelay: isInView ? '0ms' : '0ms' }} 
          >
            <h2 
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-shimmer"
              )}
            >
              Why Choose Ventures AI?
            </h2>
            <p className="mt-4 max-w-xl mx-auto md:mx-0 text-2xl md:text-3xl lg:text-4xl text-muted-foreground">
              Empowering you with comprehensive tools to explore, analyze, and visualize your data effectively.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <AnimatedFeatureCard 
              key={index} 
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
