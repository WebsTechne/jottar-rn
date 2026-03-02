import { authClient } from "@/lib/auth-client";
import { showToast } from "@/lib/helpers/show-toast";
import { Note } from "@/types/notes";

const API_URL = `${process.env.EXPO_PUBLIC_BASE_URL}/api`;

// ----- Get functions -----
const getNotes = async (): Promise<Note[]> => {
  try {
    const cookies = authClient.getCookie();
    const headers = { Cookie: cookies };

    const res = await fetch(`${API_URL}/notes`, { headers, credentials: "omit" });

    if (!res.ok) {
      const err = await res.json();
      showToast(err?.message || "Failed to fetch notes");
      return [];
    }

    const json = await res.json();
    return json.data;
  } catch (err: any) {
    showToast(err?.message ?? "Network error while fetching notes");
    return [];
  }
};
const getOverviewNotes = async (): Promise<Note[]> => {
  try {
    const cookies = authClient.getCookie();
    const headers = { Cookie: cookies };

    const res = await fetch(`${API_URL}/notes?mode=overview`, { headers, credentials: "omit" });

    if (!res.ok) {
      const err = await res.json();
      showToast(err?.message || "Failed to fetch notes");
      return [];
    }

    const json = await res.json();
    return json.data;
  } catch (err: any) {
    showToast(err?.message ?? "Network error while fetching notes");
    return [];
  }
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
      const errorData = await res.json();
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
      const errorData = await res.json();
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
      const errorData = await res.json();
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
      const errorData = await res.json();
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
  updateNoteFolder,
  //
  trashNote,
  restoreNote,
};
