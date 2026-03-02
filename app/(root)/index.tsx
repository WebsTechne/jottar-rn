import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { type ImageStyle, View, ScrollView, FlatList } from "react-native";
import { NoteCardSkeleton } from "@/components/notes/note-card";
import { Section, SectionBody, SectionTitle } from "@/components/block/section";
import { Note } from "@/types/notes";
import { getNotes, getOverviewNotes } from "@/api/notes";
import { THEME } from "@/lib/theme";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { GoBackward15SecFreeIcons } from "@hugeicons/core-free-icons";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { usePathname } from "expo-router";

const LOGO = {
  light: require("@/assets/images/react-native-reusables-light.png"),
  dark: require("@/assets/images/react-native-reusables-dark.png"),
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

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

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchOverviewNotes = async () => {
      try {
        const result = await getNotes();
        console.log(result);
        setNotes(result);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOverviewNotes();
  }, []);

  const { data: session } = authClient.useSession();

  const { push } = useRouter();
  const pathname = usePathname();

  const returnTo = pathname;

  return (
    <>
      <ScrollView>
        <Section>
          <SectionTitle>{session ? session.user.name : "Notes"}</SectionTitle>
          <SectionBody>
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="flex-row gap-2">
                  <HugeiconsIcon icon={GoBackward15SecFreeIcons} className="text-foreground" />
                  <Text className="text-foreground">{item.title}</Text>
                </View>
              )}></FlatList>
            {notes.length < 1 && <Text>No notes yet.</Text>}

            <NoteCardSkeleton />
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
