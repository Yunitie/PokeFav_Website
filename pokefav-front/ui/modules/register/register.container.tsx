"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RegisterView from "./register.view";
import { API_BASE_URL } from "@/lib/config";

export default function RegisterContainer() {
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

    // Même règles de base que le backend (longueur minimale)
    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
    <RegisterView
      formData={formData}
      error={error}
      isLoading={isLoading}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
