import * as Font from "expo-font";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
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
export default function App() {
  // const [loaded, setLoaded] = useState(false);

  const [fontsLoaded] = useFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
    Raleway_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <Slot />
      <PortalHost />
    </>
  );
}
