"use client";

import { useQuery } from "@tanstack/react-query";
import { authKeys, getCurrentUser } from "@/services/auth.service";

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    retry: false,
  });
}
