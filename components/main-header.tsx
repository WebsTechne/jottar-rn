import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { HeaderTitle } from "@/components/header-title";
import { ThemeToggle } from "@/components/theme-toggle";
import { THEME } from "@/lib/theme";

export function Header({ title }: { title: string }) {
  const { colorScheme: theme } = useColorScheme();
  const currentTheme = THEME[theme ?? "light"];

  return (
    <Stack.Screen
      options={{
        title: "",
        headerBlurEffect: theme === "dark" ? "dark" : "light",
        headerStyle: { backgroundColor: currentTheme.background },
        headerTitle: () => <HeaderTitle title={title} />,
        headerTitleAlign: "left",
        headerRight: () => <ThemeToggle />,
      }}
    />
  );
}
