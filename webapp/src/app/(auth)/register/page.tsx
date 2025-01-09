"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import apiClient from "@/lib/axios";
import countriesJson from "@/app/data/countries.json";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CountryCommand } from "@/components/country-command";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

interface FormData {
  email: string;
  fullName: string;
  password: string;
  country: string;
  isAgreed: boolean;
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      country: "US",
      isAgreed: false,
    },
  });
  const { login } = useAuth(); // Access auth state
  const { toast } = useToast();
  const router = useRouter();
  const [countries, setCountries] = useState<
    { code: string; country: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const transformed = Object.entries(countriesJson).map(
      ([code, data]: any) => ({
        code,
        country: data.country,
      })
    );
    setCountries(transformed);
  }, []);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/api/user/register", {
        ...data,
        product: process.env.NEXT_PUBLIC_PRODUCT_KEY,
      });
      const { token } = response.data;

      login(token);

      toast({
        description: "Registration successful! Redirecting...",
      });
      router.replace("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        description:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isAgreed = watch("isAgreed");

  return (
    <form className={"flex flex-col gap-6"} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Create an account to get started
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
            <span className="text-sm text-red-600">{errors.email.message}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            {...register("fullName", { required: "Full Name is required" })}
            disabled={loading}
          />
          {errors.fullName && (
            <span className="text-sm text-red-600">
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Minimum 8 characters required",
              },
            })}
            disabled={loading}
          />
          {errors.password && (
            <span className="text-sm text-red-600">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="country">Country</Label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <CountryCommand
                countries={countries}
                value={field.value}
                onSelect={(code) => setValue("country", code)}
                disabled={loading}
              />
            )}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="isAgreed"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={(val) => setValue("isAgreed", Boolean(val))}
                disabled={loading}
              />
            )}
          />
          <label htmlFor="terms" className="text-sm">
            I agree to the{" "}
            <a href="/terms-of-use" className="text-blue-600 hover:underline">
              Terms and Conditions
            </a>
          </label>
        </div>

        <Button
          type="submit"
          disabled={!isValid || loading || !isAgreed}
          className="w-full"
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}