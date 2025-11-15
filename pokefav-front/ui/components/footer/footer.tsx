import Container from "../container/container";
import { Typography } from "@/ui/design-system/typography/typography";

const Footer = () => {
  return (
    <footer className="border-gray-900 bg-landing-dark-purple dark:bg-[#161616] dark:border-[#010101]">
      <Container className="py-4  md:items-center md:justify-between">
        <Typography
          variant="body-sm"
          theme="gray-500"
          className="md:text-center text-justify"
        >
          The datas are from the :{" "}
          <a
            href="https://tyradex.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tyradex API
          </a>{" "}
        </Typography>
        <Typography
          variant="body-sm"
          theme="gray-500"
          className="md:text-center text-justify"
        >
          This site is not affiliated, associated, authorized, endorsed by, or
          in any way officially connected with The Pokemon Company, Nintendo, or
          any of their subsidiaries or affiliates. <br /> All product names,
          logos, and trademarks are the property of their respective owners. |
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
