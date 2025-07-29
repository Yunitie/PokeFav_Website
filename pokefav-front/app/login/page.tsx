"use client";

import { useState } from "react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthUserContext";
import Container from "@/ui/components/container/container";
import { Typography } from "@/ui/design-system/typography/typography";
import Button from "@/ui/design-system/button/button";
import Logo from "@/ui/design-system/logo/logo";
import Spinner from "@/ui/design-system/spinner/spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check URL parameters for messages
  React.useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      setSuccess(message);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/"); // Redirect to home page after login
    } catch (error) {
      setError("Incorrect email or password");
      console.log(error);
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
              Login
            </Typography>
            <Typography variant="body-sm" theme="gray">
              Sign in to your PokeFav account
            </Typography>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Your password"
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

            {/* Success message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <Typography variant="body-base" theme="success">
                  {success}
                </Typography>
              </div>
            )}

            {/* Login button */}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="small" />
                  Logging in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Additional links */}
          <div className="mt-6 text-center space-y-4">
            <div>
              <Typography variant="body-base" theme="gray">
                Don&apos;t have an account yet?{" "}
                <a
                  href="/login/register"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Create an account
                </a>
              </Typography>
            </div>
            <div>
              <a
                href="/login/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
