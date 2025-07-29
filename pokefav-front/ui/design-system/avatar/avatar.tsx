"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Props {
  size?: "small" | "medium" | "large";
  src: string;
  alt: string;
  priority?: boolean;
}

const Avatar = ({ size = "medium", src, alt, priority = false }: Props) => {
  let sizeStyles: string;
  let sizes: string;

  const defaultSrc = "/images/Mawile303profile.png";
  const [imgSrc, setImgSrc] = useState(src || defaultSrc);

  useEffect(() => {
    if (src && src.trim() !== "") {
      setImgSrc(src);
    }
  }, [src]);

  switch (size) {
    case "small":
      sizeStyles = "w-[24px] h-[24px]";
      sizes = "24px";
      break;

    case "medium": //Default
      sizeStyles = "w-[34px] h-[34px]";
      sizes = "34px";
      break;

    case "large":
      sizeStyles = "w-[50px] h-[50px]";
      sizes = "50px";
      break;
  }

  return (
    <div className={clsx(sizeStyles, "bg-gray-400 rounded-full relative")}>
      <Image
        fill
        src={imgSrc}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className="rounded-full object-cover object-center"
        onError={() => setImgSrc(defaultSrc)}
      />
    </div>
  );
};

export default Avatar;
