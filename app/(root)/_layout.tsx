import { HeaderTitle } from "@/components/header-title";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import "@/global.css";
import { authClient } from "@/lib/auth-client";
import getInitials from "@/lib/helpers/initials";
import getDisplayTitle from "@/lib/helpers/get-display-title";

import { NAV_THEME } from "@/lib/theme";
import { Folder02Icon, Home03Icon, Note01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Redirect, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TagsIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname } from "expo-router";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const { colorScheme: theme } = useColorScheme();
  const currentTheme = NAV_THEME[theme ?? "light"];

  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const title = getDisplayTitle(pathname);

  const { data: session } = authClient.useSession();
  if (!session) return <Redirect href="/auth/sign-in" />;
  const { name, image } = session.user;
  const { initials } = getInitials(name);

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <Tabs
        screenOptions={{
          header: () => (
            <View
              style={{ paddingTop: insets.top, height: 48 + insets.top }}
              className="top-0 flex flex-row items-center justify-between overflow-y-visible border-b border-border bg-background/90 px-4 backdrop-blur-lg">
              <HeaderTitle title={title} />
              <ThemeToggle />
            </View>
          ),

          tabBarStyle: { backgroundColor: currentTheme.colors.background },
          tabBarActiveTintColor: currentTheme.colors.primary,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <HugeiconsIcon icon={Home03Icon} color={color} size={size} strokeWidth={1.7} />
            ),
          }}
        />
        <Tabs.Screen
          name="notes"
          options={{
            tabBarLabel: "Notes",
            tabBarIcon: ({ color, size }) => (
              <HugeiconsIcon icon={Note01Icon} color={color} size={size} strokeWidth={1.7} />
            ),
          }}
        />
        <Tabs.Screen
          name="folders"
          options={{
            tabBarLabel: "Folders",
            tabBarIcon: ({ color, size }) => (
              <HugeiconsIcon icon={Folder02Icon} color={color} size={size} strokeWidth={1.7} />
            ),
          }}
        />
        <Tabs.Screen
          name="tags"
          options={{
            tabBarLabel: "Tags",
            tabBarIcon: ({ color, size }) => (
              <TagsIcon color={color} size={size} strokeWidth={1.7} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: "You",
            tabBarIcon: ({ color, size }) => (
              // <HugeiconsIcon icon={Setting07Icon} color={color} size={size} strokeWidth={1.7} />
              <Avatar style={{ width: size, height: size }} alt={`${name}'s Avatar`}>
                <AvatarImage source={{ uri: image || "" }} />
                <AvatarFallback>
                  <Text>{initials}</Text>
                </AvatarFallback>
              </Avatar>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
