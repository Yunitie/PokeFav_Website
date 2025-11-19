import React from "react";
import Container from "@/ui/components/container/container";
import { Typography } from "@/ui/design-system/typography/typography";
import Button from "@/ui/design-system/button/button";
import Logo from "@/ui/design-system/logo/logo";
import Spinner from "@/ui/design-system/spinner/spinner";

interface RegisterViewProps {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    displayName: string;
  };
  error: string;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * View d'inscription - Composant pure pour l'affichage du formulaire d'inscription
 */
export default function RegisterView({
  formData,
  error,
  isLoading,
  onChange,
  onSubmit,
}: RegisterViewProps) {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#171717]">
      <Container className="max-w-md w-full">
        <div className="bg-white dark:bg-[#1F1F1F] border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo
                size="large"
                color="black"
                className="dark:fill-[#F3EDF5]"
              />
            </div>
            <Typography
              variant="h2"
              component="h1"
              className="mb-2 text-black dark:text-white"
            >
              Create an account
            </Typography>
            <Typography
              variant="body-base"
              theme="gray"
              className="text-black dark:text-white"
            >
              Join PokeFav and start creating your favorite Pokemon lists
            </Typography>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Display name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Display name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                required
                value={formData.displayName}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-[#2A2A2A] dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Your display name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-[#2A2A2A] dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-[#2A2A2A] dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Your password"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-[#2A2A2A] dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Confirm your password"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <Typography variant="body-base" theme="danger">
                  {error}
                </Typography>
              </div>
            )}
            <Typography variant="body-sm" theme="gray-600">
              Your informations will be used only to create your account
            </Typography>

            {/* Register button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Spinner size="small" className="mr-2" />
                  Creating account...
                </>
              ) : (
                "Create my account"
              )}
            </Button>
          </form>

          {/* Additional links */}
          <div className="mt-6 text-center">
            <Typography
              variant="body-base"
              theme="gray"
              className="text-black dark:text-gray-300"
            >
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Sign in
              </a>
            </Typography>
          </div>
        </div>
      </Container>
    </div>
  );
}
