import { getNotes } from "@/api/notes";
import { useQuery } from "@tanstack/react-query";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";
import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Section, SectionBody } from "@/components/block/section";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { NoteCard, NoteCardSkeleton } from "@/components/notes/note-card";
import { getDropdownFolders } from "@/api/folders";
import { Stack } from "expo-router";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TrashedPage() {
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const { colorScheme: theme } = useColorScheme();
  const currentTheme = THEME[theme ?? "light"];

  const insets = useSafeAreaInsets();

  const { data: foldersDropdown } = useQuery({
    queryKey: ["foldersDropdown"],
    queryFn: getDropdownFolders,
  });

  const {
    data: fetchedNotes,
    isLoading: notesPending,
    isFetching: notesFetching,
    refetch: refetchNotes,
    error: notesError,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
    retry: 1,
  });

  const notes = useMemo(() => {
    if (notesError || !fetchedNotes) return [];
    const result = (fetchedNotes ?? []).filter((n) => n.trashedAt !== null);
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [fetchedNotes, notesError]);

  const handleRefresh = async () => {
    setManualRefreshing(true);
    await refetchNotes();
    setManualRefreshing(false);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Trash" }} />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={manualRefreshing}
            onRefresh={handleRefresh}
            tintColor={currentTheme.mutedForeground}
            colors={[currentTheme.mutedForeground]}
            progressBackgroundColor={currentTheme.card}
          />
        }>
        <Section>
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
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  view="trashed"
                  folders={foldersDropdown || []}
                />
              ))
            ) : (
              <View className="h-32 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border">
                <Text className="text-muted-foreground">You don't have any notes in trash</Text>
              </View>
            )}
          </SectionBody>
        </Section>
      </ScrollView>
    </>
  );
}
