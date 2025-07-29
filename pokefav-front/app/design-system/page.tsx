import Container from "@/ui/components/container/container";
import { generateMetadata } from "@/ui/components/seo/seo";
import Avatar from "@/ui/design-system/avatar/avatar";
import Button from "@/ui/design-system/button/button";
import Logo from "@/ui/design-system/logo/logo";
import Spinner from "@/ui/design-system/spinner/spinner";
import { Typography } from "@/ui/design-system/typography/typography";

export const metadata = generateMetadata({
  title: "Design System - PokeFav",
  description: "PokeFav design system documentation",
  keywords: "design system, components, typography, buttons, PokeFav",
});

export default function DesignSystemPage() {
  return (
    <div className="space-y-5">
      <Container className="space-y-5 py-5">
        {/* Typography */}
        <div className="space-y-2">
          <Typography variant="caption2" weight="medium">
            Typography
          </Typography>
          <div className="flex flex-col gap-2 p-5 border border-gray-500 rounded">
            <Typography variant="caption3" weight="medium">
              Theme
            </Typography>
            <div className="flex flex-wrap gap-6 space-y-2 ">
              <Typography variant="h1" theme="primary" component="div">
                Primary
              </Typography>
              <Typography variant="h1" theme="secondary" component="div">
                Secondary
              </Typography>
              <Typography variant="h1" theme="gray" component="div">
                Gray
              </Typography>
            </div>

            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                Display
              </Typography>
              <Typography variant="display">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                H1
              </Typography>
              <Typography variant="h1">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                H2
              </Typography>
              <Typography variant="h2">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                H3
              </Typography>
              <Typography variant="h3">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                H4
              </Typography>
              <Typography variant="h4">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                H5
              </Typography>
              <Typography variant="h5">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                Lead
              </Typography>
              <Typography variant="lead">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                Body Large
              </Typography>
              <Typography variant="body-lg">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                Body Base
              </Typography>
              <Typography variant="body-base">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                Body Small
              </Typography>
              <Typography variant="body-sm">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                Caption 1
              </Typography>
              <Typography variant="caption1">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                Caption 2
              </Typography>
              <Typography variant="caption2">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                Caption 3
              </Typography>
              <Typography variant="caption3">Skate ipsum dolor</Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                Caption 4
              </Typography>
              <Typography variant="caption4">Skate ipsum dolor</Typography>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <Typography variant="caption2" weight="medium">
            Buttons
          </Typography>
          <div className="p-5 space-y-8 border border-gray-500 rounded">
            <div className="space-y-2">
              <Typography variant="caption3" weight="medium">
                Small
              </Typography>
              <div className="flex flex-wrap items-center gap-2 p-1">
                <Button size="small" variant="accent">
                  Accent
                </Button>
                <Button
                  size="small"
                  variant="accent"
                  iconPosition="left"
                  iconName="user"
                >
                  Accent
                </Button>
                <Button size="small" variant="secondary">
                  Secondary
                </Button>
                <Button size="small" variant="outline">
                  Outline
                </Button>
                <Button size="small" variant="disabled" disabled>
                  Disabled
                </Button>
                <Button size="small" variant="ico" iconName="user" />
                <Button
                  size="small"
                  variant="ico"
                  iconTheme="secondary"
                  iconName="user"
                />
                <Button
                  size="small"
                  variant="ico"
                  iconTheme="gray"
                  iconName="user"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Typography variant="caption3" weight="medium">
                Medium
              </Typography>
              <div className="flex flex-wrap items-center gap-2 p-1">
                <Button variant="accent">Accent</Button>
                <Button variant="accent" iconPosition="left" iconName="user">
                  Accent
                </Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="disabled" disabled>
                  Disabled
                </Button>
                <Button variant="ico" iconName="user" />
                <Button variant="ico" iconTheme="secondary" iconName="user" />
                <Button variant="ico" iconTheme="gray" iconName="user" />
              </div>
            </div>

            <div className="space-y-2">
              <Typography variant="caption3" weight="medium">
                Large
              </Typography>
              <div className="flex flex-wrap items-center gap-2 p-1">
                <Button size="large" variant="accent">
                  Accent
                </Button>
                <Button
                  size="large"
                  variant="accent"
                  iconPosition="left"
                  iconName="user"
                >
                  Accent
                </Button>
                <Button size="large" variant="secondary">
                  Secondary
                </Button>
                <Button size="large" variant="outline">
                  Outline
                </Button>
                <Button size="large" variant="disabled" disabled>
                  Disabled
                </Button>
                <Button size="large" variant="ico" iconName="user" />
                <Button
                  size="large"
                  variant="ico"
                  iconTheme="secondary"
                  iconName="user"
                />
                <Button
                  size="large"
                  variant="ico"
                  iconTheme="gray"
                  iconName="user"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Typography variant="caption3" weight="medium">
                Loading States
              </Typography>
              <div className="flex flex-wrap items-center gap-2 p-1">
                <Button size="large" isLoading variant="accent">
                  Accent
                </Button>
                <Button
                  size="large"
                  isLoading
                  variant="accent"
                  iconPosition="left"
                  iconName="user"
                >
                  Accent
                </Button>
                <Button size="large" isLoading variant="secondary">
                  Secondary
                </Button>
                <Button size="large" isLoading variant="outline">
                  Outline
                </Button>
                <Button size="large" isLoading variant="disabled" disabled>
                  Disabled
                </Button>
                <Button size="large" isLoading variant="ico" iconName="user" />
                <Button
                  size="large"
                  isLoading
                  variant="ico"
                  iconTheme="secondary"
                  iconName="user"
                />
                <Button
                  size="large"
                  isLoading
                  variant="ico"
                  iconTheme="gray"
                  iconName="user"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logo, Avatar et Spinner - Alignés horizontalement sur desktop */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Logo */}
            <div className="space-y-2">
              <Typography variant="caption3" weight="medium">
                Logo
              </Typography>
              <div className="p-5 space-y-4 border border-gray-500 rounded">
                <div className="flex items-center gap-4">
                  <Logo size="very-small" />
                  <Typography variant="caption3">Very Small</Typography>
                </div>
                <div className="flex items-center gap-4">
                  <Logo size="small" />
                  <Typography variant="caption3">Small</Typography>
                </div>
                <div className="flex items-center gap-4">
                  <Logo size="medium" />
                  <Typography variant="caption3">Medium</Typography>
                </div>
                <div className="flex items-center gap-4">
                  <Logo size="large" />
                  <Typography variant="caption3">Large</Typography>
                </div>
              </div>
            </div>

            {/* Avatar et Spinner empilés */}
            <div className="space-y-5">
              {/* Avatar */}
              <div className="space-y-2">
                <Typography variant="caption3" weight="medium">
                  Avatar
                </Typography>
                <div className="p-5 space-y-4 border border-gray-500 rounded">
                  <div className="flex items-center gap-4">
                    <Avatar size="small" src="" alt="User" />
                    <Typography variant="caption3">Small</Typography>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar size="medium" src="" alt="User" />
                    <Typography variant="caption3">Medium</Typography>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar size="large" src="" alt="User" />
                    <Typography variant="caption3">Large</Typography>
                  </div>
                </div>
              </div>

              {/* Spinner */}
              <div className="space-y-2">
                <Typography variant="caption3" weight="medium">
                  Spinner
                </Typography>
                <div className="p-5 space-y-4 border border-gray-500 rounded">
                  <div className="flex items-center gap-4">
                    <Spinner size="small" />
                    <Typography variant="caption3">Small</Typography>
                  </div>
                  <div className="flex items-center gap-4">
                    <Spinner size="medium" />
                    <Typography variant="caption3">Medium</Typography>
                  </div>
                  <div className="flex items-center gap-4">
                    <Spinner size="large" />
                    <Typography variant="caption3">Large</Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
