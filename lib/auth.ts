import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  advanced: { database: { generateId: () => crypto.randomUUID() } },
  emailAndPassword: { enabled: true, autoSignIn: true },
  trustedOrigins: [
    "jottar://", // Basic scheme
    "jottar://*", // Wildcard support for all paths following the scheme

    ...(process.env.NODE_ENV === "development"
      ? [
          "exp://", // Trust all Expo URLs (prefix matching)
          "exp://**", // Trust all Expo URLs (wildcard matching)
          "exp://10.198.*.*:*/**", // Trust 10.198.x.x IP range with any port and path
        ]
      : []),
  ],
  plugins: [expo()],

  ///// Social providers
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //   },
  // },

  ///// Plugins
});
