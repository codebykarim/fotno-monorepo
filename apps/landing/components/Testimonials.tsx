import Image from "next/image";
import { Container } from "@/components/Container";
import avatarImage1 from "@/images/avatars/avatar-1.png";
import avatarImage2 from "@/images/avatars/avatar-2.png";
import avatarImage3 from "@/images/avatars/avatar-3.png";
import avatarImage4 from "@/images/avatars/avatar-4.png";
import avatarImage5 from "@/images/avatars/avatar-5.png";

const testimonials = [
  [
    {
      content:
        "Fotno completely changed how I deliver to clients. The password-protected galleries look so professional -- my clients think I built a custom site for them.",
      author: {
        name: "Sarah Mitchell",
        role: "Wedding Photographer",
        image: avatarImage1,
      },
    },
    {
      content:
        "The bulk upload is a game-changer. I shot 2,000 photos at an event and had the gallery live within the hour. No more wrestling with WeTransfer links.",
      author: {
        name: "James Chen",
        role: "Event Photographer",
        image: avatarImage4,
      },
    },
  ],
  [
    {
      content:
        "I love the favorites feature. My clients pick their top shots, I see them instantly in my dashboard. Selection rounds that used to take weeks now take days.",
      author: {
        name: "Lina Kareem",
        role: "Portrait Photographer",
        image: avatarImage5,
      },
    },
    {
      content:
        "Clean, fast, beautiful. That's all I needed for client delivery and Fotno nails it. The dark mode galleries are especially stunning for my moody editorial work.",
      author: {
        name: "Omar Hassan",
        role: "Fashion Photographer",
        image: avatarImage2,
      },
    },
  ],
  [
    {
      content:
        "Switched from Google Drive links to Fotno and my client satisfaction went through the roof. The gallery experience just feels premium.",
      author: {
        name: "Nadia Fouad",
        role: "Product Photographer",
        image: avatarImage3,
      },
    },
    {
      content:
        "As a studio owner, I needed something that scales. Fotno handles our 50+ galleries without breaking a sweat and the pricing actually makes sense.",
      author: {
        name: "Karim Youssef",
        role: "Studio Owner",
        image: avatarImage4,
      },
    },
  ],
];

function QuoteIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" width={105} height={78} {...props}>
      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
    </svg>
  );
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="What our customers are saying"
      className="bg-muted py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="text-3xl tracking-tight text-foreground sm:text-4xl font-semibold">
            Loved by photographers.
          </h2>
          <p className="mt-4 text-lg tracking-tight text-muted-foreground">
            Hear from real photographers who upgraded their delivery workflow
            with Fotno.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                {column.map((testimonial, testimonialIndex) => (
                  <li key={testimonialIndex}>
                    <figure className="relative rounded-2xl bg-card p-6 shadow-sm border border-border/50">
                      <QuoteIcon className="absolute top-6 left-6 fill-primary/10" />
                      <blockquote className="relative">
                        <p className="text-lg tracking-tight text-foreground">
                          {testimonial.content}
                        </p>
                      </blockquote>
                      <figcaption className="relative mt-6 flex items-center justify-between border-t border-border/50 pt-6">
                        <div>
                          <div className="text-base font-semibold text-foreground">
                            {testimonial.author.name}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {testimonial.author.role}
                          </div>
                        </div>
                        <div className="overflow-hidden rounded-full bg-muted">
                          <Image
                            className="h-14 w-14 object-cover"
                            src={testimonial.author.image}
                            alt=""
                            width={56}
                            height={56}
                          />
                        </div>
                      </figcaption>
                    </figure>
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
