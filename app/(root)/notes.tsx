import { useMemo } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { NoteCard, NoteCardSkeleton } from "@/components/notes/note-card";
import { Section, SectionBody, SectionTitle } from "@/components/block/section";
import { getNotes } from "@/api/notes";
import { getDropdownFolders } from "@/api/folders";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

export default function Screen() {
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
    retry: 1,
  });

  const orderedNotes = useMemo(() => {
    if (notesError || !fetchedNotes) return [];
    const result = (fetchedNotes ?? []).filter((n) => !n.archived && n.trashedAt == null);
    return [
      ...result
        .filter((n) => n.isPinned)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
      ...result
        .filter((n) => !n.isPinned)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    ];
  }, [fetchedNotes, notesError]);

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={notesPending} onRefresh={refetchNotes} />}>
        <Section>
          <SectionTitle>Notes</SectionTitle>
          <SectionBody>
            {notesError ? (
              <View className="h-32 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border">
                <Text className="text-muted-foreground">Something went wrong</Text>
                <Button onPress={() => refetchNotes()}>
                  <Text>Refresh</Text>
                </Button>
              </View>
            ) : notesPending ? (
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
              <View className="h-32 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border">
                <Text className="text-muted-foreground">You do not have any notes</Text>
              </View>
            )}
          </SectionBody>
        </Section>
      </ScrollView>
    </>
  );
}
