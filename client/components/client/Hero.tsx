import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";
import { Container } from "./ui/Container";

const Hero = () => {
  return (
    <section className="relative">
      <div className="relative aspect-[375/600] w-full md:aspect-[1440/650]">
        <Image
          src="/hero.png"
          alt="A man and woman wearing Volt crossbody bags"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[59%_17%]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <Container className="relative z-10 flex h-full items-end pb-10 md:pb-16">
          <div>
            <h1 className="text-4xl font-medium tracking-tight text-white md:text-6xl">
              Be Iconic, Be you.
            </h1>

            <Link
              href="/shop"
              className="mt-5 inline-flex items-center gap-2 border border-white px-4 py-2 text-sm font-medium uppercase text-white transition hover:bg-white hover:text-black"
            >
              Shop Now
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
