"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage, isUnauthorizedError } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { logout } from "@/services/auth.service";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const userQuery = useCurrentUser();

  useEffect(() => {
    if (userQuery.error && isUnauthorizedError(userQuery.error)) {
      router.replace("/login");
    }
  }, [router, userQuery.error]);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success("You have been logged out.");
      router.replace("/login");
      router.refresh();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Unable to log out."));
    },
  });

  if (userQuery.isPending) {
    return <LoadingState fullScreen message="Opening your workspace…" />;
  }

  if (userQuery.isError || !userQuery.data) {
    if (isUnauthorizedError(userQuery.error)) {
      return <LoadingState fullScreen message="Returning to sign in…" />;
    }

    return (
      <div className="grid min-h-screen place-items-center p-6">
        <ErrorState
          title="StaffFlow could not connect"
          message={getApiErrorMessage(
            userQuery.error,
            "Check that the API server is running, then try again.",
          )}
          onRetry={() => userQuery.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <Navbar
          user={userQuery.data}
          isLoggingOut={logoutMutation.isPending}
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={() => logoutMutation.mutate()}
        />
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
