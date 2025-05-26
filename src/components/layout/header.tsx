
"use client";
import type { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Sun, Moon, Palette, Laptop, Check } from 'lucide-react'; // Removed Target as it's no longer used in logo
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AuthStatus from '@/components/auth-status';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
  { href: '/#cta', label: 'Get Started' },
];

type Theme = 'light' | 'dark' | 'ocean-blue' | 'system';

interface ThemeOption {
  name: string;
  value: Theme;
  icon: FC<React.SVGProps<SVGSVGElement>>;
}

const themeOptions: ThemeOption[] = [
  { name: 'Teal', value: 'light', icon: Sun },
  { name: 'Dark', value: 'dark', icon: Moon },
  { name: 'Ocean Blue', value: 'ocean-blue', icon: Palette },
  { name: 'System', value: 'system', icon: Laptop },
];

const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && themeOptions.some(t => t.value === savedTheme)) {
      setCurrentTheme(savedTheme);
    } else {
      setCurrentTheme('system');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;

    // Remove all theme classes before applying the new one
    themeOptions.forEach(theme => {
      if (theme.value !== 'light' && theme.value !== 'system') { 
         root.classList.remove(theme.value === 'dark' ? 'dark' : `theme-${theme.value}`);
      }
    });
     root.classList.remove('dark'); 
     root.classList.remove('theme-ocean-blue');


    let activeTheme = currentTheme;
    if (currentTheme === 'system' && typeof window !== 'undefined') {
      activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (activeTheme === 'dark') {
      root.classList.add('dark');
    } else if (activeTheme === 'ocean-blue') {
      root.classList.add('theme-ocean-blue');
    }
    

    localStorage.setItem('theme', currentTheme);
  }, [currentTheme, mounted]);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const LogoComponent: FC<{isMobileSheet?: boolean}> = ({isMobileSheet}) => (
    <Link
        href="/"
        className={cn(
            "inline-flex flex-col group", // Children (image) will be centered by default due to items-center
            isMobileSheet ? "items-start" : "items-center", // Align content for mobile sheet vs desktop
            !isMobileSheet && "transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-0.5 hover:[transform:rotateX(5deg)]"
        )}
        data-cursor-interactive="true"
        aria-label="Ventures AI Home"
        onClick={() => isMobileSheet && setIsMobileMenuOpen(false)}
        style={{ perspective: isMobileSheet ? undefined : '800px' }}
    >
      <img
        src="https://placehold.co/144x36.png" 
        alt="Ventures AI Logo"
        className="h-9 w-auto" // Height 36px, width auto
      />
      {/* "DATA ANALYST" tagline removed */}
    </Link>
  );

  const ThemeSelector: FC<{ isMobile?: boolean }> = ({ isMobile }) => {
    if (!mounted) {
      return <div style={{ width: isMobile ? '100%' : '40px', height: '40px' }} className="animate-pulse bg-muted rounded-md" />;
    }

    let displayThemeValue: Theme = currentTheme;
    if (currentTheme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      displayThemeValue = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else if (currentTheme === 'system') {
      displayThemeValue = 'light'; 
    }


    const ActiveIcon = themeOptions.find(t => t.value === displayThemeValue)?.icon || Sun;


    if (isMobile) {
      return (
        <div className="space-y-1 pt-4 border-t border-border">
           <p className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Theme</p>
          {themeOptions.map(theme => (
            <SheetClose asChild key={theme.value}>
              <Button
                variant={currentTheme === theme.value ? "secondary" : "ghost"}
                className="w-full justify-start text-lg font-medium"
                onClick={() => setCurrentTheme(theme.value)}
                data-cursor-interactive="true"
              >
                <theme.icon className="mr-2 h-5 w-5" />
                {theme.name}
                {currentTheme === theme.value && <Check className="ml-auto h-5 w-5" />}
              </Button>
            </SheetClose>
          ))}
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" data-cursor-interactive="true" aria-label="Select theme">
             <ActiveIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {themeOptions.map(theme => (
            <DropdownMenuItem key={theme.value} onClick={() => setCurrentTheme(theme.value)} data-cursor-interactive="true">
              <theme.icon className="mr-2 h-4 w-4" />
              <span>{theme.name}</span>
              {currentTheme === theme.value && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };


  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-md" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <LogoComponent />

          <nav className="hidden md:flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2"
                data-cursor-interactive="true"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-1 ml-4">
              <ThemeSelector />
              <AuthStatus />
            </div>
          </nav>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeSelector />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-cursor-interactive="true">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs bg-background p-6 flex flex-col">
                <div className="pb-6">
                  <SheetClose asChild>
                     <LogoComponent isMobileSheet={true} />
                  </SheetClose>
                </div>

                <nav className="flex flex-col space-y-3 mb-6">
                  {navLinks.map((link) => (
                     <SheetClose asChild key={link.label}>
                        <Link
                          href={link.href}
                          className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                          data-cursor-interactive="true"
                        >
                          {link.label}
                        </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-auto space-y-4">
                  <AuthStatus />
                  <ThemeSelector isMobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
