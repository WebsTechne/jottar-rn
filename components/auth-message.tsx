import { View } from "react-native";
import { Text } from "./ui/text";

export function AuthMessage({ title, message }: { title: string; message: string }) {
  return (
    <View>
      <Text variant="h1" className="text-left">
        {title}
      </Text>
      <Text className="text-base text-muted-foreground">{message}</Text>
    </View>
  );
}
