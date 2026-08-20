"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getApiErrorMessage } from "@/lib/api";
import { authKeys, login } from "@/services/auth.service";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required.").email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.currentUser(), user);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}.`);
      const requestedPath = new URLSearchParams(window.location.search).get("from");
      const destination = requestedPath?.startsWith("/dashboard")
        ? requestedPath
        : "/dashboard";
      router.replace(destination);
      router.refresh();
    },
  });

  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-[1fr_1.05fr]">
      <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 text-sm font-bold">
            SF
          </span>
          StaffFlow
        </Link>
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Your people workspace
          </p>
          <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight">
            The daily details of HR, finally in one place.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Manage employee records, attendance, departments, and workforce reporting
            from a dashboard your whole team can understand.
          </p>
        </div>
        <p className="text-sm text-slate-600">Secure administrator access</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to StaffFlow
          </Link>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-100 text-blue-700">
            <LockKeyhole className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">
            Welcome back
          </h1>
          <p className="mt-2 text-slate-600">Sign in with your StaffFlow admin account.</p>

          <form
            onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
            className="mt-8 space-y-5"
            noValidate
          >
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
                placeholder="admin@company.com"
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password")}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 shadow-sm outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {loginMutation.isError && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {getApiErrorMessage(loginMutation.error, "Unable to sign in.")}
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginMutation.isPending && (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {loginMutation.isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Demo account details are created by the backend seed command and documented
            in the project README.
          </p>
        </div>
      </section>
    </main>
  );
}
