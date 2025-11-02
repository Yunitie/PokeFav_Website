"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HomeView from "./home.view";

export default function HomeContainer() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const [clipStartY, setClipStartY] = useState<number>(70);
  const [clipEndY, setClipEndY] = useState<number>(85);

  const updateSeparator = useMemo(() => {
    return () => {
      const sectionEl = sectionRef.current;
      const imageEl = imageWrapperRef.current;
      if (!sectionEl || !imageEl) return;

      const sectionRect = sectionEl.getBoundingClientRect();
      const imageRect = imageEl.getBoundingClientRect();

      const sectionHeight = sectionRect.height || 1;
      const imageBottomWithinSection = imageRect.bottom - sectionRect.top;

      // Position separator slightly below the image bottom, clamped to [40, 92]
      const baseY = (imageBottomWithinSection / sectionHeight) * 100;
      // Convert offset to percentage of section height
      const offsetPercent = -(imageRect.height / sectionHeight) * 50;
      const startY = Math.min(92, Math.max(28, baseY + offsetPercent));

      // Calculate responsive slope - smaller slope on narrow screens, larger on wide screens
      const windowWidth = window.innerWidth;
      // Slope ranges from 15 on mobile (< 640px) to 46 on large screens (> 1280px)
      const slope =
        windowWidth < 640
          ? 15
          : windowWidth < 1280
          ? 15 + (windowWidth - 640) * (31 / 640)
          : 46;

      const endY = Math.min(98, startY + slope);

      setClipStartY(startY);
      setClipEndY(endY);
    };
  }, []);

  useEffect(() => {
    updateSeparator();
    window.addEventListener("resize", updateSeparator);
    const id = window.setInterval(updateSeparator, 250); // handle font/image late layout
    return () => {
      window.removeEventListener("resize", updateSeparator);
      window.clearInterval(id);
    };
  }, [updateSeparator]);

  return (
    <HomeView
      sectionRef={sectionRef}
      imageWrapperRef={imageWrapperRef}
      clipStartY={clipStartY}
      clipEndY={clipEndY}
    />
  );
}
