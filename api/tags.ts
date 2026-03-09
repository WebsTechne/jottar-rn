import { authClient } from "@/lib/auth-client";
import { TagListItem } from "@/types/tags-types";
import { safeJson } from "./notes";
import { showToast } from "@/lib/helpers/show-toast";

const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}/api`;

const getTags = async (): Promise<TagListItem[]> => {
  const cookies = await authClient.getCookie();
  const headers = { Cookie: cookies };

  const res = await fetch(`${API_URL}/tags`, { headers });

  if (!res.ok) {
    const err = await safeJson(res);
    showToast(err?.message || "Failed to fetch tags");
    throw new Error(err?.message || "Failed to fetch tags");
  }

  const json = await res.json();
  return json.data;
};

export { getTags };
