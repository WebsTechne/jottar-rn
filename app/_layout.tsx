import { Slot } from "expo-router";
import {
  useFonts,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
} from "@expo-google-fonts/raleway";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import { NAV_THEME } from "@/lib/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Raleway_800ExtraBold,
  });

  const { colorScheme: theme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[theme ?? "light"]}>
      {fontsLoaded ? <Slot /> : null}
      <PortalHost />
    </ThemeProvider>
  );
}
