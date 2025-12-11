// src/lib/api/profile.ts
import { mockApi } from "@/services/mockApi";
// import { getUserProfileBackend } from "@/lib/api"; // uncomment when backend available

export const getUserProfile = async (userId: string) => {
  // Try to load a per-user mock file first (public/mock-data/users/{userId}.json)
  const userFilePath = `users/${userId}`;
  const profile = await mockApi.get(userFilePath);

  if (profile) return profile;

  // fallback to global currentUser.json
  const fallback = await mockApi.get("currentUser");
  if (fallback) return fallback;

  // Final fallback: return null
  return null;
};
