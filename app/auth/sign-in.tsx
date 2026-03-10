import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, useRouter } from "expo-router";
import { AuthMessage } from "@/components/auth-message";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { FormError } from "@/components/block/form-error";
import z from "zod";
import { showToast } from "@/lib/helpers/show-toast";

type SignInErrors = {
  email?: string;
  password?: string;
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<SignInErrors>({});

  const { colorScheme: theme } = useColorScheme();
  const currentTheme = THEME[theme ?? "light"];

  const { data: session, isPending } = authClient.useSession();

  const router = useRouter();

  useEffect(() => {
    if (!isPending && session) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  const passwordInputRef = useRef(null);

  const emailSchema = z.string().email("Enter a valid email");

  const validateForm = () => {
    let errors: SignInErrors = {};

    if (!email) {
      errors.email = "Email is required";
    }
    if (!password) errors.password = "Password is required";

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) errors.email = JSON.parse(emailResult.error.message)[0].message;

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await authClient.signIn.email(
        {
          email: email.trim(),
          password,
        },
        {
          onSuccess: () => {
            setErrors({});
            router.replace("/");
          },
        }
      );

      if (res.error) {
        setErrors({ password: "Invalid credentials" });
        return;
      }

      if (res.data) showToast(`Welcome back, ${res.data.user.name}!`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <View className="gap-5 bg-background p-6 pt-7">
        <AuthMessage title="Welcome back" message="Sign in with your email and password" />
        <View className="gap-[18px]">
          <View className="gap-1.5">
            <Label
              nativeID="email"
              className="!after:text-destructive font-medium text-sm leading-none text-muted-foreground after:content-['*']">
              Email
            </Label>
            <Input
              placeholder="j@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              // autoFocus
              editable={!isSubmitting}
              inputMode="email"
              returnKeyType="next"
              returnKeyLabel="Next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
              className="text-foreground"
            />
            {errors.email && <FormError errors={errors.email} />}
          </View>

          <View className="gap-1.5">
            <Label
              nativeID="password"
              className="!after:text-destructive font-medium text-sm leading-none text-muted-foreground after:content-['*']">
              Password
            </Label>
            <View className="relative h-max w-full">
              <Input
                ref={passwordInputRef}
                placeholder="Password"
                textContentType="password"
                secureTextEntry={hidePassword}
                autoComplete="current-password"
                editable={!isSubmitting}
                returnKeyType="done"
                returnKeyLabel="Go"
                onSubmitEditing={handleLogin}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className="w-full text-foreground"
              />

              <Button
                variant="ghost"
                size="icon"
                accessibilityLabel="Toggle password visibility"
                className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
                onPress={() => setHidePassword((v) => !v)}>
                <HugeiconsIcon
                  icon={hidePassword ? ViewIcon : ViewOffIcon}
                  className="size-5 text-muted-foreground"
                />
              </Button>
            </View>
            {errors.password && <FormError errors={errors.password} />}
          </View>

          <Button onPress={handleLogin} disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color={currentTheme.primaryForeground} />
                <Text className="font-medium">Signing in</Text>
              </>
            ) : (
              <Text className="font-medium">Sign in</Text>
            )}
          </Button>

          <View className="flex-row flex-wrap items-center justify-center gap-1">
            <Text className="text-base text-foreground">Don't have an account?</Text>
            <Link href="/auth/sign-up" asChild>
              <Text className="font-medium text-primary underline underline-offset-4">Sign up</Text>
            </Link>
          </View>
        </View>
      </View>
    </>
  );
}
