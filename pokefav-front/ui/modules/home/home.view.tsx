"use client";

import Layout from "@/ui/components/layout/layout";
import { Typography } from "@/ui/design-system/typography/typography";
import Button from "@/ui/design-system/button/button";
import KonamiCode from "@/ui/components/konami-code/konami-code";
import FeatureCard from "./components/feature-card";
import Image from "next/image";

interface HomeViewProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  imageWrapperRef: React.RefObject<HTMLDivElement | null>;
  clipStartY: number;
  clipEndY: number;
}

export default function HomeView({
  sectionRef,
  imageWrapperRef,
  clipStartY,
  clipEndY,
}: HomeViewProps) {
  return (
    <Layout>
      <KonamiCode />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section
          ref={sectionRef}
          className="relative min-h-screen flex pt-14 pb-10 md:pt-22 justify-center"
        >
          <div className="container relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-center">
              {/* Left side - Text content */}
              <div className=" px-2 md:px-5 flex flex-col items-center justify-center">
                <div className="pb-4">
                  <Typography
                    variant="h3"
                    component="h1"
                    theme="black"
                    weight="bold"
                    className=""
                  >
                    Gotta Rank &apos;Em All !
                  </Typography>
                  <Typography
                    variant="lead"
                    component="p"
                    theme="gray-600"
                    weight="regular"
                    className=""
                  >
                    Rank all the Pokemons and discover your ultimate list!
                  </Typography>
                </div>
                <div className="pt-4">
                  <Button
                    baseUrl="/pokemon-choice"
                    size="xlarge"
                    variant="accent"
                    fontWeight="extrabold"
                    className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-extrabold -rotate-3"
                  >
                    Let&apos;s Rank !
                  </Button>
                </div>
              </div>

              {/* Right side - Podium graphic */}
              <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
                <div ref={imageWrapperRef} className="relative rotate-2">
                  {/* Blur background using the same image */}
                  <Image
                    src="/images/Podium.png"
                    alt=""
                    width={400}
                    height={400}
                    className="absolute inset-0 object-contain w-full max-w-sm md:max-w-md lg:max-w-lg blur-xl opacity-60 -z-10"
                    priority
                  />
                  <Image
                    src="/images/Podium.png"
                    alt="Pokemon podium with Umbreon, Mawile, and Mimikyu"
                    width={400}
                    height={400}
                    className="object-contain w-full max-w-sm md:max-w-md lg:max-w-lg relative z-10"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Bottom text */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-30 md:pt-50 text-center px-10 z-10">
              <FeatureCard
                title="Connect your account"
                description="Create an account to save your progression"
                imageSrc="/images/Connect.png"
                imageAlt="Connect your account"
              />

              <FeatureCard
                title="Pick your Pokemon"
                description="Choose between Pokemons to start your list"
                imageSrc="/images/Pick.png"
                imageAlt="Pick your Pokemon"
              />

              <FeatureCard
                title="See your personal ranking"
                description="And share it to your friends !"
                imageSrc="/images/Rank.png"
                imageAlt="See your personal ranking"
              />
            </div>
          </div>

          {/* Diagonal separator */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-landing-dark-purple to-40% to-landing-purple z-0"
            style={{
              clipPath: `polygon(0% ${clipStartY}%, 100% ${clipEndY}%, 100% 100%, 0% 100%)`,
            }}
          ></div>
        </section>
      </div>
    </Layout>
  );
}
