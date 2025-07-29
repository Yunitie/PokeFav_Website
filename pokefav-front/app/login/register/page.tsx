"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/ui/components/container/container";
import { Typography } from "@/ui/design-system/typography/typography";
import Button from "@/ui/design-system/button/button";
import Logo from "@/ui/design-system/logo/logo";
import Spinner from "@/ui/design-system/spinner/spinner";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration error");
      }

      // Redirect to login page after successful registration
      router.push(
        "/login?message=Registration successful! You can now sign in."
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Registration error");
      } else {
        setError("Registration error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="large" />
            </div>
            <Typography variant="h2" component="h1" className="mb-2">
              Create an account
            </Typography>
            <Typography variant="body-base" theme="gray">
              Join PokeFav and start creating your favorite Pokemon lists
            </Typography>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Your display name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Your password"
              />
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            <Typography variant="body-base" theme="gray">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
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
