import * as SplashScreen from "expo-splash-screen";
import { Redirect, Slot } from "expo-router";
import {
  useFonts,
  Raleway_400Regular,
  Raleway_500Medium,
  Raleway_600SemiBold,
  Raleway_700Bold,
  Raleway_800ExtraBold,
} from "@expo-google-fonts/raleway";
import { GeistMono_400Regular, GeistMono_700Bold } from "@expo-google-fonts/geist-mono";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import { NAV_THEME } from "@/lib/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OverlayProvider } from "@/components/overlay";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    GeistMono_400Regular,
    GeistMono_700Bold,
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Raleway_800ExtraBold,
  });

  const { colorScheme: theme } = useColorScheme();

  const [appReady, setAppReady] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && fontsLoaded) {
      setAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [isPending, fontsLoaded]);

  if (!appReady) return null; // app is rendering behind the splash anyway

  if (!session) return <Redirect href="/auth/sign-in" />;

  return (
    <>
      <ThemeProvider value={NAV_THEME[theme ?? "light"]}>
        <QueryClientProvider client={queryClient}>
          <OverlayProvider>{fontsLoaded ? <Slot /> : null}</OverlayProvider>
        </QueryClientProvider>
      </ThemeProvider>
      <PortalHost />
    </>
  );
}
