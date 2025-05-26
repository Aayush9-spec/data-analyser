
"use client";

import type { NextPage } from 'next';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; // Removed Card
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  company: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(500, { message: "Message must be 500 characters or less." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage: NextPage = () => {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    console.log("Contact form submitted:", data);
    // Here you would typically send the data to a backend or email service
    // For this demo, we'll just show a success toast and reset the form.
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you shortly.",
      variant: "default", 
    });
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <div 
        className={cn(
            "group w-full max-w-2xl p-0.5 rounded-xl shadow-2xl transition-all duration-300 ease-out hover:p-1.5",
            "bg-gradient-to-br from-primary/70 via-accent/70 to-secondary/70",
            "bg-[length:200%_200%] hover:animate-gradient-flow",
            "hover:shadow-[0_0_25px_3px_hsl(var(--primary)/0.4)]"
        )}
        data-cursor-interactive="true"
      >
        <div className="bg-card rounded-lg h-full w-full">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 mx-auto">
              <Mail className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-shimmer">Contact Our Sales Team</CardTitle>
            <CardDescription className="text-lg text-muted-foreground pt-2">
              Have questions about our enterprise solutions or need a personalized demo? Fill out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} data-cursor-interactive="true" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} data-cursor-interactive="true" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company Inc." {...field} data-cursor-interactive="true" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="How can we help you today?"
                          className="resize-none"
                          rows={5}
                          {...field}
                          data-cursor-interactive="true"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full font-semibold" size="lg" disabled={form.formState.isSubmitting} data-cursor-interactive="true">
                  {form.formState.isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;