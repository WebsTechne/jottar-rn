import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/helpers/show-toast";
import { FolderDropdownItem, FolderListItem, FolderOverview } from "@/types/folders";

const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}/api`;

// ----- Folder functions -----
export const getFolders = async (): Promise<FolderListItem[]> => {
  try {
    const cookies = authClient.getCookie();
    const headers = { Cookie: cookies };

    const res = await fetch(`${API_URL}/folders`, { headers, credentials: "omit" });

    if (!res.ok) {
      const err = await res.json();
      showToast(err?.message || "Failed to fetch folders");
      return [];
    }

    const json = await res.json();
    return json.data;
  } catch (err: any) {
    showToast(err?.message ?? "Network error while fetching folders");
    return [];
  }
};

export const getOverviewFolders = async (): Promise<FolderOverview[]> => {
  try {
    const cookies = authClient.getCookie();
    const headers = { Cookie: cookies };

    const res = await fetch(`${API_URL}/folders?mode=overview`, { headers, credentials: "omit" });

    if (!res.ok) {
      const err = await res.json();
      showToast(err?.message || "Failed to fetch overview folders");
      return [];
    }

    const json = await res.json();
    return json.data;
  } catch (err: any) {
    showToast(err?.message ?? "Network error while fetching overview folders");
    return [];
  }
};

export const getDropdownFolders = async (): Promise<FolderDropdownItem[]> => {
  try {
    const cookies = authClient.getCookie();
    const headers = { Cookie: cookies };

    const res = await fetch(`${API_URL}/folders?mode=dropdown`, { headers, credentials: "omit" });

    if (!res.ok) {
      const err = await res.json();
      showToast(err?.message || "Failed to fetch dropdown folders");
      return [];
    }

    const json = await res.json();
    return json.data;
  } catch (err: any) {
    showToast(err?.message ?? "Network error while fetching dropdown folders");
    return [];
  }
};
