"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Form data structure
interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth(); // Access auth state
  const router = useRouter(); // Next.js router instance
  const { toast } = useToast(); // Access toast context
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    mode: "onChange",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/"); // Smooth redirect to home if already logged in
    }
  }, [isLoggedIn, router]);

  // Login handler
  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/api/user/login", {
        ...data,
        product: process.env.NEXT_PUBLIC_PRODUCT_KEY,
      });
      const { token } = response.data; // Assuming response includes user details

      // Save login state
      login(token);
      toast({
        description: "Logged in successfully",
      });

      // Smooth transition to home
      router.replace("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message || "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner during redirect
  if (isLoggedIn) return null;

  return (
    <div className="flex flex-col gap-6">
      <form
        className={cn("flex flex-col gap-6")}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email", { required: "Email is required" })}
              disabled={loading}
            />
            {errors.email && (
              <span className="text-sm text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                onClick={() => setIsOpen(true)}
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              disabled={loading}
            />
            {errors.password && (
              <span className="text-sm text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>
          <Button
            type="submit"
            disabled={!isValid || loading}
            className="w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Forgot your password?</AlertDialogTitle>
            <AlertDialogDescription>
              There are steps to recover your password:
              <ul className="list-decimal list-inside">
                <li>
                  Send an password recovery email to{" "}
                  <a className="underline" href="mailto:hello@allplrs.com">
                    hello@allplrs.com
                  </a>{" "}
                  with your registered email.
                </li>
                <li>
                  Follow the instructions in the email to reset your password.
                </li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got It</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
