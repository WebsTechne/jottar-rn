import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL, // Base URL of Jottar (nextjs backend).
  fetchOptions: {
    headers: {
      Origin: "jottar://*",
    },
  },
  plugins: [
    expoClient({
      scheme: "jottar",
      storagePrefix: "jottar",
      storage: SecureStore,
    }),
  ],
});
