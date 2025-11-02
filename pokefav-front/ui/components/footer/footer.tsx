import Container from "../container/container";
import { Typography } from "@/ui/design-system/typography/typography";

const Footer = () => {
  return (
    <footer className="border-t-2 border-gray-900 bg-landing-dark-purple">
      <Container className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <Typography variant="body-sm" theme="gray-500" className="text-center">
          This site is not affiliated, associated, authorized, endorsed by, or
          in any way officially connected with The Pokemon Company, Nintendo, or
          any of their subsidiaries or affiliates. <br /> All product names,
          logos, and trademarks are the property of their respective owners.
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
