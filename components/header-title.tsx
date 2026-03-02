import { HugeiconsIcon } from "@hugeicons/react-native";
import { Text } from "./ui/text";
import { QuillWrite01Icon } from "@hugeicons/core-free-icons";
import { View } from "react-native";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";

export function HeaderTitle({ title }: { title: string }) {
  const { colorScheme: theme } = useColorScheme();
  const currentTheme = THEME[theme ?? "light"];

  return (
    <View className="flex flex-row items-center gap-0.5 font-semibold">
      <HugeiconsIcon
        icon={QuillWrite01Icon}
        strokeWidth={2}
        className="size-6!"
        color={currentTheme.foreground}
      />
      <Text variant="large">{title}</Text>
    </View>
  );
}
