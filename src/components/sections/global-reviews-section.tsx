
"use client";

import type { FC } from 'react';
// import Image from 'next/image'; // Not currently used
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Review {
  id: number;
  avatarSrc: string;
  avatarFallback: string;
  dataAiHint: string;
  name: string;
  title: string;
  rating: number;
  reviewText: string;
}

const placeholderReviews: Review[] = [
  {
    id: 1,
    avatarSrc: 'https://placehold.co/64x64.png',
    avatarFallback: 'AC',
    dataAiHint: 'profile person',
    name: 'Alex Chen',
    title: 'Lead Data Scientist @ Innovatech',
    rating: 5,
    reviewText:
      "Ventures AI has revolutionized how we approach data. The insights are incredibly powerful, and the platform is surprisingly easy to use! We've seen a significant boost in our analytical capabilities since adopting it.",
  },
  {
    id: 2,
    avatarSrc: 'https://placehold.co/64x64.png',
    avatarFallback: 'SM',
    dataAiHint: 'profile person',
    name: 'Sarah Miller',
    title: 'Product Manager @ DataDriven Co.',
    rating: 5,
    reviewText:
      'The visualizations are intuitive and beautiful. Our team can now understand complex data faster than ever before. Highly recommended for any organization looking to leverage their data assets effectively. This text is intentionally made longer to test the scrolling functionality properly and ensure that multiple lines are handled as expected within the constrained height of the card content area. We need to see if this makes the scrollbar appear. More and more text to fill up the space.',
  },
  {
    id: 3,
    avatarSrc: 'https://placehold.co/64x64.png',
    avatarFallback: 'DK',
    dataAiHint: 'profile person',
    name: 'David Kim',
    title: 'CTO @ Quantum Solutions',
    rating: 4,
    reviewText:
      "Seamless integration and top-notch support. Ventures AI is a game-changer for any data-focused team. The learning curve was minimal, and the ROI has been excellent. It's become an indispensable tool for us.",
  },
   {
    id: 4,
    avatarSrc: 'https://placehold.co/64x64.png',
    avatarFallback: 'LJ',
    dataAiHint: 'profile person',
    name: 'Laura Jones',
    title: 'Senior Analyst @ Insight Corp',
    rating: 5,
    reviewText:
      "I'm impressed by the speed and accuracy of the AI-driven analysis. It's helped us uncover critical trends we would have otherwise missed. The ability to quickly iterate on data models is fantastic.",
  },
  {
    id: 5,
    avatarSrc: 'https://placehold.co/64x64.png',
    avatarFallback: 'RB',
    dataAiHint: 'profile person',
    name: 'Rajesh Brown',
    title: 'Head of Engineering @ FinTech Global',
    rating: 4,
    reviewText:
      "A robust platform that scales with our needs. The API is well-documented, making custom integrations straightforward. Our developers appreciate the clear documentation and responsive support team. More text to ensure this card also has enough content to potentially scroll if the layout allows it. We are testing this thoroughly because it's important for the user experience that all text is accessible.",
  },
  {
    id: 6,
    avatarSrc: 'https://placehold.co/64x64.png',
    avatarFallback: 'EM',
    dataAiHint: 'profile person',
    name: 'Elena Moreau',
    title: 'Data Visualization Expert @ CreativeData',
    rating: 5,
    reviewText:
      "The quality of the generated graphs and the flexibility in customization are unparalleled. A must-have tool for data storytellers seeking to convey complex information in an accessible and engaging manner.",
  },
];

const GlobalReviewsSection: FC = () => {
  return (
    <section
      id="reviews"
      className="py-16 md:py-24 bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-shimmer">
            Hear From Our <span className="text-primary">Developers</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Discover how Ventures AI is empowering developers and data scientists across the globe.
          </p>
        </div>
      </div>

      <div
        className={cn(
          "w-full overflow-hidden relative group mt-12"
          // Temporarily commented out for debugging text visibility in cards:
          // "[perspective:1200px] transform-style-preserve-3d [transform:rotateY(-15deg)] group-hover:[transform:rotateY(-12deg)] transition-transform duration-500 ease-out"
        )}
      >
        <div className="absolute inset-y-0 left-0 w-16 md:w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="flex whitespace-nowrap animate-infinite-scroll group-hover:animate-paused">
          {[...placeholderReviews, ...placeholderReviews].map((review, index) => (
            <div
              key={`${review.id}-${index}-wrapper`} 
              data-cursor-interactive="true"
              className={cn(
                "group/item relative flex flex-col w-[360px] h-[300px] mx-4 my-2 flex-shrink-0", // Changed from inline-flex
                "p-0.5 rounded-xl", 
                "bg-gradient-to-br from-primary/70 via-accent/70 to-secondary/70", 
                "bg-[length:200%_200%]", 
                "transition-all duration-300 ease-out", 
                "hover:p-1 hover:shadow-[0_0_25px_3px_hsl(var(--primary)/0.4)]",
                "group-hover/item:animate-gradient-flow"
              )}
            >
              <Card
                className="rounded-lg h-full w-full flex flex-col flex-shrink-0 overflow-hidden" // Added overflow-hidden
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < review.rating ? "text-primary fill-primary" : "text-muted-foreground/50"
                        )}
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto min-h-0"> {/* Changed flex-grow to flex-1 */}
                  <p className="text-base text-muted-foreground italic relative pl-8 m-0"> {/* Added m-0 */}
                    <Quote className="absolute left-0 top-0 h-5 w-5 text-primary/70 transform -translate-x-1 -translate-y-1" />
                    {review.reviewText}
                  </p>
                </CardContent>
                <CardFooter className="pt-4 mt-auto"> 
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={review.avatarSrc} alt={review.name} data-ai-hint={review.dataAiHint} />
                      <AvatarFallback>{review.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.title}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 right-0 w-16 md:w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default GlobalReviewsSection;
    

    