import { ThemeToggle } from "@/components/theme-toggle";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/auth-client";
import { QuillWrite01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AuthLayout() {
  const { colorScheme: theme } = useColorScheme();
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) router.replace("/");
  }, [session, isPending, router]);

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <Stack
        screenOptions={{
          header: () => (
            <View
              style={{ paddingTop: insets.top, height: 56 + insets.top }}
              className="mb-6 flex-row items-center justify-between bg-background px-6">
              <View className="flex-row items-center">
                <HugeiconsIcon
                  icon={QuillWrite01Icon}
                  strokeWidth={2.4}
                  className="size-6! text-foreground"
                />
                <Text variant="large" className="font-bold">
                  Jottar
                </Text>
              </View>

              <ThemeToggle />
            </View>
          ),
        }}
      />
    </>
  );
}
