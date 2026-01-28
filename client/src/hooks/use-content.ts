import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertSocialLink, type InsertAutomationLink, type InsertAboutMe } from "@shared/routes";

// --- Social Links ---

export function useSocialLinks() {
  return useQuery({
    queryKey: [api.socialLinks.list.path],
    queryFn: async () => {
      const res = await fetch(api.socialLinks.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch social links");
      return api.socialLinks.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertSocialLink) => {
      const res = await fetch(api.socialLinks.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create social link");
      return api.socialLinks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.socialLinks.list.path] }),
  });
}

export function useDeleteSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.socialLinks.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete social link");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.socialLinks.list.path] }),
  });
}

// --- Automation Links ---

export function useAutomationLinks() {
  return useQuery({
    queryKey: [api.automationLinks.list.path],
    queryFn: async () => {
      const res = await fetch(api.automationLinks.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch automation links");
      return api.automationLinks.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAutomationLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAutomationLink) => {
      const res = await fetch(api.automationLinks.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create automation link");
      return api.automationLinks.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.automationLinks.list.path] }),
  });
}

export function useDeleteAutomationLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.automationLinks.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete automation link");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.automationLinks.list.path] }),
  });
}

// --- About Me ---

export function useAboutMe() {
  return useQuery({
    queryKey: [api.aboutMe.get.path],
    queryFn: async () => {
      const res = await fetch(api.aboutMe.get.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch about me");
      return api.aboutMe.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpdateAboutMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAboutMe) => {
      const res = await fetch(api.aboutMe.update.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update about me");
      return api.aboutMe.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.aboutMe.get.path] }),
  });
}
