import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/helpers/show-toast";
import { FolderDropdownItem, FolderListItem, FolderOverview } from "@/types/folders-types";
import { safeJson } from "./notes";

const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}/api`;

// ----- Folder functions -----
const getFolders = async (): Promise<FolderListItem[]> => {
  const cookies = authClient.getCookie();
  const headers = { Cookie: cookies };

  const res = await fetch(`${API_URL}/folders`, { headers, credentials: "omit" });

  if (!res.ok) {
    const err = await safeJson(res);
    showToast(err?.message || "Failed to fetch folders");
    throw new Error(err?.message || "Failed to fetch folders");
  }

  const json = await res.json();
  return json.data;
};

const getOverviewFolders = async (): Promise<FolderOverview[]> => {
  const cookies = authClient.getCookie();
  const headers = { Cookie: cookies };

  const res = await fetch(`${API_URL}/folders?mode=overview`, { headers, credentials: "omit" });

  if (!res.ok) {
    const err = await safeJson(res);
    showToast(err?.message || "Failed to load overview");
    throw new Error(err?.message || "Failed to load overview");
  }

  const json = await res.json();
  return json.data;
};

const getDropdownFolders = async (): Promise<FolderDropdownItem[]> => {
  const cookies = authClient.getCookie();
  const headers = { Cookie: cookies };

  const res = await fetch(`${API_URL}/folders?mode=dropdown`, { headers, credentials: "omit" });

  if (!res.ok) {
    const err = await safeJson(res);
    showToast(err?.message || "Failed to fetch folders");
    throw new Error(err?.message || "Failed to fetch folders");
  }

  const json = await res.json();
  return json.data;
};

export { getFolders, getOverviewFolders, getDropdownFolders };
