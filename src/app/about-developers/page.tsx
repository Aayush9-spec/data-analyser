
import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Meet Our Team - Ventures AI',
  description: 'Learn about the talented developers behind Ventures AI.',
};

interface Developer {
  id: number;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  avatarFallback: string;
  avatarIcon?: JSX.Element;
  githubUrl?: string;
  linkedinUrl?: string;
  xUrl?: string;
}

const developers: Developer[] = [
  {
    id: 1,
    name: 'Aayush Singh',
    role: 'Lead Frontend Developer',
    bio: 'Aayush is passionate about creating intuitive and beautiful user interfaces. He has 7 years of experience in web technologies.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'UI/UX Design'],
    avatarFallback: 'AS',
    githubUrl: '#',
    linkedinUrl: '#',
    xUrl: '#',
  },
  {
    id: 2,
    name: 'Shreyansh Singh',
    role: 'Backend Architect',
    bio: 'Shreyansh specializes in building scalable and robust backend systems. He loves tackling complex data challenges.',
    skills: ['Node.js', 'Python', 'Databases', 'API Design', 'Cloud Architecture'],
    avatarFallback: 'SS',
    githubUrl: '#',
    linkedinUrl: '#',
    xUrl: '#',
  },
  {
    id: 3,
    name: 'Amitesh Shukla',
    role: 'UI/UX Specialist',
    bio: 'Amitesh focuses on user-centered design, ensuring every interaction is meaningful and enjoyable. He has a keen eye for detail.',
    skills: ['Figma', 'User Research', 'Prototyping', 'Accessibility', 'Wireframing'],
    avatarFallback: 'AS',
    githubUrl: '#',
    linkedinUrl: '#',
    xUrl: '#',
  },
  {
    id: 4,
    name: 'Arpit T.',
    role: 'AI & Machine Learning Engineer',
    bio: 'Arpit drives innovation by integrating cutting-edge AI models into practical applications. He is an expert in Genkit.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Genkit', 'NLP', 'Computer Vision'],
    avatarFallback: 'AT',
    githubUrl: '#',
    linkedinUrl: '#',
    xUrl: '#',
  },
];

export default function AboutDevelopersPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Meet Our Talented Team
        </h1>
        <p className="mt-4 text-xl text-muted-foreground lg:text-2xl">
          The innovative minds driving Ventures AI forward.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {developers.map((dev) => (
          <div 
            key={dev.id}
            className={cn(
              "group p-0.5 rounded-xl transition-all duration-300 ease-out hover:scale-105 hover:p-1.5",
              "bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700",
              "bg-[length:200%_200%] hover:animate-gradient-flow",
              "hover:shadow-[0_0_25px_3px_rgba(168,85,247,0.4)]" // Purple glow
            )}
            data-cursor-interactive="true"
          >
            <div className="bg-card text-card-foreground rounded-lg h-full w-full p-6 flex flex-col text-center shadow-lg">
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-muted flex items-center justify-center text-primary">
                {dev.avatarIcon ? dev.avatarIcon : <span className="text-3xl font-semibold">{dev.avatarFallback}</span>}
              </div>
              <h3 className="text-2xl font-semibold text-card-foreground">{dev.name}</h3>
              <p className="text-primary font-medium text-lg">{dev.role}</p>
              <p className="mt-3 text-sm text-muted-foreground flex-grow">{dev.bio}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Skills:</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {dev.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex justify-center space-x-4">
                {dev.githubUrl && (
                  <Link href={dev.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${dev.name}'s GitHub Profile`} data-cursor-interactive="true">
                    <Github className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                )}
                {dev.linkedinUrl && (
                  <Link href={dev.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`${dev.name}'s LinkedIn Profile`} data-cursor-interactive="true">
                    <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                )}
                {dev.xUrl && (
                  <Link href={dev.xUrl} target="_blank" rel="noopener noreferrer" aria-label={`${dev.name}'s X Profile`} data-cursor-interactive="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
