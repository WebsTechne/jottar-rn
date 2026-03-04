import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { RefreshControl, ScrollView, View } from "react-native";
import { NoteCard, NoteCardSkeleton } from "@/components/notes/note-card";
import { Section, SectionBody, SectionTitle } from "@/components/block/section";
import { getOverviewNotes } from "@/api/notes";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { usePathname } from "expo-router";
import { getDropdownFolders, getOverviewFolders } from "@/api/folders";
import { showToast } from "@/lib/helpers/show-toast";
import { useQuery } from "@tanstack/react-query";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";

export const handleSignOut = async ({
  returnTo,
  push,
}: {
  returnTo: string;
  push: (href: string) => void;
}) => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        push(`/auth/sign-in/?returnTo=${returnTo}`);
      },
      onError: (err) => {
        console.error("Couldn't sign out. Please try again.", "Error: ", err);
      },
    },
  });
};

export default function Screen() {
  const { colorScheme: theme } = useColorScheme();
  const currentTheme = THEME[theme ?? "light"];

  const { data: session } = authClient.useSession();

  const { push } = useRouter();
  const pathname = usePathname();

  const returnTo = pathname;

  const { data: foldersDropdown } = useQuery({
    queryKey: ["foldersDropdown"],
    queryFn: getDropdownFolders,
  });

  const {
    data: notes,
    isFetching: notesPending,
    refetch: refetchNotes,
    error: notesError,
  } = useQuery({ queryKey: ["overviewNotes"], queryFn: getOverviewNotes, retry: 1 });

  const {
    data: folders,
    isFetching: foldersPending,
    refetch: refetchFolders,
    error: foldersError,
  } = useQuery({
    queryKey: ["overviewFolders"],
    queryFn: getOverviewFolders,
    retry: 1,
  });

  const refreshing = notesPending || foldersPending;

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchNotes(), refetchFolders()]);
    } catch (err) {
      showToast("Error fetching data. Please try again.");
      console.error("Error fetching data: ", err);
    }
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={currentTheme.cardForeground}
            colors={[currentTheme.cardForeground]}
            progressBackgroundColor={currentTheme.card}
          />
        }>
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
            ) : !notesError && (notes ?? []).length > 0 ? (
              (notes ?? []).map((note) => (
                <NoteCard key={note.id} note={note} view="active" folders={foldersDropdown ?? []} />
              ))
            ) : (
              <View className="h-32 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border">
                <Text className="text-muted-foreground">You do not have any notes</Text>
              </View>
            )}
          </SectionBody>
        </Section>

        <Section>
          <SectionTitle>Folders</SectionTitle>
          <SectionBody variant="scroll">
            {foldersError ? (
              <View className="h-32 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border">
                <Text className="text-muted-foreground">Something went wrong</Text>
                <Button onPress={() => refetchFolders()}>
                  <Text>Refresh</Text>
                </Button>
              </View>
            ) : foldersPending ? (
              <>
                <NoteCardSkeleton />
              </>
            ) : (folders ?? []).length > 0 ? (
              (folders ?? []).map((folder) => (
                <View key={folder.id}>
                  <Text>{folder.name}</Text>
                </View>
              ))
            ) : (
              <View className="h-32 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border">
                <Text className="text-muted-foreground">You do not have any folders</Text>
              </View>
            )}
          </SectionBody>
        </Section>

        <Section>
          <SectionTitle>Auth</SectionTitle>
          <SectionBody>
            {session ? (
              <Button onPress={() => handleSignOut({ returnTo, push })}>
                <Text>Sign out </Text>
              </Button>
            ) : (
              <>
                <Link href="/auth/sign-in" className="" asChild>
                  <Button className="!overflow-visible">
                    <Text>Sign in</Text>
                  </Button>
                </Link>

                <Link href="/auth/sign-up" asChild>
                  <Button variant="secondary" className="">
                    <Text>Sign up</Text>
                  </Button>
                </Link>
              </>
            )}
          </SectionBody>
        </Section>
      </ScrollView>
    </>
  );
}
