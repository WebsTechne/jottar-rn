import { useRef, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { authClient } from "@/lib/auth-client";
import { Section, SectionBody } from "@/components/block/section";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { AuthMessage } from "@/components/auth-message";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { FormError } from "@/components/block/form-error";

export const unstable_settings = {
  tabBarButton: () => null, // hides the tab button
};

type SignInErrors = {
  email?: string;
  password?: string;
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<SignInErrors>({});

  const passwordInputRef = useRef(null);

  const validateForm = () => {
    let errors: SignInErrors = {};

    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const router = useRouter();

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      setLoading(false);

      if (res.error) {
        console.log(res.error);
        return;
      }

      if (res.data) console.log(res.data);

      setEmail("");
      setPassword("");
      setErrors({});

      router.replace("/");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const { colorScheme: theme } = useColorScheme();
  const currentTheme = THEME[theme ?? "light"];

  return (
    <>
      <View className="gap-5 border-b-transparent">
        <AuthMessage title="Welcome back" message="Sign in with your email and password" />
        <View className="gap-[18px]">
          <View className="gap-1.5">
            <Label
              htmlFor="email"
              nativeID="email"
              className="!after:text-destructive font-medium text-sm leading-none text-muted-foreground after:content-['*']">
              Email
            </Label>
            <Input
              id="email"
              placeholder="j@example.com"
              keyboardType="email-address"
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              inputMode="email"
              autoComplete="email"
              returnKeyType="next"
              returnKeyLabel="Next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              value={email}
              onChangeText={setEmail}
              className="text-foreground"
            />
            {errors.email && <FormError errors={errors.email} />}
          </View>

          <View className="gap-1.5">
            <Label
              htmlFor="password"
              nativeID="password"
              className="!after:text-destructive font-medium text-sm leading-none text-muted-foreground after:content-['*']">
              Password
            </Label>
            <View className="relative h-max w-max">
              <Input
                id="password"
                ref={passwordInputRef}
                placeholder="Password"
                textContentType="password"
                secureTextEntry={hidePassword}
                autoComplete="current-password"
                returnKeyType="done"
                returnKeyLabel="Go"
                onSubmitEditing={handleLogin}
                value={password}
                onChangeText={setPassword}
                className="text-foreground"
              />

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
                onPress={() => setHidePassword((p) => !p)}>
                <HugeiconsIcon
                  icon={hidePassword ? ViewIcon : ViewOffIcon}
                  className="size-5 text-muted-foreground"
                />
              </Button>
            </View>
          </View>

          <Button onPress={handleLogin} disabled={loading} className="w-full">
            {loading ? (
              <>
                <ActivityIndicator size="small" color={currentTheme.primaryForeground} />
                <Text className="font-medium">Signing in</Text>
              </>
            ) : (
              <Text className="font-medium">Sign in</Text>
            )}
          </Button>
        </View>
      </View>
    </>
  );
}
