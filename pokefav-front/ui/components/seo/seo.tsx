import type { Metadata } from "next";

interface Props {
  title: string;
  description: string;
  keywords?: string;
}

export const generateMetadata = ({
  title,
  description,
  keywords,
}: Props): Metadata => {
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
};
