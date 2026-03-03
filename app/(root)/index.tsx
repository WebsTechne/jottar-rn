import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { NoteCard, NoteCardSkeleton } from "@/components/notes/note-card";
import { Section, SectionBody, SectionTitle } from "@/components/block/section";
import { Note } from "@/types/notes";
import { getOverviewNotes } from "@/api/notes";
import { THEME } from "@/lib/theme";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { usePathname } from "expo-router";
import { FolderDropdownItem, FolderOverview } from "@/types/folders";
import { getDropdownFolders, getOverviewFolders } from "@/api/folders";
import { showToast } from "@/lib/helpers/show-toast";
import { useQuery } from "@tanstack/react-query";

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
  } = useQuery({ queryKey: ["overviewNotes"], queryFn: getOverviewNotes });

  const {
    data: folders,
    isFetching: foldersPending,
    refetch: refetchFolders,
    error: foldersError,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: getOverviewFolders,
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
        <Section>
          <SectionTitle>Notes</SectionTitle>
          <SectionBody>
            {notesPending ? (
              <>
                <NoteCardSkeleton />
                <NoteCardSkeleton />
                <NoteCardSkeleton />
              </>
            ) : (notes ?? []).length > 0 ? (
              (notes ?? []).map((note) => (
                <NoteCard key={note.id} note={note} view="active" folders={foldersDropdown ?? []} />
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

        <Section>
          <SectionTitle>Folders</SectionTitle>
          <SectionBody>
            {foldersPending ? (
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
              <NoteCardSkeleton />
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
