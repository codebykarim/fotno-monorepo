import { Container } from "@/components/Container";
import Link from "next/link";

const faqs = [
  [
    {
      question: "How does gallery delivery work?",
      answer:
        "Upload your photos to a gallery, set a password, and share the link with your client. They view the photos in a beautiful lightbox, tap hearts on their favorites, and you see the picks on your dashboard.",
    },
    {
      question: "Can my clients download photos?",
      answer:
        "Yes. You control whether downloads are enabled per gallery. Clients can download individual photos or the full gallery depending on your settings.",
    },
    {
      question: "Is there a limit on photo uploads?",
      answer:
        "Each plan includes a storage quota. Within that quota you can upload as many photos as you want. Our chunked upload pipeline handles even large RAW exports reliably.",
    },
  ],
  [
    {
      question: "How does the favorites feature work?",
      answer:
        "When viewing a gallery, clients can tap a heart icon on any photo. You see their selections in real-time on your dashboard, making final edits and album curation a breeze.",
    },
    {
      question: "Can I use my own domain?",
      answer:
        "Custom domains are on our roadmap. For now, every gallery gets a clean slug URL on your Fotno subdomain (e.g. gallery.fotno.com/your-shoot).",
    },
    {
      question: "What happens if I exceed my storage?",
      answer:
        "We don't cut you off. Overage is billed at a fair per-GB rate, clearly shown in your dashboard so there are no surprises.",
    },
  ],
  [
    {
      question: "Is my data secure?",
      answer:
        "All photos are stored on enterprise-grade cloud infrastructure with encryption at rest. Gallery passwords are hashed, and all traffic is served over HTTPS.",
    },
    {
      question: "Can I try Fotno before paying?",
      answer:
        "Absolutely. Every new account gets a 1-month free trial on the Professional plan. No credit card required.",
    },
    {
      question: "How do I get support?",
      answer:
        "Email us at support@fotno.com. Studio plan customers get priority support with faster response times.",
    },
  ],
];

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="bg-background py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="text-3xl tracking-tight text-foreground sm:text-4xl font-semibold"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-muted-foreground">
            Can't find what you're looking for?{" "}
            <Link
              href="mailto:support@fotno.com"
              className="text-primary hover:text-primary/80 underline underline-offset-4"
            >
              Contact our team
            </Link>
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="text-lg/7 font-semibold text-foreground">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
