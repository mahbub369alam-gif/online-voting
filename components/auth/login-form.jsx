"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        // Redirect will be handled by the auth system
        window.location.href = "/admin/dashboard";
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-gray-100">
      {/* Curved Green Background */}
      <div className="absolute inset-0">
        <div
          className="h-full bg-gradient-to-br from-emerald-400 to-teal-500"
          style={{
            clipPath: "polygon(0 0, 65% 0, 45% 100%, 0% 100%)",
          }}
        />
      </div>

      {/* Left Side Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 lg:px-16">
        <div className="text-white max-w-md">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            "E-Voting Administration Portal –
          </h1>
          <p className="text-xl lg:text-2xl opacity-90">
            Please log in with your credentials."
          </p>
        </div>
      </div>

      {/* Right Side Login Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 lg:px-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Log IN
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Username/Email Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <Input
                  type="email"
                  placeholder="enter your user name or id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Lock className="h-5 w-5 text-blue-500" />
                </div>
                <Input
                  type="password"
                  placeholder="enter your user password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-0 placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Login Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-lg font-semibold bg-teal-400 hover:bg-teal-500 text-white rounded-lg shadow-lg transition-colors"
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
