"use client";

import Image from "next/image";

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

export default function FeatureCard({
  title,
  description,
  imageSrc,
  imageAlt,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`bg-white/10 rounded-2xl px-8 py-6 text-center text-white ${className}`}
    >
      <h2 className="text-xl font-semibold mb-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] drop-shadow-[0_-1px_1px_rgba(0,0,0,0.8)] drop-shadow-[1px_0_1px_rgba(0,0,0,0.8)] drop-shadow-[-1px_0_1px_rgba(0,0,0,0.8)]">
        {title}
      </h2>
      <p className="text-sm text-white/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] drop-shadow-[0_-1px_1px_rgba(0,0,0,0.8)] drop-shadow-[1px_0_1px_rgba(0,0,0,0.8)] drop-shadow-[-1px_0_1px_rgba(0,0,0,0.8)]">
        {description}
      </p>
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={400}
        height={400}
        quality={95}
        className="object-contain w-full max-w-[250px] md:max-w-[250px] relative pt-6 z-10 mx-auto"
      />
    </div>
  );
}
