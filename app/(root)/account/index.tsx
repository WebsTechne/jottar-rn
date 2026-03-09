import { useState } from "react";
import { getFolders } from "@/api/folders";
import { getNotes } from "@/api/notes";
import { getTags } from "@/api/tags";
import { Section, SectionBody, SectionTitle } from "@/components/block/section";
import { Text } from "@/components/ui/text";
import capitalize from "@/lib/helpers/capitalize";
import { showToast } from "@/lib/helpers/show-toast";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import * as React from "react";
import { RefreshControl, ScrollView } from "react-native";
import { View } from "react-native";
import { Stack } from "expo-router";

const PAGES: { name: string; link: string; destructive?: boolean }[] = [
  { name: "Favorites", link: "/account/favorites" },
  { name: "archived", link: "/account/archived" },
  { name: "trashed", link: "/account/trashed" },
];

export default function Screen() {
  const [manualRefreshing, setManualRefreshing] = useState(false);

  const { colorScheme: theme } = useColorScheme();
  const currentTheme = THEME[theme ?? "light"];

  const {
    data: fetchedNotes,
    refetch: refetchNotes,
    error: notesError,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
    retry: 1,
  });

  const {
    data: fetchedFolders,
    refetch: refetchFolders,
    error: foldersError,
  } = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
    retry: 1,
  });

  const {
    data: fetchedTags,
    refetch: refetchTags,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
    retry: 1,
  });

  const handleRefresh = async () => {
    setManualRefreshing(true);
    try {
      await Promise.all([refetchNotes(), refetchFolders(), refetchTags()]);
    } catch (err) {
      showToast("Error fetching data. Please try again.");
      console.error("Error fetching data: ", err);
    } finally {
      setManualRefreshing(false);
    }
  };
  const notes = fetchedNotes ?? [];
  const folders = fetchedFolders ?? [];
  const tags = fetchedTags ?? [];

  return (
    <>
      <Stack.Screen options={{ title: "Account" }} />

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
          <SectionTitle>Stats</SectionTitle>
          <SectionBody variant="flex">
            <View className="flex w-[48%] rounded-2xl border border-border bg-card p-2">
              <Text variant="h3" className="!font-monoBold text-card-foreground">
                {notes.length}
              </Text>
              <Text variant="large">
                {notes.length > 1 || notes.length === 0 ? "Notes" : "Note"}
              </Text>
            </View>

            <View className="flex w-[48%] rounded-2xl border border-chart-3/30 bg-chart-3/20 p-2">
              <Text variant="h3" className="!font-monoBold text-card-foreground">
                {folders.length}
              </Text>
              <Text variant="large">
                {folders.length > 1 || folders.length === 0 ? "Folders" : "Folder"}
              </Text>
            </View>

            <View className="flex w-[48%] rounded-2xl border border-purple-600/30 bg-purple-600/20 p-2">
              <Text variant="h3" className="!font-monoBold text-card-foreground">
                {tags.length}
              </Text>
              <Text variant="large">{tags.length > 1 || tags.length === 0 ? "Tags" : "Tag"}</Text>
            </View>
          </SectionBody>
        </Section>

        <Section>
          <SectionBody>
            <View className="gap-1">
              <Text className="text-muted-foreground">Collections</Text>
              <View className="rounded-hidden min-h-11 rounded-xl bg-muted px-3 dark:bg-card">
                {PAGES.map((page, index) => (
                  <Link
                    key={page.link}
                    href={page.link}
                    className={cn("h-11", index < PAGES.length - 1 && "border-b border-border")}>
                    <View className="flex h-full flex-row items-center gap-2">
                      <Text className="text-muted-foreground dark:!text-muted-foreground">
                        {capitalize(page.name)}
                      </Text>
                    </View>
                  </Link>
                ))}
              </View>
            </View>

            <View className="gap-1">
              {/*<Text className="text-muted-foreground">Collections</Text>*/}
              <View className="rounded-hidden min-h-11 rounded-xl bg-muted px-3 dark:bg-card">
                <Link href="/account/about" className="h-11 border-b border-border">
                  <View className="flex h-full flex-row items-center gap-2">
                    <Text className="text-muted-foreground dark:!text-muted-foreground">About</Text>
                  </View>
                </Link>
                <Link href="/account/settings" className="h-11">
                  <View className="flex h-full flex-row items-center gap-2">
                    <Text className="text-muted-foreground dark:!text-muted-foreground">
                      Settings
                    </Text>
                  </View>
                </Link>
              </View>
            </View>
          </SectionBody>
        </Section>
      </ScrollView>
    </>
  );
}
