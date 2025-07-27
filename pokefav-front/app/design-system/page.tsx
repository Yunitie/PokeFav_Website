import Container from "@/ui/components/container/container";
import { generateMetadata } from "@/ui/components/seo/seo";
import Avatar from "@/ui/design-system/avatar/avatar";
import Button from "@/ui/design-system/button/button";
import Logo from "@/ui/design-system/logo/logo";
import Spinner from "@/ui/design-system/spinner/spinner";
import { Typography } from "@/ui/design-system/typography/typography";

export const metadata = generateMetadata({
  title: "Design System - PokeFav",
  description: "Documentation du design system PokeFav",
  keywords: "design system, composants, typographie, boutons, PokeFav",
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
              <Typography variant="lead">
                Skate ipsum dolor sit amet, stalefish axle set Tony Magnusson
                fastplant
              </Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                Body lg
              </Typography>
              <Typography variant="body-lg">
                Skate ipsum dolor sit amet, stalefish axle set Tony Magnusson
                fastplant noseblunt slide frontside air nose.
              </Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                Body base
              </Typography>
              <Typography variant="body-base">
                Skate ipsum dolor sit amet, stalefish axle set Tony Magnusson
                fastplant noseblunt slide frontside air nose. Helipop nollie
                heel flip disaster 1080 switch.
              </Typography>
            </div>
            <div className="pb-5 space-y-2 p-2 border-t border-gray-500">
              <Typography variant="caption3" weight="medium">
                Body sm
              </Typography>
              <Typography variant="body-sm">
                Skate ipsum dolor sit amet, stalefish axle set Tony Magnusson
                fastplant noseblunt slide frontside air nose. Helipop nollie
                heel flip disaster 1080 switch. Chicken wing impossible goofy
                footed crail slide body varial rock and roll.
              </Typography>
            </div>

            <div className="flex gap-2 p-5 border border-gray-500 rounded">
              <div className="gap-1 flex flex-col p-2 border-r border-gray-500">
                <Typography variant="caption3" weight="medium">
                  Caption 1
                </Typography>
                <Typography variant="caption1" weight="regular">
                  Regular
                </Typography>
                <Typography variant="caption1" weight="medium">
                  Medium
                </Typography>
              </div>
              <div className="gap-1 flex flex-col p-2 border-r border-gray-500">
                <Typography variant="caption3" weight="medium">
                  Caption 2
                </Typography>
                <Typography variant="caption2" weight="regular">
                  Regular
                </Typography>
                <Typography variant="caption2" weight="medium">
                  Medium
                </Typography>
              </div>
              <div className="gap-1 flex flex-col p-2 border-r border-gray-500">
                <Typography variant="caption3" weight="medium">
                  Caption 3
                </Typography>
                <Typography variant="caption3" weight="regular">
                  Regular
                </Typography>
                <Typography variant="caption3" weight="medium">
                  Medium
                </Typography>
              </div>
              <div className="gap-1 flex flex-col p-2 border-r border-gray-500">
                <Typography variant="caption3" weight="medium">
                  Caption 4
                </Typography>
                <Typography variant="caption4" weight="regular">
                  Regular
                </Typography>
                <Typography variant="caption4" weight="medium">
                  Medium
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Spinners / Logo */}
        <div className="flex items-start gap-7">
          {/* Spinners */}
          <div className="space-y-2">
            <Typography variant="caption2" weight="medium">
              Spinners
            </Typography>
            <div className="flex items-center gap-2 p-5 border border-gray-500 rounded">
              <Spinner size="small" />
              <Spinner />
              <Spinner size="large" variant="primary" />
            </div>
          </div>

          <div className="space-y-2">
            {/* Avatar */}
            <Typography variant="caption2" weight="medium">
              Avatar
            </Typography>
            <div className="flex items-center gap-2 p-5 border border-gray-500 rounded">
              <Avatar src="/images/Unsplash1.jpg" alt="Avatar" size="small" />
              <Avatar src="/images/Unsplash1.jpg" alt="Avatar" />
              <Avatar src="/images/Unsplash1.jpg" alt="Avatar" size="large" />
            </div>
          </div>

          <div className="space-y-2">
            {/* Logo */}
            <Typography variant="caption2" weight="medium">
              Logo
            </Typography>
            <div className="flex items-center gap-2 p-5 border border-gray-500 rounded">
              <Logo size="very-small" />
              <Logo size="small" />
              <Logo />
              <Logo size="large" />
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
              <div className="flex flex-wrap items-center gap-2 p-1">
                <Button size="small" isLoading variant="accent">
                  Accent
                </Button>
                <Button
                  size="small"
                  isLoading
                  variant="accent"
                  iconPosition="left"
                  iconName="user"
                >
                  Accent
                </Button>
                <Button size="small" isLoading variant="secondary">
                  Secondary
                </Button>
                <Button size="small" isLoading variant="outline">
                  Outline
                </Button>
                <Button size="small" isLoading variant="disabled" disabled>
                  Disabled
                </Button>
                <Button size="small" isLoading variant="ico" iconName="user" />
                <Button
                  size="small"
                  isLoading
                  variant="ico"
                  iconTheme="secondary"
                  iconName="user"
                />
                <Button
                  size="small"
                  isLoading
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
              <div className="flex flex-wrap items-center gap-2 p-1">
                <Button isLoading variant="accent">
                  Accent
                </Button>
                <Button
                  isLoading
                  variant="accent"
                  iconPosition="left"
                  iconName="user"
                >
                  Accent
                </Button>
                <Button isLoading variant="secondary">
                  Secondary
                </Button>
                <Button isLoading variant="outline">
                  Outline
                </Button>
                <Button isLoading variant="disabled" disabled>
                  Disabled
                </Button>
                <Button isLoading variant="ico" iconName="user" />
                <Button
                  isLoading
                  variant="ico"
                  iconTheme="secondary"
                  iconName="user"
                />
                <Button
                  isLoading
                  variant="ico"
                  iconTheme="gray"
                  iconName="user"
                />
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
      </Container>
    </div>
  );
}
