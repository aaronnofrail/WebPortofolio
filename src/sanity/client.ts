import { createClient } from "@sanity/client";
import { sanityConfig } from "./config";

export const client = createClient(sanityConfig);

// Helper function to fetch data with a fallback to mock data
export async function sanityFetch<T>({
  query,
  fallback,
  params = {},
}: {
  query: string;
  fallback: T;
  params?: Record<string, any>;
}): Promise<T> {
  // If using placeholder project ID, return fallback immediately
  if (sanityConfig.projectId === "aaronnofrail_project") {
    return fallback;
  }
  
  try {
    const data = await client.fetch<T>(query, params);
    if (data === null || (Array.isArray(data) && data.length === 0)) {
      return fallback;
    }
    return data;
  } catch (error) {
    console.warn("Sanity fetch failed, falling back to local mockup data:", error);
    return fallback;
  }
}
export default client;
