import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/helpers/show-toast";
import { Note } from "@/types/notes";

const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}/api`;

const safeJson = async (res: Response) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

// ----- Get functions -----
const getNotes = async (): Promise<Note[]> => {
  const cookies = authClient.getCookie();
  const headers = { Cookie: cookies };

  const res = await fetch(`${API_URL}/notes`, { headers, credentials: "omit" });

  if (!res.ok) {
    const err = await safeJson(res);
    showToast(err?.message || "Failed to fetch notes");
    throw new Error(err?.message || "Failed to fetch notes");
  }

  const json = await res.json();
  return json.data;
};
const getOverviewNotes = async (): Promise<Note[]> => {
  const cookies = authClient.getCookie();
  const headers = { Cookie: cookies };

  const res = await fetch(`${API_URL}/notes?mode=overview`, { headers, credentials: "omit" });

  if (!res.ok) {
    const err = await safeJson(res);
    showToast(err?.message || "Failed to load overview");
    throw new Error(err?.message || "Failed to load overview");
  }

  const json = await res.json();
  return json.data;
};

// ----- Edit functions -----
const trashNote = async (noteId: string) => {
  try {
    const cookies = authClient.getCookie();
    const headers = { Cookie: cookies };

    const res = await fetch(`${API_URL}/notes/${noteId}/trash`, {
      method: "POST",
      headers,
      credentials: "omit",
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      showToast(errorData.message || "Failed to trash note");
      return null;
    }

    const result = await res.json();
    return result.data;
  } catch (err: any) {
    console.error("Error trashing note:", err);
    showToast(err?.message ?? "Network error while trashing note");
    return null;
  }
};

const restoreNote = async (noteId: string) => {
  try {
    const cookies = authClient.getCookie();
    const headers = { Cookie: cookies };

    const res = await fetch(`${API_URL}/notes/${noteId}/restore`, {
      method: "POST",
      headers,
      credentials: "omit",
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      showToast(errorData.message || "Failed to restore note");
      return null;
    }

    const result = await res.json();
    return result.data; // restored note object
  } catch (err: any) {
    console.error("Error restoring note:", err);
    showToast(err?.message ?? "Network error while restoring note");
    return null;
  }
};

const toggleNotePinned = async (noteId: string, action?: string) => {
  try {
    const cookies = authClient.getCookie();
    const headers = { Cookie: cookies };

    const res = await fetch(`${API_URL}/notes/${noteId}/toggle-pin`, {
      method: "POST",
      headers,
      credentials: "omit",
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      showToast(errorData.message || `Failed to ${action} note`);
      return null;
    }

    const result = await res.json();
    return result.data; // pinned/unpinned note object
  } catch (err: any) {
    console.error(`Error ${action}ning note:`, err);
    showToast(err?.message ?? `Network error while ${action}ning note`);
    return null;
  }
};

const toggleNoteFavorited = async (noteId: string, action?: string) => {
  try {
    const cookies = authClient.getCookie();
    const headers = { Cookie: cookies };

    const res = await fetch(`${API_URL}/notes/${noteId}/toggle-favorite`, {
      method: "POST",
      headers,
      credentials: "omit",
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      showToast(errorData.message || `Failed to ${action} note`);
      return null;
    }

    const result = await res.json();
    return result.data; // favorited/unfavorited note object
  } catch (err: any) {
    console.error(`Error ${action}ing note:`, err);
    showToast(
      err?.message ??
        `Network error while ${action === "favorite" ? "favoriting" : "unfavoriting"} note`
    );
    return null;
  }
};
const toggleNoteArchived = async (noteId: string, action?: string) => {
  try {
    const cookies = authClient.getCookie();
    const headers = { Cookie: cookies };

    const res = await fetch(`${API_URL}/notes/${noteId}/toggle-archive`, {
      method: "POST",
      headers,
      credentials: "omit",
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      showToast(errorData.message || `Failed to ${action} note`);
      return null;
    }

    const result = await res.json();
    return result.data; // archived/unarchived note object
  } catch (err: any) {
    console.error(`Error ${action}ing note:`, err);
    showToast(
      err?.message ??
        `Network error while ${action === "archive" ? "archiving" : "unarchiving"} note`
    );
    return null;
  }
};

const updateNoteFolder = async (noteId: string, folderId: string | null) => {
  try {
    const cookies = authClient.getCookie();
    const headers = { Cookie: cookies, "Content-Type": "application/json" };

    const res = await fetch(`${API_URL}/notes/${noteId}/folder`, {
      method: "PATCH",
      headers,
      credentials: "omit",
      body: JSON.stringify({ folderId }),
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      showToast(errorData.message || "Failed to update note folder");
      return null;
    }

    const result = await res.json();
    return result; // { ok: true, success: true }
  } catch (err: any) {
    console.error("Error updating note folder:", err);
    showToast(err?.message ?? "Network error while updating folder");
    return null;
  }
};

const duplicateNote = async (noteId: string) => {
  try {
    const cookies = authClient.getCookie();
    const headers = { Cookie: cookies };

    const res = await fetch(`${API_URL}/notes/${noteId}/duplicate`, {
      method: "POST",
      headers,
      credentials: "omit",
    });

    if (!res.ok) {
      const errorData = await safeJson(res);
      showToast(errorData.message || "Failed to duplicate note");
      return null;
    }

    const result = await res.json();
    return result.data; // duplicated note object
  } catch (err: any) {
    console.error("Error duplicating note:", err);
    showToast(err?.message ?? "Network error while duplicating note");
    return null;
  }
};

export {
  //
  getNotes,
  getOverviewNotes,
  duplicateNote,
  //
  toggleNotePinned,
  toggleNoteFavorited,
  toggleNoteArchived,
  updateNoteFolder,
  //
  trashNote,
  restoreNote,
  //
  safeJson,
};
