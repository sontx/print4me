// app/(marketing)/faqs/page.tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata = {
  title: "FAQs | Print4Me",
  description: "Frequently asked questions about Print4Me",
};

export default function FAQsPage() {
  return (
    <section className="mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h1>

      <h2 className="mb-2 text-xl font-semibold">Membership</h2>
      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            I purchased membership but I can’t login?
          </AccordionTrigger>
          <AccordionContent>
            If you are unable to login to your account after purchasing your
            membership, you need to verify your email address.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            How many mazes can I download every month?
          </AccordionTrigger>
          <AccordionContent>
            Each user is allocated 100 credits per month. These credits reset at
            the beginning of every next month, counting from the date you
            started your membership (not the calendar month).
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>
            Are your products available for commercial use?
          </AccordionTrigger>
          <AccordionContent>
            Yes, you can create and download any number of mazes within the time
            frame of your active membership for commercial use.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>
            Can I use my mazes for commercial use permanently?
          </AccordionTrigger>
          <AccordionContent>
            Yes, you can use the generated mazes for commercial use
            indefinitely. You do not need to maintain an active membership to
            continue using or selling the mazes.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>Can I extend my credits?</AccordionTrigger>
          <AccordionContent>
            Yes, you can extend your credits by contacting our support team.
            We’ll be happy to assist you with additional credit options.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger>What languages are supported?</AccordionTrigger>
          <AccordionContent>
            All mazes support standard English letters only. Non-English
            characters, including extended ASCII characters, European accented
            characters, or special characters, may not work properly and could
            cause unexpected results.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <h2 className="mb-2 text-xl font-semibold">General</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-7">
          <AccordionTrigger>What is Print4Me Maze?</AccordionTrigger>
          <AccordionContent>
            <strong>Print4Me Maze</strong> is a platform that provides
            high-quality printing maze puzzles for kids and adults. You can
            create and download mazes for personal or commercial use.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger>How do I open the files?</AccordionTrigger>
          <AccordionContent>
            The files are usually provided in PDF, PNG, or SVG formats. Here’s
            how you can open them:
            <br />
            <br />
            <strong>PDF Files:</strong> You can use Adobe Reader to open or
            print PDF files. If it’s not already installed on your system, you
            can download it for free from the{" "}
            <a
              href="https://get.adobe.com/reader/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Adobe website
            </a>
            .
            <br />
            <br />
            <strong>PNG Files:</strong> You can use any image editor program,
            such as Paint or Photoshop, to open PNG files.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
