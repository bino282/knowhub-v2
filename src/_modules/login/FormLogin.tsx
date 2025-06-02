"use client";
import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [form, setForm] = React.useState({ email: "", password: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleGoogleSignIn = async () => {
    await signIn("google", {
      redirect: true,
      callbackUrl: `/dashboard`,
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    if (res?.error === null) {
      router.push(`/dashboard`);
      toast.success("Login successful");
    } else {
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <BrainCircuit className="h-12 w-12 text-[#2563EB]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          KnowHub
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Your intelligent knowledge management system
        </p>
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 dark:bg-gray-800"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={handleChange}
                  className="px-4 py-2"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={handleChange}
                  className="px-4 py-2"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-[#2563EB] hover:text-[#3B82F6] dark:text-[#60A5FA]"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="bg-[#2563EB] text-white hover:bg-blue-700 focus:ring-[#3B82F6] w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign in
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                />
                Sign in with Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-[#2563EB] hover:text-[#3B82F6] dark:text-[#60A5FA]"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
