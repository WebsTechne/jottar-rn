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

export default function AuthLayout() {
  const { colorScheme: theme } = useColorScheme();
  const router = useRouter();

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) router.replace("/");
  }, [session, router]);

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <View className="flex-1 bg-background p-6 pt-7">
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: "transparent" },
            header: () => (
              <View className="mb-6 h-14 flex-row items-center justify-between bg-background">
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
      </View>
    </>
  );
}
