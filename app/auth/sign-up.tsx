import { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/block/form-error";
import { useRouter } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { AuthMessage } from "@/components/auth-message";

import { z } from "zod";

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
    <View className="gap-5">
      <AuthMessage title="Create account" message="Sign up for the best experience" />

      {/* Name */}
      <View className="gap-1.5">
        <Label>Name</Label>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              editable={!isSubmitting}
              placeholder="John Doe"
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
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSubmitting}
              placeholder="j@example.com"
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
                value={value}
                onChangeText={onChange}
                secureTextEntry={!showPassword}
                editable={!isSubmitting}
                placeholder="Password"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onPress={() => setShowPassword((v) => !v)}>
                <HugeiconsIcon icon={showPassword ? ViewOffIcon : ViewIcon} />
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
              value={value}
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              editable={!isSubmitting}
              placeholder="Confirm Password"
            />
          )}
        />
        {errors.confirmPassword && <FormError errors={errors.confirmPassword.message} />}
      </View>

      <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full">
        {isSubmitting ? <ActivityIndicator size="small" /> : <Text>Sign up</Text>}
      </Button>

      {serverError && <FormError errors={serverError} />}
    </View>
  );
}
