import { ThemeToggle } from "@/components/theme-toggle";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname } from "expo-router";
import getDisplayTitle from "@/lib/helpers/get-display-title";
import { Text } from "@/components/ui/text";

export default function AccountLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const title = getDisplayTitle(pathname);

  return (
    <Stack
      screenOptions={{
        header: ({ options }) => (
          <View
            style={{ paddingTop: insets.top, height: 48 + insets.top }}
            className="top-0 flex flex-row items-center justify-between overflow-y-visible bg-background px-4">
            <Text variant="h3">{options.title}</Text>
            <ThemeToggle />
          </View>
        ),
      }}
    />
  );
}
