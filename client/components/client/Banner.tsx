import Link from "next/link";
import { Container } from "./ui/Container";

const Banner = () => {
  return (
    <section
      aria-labelledby="banner-title"
      className="bg-orange-600 text-white"
    >
      <Container>
        <div className="flex min-h-[320px] flex-col items-start justify-center gap-6 py-12 sm:min-h-[360px] sm:py-16 lg:min-h-[450px] lg:gap-8">
          <h2
            id="banner-title"
            className="max-w-2xl text-3xl leading-none tracking-tight sm:text-4xl lg:text-5xl"
          >
            Free gift worth Rs. 5,000 on Your next purchase
          </h2>

          <Link
            href="/products"
            className="inline-flex min-h-12 items-center justify-center gap-3 bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-8"
          >
            Shop Now
            <span aria-hidden="true" className="text-lg">
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default Banner;
