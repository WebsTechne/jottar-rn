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

export default function Screen() {
  const { colorScheme: theme } = useColorScheme();
  const currentTheme = THEME[theme ?? "light"];

  const [refreshing, setRefreshing] = useState(false);

  const [notes, setNotes] = useState<Note[]>([]);
  const [foldersDropdown, setFoldersDropdown] = useState<FolderDropdownItem[]>([]);

  const fetchNotes = async (showLoader: boolean = false) => {
    if (showLoader) setRefreshing(true);
    try {
      const result = await getNotes();
      setNotes(result);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoader) setRefreshing(false);
    }
  };
  const fetchDropdownFolders = async () => {
    try {
      const result = await getDropdownFolders();
      setFoldersDropdown(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes(false);
    fetchDropdownFolders();
  }, []);

  const orderedNotes = useMemo(() => {
    const result = notes.filter((n) => !n.archived && n.trashedAt == null);
    return [
      ...result
        .filter((n) => n.isPinned)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
      ...result
        .filter((n) => !n.isPinned)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    ];
  }, [notes]);

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchNotes(true)} />
        }>
        <Section>
          <SectionTitle>Notes</SectionTitle>
          <SectionBody>
            {refreshing ? (
              <>
                <NoteCardSkeleton />
                <NoteCardSkeleton />
                <NoteCardSkeleton />
              </>
            ) : orderedNotes.length > 0 ? (
              orderedNotes.map((note) => (
                <NoteCard key={note.id} note={note} view="active" folders={foldersDropdown} />
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
