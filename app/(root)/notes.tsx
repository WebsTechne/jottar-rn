import { useColorScheme } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { NoteCard, NoteCardSkeleton } from "@/components/notes/note-card";
import { Section, SectionBody, SectionTitle } from "@/components/block/section";
import { Note } from "@/types/notes";
import { getNotes } from "@/api/notes";
import { THEME } from "@/lib/theme";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { getDropdownFolders } from "@/api/folders";
import { FolderDropdownItem } from "@/types/folders";
import { useQuery } from "@tanstack/react-query";

export default function Screen() {
  const { colorScheme: theme } = useColorScheme();
  const currentTheme = THEME[theme ?? "light"];

  const { data: foldersDropdown } = useQuery({
    queryKey: ["foldersDropdown"],
    queryFn: getDropdownFolders,
  });
  const {
    data: fetchedNotes,
    isFetching: notesPending,
    refetch: refetchNotes,
    error: notesError,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });

  const orderedNotes = useMemo(() => {
    const result = (fetchedNotes ?? []).filter((n) => !n.archived && n.trashedAt == null);
    return [
      ...result
        .filter((n) => n.isPinned)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
      ...result
        .filter((n) => !n.isPinned)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    ];
  }, [fetchedNotes]);

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={notesPending} onRefresh={refetchNotes} />}>
        <Section>
          <SectionTitle>Notes</SectionTitle>
          <SectionBody>
            {notesPending ? (
              <>
                <NoteCardSkeleton />
                <NoteCardSkeleton />
                <NoteCardSkeleton />
              </>
            ) : orderedNotes.length > 0 ? (
              orderedNotes.map((note) => (
                <NoteCard key={note.id} note={note} view="active" folders={foldersDropdown || []} />
              ))
            ) : (
              <>
                <NoteCardSkeleton />
                <NoteCardSkeleton />
                <NoteCardSkeleton />
              </>
            )}
          </SectionBody>
        </Section>
      </ScrollView>
    </>
  );
}
