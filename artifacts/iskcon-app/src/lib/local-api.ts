import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createActivity,
  createMessage,
  getActivitiesForPurpose,
  getCurrentUserFromStorage,
  getMessagesForPurpose,
  getPurpose,
  subscribeToLocalData,
} from "@/lib/local-data";

export function getGetActivitiesQueryKey(purposeId: number) {
  return ["activities", purposeId];
}

export function getGetMessagesQueryKey(purposeId: number) {
  return ["messages", purposeId];
}

function useLocalSubscription() {
  return {
    refetchOnMount: true as const,
    staleTime: 0,
    gcTime: 0,
  };
}

export function useGetPurpose(id: number, options?: { query?: Record<string, unknown> }) {
  return useQuery({
    queryKey: ["purpose", id],
    queryFn: () => getPurpose(id),
    ...(options?.query ?? {}),
    ...useLocalSubscription(),
  });
}

export function useGetActivities(id: number, options?: { query?: Record<string, unknown> }) {
  return useQuery({
    queryKey: getGetActivitiesQueryKey(id),
    queryFn: () => getActivitiesForPurpose(id, getCurrentUserFromStorage()),
    ...(options?.query ?? {}),
    ...useLocalSubscription(),
  });
}

export function useGetMessages(id: number, options?: { query?: Record<string, unknown> }) {
  return useQuery({
    queryKey: getGetMessagesQueryKey(id),
    queryFn: () => getMessagesForPurpose(id, getCurrentUserFromStorage()),
    ...(options?.query ?? {}),
    ...useLocalSubscription(),
  });
}

export function useCreateActivity() {
  return useMutation({
    mutationFn: async ({ purposeId, data }: { purposeId: number; data: Parameters<typeof createActivity>[1] }) => {
      createActivity(purposeId, data);
      return null;
    },
  });
}

export function useCreateMessage() {
  return useMutation({
    mutationFn: async ({ purposeId, data }: { purposeId: number; data: Parameters<typeof createMessage>[1] }) => {
      createMessage(purposeId, data);
      return null;
    },
  });
}

export function subscribeQueries(onChange: () => void) {
  return subscribeToLocalData(onChange);
}
