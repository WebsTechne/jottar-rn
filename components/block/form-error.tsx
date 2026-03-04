import React, { useMemo } from "react";
import { View, Text } from "react-native";

type FormErrorProps = React.ComponentProps<typeof View> & {
  errors?: { [key: string]: string | undefined } | string[] | string;
  children?: React.ReactNode;
};

export function FormError({ className, children, errors, ...props }: FormErrorProps) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors) {
      return null;
    }

    // Normalize errors to an array of strings
    let errorMessages: string[] = [];

    if (typeof errors === "string") {
      errorMessages = [errors];
    } else if (Array.isArray(errors)) {
      errorMessages = errors.filter(Boolean) as string[];
    } else if (typeof errors === "object") {
      errorMessages = Object.values(errors).filter(Boolean) as string[];
    }

    // Remove duplicates
    const uniqueErrors = [...new Set(errorMessages)];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0];
    }

    return (
      <View className="ml-4 flex flex-col gap-1">
        {uniqueErrors.map((message, index) => (
          <Text key={index} className="font-normal list-disc text-sm !text-destructive">
            {message}
          </Text>
        ))}
      </View>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <View accessibilityRole="alert" className={` ${className ?? ""}`} {...props}>
      {typeof content === "string" ? (
        <Text className="font-normal text-sm !text-destructive">{content}</Text>
      ) : (
        content
      )}
    </View>
  );
}
