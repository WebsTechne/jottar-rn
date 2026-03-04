import { useRef, useState } from "react";
import {
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type TextInput,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/block/form-error";
import { Link, useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { AuthMessage } from "@/components/auth-message";

import { z } from "zod";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";

const formSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name must be at most 100 characters."),
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters.")
      .max(72, "Password must be at most 72 characters."),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const { colorScheme: theme } = useColorScheme();
  const currentTheme = THEME[theme ?? "light"];

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError("");

    try {
      const result = await authClient.signUp.email({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (result?.error) {
        switch (result.error.code) {
          case "USER_ALREADY_EXISTS":
            setServerError("This email is already registered.");
            return;
          case "WEAK_PASSWORD":
            setServerError("Password is too weak.");
            return;
          default:
            setServerError(result.error.message ?? "Failed to create account.");
            return;
        }
      }

      router.replace("/");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Unexpected authentication error");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 gap-5 bg-background p-6 pt-7">
          <AuthMessage title="Create account" message="Sign up for the best experience" />

          {/* Name */}
          <View className="gap-1.5">
            <Label>Name</Label>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  ref={nameRef}
                  value={value}
                  onChangeText={onChange}
                  editable={!isSubmitting}
                  placeholder="John Doe"
                  returnKeyType="next"
                  returnKeyLabel="Next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              )}
            />
            {errors.name && <FormError errors={errors.name.message} />}
          </View>

          {/* Email */}
          <View className="gap-1.5">
            <Label>Email</Label>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  ref={emailRef}
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isSubmitting}
                  placeholder="j@example.com"
                  returnKeyType="next"
                  returnKeyLabel="Next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              )}
            />
            {errors.email && <FormError errors={errors.email.message} />}
          </View>

          {/* Password */}
          <View className="gap-1.5">
            <Label>Password</Label>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <View className="relative h-max w-full">
                  <Input
                    ref={passwordRef}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                    editable={!isSubmitting}
                    placeholder="Password"
                    returnKeyType="next"
                    returnKeyLabel="Next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onPress={() => setShowPassword((v) => !v)}>
                    <HugeiconsIcon
                      icon={showPassword ? ViewOffIcon : ViewIcon}
                      className="size-5 text-muted-foreground"
                    />
                  </Button>
                </View>
              )}
            />
            {errors.password && <FormError errors={errors.password.message} />}
          </View>

          {/* Confirm Password */}
          <View className="gap-1.5">
            <Label>Confirm Password</Label>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  ref={confirmPasswordRef}
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!showPassword}
                  editable={!isSubmitting}
                  placeholder="Confirm Password"
                  returnKeyType="done"
                  returnKeyLabel="Submit"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.confirmPassword && <FormError errors={errors.confirmPassword.message} />}
          </View>

          <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color={currentTheme.primaryForeground} />
                <Text className="font-medium">Signing up</Text>
              </>
            ) : (
              <Text className="font-medium">Sign up</Text>
            )}
          </Button>

          {serverError && <FormError errors={serverError} />}

          <View className="flex-row flex-wrap items-center justify-center gap-1">
            <Text className="text-base text-foreground">Have an account?</Text>
            <Link href="/auth/sign-in" asChild>
              <Text className="font-medium text-primary underline underline-offset-4">Sign in</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
