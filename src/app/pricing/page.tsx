
"use client";

import type { NextPage } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, HelpCircle, Star } from 'lucide-react';

const PricingPage: NextPage = () => {
  const plans = [
    {
      id: 'free-trial',
      title: 'Free Trial',
      price: '$0',
      period: '/ 14 days',
      description: 'Explore core features and see Ventures AI in action. No credit card required.',
      features: [
        'Limited data analyses per month',
        'Basic data visualizations',
        '1 user account',
        'Community support',
      ],
      ctaText: 'Start Free Trial',
      ctaLink: '/demo#chatbot-demo', 
      highlight: false,
    },
    {
      id: 'pro-plan',
      title: 'Pro Plan',
      price: '$49',
      period: '/ month',
      description: 'For professionals and small teams who need robust analytics and collaboration.',
      features: [
        'Unlimited data analyses',
        'Advanced visualization tools',
        'Up to 5 user accounts',
        'Real-time collaboration features',
        'Email & chat support',
        'Access to API',
      ],
      ctaText: 'Get Started with Pro',
      ctaLink: '/signup?plan=pro', 
      highlight: true,
    },
    {
      id: 'enterprise-demo',
      title: 'Enterprise & Demo',
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for large organizations or specific needs. Request a personalized demo.',
      features: [
        'Volume-based pricing',
        'Custom integrations & features',
        'Dedicated account manager',
        'Premium support & SLAs',
        'Onboarding & training',
        'Personalized demo',
      ],
      ctaText: 'Request a Demo',
      ctaLink: '/demo', 
      highlight: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl text-shimmer">
          Find the Plan That's Right For You
        </h1>
        <p className="mt-4 text-xl text-muted-foreground lg:text-2xl max-w-3xl mx-auto">
          Start with a free trial, or unlock powerful features with our premium plans. No matter your size, Ventures AI scales with you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            id={plan.id}
            className={`flex flex-col rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              plan.highlight ? 'border-2 border-primary ring-4 ring-primary/20' : 'border-border'
            }`}
            data-cursor-interactive="true"
          >
            <CardHeader className="p-6">
              {plan.highlight && (
                <div className="flex justify-end mb-2">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                    <Star className="mr-1 h-4 w-4" /> Most Popular
                  </span>
                </div>
              )}
              <CardTitle className="text-3xl font-semibold text-card-foreground">{plan.title}</CardTitle>
              <div className="flex items-baseline mt-2">
                <span className="text-5xl font-extrabold tracking-tight text-card-foreground">{plan.price}</span>
                {plan.period && <span className="ml-1 text-xl font-medium text-muted-foreground">{plan.period}</span>}
              </div>
              <CardDescription className="mt-3 text-base text-muted-foreground">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <ul role="list" className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle2 className="flex-shrink-0 h-6 w-6 text-green-500 mr-3 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-6 mt-auto">
              <Button asChild size="lg" className={`w-full font-semibold ${plan.id === 'pro-plan' ? '' : 'variant="outline"'}`} data-cursor-interactive="true">
                <Link href={plan.ctaLink}>
                  {plan.ctaText}
                  {plan.id !== 'enterprise-demo' ? <ArrowRight className="ml-2 h-5 w-5" /> : <HelpCircle className="ml-2 h-5 w-5" />}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div id="contact-sales" className="mt-16 text-center p-8 bg-card rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold text-card-foreground">Need a Custom Solution?</h3>
        <p className="mt-2 text-muted-foreground">
          Our team is ready to help you find the perfect fit for your organization.
        </p>
        <Button asChild size="lg" className="mt-6 font-semibold" data-cursor-interactive="true">
          <Link href="/contact"> 
            Contact Sales <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PricingPage;
