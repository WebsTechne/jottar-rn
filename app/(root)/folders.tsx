import { useMemo } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { FolderCard, FolderCardSkeleton } from "@/components/notes/folder-card";
import { Section, SectionBody, SectionTitle } from "@/components/block/section";
import { getNotes } from "@/api/notes";
import { getDropdownFolders, getFolders } from "@/api/folders";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

export default function Screen() {
  const {
    data: fetchedFolders,
    isFetching: foldersPending,
    refetch: refetchFolders,
    error: foldersError,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
    retry: 1,
  });

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={foldersPending} onRefresh={refetchFolders} />}>
      <Section>
        <SectionTitle>Folders</SectionTitle>
        <SectionBody variant="flex">
          {foldersError ? (
            <View className="h-32 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border">
              <Text className="text-muted-foreground">Something went wrong</Text>
              <Button onPress={() => refetchFolders()}>
                <Text>Refresh</Text>
              </Button>
            </View>
          ) : foldersPending ? (
            <>
              <FolderCardSkeleton />
              <FolderCardSkeleton />
              <FolderCardSkeleton />
            </>
          ) : fetchedFolders && fetchedFolders.length > 0 ? (
            fetchedFolders?.map((folder) => <FolderCard key={folder.id} folder={folder} />)
          ) : (
            <View className="h-32 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border">
              <Text className="text-muted-foreground">You do not have any folders</Text>
            </View>
          )}
        </SectionBody>
      </Section>
    </ScrollView>
  );
}
