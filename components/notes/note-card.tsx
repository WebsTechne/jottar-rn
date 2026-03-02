import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Link } from "expo-router";

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
import { formatDateTime } from "@/lib/helpers/format-date-time";
import { extractTextFromDoc } from "@/lib/helpers/extract-text";
import {
  duplicateNote,
  restoreNote,
  toggleNoteArchived,
  toggleNoteFavorited,
  toggleNotePinned,
  trashNote,
  updateNoteFolder,
} from "@/api/notes";
import { showToast } from "@/lib/helpers/show-toast";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useOverlay } from "../overlay";
import { Text } from "../ui/text";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";
import { buttonVariants } from "../ui/button";

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
  const handleDeleteDialogChange = (value: boolean) => {
    setDeleteDialogOpen(value);
  };

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const handleDetailsDialogChange = (value: boolean) => {
    setDetailsDialogOpen(value);
  };

  const [localNote, setLocalNote] = useState<Note>(note);
  const [inFlight, setInFlight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    actionFn: (id: string, action?: string) => Promise<any>,
    { force = false, showUndo = false } = {}
  ) => {
    const id = localNote.id;
    if (inFlight && !force) return;
    setInFlight(true);
    const prev = { ...localNote };
    setLocalNote((s) => ({ ...s, [key]: !s[key] }) as any);
    try {
      let res;
      switch (actionFn) {
        case toggleNotePinned:
          res = await actionFn(id, localNote.isPinned ? "unpin" : "pin");
          break;
        case toggleNoteFavorited:
          res = await actionFn(id, localNote.favorite ? "unfavorite" : "favorite");
          break;
        case toggleNoteArchived:
          res = await actionFn(id, localNote.archived ? "unarchive" : "archive");
          break;
        default:
          res = await actionFn(id);
      }
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
      <ContextMenu open={true} onOpenChange={(v) => (v ? open(owner) : close())}>
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

            <View className="flex-row items-center justify-end gap-2">
              <Text className="font-mono text-xs text-muted-foreground">{date}</Text>
              <Text className="font-mono text-xs text-muted-foreground">{time}</Text>
            </View>

            {/* absolute clickable layer */}
            <Link href={`/notes/${localNote.id}`} className="absolute inset-0 z-10" />
          </View>
        </ContextMenuTrigger>

        <ContextMenuContent className="!min-w-52">
          {!localNote.archived && !localNote.trashedAt && (
            <>
              <ContextMenuGroup>
                {view === "active" && (
                  <ContextMenuItem onPress={() => optimisticToggle("isPinned", toggleNotePinned)}>
                    {localNote.isPinned ? (
                      <>
                        <HugeiconsIcon icon={PinOffIcon} strokeWidth={2} />
                        Unpin note
                      </>
                    ) : (
                      <>
                        <HugeiconsIcon icon={PinIcon} strokeWidth={2} />
                        Pin note
                      </>
                    )}
                  </ContextMenuItem>
                )}

                <ContextMenuItem onPress={() => optimisticToggle("favorite", toggleNoteFavorited)}>
                  {localNote.favorite ? (
                    <>
                      <HugeiconsIcon icon={StarIcon} fill="currentColor" strokeWidth={2} />
                      Remove from favorites
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon icon={StarIcon} strokeWidth={2} />
                      Add to favorites
                    </>
                  )}
                </ContextMenuItem>
              </ContextMenuGroup>

              <ContextMenuSeparator />
            </>
          )}

          {!localNote.trashedAt && (
            <>
              <ContextMenuItem
                onPress={() =>
                  optimisticToggle("archived", toggleNoteArchived, {
                    showUndo: true,
                  })
                }>
                {localNote.archived ? (
                  <>
                    <HugeiconsIcon icon={ArchiveOff03Icon} strokeWidth={2} />
                    Unarchive note
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Archive03Icon} strokeWidth={2} />
                    Archive note
                  </>
                )}
              </ContextMenuItem>

              <ContextMenuSeparator />
            </>
          )}

          {!localNote.trashedAt && (
            <>
              <ContextMenuItem onPress={() => handleDuplicateNote(localNote.id)}>
                <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
                Duplicate note
              </ContextMenuItem>

              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  <HugeiconsIcon icon={Folder02Icon} strokeWidth={2} />
                  Move to folder
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuGroup>
                    <ContextMenuItem asChild>
                      <Link
                        href="/folders/new"
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "justify-start! w-full"
                        )}>
                        <HugeiconsIcon icon={FolderAddIcon} strokeWidth={2} />
                        New folder
                      </Link>
                    </ContextMenuItem>

                    {usableFolders.length > 0 && <ContextMenuSeparator />}

                    <ContextMenuRadioGroup
                      value={localNote.folderId ?? "none"}
                      onValueChange={handleFolderChange}>
                      <ContextMenuRadioItem value="none">None</ContextMenuRadioItem>
                      {usableFolders.map((folder) => (
                        <ContextMenuRadioItem key={folder.id} value={folder.id}>
                          {folder.name}
                        </ContextMenuRadioItem>
                      ))}
                    </ContextMenuRadioGroup>
                  </ContextMenuGroup>
                </ContextMenuSubContent>
              </ContextMenuSub>

              <ContextMenuSeparator />
            </>
          )}

          {!localNote.archived && !localNote.trashedAt && (
            <ContextMenuItem onPress={() => showToast("This feature isn't available yet")}>
              <HugeiconsIcon icon={Share01Icon} strokeWidth={2} />
              Share note
            </ContextMenuItem>
          )}

          <ContextMenuItem onPress={() => handleDetailsDialogChange(true)}>
            <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
            Details
          </ContextMenuItem>

          <ContextMenuSeparator />

          {localNote.trashedAt && (
            <ContextMenuItem onPress={() => handleRestore(localNote.id)}>
              <HugeiconsIcon icon={ReloadIcon} strokeWidth={2} />
              Restore from trash
            </ContextMenuItem>
          )}

          {!localNote.trashedAt ? (
            <ContextMenuItem variant="destructive" onPress={() => handleDeleteDialogChange(true)}>
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              Trash
            </ContextMenuItem>
          ) : (
            <ContextMenuItem
              variant="destructive"
              onPress={() => showToast("This feature isn't available yet")}>
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              Delete permanently
            </ContextMenuItem>
          )}
        </ContextMenuContent>
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
