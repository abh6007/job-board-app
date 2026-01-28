import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertJob } from "@shared/routes";

export function useJobs(search?: string) {
  return useQuery({
    queryKey: [api.jobs.list.path, search],
    queryFn: async () => {
      const url = search 
        ? `${api.jobs.list.path}?search=${encodeURIComponent(search)}`
        : api.jobs.list.path;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return api.jobs.list.responses[200].parse(await res.json());
    },
  });
}

export function useJob(id: number | null) {
  return useQuery({
    queryKey: [api.jobs.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.jobs.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch job");
      return api.jobs.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertJob) => {
      const res = await fetch(api.jobs.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create job");
      return api.jobs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.jobs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.admin.stats.path] });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertJob>) => {
      const url = buildUrl(api.jobs.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update job");
      return api.jobs.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.jobs.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.admin.stats.path] });
    },
  });
}

export function useTrackJobClick() {
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.jobs.trackClick.path, { id });
      const res = await fetch(url, { 
        method: "POST", 
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to track click");
      return api.jobs.trackClick.responses[200].parse(await res.json());
    },
  });
}
