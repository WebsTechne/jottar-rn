import { useColorScheme } from "nativewind";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { MoonStarIcon, StarIcon, SunIcon } from "lucide-react-native";

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="size-8 rounded-full !px-0 !py-0">
      // ios:size-9
      <Icon as={THEME_ICONS[colorScheme ?? "light"]} className="size-6" />
    </Button>
  );
}
