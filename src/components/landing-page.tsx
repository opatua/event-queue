"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Users, Calendar, Clock, ListPlus, Share2, CheckCircle, BarChart } from "lucide-react"

export function LandingPage() {
  const faqItems = [
    {
      question: "Is EventQueue completely free to use?",
      answer: "Yes! EventQueue is completely free for both event creators and attendees. There are no hidden fees or charges.",
    },
    {
      question: "Do I need an account to use EventQueue?",
      answer: "Currently, you don't need an account to create or manage events. However, we plan to introduce optional accounts for event creators in the future to provide a more personalized experience.",
    },
    {
      question: "How many events can I create?",
      answer: "You can create an unlimited number of events. There are no restrictions on the number of events you can host on our platform.",
    },
    {
      question: "Can I customize the registration page for my event?",
      answer: "Each event you create gets its own unique, shareable page. While deep customization isn't available yet, the page is clean, professional, and contains all the necessary information for your attendees.",
    },
    {
      question: "What happens when my event reaches capacity?",
      answer: "Once your event is full, our smart queue system automatically kicks in. New attendees will be placed in a first-come, first-served waiting list and will be automatically registered if a spot opens up.",
    },
  ]

  const features = [
    {
      icon: <ListPlus className="h-10 w-10 text-primary" />,
      title: "Effortless Event Creation",
      description: "Create and manage multiple events with ease from a single, intuitive dashboard.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Smart Queue System",
      description: "Our automated queue handles overflow, ensuring a fair, first-come, first-served process when spots open up.",
    },
    {
      icon: <Share2 className="h-10 w-10 text-primary" />,
      title: "Shareable Event Pages",
      description: "Each event gets a unique, shareable link for attendees to register, view details, and join the queue.",
    },
    {
        icon: <BarChart className="h-10 w-10 text-primary" />,
        title: "Simple Attendee Management",
        description: "Admins can easily manage attendee lists, view the queue, and export registered participants for their records."
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 lg:px-6 h-16 flex items-center">
        <Link href="#" className="flex items-center justify-center font-bold text-xl" prefetch={false}>
          <ListPlus className="h-6 w-6 mr-2" />
          EventQueue
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard" passHref>
            <Button>Go to Dashboard</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Simple, Fair Event Registration & Queuing
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    EventQueue provides a clean, functional app for event registration with a limited capacity and a smart, automated queue system.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard" passHref>
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Create Your First Event
                    </Button>
                  </Link>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                data-ai-hint="event management dashboard"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need for Your Event</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Focus on your event, not on managing a messy sign-up list.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  {feature.icon}
                  <div className="grid gap-1">
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions? We've got answers.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-12 w-full">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index + 1}`}>
                    <AccordionTrigger className="text-lg">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} EventQueue. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
