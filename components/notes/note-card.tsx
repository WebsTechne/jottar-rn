import React, { useEffect, useMemo, useState } from "react";
import { View, Pressable, Modal, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Link, useRouter } from "expo-router";

import {
  Archive03Icon,
  ArchiveOff03Icon,
  Copy01Icon,
  Delete02Icon,
  Folder02Icon,
  FolderAddIcon,
  InformationCircleIcon,
  PinIcon,
  PinOffIcon,
  ReloadIcon,
  Share01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { type Note } from "@/types/notes";
import { type FolderDropdownItem } from "@/types/folders";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";
import { formatDateTime } from "@/lib/helpers/format-date-time";
import { extractTextFromDoc } from "@/lib/helpers/extract-text";
import { duplicateNote, restoreNote, trashNote, updateNoteFolder } from "@/api/notes";
import { showToast } from "@/lib/helpers/show-toast";
import { ContextMenu, ContextMenuTrigger } from "../ui/context-menu";
import { useOverlay } from "../overlay";
import { Text } from "../ui/text";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";

type Props = {
  note: Note;
  folders: FolderDropdownItem[];
  onPatch?: (updated: Partial<Note> & { id: string }) => void;
  view: "active" | "folder" | "favorites" | string;
};

const EXCLUDED_FOLDERS = new Set(["imported notes", "shared notes"]);

function NoteCard({ note, folders, onPatch, view }: Props) {
  const { colorScheme } = useColorScheme();
  const currentTheme = THEME[colorScheme ?? "light"];

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [localNote, setLocalNote] = useState<Note>(note);
  const [inFlight, setInFlight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

  const { active, open, close } = useOverlay();
  const owner = `note-context:${localNote.id}` as const;
  const isOpen = active === owner;

  const usableFolders = folders.filter((folder) => {
    const normalizedName = folder.name.trim().toLowerCase();
    return !EXCLUDED_FOLDERS.has(normalizedName);
  });
  const thisFolder = folders.find((f) => f.id === localNote.folderId);

  // preview extraction
  const preview = useMemo(() => {
    try {
      const parsed =
        typeof localNote.content === "string" ? JSON.parse(localNote.content) : localNote.content;
      return extractTextFromDoc(parsed).slice(0, 120);
    } catch {
      return "";
    }
  }, [localNote.content]);

  const { date, time } = useMemo(
    () => formatDateTime(localNote.updatedAt.toString()),
    [localNote.updatedAt]
  );

  // --- action handlers ---
  const handleTrashConfirm = async (id: string) => {
    if (inFlight) return;
    setInFlight(true);
    const prev = { ...localNote };
    setLocalNote((s) => ({ ...s, trashedAt: new Date() }) as any);
    try {
      const res = await trashNote(id);
      if (res?.error) {
        setLocalNote(prev);
        showToast(res.error);
        return;
      }
      if (res?.data) {
        setLocalNote((s) => ({ ...s, ...res.data }));
        onPatch?.(res.data);
        try {
          const channel = new BroadcastChannel("notes");
          channel.postMessage({ type: "patch", data: res.data });
          channel.close();
        } catch {}
      }
      showToast("Moved to Trash");
      setDeleteDialogOpen(false);
      setMenuOpen(false);
    } catch (err: any) {
      setLocalNote(prev);
      showToast(err?.message ?? "Network error");
    } finally {
      setInFlight(false);
    }
  };

  const handleRestore = async (id: string) => {
    if (inFlight) return;
    setInFlight(true);
    const prev = { ...localNote };
    setLocalNote((s) => ({ ...s, trashedAt: null }) as any);
    try {
      const res = await restoreNote(id);
      if (res?.error) {
        setLocalNote(prev);
        showToast(res.error);
        return;
      }
      if (res?.data) {
        setLocalNote((s) => ({ ...s, ...res.data }));
        onPatch?.(res.data);
        try {
          const channel = new BroadcastChannel("notes");
          channel.postMessage({ type: "patch", data: res.data });
          channel.close();
        } catch {}
      }
      showToast("Restored");
      setMenuOpen(false);
    } catch (err: any) {
      setLocalNote(prev);
      showToast(err?.message ?? "Network error");
    } finally {
      setInFlight(false);
    }
  };

  const handleFolderChange = async (newFolderId: string) => {
    if (inFlight) return;
    setInFlight(true);
    const targetId = newFolderId === "none" ? null : newFolderId;
    const prevFolderId = localNote.folderId;
    setLocalNote((s) => ({ ...s, folderId: targetId }) as any);
    try {
      const res = await updateNoteFolder(localNote.id, targetId);
      if (res?.error) {
        setLocalNote((s) => ({ ...s, folderId: prevFolderId }));
        showToast(res.error);
        return;
      }
      if (res?.success) {
        const patch = { id: localNote.id, folderId: targetId };
        onPatch?.(patch as any);
        try {
          const channel = new BroadcastChannel("notes");
          channel.postMessage({ type: "patch", data: patch });
          channel.close();
        } catch {}
        showToast("Folder updated");
        setMenuOpen(false);
      }
    } catch (err: any) {
      setLocalNote((s) => ({ ...s, folderId: prevFolderId }));
      showToast(err?.message ?? "Network error");
    } finally {
      setInFlight(false);
    }
  };

  const handleDuplicateNote = async (noteId: string) => {
    if (inFlight) return;
    setInFlight(true);
    try {
      const res = await duplicateNote(noteId);
      if (res?.error) {
        showToast(res.error);
        return;
      }
      if (res?.data) {
        showToast("Note duplicated");
        setMenuOpen(false);
      }
    } catch (err: any) {
      showToast(err?.message ?? "Network error");
    } finally {
      setInFlight(false);
    }
  };

  const optimisticToggle = async (
    key: "isPinned" | "favorite" | "archived" | "folderId",
    actionFn: (id: string) => Promise<any>,
    { force = false, showUndo = false } = {}
  ) => {
    const id = localNote.id;
    if (inFlight && !force) return;
    setInFlight(true);
    const prev = { ...localNote };
    setLocalNote((s) => ({ ...s, [key]: !s[key] }) as any);
    try {
      const res = await actionFn(id);
      if (res?.error) {
        setLocalNote(prev);
        showToast(res.error);
        return;
      }
      if (res?.data) {
        setLocalNote((s) => ({ ...s, ...res.data }));
        onPatch?.(res.data);
        try {
          const channel = new BroadcastChannel("notes");
          channel.postMessage({ type: "patch", data: res.data });
          channel.close();
        } catch {}
      }
      showToast("Done");
    } catch (err: any) {
      setLocalNote(prev);
      showToast(err?.message ?? "Network error");
    } finally {
      setInFlight(false);
    }
  };

  return (
    <>
      <ContextMenu open={isOpen} onOpenChange={(v) => (v ? open(owner) : close())}>
        <ContextMenuTrigger asChild>
          <View
            className={cn(
              "relative h-[100px] w-full overflow-hidden rounded-lg bg-muted p-3 pb-2 dark:!bg-card",
              isOpen && "shadow-sm"
            )}>
            <View className="pointer-events-none absolute right-1 top-1 inline-flex min-h-5 w-5 flex-col items-center justify-center gap-[3px]">
              {localNote.isPinned && view === "active" && (
                <HugeiconsIcon
                  icon={PinIcon}
                  size={16}
                  fill={currentTheme.mutedForeground}
                  className="text-muted-foreground"
                />
              )}
              {localNote.favorite &&
                (view === "active" || view === "folder" || view === "favorites") && (
                  <HugeiconsIcon
                    icon={StarIcon}
                    size={14}
                    fill={currentTheme.mutedForeground51}
                    className="text-transparent"
                  />
                )}
            </View>

            <View className="relative h-max w-full flex-1">
              <Text variant="h3" className="line-clamp-1 font-semibold !text-base tracking-tight">
                {localNote.title ?? "Untitled Note"}
              </Text>
              <Text className="line-clamp-2 text-sm text-muted-foreground">{preview}</Text>
            </View>

            <View className="flex-row items-center justify-end gap-2 font-mono">
              <Text className="text-xs text-muted-foreground">{date}</Text>
              <Text className="text-xs text-muted-foreground">{time}</Text>
            </View>

            {/* absolute clickable layer */}
            <Link href={`/notes/${localNote.id}`} className="absolute inset-0 z-10" />
          </View>
        </ContextMenuTrigger>
      </ContextMenu>
    </>
  );
}

function NoteCardSkeleton() {
  return (
    <View className="flex-center h-[100px] w-full overflow-hidden rounded-2xl">
      <Skeleton className="size-full !rounded-[inherit]" />
    </View>
  );
}

export { NoteCard, NoteCardSkeleton };
