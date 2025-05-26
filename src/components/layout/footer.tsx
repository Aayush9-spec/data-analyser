
import type { FC } from 'react';
import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react'; 

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-secondary-foreground py-12 
                     bg-gradient-to-r from-secondary via-primary/30 to-secondary 
                     bg-[size:200%_auto] animate-lake-effect hover:animate-paused">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div 
            className="flex flex-col items-center md:items-start" // Removed group, perspective handled by Link
            data-cursor-interactive="true" 
          >
            <Link 
              href="/" 
              className="inline-flex flex-col items-center md:items-start group transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-1 hover:[transform:rotateX(5deg)]" 
              aria-label="Ventures AI Home"
              style={{ perspective: '800px' }} // Added perspective here for the Link's transform
              data-cursor-interactive="true"
            >
              <img
                src="https://placehold.co/144x36.png" 
                alt="Ventures AI Logo"
                className="h-9 w-auto" // Same as header for consistency
              />
              {/* "DATA ANALYST" tagline removed */}
            </Link>
          </div>

          <div className="flex justify-center space-x-6">
            <Link href="#" data-cursor-interactive="true" aria-label="X (formerly Twitter)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 hover:text-primary hover:scale-110 transition-all duration-200"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link href="#" data-cursor-interactive="true" aria-label="GitHub">
              <Github className="h-6 w-6 hover:text-primary hover:scale-110 transition-all duration-200" />
            </Link>
            <Link href="#" data-cursor-interactive="true" aria-label="LinkedIn">
              <Linkedin className="h-6 w-6 hover:text-primary hover:scale-110 transition-all duration-200" />
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground text-center md:text-right">
            &copy; {currentYear} Ventures AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
