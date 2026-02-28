import "@/global.css";

import { NAV_THEME } from "@/lib/theme";
import { Folder02Icon, Home03Icon, Note01Icon, Setting07Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TagsIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const { colorScheme: theme } = useColorScheme();
  const currentTheme = NAV_THEME[theme ?? "light"];

  return (
    <ThemeProvider value={NAV_THEME[theme ?? "light"]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <Tabs
        screenOptions={{
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
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <HugeiconsIcon icon={Setting07Icon} color={color} size={size} strokeWidth={1.7} />
            ),
          }}
        />
      </Tabs>
      <PortalHost />
    </ThemeProvider>
  );
}
