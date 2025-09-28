"use client";

/* eslint-disable */
import Logo from "@/ui/design-system/logo/logo";
import Container from "../container/container";
import { Typography } from "@/ui/design-system/typography/typography";
import Button from "@/ui/design-system/button/button";
import Link from "next/link";
import ActiveLink from "./active-link";
import { useAuth } from "@/context/AuthUserContext";
import { useState } from "react";
// import { AccountAvatarNavigationLink } from "./account-avatar-link";

interface Props {}

const Navigation = ({}: Props) => {
  const { authUser, logout, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const authenticationSystem = (
    <div className="flex items-center gap-2">
      <Button baseUrl="/login" size="small">
        Login
      </Button>
      <Button baseUrl="/login/register" size="small" variant="secondary">
        Join
      </Button>
    </div>
  );

  const navigationLinks = (
    <>
      <ActiveLink href="/pokemon-choice">Pokemon</ActiveLink>
      <ActiveLink href="/my-ranking">My Ranking</ActiveLink>
    </>
  );

  const userSection = (
    <>
      {loading ? (
        <div className="flex items-center gap-2">
          <Typography variant="caption3" component="span">
            Loading...
          </Typography>
        </div>
      ) : !authUser ? (
        authenticationSystem
      ) : (
        <div className="flex items-center gap-4">
          <Typography
            variant="caption3"
            component="span"
            theme="primary"
            weight="medium"
          >
            {authUser?.displayName || ""}
          </Typography>
          <Button
            action={async () => {
              try {
                await logout();
              } catch (error) {
                console.error("Error during logout:", error);
              }
            }}
            size="small"
            variant="secondary"
          >
            Logout
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div className="border-b-2 border-gray-400 relative">
      <Container className="flex items-center justify-between py-1.5 gap-7">
        {/* Logo - always visible */}
        <Link href="/" onClick={closeMobileMenu}>
          <div className="flex items-center gap-2.5">
            <Logo size="small" />
            <div className="flex flex-col">
              <div className="text-gray font-extrabold text-[24px]">
                PokeFav
              </div>
              <Typography variant="caption4" theme="gray" component="span">
                Create and share your favorite Pokemon lists!
              </Typography>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden md:flex items-center gap-7">
          <Typography
            variant="caption3"
            component="div"
            className="flex items-center gap-7"
          >
            {navigationLinks}
          </Typography>
          {/* Barre verticale si connecté */}
          {!loading && authUser && (
            <div className="self-stretch w-px bg-gray-300" />
          )}
          {userSection}
        </div>

        {/* Hamburger Button - visible only on mobile */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
          aria-label="Menu"
        >
          <span
            className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>
      </Container>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b-2 border-gray-400 shadow-lg z-50">
          <div className="px-4 py-6 space-y-6">
            {/* Mobile Navigation Links */}
            <div className="space-y-4">
              <Typography
                variant="caption2"
                weight="medium"
                className="mb-4 block"
              >
                Navigation
              </Typography>
              <div className="flex flex-col space-y-3">
                <Link
                  href="/pokemon-choice"
                  onClick={closeMobileMenu}
                  className="text-gray-700 hover:text-primary transition-colors py-2"
                >
                  Pokemon
                </Link>
                <Link
                  href="/my-ranking"
                  onClick={closeMobileMenu}
                  className="text-gray-700 hover:text-primary transition-colors py-2"
                >
                  My Ranking
                </Link>
              </div>
            </div>

            {/* Mobile User Section */}
            <div className="pt-4 border-t border-gray-200">
              <Typography
                variant="caption2"
                weight="medium"
                className="mb-4 block"
              >
                Account
              </Typography>
              <div className="space-y-3">
                {loading ? (
                  <Typography variant="caption3" component="span">
                    Loading...
                  </Typography>
                ) : !authUser ? (
                  <div className="flex flex-col space-y-2">
                    <Button baseUrl="/login" size="small" fullWith>
                      Login
                    </Button>
                    <Button
                      baseUrl="/login/register"
                      size="small"
                      variant="secondary"
                      fullWith
                    >
                      Join
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Typography
                      variant="caption3"
                      component="div"
                      theme="primary"
                      weight="medium"
                    >
                      Hello, {authUser?.displayName || ""}
                    </Typography>
                    <Button
                      action={async () => {
                        try {
                          await logout();
                          closeMobileMenu();
                        } catch (error) {
                          console.error("Error during logout:", error);
                        }
                      }}
                      size="small"
                      variant="secondary"
                      fullWith
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;
